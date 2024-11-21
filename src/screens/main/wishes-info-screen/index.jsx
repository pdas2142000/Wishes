/** React Imports */
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator, Dimensions, Platform } from 'react-native'

/** Local Imports */
import { AppCommonStyle } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'
import { ms, toast } from '../../../utils/helpers/metrics'
import { IconProps } from '../../../utils/helpers/Iconprops'
import { useLanguage } from '../../../utils/context/LanguageContext'
import { makeRequest } from '../../../utils/make-request'
import { useAuth } from '../../../utils/context/AuthContext'
import { MainStackStyles } from '../../auth/common/auth-styles'
import { Banner_styles } from '../../../utils/styles/BannerStyle'
import PopUp from '../../../components/popup'
import { wish_info_styles } from './helper'

/** Components */
import AppHeader from '../../../components/header'
import ActionSheet from '../../../components/action-sheet'

/** Icon */
import TrashIcon from "../../../../assets/svgs/trash.svg"
import EditIcon from "../../../../assets/svgs/pencil_two.svg"
import TrashoneIcon from "../../../../assets/svgs/trashone.svg"
import ViewIcon from "../../../../assets/svgs/eye.svg"
import CommentIcon from "../../../../assets/svgs/comment.svg"
import GiftIcon from "../../../../assets/svgs/gift.svg"

/** Libraries */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { DateTime } from 'luxon';
import NotFound from '../../../components/not-found'

const screenHeight = Dimensions.get('window').height;
const SettingSheetHeight = screenHeight * 0.42;
const SettingSheetHeightIos = screenHeight * 0.3;
const SettingSheetHeightAndroid = screenHeight * 0.4;

