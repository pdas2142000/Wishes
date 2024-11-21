/** Reaci Import */
import React, { useEffect, useRef, useState } from 'react'
import { View, SafeAreaView, Dimensions, ScrollView, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, Text, Image } from 'react-native'

/** Components */
import ChatHeader from '../../../../components/some-handler/chat-header'
import SendBox from '../../../../components/some-handler/send-box'
import ActionSheet from '../../../../components/action-sheet'
import MessageRow from '../../../../components/message-row'

/** Local Import */
import { useTheme } from '../../../../utils/context/ThemeContext'
import { styles } from '../style'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import { useSocket } from '../../../../utils/context/socket-context'
import { ms } from '../../../../utils/helpers/metrics'
import { Colors } from '../../../../utils/styles'

/** Libraries */
import { TypingAnimation } from 'react-native-typing-animation';
import { launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const { height } = Dimensions.get('window')
const HomeSheetHeight = height * 0.6
const ChatFileHeight = height * 0.3

const androidKeyboardHeight = height * 0.125

/** Main Export */
const SingleChat = ({ route }) => {
    const { theme } = useTheme()
    const { Data, conversation_id, type } = route.params || {}
    const { Token, user } = useAuth()
    const userinfoRef = useRef()
    const chatFileRef = useRef()
    const ScrollRef = useRef(null)
    const { socket, socketConnected } = useSocket()
    const isFocused = useIsFocused()

    const [GetSingleChat, SetGetSingleChat] = useState(null)
    const [AllChats, SetAllChats] = useState([])
    const [message, setMessage] = useState('')
    const [hadeSubText, SetHadeSubText] = useState(null)
    const [TypingUser, SetTypingUser] = useState({});
    const [LoadMoreLoading, setLoadMoreLoading] = useState(false);
    const [Page, setPage] = useState(1);
    const [LoadPages, setLoadPages] = useState({ totalPages: 1 })
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [UserSeen, SetUserSeen] = useState({})
    const Navigation = useNavigation()

    /**
    * Open action sheet
    */
    const HandleFilterSheet = () => {
        if (userinfoRef.current) {
            userinfoRef.current.snapToIndex(0)
        }
    }
    const HandleChatFileSheet = () => {
        if (chatFileRef.current) {
            chatFileRef.current.snapToIndex(0)
        }
    }

    /**
     * Close file shet
     */
    const CloseFilesheet = () => {
        chatFileRef?.current?.close()
    }

    /**
     * Handle keyboard
     */
    useEffect(() => {
        const handleKeyboardShow = () => {
            if (ScrollRef.current) {
                ScrollRef.current.scrollToEnd({ animated: true });
            }
        };
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    /**
     * Send message
     */
    const sendMessage = () => {
        if (message.trim() && socket) {
            socket.emit('send-message', { conversation_id, text: message })
            setMessage('')
        }
    }

    /**
    * Choose photo
    */
    const launchGallery = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo'
        })
        if (result && !result.didCancel) {
            const { assets } = result
            if (assets && assets.length > 0) {
                const selectedImage = assets[0]
                CloseFilesheet()
                const formData = new FormData()
                formData.append("conversation_id", conversation_id)
                if (selectedImage) {
                    formData.append('file', {
                        name: selectedImage.fileName,
                        type: selectedImage.type,
                        uri: selectedImage.uri,
                        size: selectedImage.fileSize
                    })
                }
                const Response = await makeRequest("POST", "conversation/image-message", null, Token, formData, true)
                if (Response.success == 1) {
                    CloseFilesheet()
                } else if (Response.success == 0) {
                    CloseFilesheet()
                }
            }
        }
    }

    /**
     * Choose Document
     */
    const HandlePickDocument = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: DocumentPicker.types.pdf,
            })
            const AllFile = results[0]
            CloseFilesheet()

            const formData = new FormData()
            formData.append("conversation_id", conversation_id)
            if (results) {
                formData.append('file', {
                    name: AllFile.name,
                    type: AllFile.type,
                    uri: AllFile.uri,
                    size: AllFile.size
                })
            }
            const Response = await makeRequest("POST", "conversation/pdf-message", null, Token, formData, true)
            if (Response.success == 1) {
                CloseFilesheet()
            } else if (Response.success == 0) {
                CloseFilesheet()
            }
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
            } else {
                console.log('Unknown error:', error)
            }
        }
    }


    /**
     * Getting single user and chats 
     */
    const GetSingleGroup = (page) => {

        if (!socket) return;

        setLoadMoreLoading(true)

        socket.emit("conversation", { conversation_id, token: Token, page: page, limit: "20" }, (data) => {
            SetGetSingleChat(data?.data)
            SetAllChats((prevUsers) => [...data?.data?.messages?.items, ...prevUsers]);
            setLoadPages(data?.data?.messages?.meta)
            if (page == 1) {
                SetHadeSubText(data?.data?.header_subtext);
            }
            setLoadMoreLoading(false)
        })
    }

    /**
     * Scroll to load 
     */
    const handleScroll = ({ nativeEvent }) => {
        const isCloseToTop = nativeEvent.contentOffset.y <= 100;

        if (isCloseToTop && !LoadMoreLoading) {
            LoadMorePage();
        }
    };

    const LoadMorePage = () => {
        if (LoadPages?.totalPages > Page && !LoadMoreLoading) {
            setLoadMoreLoading(true);
            setPage((prevPage) => prevPage + 1);
        }
    };

    /**
     * Update chat
     */
    useEffect(() => {
        if (!socket || !isFocused || !socketConnected || !conversation_id) return;
        GetSingleGroup(Page);
    }, [Page, Token, socket, socketConnected, isFocused, conversation_id]);

    /**
     * Receive new message 
     */
    useEffect(() => {

        if (!socket || !isFocused || !socketConnected || !conversation_id) return;

        console.log("LOADING")

        socket.on('new-message', (data) => {

            console.log("SD", data);

            delete data.conversation;
            delete data.users;

            SetAllChats((previous) => [...previous, data])

            user?.data?.user?.id !== data?.user_id && socket.emit('message-status-update', {
                message_id: data?.id,
                type: 1,
                conversation_id: conversation_id
            });
        });

        socket.on("message-status", (data) => {
            SetUserSeen(data)
        })

        return () => {
            socket.off('new-message')
            socket.off('message-status')
        }
    }, [socket, socketConnected, isFocused, conversation_id]);

    /**
     * ScrollToEnd only show in 1st page 
     */
    const scrollToBottom = () => {
        if (Page === 1 && ScrollRef.current) {
            ScrollRef.current.scrollToEnd({ animated: false });
        }
    };

    const ids = GetSingleChat?.users.map(item => item.id);

    /**
     * Typing user
     */
    useEffect(() => {
        socket.on("typing", (data) => {
            SetTypingUser(data)
        });

        if (message) {
            socket.emit('typing', { conversation_id, users: ids || [] });
        }
        return () => {
            socket.off("typing");
        };
    }, [message]);

    /**
     * Handle keyboard 
     */
    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });

        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        // Cleanup listeners on unmount
        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    const goBack = () => {
        socket.emit('leave_room', { conversation_id });
        Navigation.goBack();
    }

    return (
        <>
            <SafeAreaView backgroundColor={theme.background} />
            <View style={[styles.sa_main_container, { backgroundColor: theme.background }]}>
                <ChatHeader
                    {...{
                        HandleFilterSheet,
                        Data,
                        headerSubTest: hadeSubText,
                        goBack: goBack
                    }}
                />

                {/* Chat box */}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : "height"}
                    keyboardVerticalOffset={Platform.OS === 'android' ? isKeyboardVisible ? androidKeyboardHeight : 0 : 0}
                >
                    {LoadMoreLoading && (
                        <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: ms(20) }}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                    )}
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                        style={styles.sa_scroll_container}
                        showsVerticalScrollIndicator={false}
                        ref={ScrollRef}
                        onContentSizeChange={scrollToBottom}
                        keyboardShouldPersistTaps="handled"
                        onScroll={handleScroll}
                        scrollEventThrottle={100}
                    >
                        {AllChats?.map((item, index) => (
                            <MessageRow key={index.toString()} type={item.type} item={item} UserSeen={UserSeen} />
                        ))}
                        {
                            TypingUser.user_id &&
                            TypingUser.user_id !== user?.data?.user?.id && (
                                <View style={{ flexDirection: "row" }}>
                                    <View style={[styles.ws_group_user_image]}>
                                        <Image style={styles.ws_img} source={{ uri: TypingUser.$avatar_user }} />
                                    </View>
                                    <View style={styles.ws_type_container}>
                                        <View style={styles.ws_typing_container}>
                                            <Text style={[styles.ws_typeing_text]}>{TypingUser.name}</Text>
                                            <View style={{ marginTop: ms(2) }}>
                                                <TypingAnimation
                                                    dotColor={Colors.ws_black}
                                                    dotSpeed={0.2}
                                                    dotAmplitude={3}
                                                    dotRadius={2.3}
                                                    dotMargin={8}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }

                    </ScrollView>
                </KeyboardAvoidingView>
                <SendBox
                    {...{
                        HandleChatFileSheet,
                        message,
                        setMessage,
                        sendMessage,
                        GetSingleGroup
                    }}
                />
            </View>
            <ActionSheet
                {...{
                    BottomSheetRef: userinfoRef,
                    type: "group_user",
                    Points: HomeSheetHeight,
                    Title: "common.memberGroup",
                    Data: GetSingleChat?.users,
                }}
            />
            <ActionSheet
                {...{
                    BottomSheetRef: chatFileRef,
                    type: "chat_file",
                    Points: ChatFileHeight,
                    Title: "Choose file",
                    launchGallery,
                    HandlePickDocument
                }}
            />
        </>
    )
}

export default SingleChat

