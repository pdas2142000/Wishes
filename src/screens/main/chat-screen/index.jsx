//** Raect Imports */
import React, { useEffect, useState } from 'react'
import { View, ScrollView, TouchableOpacity, Text, Keyboard, Image, ActivityIndicator } from 'react-native'

/** Local Imports */
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'
import { ms } from '../../../utils/helpers/metrics'
import { IconProps } from '../../../utils/helpers/Iconprops'
import { useSocket } from '../../../utils/context/socket-context'

/** Components */
import AppHeader from '../../../components/header'
import SearchBar from '../../../components/search-bar'

/** Icon */
import AddIcon from "../../../../assets/svgs/add.svg"
import DubbleCheck from "../../../../assets/svgs/dubble_check_inactive.svg"

/** Libraries */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { DateTime } from 'luxon';

/** Styles */
import { styles } from './style'
import { useAuth } from '../../../utils/context/AuthContext'
import { AppCommonStyle } from '../../../utils/styles'
import NotFound from '../../../components/not-found'

/** Main Export */
const ChatScreen = () => {

    const { theme } = useTheme()
    const Navigation = useNavigation()
    const { translate } = useLanguage()
    const { Token } = useAuth()
    const { socket, socketConnected } = useSocket()
    const isFocused = useIsFocused()
    const isKeyboardShown = useIsKeyboardShown();

    const [ChatList, SetChatList] = useState(null)
    const [ChatListMeta, SetChatListMeta] = useState({})
    const [SearchQuery, setSearchQuery] = useState('');
    const [Page, SetPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true);

    /**
     * All Chat list
     */
    const fetchConversations = (Page) => {
        setIsLoading(true)
        socket.emit("conversations", {
            token: Token,
            page: Page,
            search: SearchQuery,
            limit: "10"

        }, (data) => {

            SetChatList(val => {
                let results = val === null || SearchQuery || Page === 1 ? data?.data?.items : [...val, ...data?.data?.items];
                return results
            })
            SetChatListMeta(data?.data?.meta)
            setIsLoading(false)
        })

    }

    /**
     * Load more
     */
    const LoadMoreConversations = () => {
        if (ChatListMeta?.totalPages > Page && !isLoading) {
            SetPage(prevPage => prevPage + 1);
        }
    };

    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

        if (distanceFromBottom < 100 && ChatListMeta?.totalPages > Page && !isLoading) {
            LoadMoreConversations();
        }
    };

    useEffect(() => {
        if (!socket || !isFocused || !socketConnected) return;

        fetchConversations(Page || 1);

    }, [socket, socketConnected, Page, SearchQuery]);

    /**
     * Chat list messages
     */
    useEffect(() => {

        if (!socket || !isFocused || !socketConnected) return;

        [`new-message`, `typing`, `seen`].map(n => socket.off(n));

        socket.on('new-message', (data) => {
            updateConversation(data)
        });

        return () => {
            [`new-message`, `typing`, `seen`].map(n => socket.off(n));
        }
    }, [socket, socketConnected, isFocused]);

    /**
     * Update Conversation 
     */
    const updateConversation = (data) => {

        SetChatList(conversations => {

            let allConversations = [...conversations || []];
            let exists = allConversations.findIndex(c => c.id === data?.conversation_id);

            if (exists < 0) {
                SetPage(1);
                return conversations;
            }
            let updatedChat = allConversations.splice(exists, 1);

            if (!updatedChat.length) {
                SetPage(1);
                return conversations;
            }

            updatedChat[0].messages = [data];
            updatedChat[0].typing = false;

            allConversations.unshift(updatedChat[0]);

            return allConversations;
        })
    }

    return (
        <>
            <AppHeader title="MainNavigation.chat">
                <TouchableOpacity onPress={() => Navigation.navigate("createchat")}>
                    <AddIcon  {...IconProps(ms(23))} fill={theme.text} />
                </TouchableOpacity>
            </AppHeader>
            <View style={[styles.ws_container, isKeyboardShown ? { height: 0 } : {}, { backgroundColor: theme.background }]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View style={{ marginBottom: ms(-5) }}>
                        <SearchBar
                            {...{
                                type: "guest",
                                setSearchQuery
                            }}
                        />
                    </View>
                    <View style={{ marginBottom: ms(6) }}>
                        {
                            isLoading || ChatList === null ? (
                                <View style={AppCommonStyle.ws_top_indicator_box}>
                                    <ActivityIndicator color={theme.text} size="small" />
                                </View>
                            ) :
                                ChatList?.length ?
                                    (
                                        ChatList.map((item, index) => {
                                            const parsedTime = DateTime.fromISO(item?.messages?.[0]?.created_at || item.created_at);
                                            const formattedTime = parsedTime.toFormat('h:mm a');

                                            return (
                                                <View key={index} style={[styles.ws_archive_box, { marginVertical: ms(5), backgroundColor: theme.card_bg }]}>
                                                    <TouchableOpacity onPress={() => Navigation.navigate("singlechat", { Data: item, conversation_id: item.id })} >
                                                        <View style={[styles.ws_top_box_content, { justifyContent: "space-between" }]}>
                                                            <View style={styles.ws_top_box_content}>
                                                                <View style={styles.ws_image_box}>
                                                                    <Image style={styles.ws_img} source={{ uri: item.$avatar_url }} />
                                                                </View>
                                                                <View style={styles.ws_content_text}>
                                                                    <Text style={[styles.ws_text_one, { color: theme.text }]}>{item.name}</Text>
                                                                    <GetLastMessage item={item} />
                                                                </View>
                                                            </View>
                                                            <Text style={[styles.ws_tag_text, { color: theme.text }]}>
                                                                {formattedTime}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    ) :
                                    (
                                        <NotFound title="No data found" />
                                    )
                        }
                    </View>
                    {
                        ChatList?.length > 0 ?
                            (
                                isLoading && (
                                    <View style={AppCommonStyle.ws_top_indicator_box}>
                                        <ActivityIndicator color={theme.text} size="small" />
                                    </View>
                                )
                            ) : null
                    }
                </ScrollView>
            </View>
        </>
    )
}

export default ChatScreen

const GetLastMessage = ({ item }) => {

    const { user } = useAuth()
    const { theme } = useTheme()

    // const CheckUser = user?.data?.user?.id === item?.messages?.[0]?.user_id

    // const CheckSize = deviceType === "Tablet" ? ms(9) : ms(12);
    // const DubbleCheckSize = deviceType === "Tablet" ? ms(14) : ms(19);
    // const DubbleCheckActiveSize = deviceType === "Tablet" ? ms(13) : ms(18);

    return (
        !item.messages?.length ? null :
            item.messages[0].type == "text" ?
                <View style={styles.ws_list_text}>
                    {/* <DubbleCheck {...IconProps(ms(16))} style={styles.ws_check_margin} /> */}
                    <Text style={[styles.ws_text_two, { color: theme.subtext }]} numberOfLines={1} ellipsizeMode="tail" >
                        {item.messages[0].text}
                    </Text>
                </View> :
                item.messages[0].type == "image" ?
                    <View style={styles.ws_list_text}>
                        {/* <DubbleCheck {...IconProps(ms(16))} style={styles.ws_check_margin} /> */}
                        <Text style={[styles.ws_text_two, { color: theme.subtext }]} numberOfLines={1} ellipsizeMode="tail" >
                            Receive new image
                        </Text>
                    </View>
                    :
                    item.messages[0].type == "pdf" ?
                        <View style={styles.ws_list_text}>
                            {/* <DubbleCheck {...IconProps(ms(16))} style={styles.ws_check_margin} /> */}
                            <Text style={[styles.ws_text_two, { color: theme.subtext }]} numberOfLines={1} ellipsizeMode="tail" >
                                Receive new document
                            </Text>
                        </View> :
                        null
    );
}

export const useIsKeyboardShown = () => {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsShown(true);
        });
        const keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsShown(false);
        });

        return () => {
            keyboardDidShowSubscription?.remove();
            keyboardDidHideSubscription?.remove();
        };
    }, []);

    return isShown;
};