/** Main Export */
const WishesInfoScreen = ({ route }) => {

    const { Data, Event_id, Discussion_id,Event_info } = route.params || {}
    const { Token } = useAuth() 
    const { theme } = useTheme()
    const { translate } = useLanguage()

    const isFocused = useIsFocused()
    const Navigation = useNavigation()
    const DeleteRef = useRef()
    const GiftRef = useRef()
    const styles = wish_info_styles

    const [SingleData, setSingleData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [ContributionUser, SetContributionUser] = useState({})

    const { reset, control, handleSubmit, } = useForm()

    /**
     * Open delete bottom sheet
     */
    const HandleWishesDeleteSheet = () => {
        if (DeleteRef.current) {
            DeleteRef.current.snapToIndex(0)
        }
    }
    /**
     * Open gift bottom sheet
     */
    const HandleWishesgiftSheet = () => {
        if (GiftRef.current) {
            GiftRef.current.snapToIndex(0)
        }
    }

    /**
       * Product Url
       */
    const ProductUrl = () => {
        Linking.openURL(SingleData.url);
    }

    /**
     * Action buttons
     */
    const ActionData = [
        {
            Icon: EditIcon,
            Text: "ManageWishesScreen.editWishes",
            OnPress: () => { Navigation.navigate("wishbankaddnew", { Data: Data, type: "edit_wishes", }) }
        },
        {
            Icon: TrashoneIcon,
            Text: "common.delete",
            OnPress: () => { HandleWishesDeleteSheet() }
        },
        {
            Icon: ViewIcon,
            Text: "View",
            OnPress: () => { ProductUrl() }
        },
    ]

    /**
     * User action buttons
     */
    const UserActionData = [
        {
            Icon: CommentIcon,
            Text: "discussion",
            OnPress: () => { Navigation.navigate("singlechat", { Data: Event_info, conversation_id: Discussion_id , type:"event_chat"}) }
        },
        {
            Icon: GiftIcon,
            Text: "gift",
            OnPress: () => { HandleWishesgiftSheet() }
        },
        {
            Icon: ViewIcon,
            Text: "View",
            OnPress: () => { ProductUrl() }
        },
    ]

    /**
     * Get single wishes
     */
    const GetData = async () => {
        setLoading(true) // Start loading
        try {
            const Response = await makeRequest("GET", `wish/${Data.slug}`, null, Token)
            setSingleData(Response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false) // Stop loading
        }
    }

    /**
     * Delete wishes
     */
    const DeleteWishes = async () => {
        try {
            const Response = await makeRequest("DELETE", `wish/${Data.slug}`, null, Token)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                Navigation.goBack()
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const FormBuilder = [
        {
            name: 'quantity',
            parent: 'add_wish',
            type: 'gift',
            control,
            label: false,
            placeholder: false,
            styles: MainStackStyles,
        }
    ]

    /**
     * Open image 
     */
    const OpenModal = (image) => {
        setSelectedImage(image)
        setModalVisible(true)
    }

    const CloseModal = () => {
        setModalVisible(false)
    } 

    /**
     * Contribution gift
     */
    const Contribution = async (data) => {
        const NewData = { ...data, event_id: Event_id }
        const Response = await makeRequest("PUT", `wish/gift/${Data.slug}`, null, Token, NewData)
        if (Response.success === 1) {
            toast("success", {
                title: Response.message,
            })
            reset()
        } else if (Response.success === 0) {
            toast("error", {
                title: Response.message,
            })
            reset()
        }
    }

    /**
     * Get Contribution gift
     */
    const GetContributionUser = async () => {
        setLoading(true)
        const Response = await makeRequest("GET", `wish/gift/${Data.slug}`, null, Token)
        SetContributionUser(Response?.data)
        setLoading(false)
    }

    useEffect(() => {
        GetData()
        GetContributionUser()
    }, [isFocused]);

    const formattedDate = DateTime.fromISO(ContributionUser.created_at).toFormat("d'th' MMMM yyyy");

    return (
        <>
            <AppHeader
                {...{
                    title: "common.wishPlural",
                    willGoBack: true
                }}
            />
            <View style={[AppCommonStyle.ws_main_container, { backgroundColor: theme.background }]}>
                {
                    loading ? (
                        <View style={AppCommonStyle.ws_top_indicator_box}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View style={{ marginBottom: ms(50) }}>
                                <View style={[styles.ws_event_box, { backgroundColor: theme.background }]}>
                                    <TouchableOpacity style={styles.ws_event_image} onPress={() => OpenModal(SingleData?.$avatar_url)}>
                                        <Image style={styles.ws_img} source={{ uri: SingleData?.$avatar_url }} />
                                    </TouchableOpacity>
                                    <View style={styles.ws_info_text}>
                                        <Text style={[styles.ws_event_header, { color: theme.text }]}>{SingleData?.name}</Text>
                                    </View>
                                </View>
                                <View style={[styles.ws_container, { backgroundColor: theme.card_bg }]} >
                                    <Text style={[styles.ws_location_text, { color: theme.text }]}>Quantity</Text>
                                    <Text style={[styles.ws_location_text, { color: theme.text }]}> {SingleData?.quantity}</Text>
                                </View>
                                <View style={[styles.ws_comment_container, { backgroundColor: theme.card_bg }]} >
                                    <Text style={[styles.ws_location_text, { color: theme.text }]}>Comment</Text>
                                    <Text style={[styles.ws_subtext, { color: theme.subtext }]}>{SingleData?.description}Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime at atque est explicabo incidunt, tempora et ipsum excepturi soluta enim?</Text>
                                </View>
                                <View style={[styles.ws_action_info, { backgroundColor: theme.background }]}>
                                    {
                                        (Data.user_type ? ActionData : UserActionData).map((item, index) => {
                                            const Icon = item.Icon
                                            return (
                                                <TouchableOpacity
                                                    style={styles.ws_action_btn}
                                                    key={index}
                                                    onPress={item.OnPress}
                                                >
                                                    <Icon style={{ marginBottom: ms(7) }} {...IconProps(ms(21))} fill={theme.text} />
                                                    <Text style={[styles.ws_action_text, { color: theme.text }]}>{translate(item.Text)}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                                {
                                    !Data.user_type ?
                                        <View
                                            style={[styles.ws_comment_container, { backgroundColor: theme.card_bg, marginTop: ms(20) }]}
                                        >
                                            <Text style={[styles.ws_location_text, { color: theme.text }]}>Contribution</Text>
                                            {
                                                loading ? (
                                                    <View style={AppCommonStyle.ws_top_indicator_box}>
                                                        <ActivityIndicator color={theme.text} size="small" />
                                                    </View>
                                                ) : ContributionUser?.users?.length > 0 ? (
                                                    ContributionUser.users.map((item, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={[
                                                                Banner_styles.ws_selectable_container,
                                                                { backgroundColor: theme.background }
                                                            ]}
                                                            onPress={() => handleItemSelect(item)}
                                                        >
                                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                <View style={Banner_styles.ws_select_image}>
                                                                    <Image
                                                                        style={Banner_styles.ws_img}
                                                                        source={{ uri: item?.$avatar_url }}
                                                                    />
                                                                </View>
                                                                <View style={Banner_styles.ws_info}>
                                                                    <Text style={[Banner_styles.ws_title, { color: theme.text }]}>
                                                                        {`${item?.first_name} ${item?.last_name} contribute ${ContributionUser.quantity} gifts`}
                                                                    </Text>
                                                                    <Text
                                                                        style={[
                                                                            styles.ws_subtext,
                                                                            { color: theme.subtext, marginTop: ms(3) }
                                                                        ]}
                                                                    >
                                                                        {formattedDate}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ))
                                                ) : (
                                                    <NotFound title="Contribution not found" />
                                                )
                                            }
                                        </View>
                                        : null
                                }

                            </View>
                        </ScrollView>
                    )
                }
            </View>
            <ActionSheet
                {...{
                    BottomSheetRef: DeleteRef,
                    Points: SettingSheetHeight,
                    type: "logout",
                    btnText: "delete",
                    btnTitle: `Are you sure you want to delete this wishes?`,
                    SheetIcon: TrashIcon,
                    onPress: DeleteWishes
                }}
            />
            <ActionSheet
                {...{
                    BottomSheetRef: GiftRef,
                    Points: Platform.OS === "ios" ? SettingSheetHeightIos : SettingSheetHeightAndroid,
                    type: "gift",
                    FormBuilder,
                    Title: "Select quantity",
                    onPress: handleSubmit(Contribution),
                }}
            />
            <PopUp
                {...{
                    Vsible: modalVisible,
                    Close: CloseModal,
                    MainData: selectedImage,
                    styles
                }}
            />
        </>
    )
}
export default WishesInfoScreen