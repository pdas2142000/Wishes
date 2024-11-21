import React, { useCallback, useRef, useState } from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Share,
    ActivityIndicator,
    Dimensions,
} from 'react-native'

/** Icon */
import EditIcon from "../../../../assets/svgs/pencil_two.svg"
import CheckIcon from "../../../../assets/svgs/checkstrock.svg"
import TrashoneIcon from "../../../../assets/svgs/trashone.svg"
import ShareIcon from "../../../../assets/svgs/share.svg"
import TrashIcon from "../../../../assets/svgs/trash.svg"
import AcceptIcon from "../../../../assets/svgs/accept.svg"
import RejectIcon from "../../../../assets/svgs/reject.svg"

/** Components */
import TabUnderLineMenu from '../../../components/tab-underline-menu'
import WishesEventList from '../../../components/all-tabs/manage-event-list/wishes-event-list'
import GuestEventList from '../../../components/all-tabs/manage-event-list/guests-event-list'
import AppHeader from '../../../components/header'
import ActionSheet from '../../../components/action-sheet'

/** Local Imports */
import { AppCommonStyle, Colors } from '../../../utils/styles'
import { ms, toast } from '../../../utils/helpers/metrics'
import { IconProps } from '../../../utils/helpers/Iconprops'
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'
import { makeRequest } from '../../../utils/make-request'
import { useAuth } from '../../../utils/context/AuthContext'

/** Libraries */
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import PopUp from '../../../components/popup'
import { manage_tab_list, Management_event_styles } from './helper'

const screenHeight = Dimensions.get('window').height;
const SettingSheetHeight = screenHeight > 800 ? screenHeight * 0.35 : screenHeight * 0.42;

/** Main Export */
const ManageEvent = ({ route }) => {

    const { Data, type } = route.params || {}
    const { Token } = useAuth()
    const { theme } = useTheme()
    const { translate } = useLanguage()
    const styles = Management_event_styles

    const Navigation = useNavigation()
    const DeleteRef = useRef()
    const PublishRef = useRef()
    const InvitationRef = useRef()

    const [SelectedTab, setSelectedTab] = useState("Wishes")
    const [GetEvent, setGetEvent] = useState({})
    const [AddEventWishes, SetAddEventWishes] = useState([])
    const [AddEventGuest, SetAddEventGuest] = useState([])
    const [InvitationId, SetInvitationId] = useState()
    const [InvitationType, SetInvitationType] = useState()
    const [loaging, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

    /**
     * Delete event
     */
    const EventDelete = async () => {
        const Response = await makeRequest("DELETE", `event/${Data.slug}`, null, Token)
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
    }

    /**
     * After publishing bottom sheet will be closed.
     */
    const CloseSheet = () => {
        PublishRef?.current?.close()
    }

    /** 
   * Event view screen Details
   */
    const fetchEvent = async () => {
        setLoading(true)
        const Response = await makeRequest("GET", `event/${Data.slug}`, null, Token);
        setGetEvent(Response.data);
        setLoading(false)
    };

    /**
     * Publish event
     */
    const PublishEvent = async () => {
        if (GetEvent.wishes == 0 || GetEvent.guests == 0) {
            toast("error", {
                title: "Please add at least one wish and one guest.",
            });
            CloseSheet()
        } else {
            try {
                const response = await makeRequest("PUT", `event/toggle-published/${Data.slug}`, null, Token);
                if (response.success === 1) {
                    toast("success", {
                        title: response.message,
                    });
                    CloseSheet()
                    Navigation.goBack()
                } else if (response.success === 0) {
                    toast("error", {
                        title: response.message,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    /**
     * Delete action sheet open
     */
    const HandleEventDeleteSheet = () => {
        if (DeleteRef.current) {
            DeleteRef.current.snapToIndex(0)
        }
    }

    /**
     * Publish action sheet open 
     */
    const HandlePublishSheet = () => {
        if (PublishRef.current) {
            PublishRef.current.snapToIndex(0)
        }
    }

    /**
     * Event share 
     */
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'Join this event',
                url: 'https://wishes-app.com/',
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type: ', result.activityType)
                } else {
                    console.log('Content shared successfully!')
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed')
            }
        } catch (error) {
            console.error('Error sharing content: ', error.message)
        }
    }

    /**
     * Edit event navigation
     */
    const HandleNavigation = () => {
        if (GetEvent.type === "general") {
            Navigation.navigate("wishlist_add_new", { type: "wishlist_edit", Data: Data })
        } else {
            Navigation.navigate("event_add_new", { type: "event_edit", Data: Data })
        }
    }

    /**
     *  Event action buttons
     */
    const ActionData = [
        {
            Icon: EditIcon,
            Text: "common.edit",
            OnPress: HandleNavigation
        },
        {
            Icon: CheckIcon,
            Text: GetEvent.status == "published" ? "common.unpublish" : "common.publish",
            OnPress: () => { HandlePublishSheet() },
        },
        {
            Icon: TrashoneIcon,
            Text: "common.delete",
            OnPress: () => { HandleEventDeleteSheet() }
        },
        {
            Icon: ShareIcon,
            Text: "common.share",
            OnPress: () => { onShare() }
        },
    ]

    /**
     * General event buttons
     */
    const GeneralActionData = [
        {
            Icon: EditIcon,
            Text: "common.edit",
            OnPress: HandleNavigation
        },
        {
            Icon: TrashoneIcon,
            Text: "common.delete",
            OnPress: () => { HandleEventDeleteSheet() }
        },
        {
            Icon: ShareIcon,
            Text: "common.share",
            OnPress: () => { onShare() }
        },
    ]

    /**
     * Event information
     */
    const OrgInfo = [
        {
            title: "size",
            subText: "common.icuGuest",
            value: GetEvent?.guests
        },
        {
            title: "date",
            subText: GetEvent?.date
        },
        ...(GetEvent?.time !== null ? [{
            title: "time",
            subText: `at ${GetEvent?.time}`
        }] : [])
    ]

    /**
     * Event information
     */
    const GeneralOrgInfo = [
        {
            title: "common.icuWishe",
            subText: Data.wishes_count
        },
        {
            title: "common.icuGuest",
            subText: Data.guests
        },
    ]

    /**
     * Lists of wishes
     */
    const GetEventWishes = async () => {
        const Response = await makeRequest("GET", `wish/bank`, { event_id: Data.slug }, Token)
        SetAddEventWishes(Response?.data?.items)
    }

    /** 
     * Lists of guest
     */
    const GetEventGuest = async () => {
        const Response = await makeRequest("GET", `group`, { event_id: Data.slug }, Token)
        SetAddEventGuest(Response?.data?.users)
    }

    /**
     * Funcion call
     */
    useFocusEffect(
        useCallback(() => {
            GetEventWishes()
            fetchEvent();
            GetEventGuest()
        }, [Token])
    );

    /** 
     * Handdle reject sheet open
     */
    const HandleInvitationSheet = (Data, type) => {
        SetInvitationId(Data.slug)
        SetInvitationType(type)
        if (InvitationRef.current) {
            InvitationRef.current.snapToIndex(0)
        }
    }
 
    /**
     * Invitation accept and reject 
     */
    const HandleInvitationEvent = async (Data, type) => {

        try {
            const TYPE = type == "accepted" ? type : InvitationType
            const ID = type == "accepted" ? Data.slug : InvitationId
            const Response = await makeRequest("PUT", `group/${ID}/${TYPE}"`, null, Token)
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

    const OpenModal = (image) => {
        setSelectedImage(image)
        setModalVisible(true)
    }

    const CloseModal = () => {
        setModalVisible(false)
    }

    const title = GetEvent.type === "general" ? "common.wishListPlural" : Data.type === "invitation" ? "Invitation" : "common.events";

    return (
        <>
            <AppHeader
                {...{
                    title: title,
                    willGoBack: true
                }}
            />
            <View style={[styles.ws_main_container, { backgroundColor: theme.background }]}>
                {
                    loaging ?
                        <View style={AppCommonStyle.ws_top_indicator_box}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                        :
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.ws_padding}>
                                <View style={[styles.ws_event_box, { backgroundColor: theme.background }]}>
                                    <TouchableOpacity style={[styles.ws_event_image]} onPress={() => OpenModal(GetEvent.$avatar_url)}>
                                        {
                                            GetEvent.$avatar_url ?
                                                <Image style={styles.ws_img} source={{ uri: GetEvent.$avatar_url }} /> :
                                                <Image style={styles.ws_img} source={require("../../../../assets/images/image.png")} />
                                        }
                                    </TouchableOpacity>
                                    <View>
                                        <View style={styles.ws_event_org}>
                                            <View style={styles.ws_user_image}>
                                                {
                                                    GetEvent?.user?.$avatar_url ?
                                                        <Image style={styles.ws_img} source={{ uri: GetEvent?.user?.$avatar_url }} /> :
                                                        <Image style={[styles.ws_img, { tintColor: theme.subtext }]} source={require("../../../../assets/images/user.png")} />
                                                }
                                            </View>
                                            <Text style={[styles.ws_organised_owner, { color: theme.text }]}>{GetEvent?.user_name}</Text>
                                        </View>
                                        <Text style={[styles.ws_event_header, { color: theme.text }]}>{GetEvent?.name}</Text>
                                        {
                                            GetEvent?.venue == "undefined" || GetEvent.venue == null ?
                                                null : <View style={styles.ws_location_box}>
                                                    <Text style={[styles.ws_location_text, { color: theme.text }]}>{GetEvent?.venue}</Text>
                                                </View>
                                        }
                                    </View>
                                </View>
                                <View
                                    style={[
                                        styles.org_info,
                                        {
                                            backgroundColor: theme.background, 
                                            marginBottom: GetEvent.user_type ? ms(23) :null
                                        }
                                    ]}
                                >
                                    {
                                        GetEvent.type === "general" ?
                                            GeneralOrgInfo.map((item, index) => {
                                                const lastIndex = index === GeneralOrgInfo.length - 1
                                                return (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            styles.ws_general_event_info,
                                                            {
                                                                borderRightWidth: lastIndex ? ms(0) : ms(1),
                                                            }
                                                        ]}
                                                    >
                                                        <Text style={[styles.ws_info_text, { color: theme.text, fontSize: ms(13) }]}>{translate(item.title, { numPersons: item.subText })}</Text>
                                                    </View>
                                                )
                                            }) :
                                            OrgInfo.map((item, index) => {
                                                const lastIndex = index === OrgInfo.length - 1
                                                return (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            styles.ws_event_info,
                                                            {
                                                                width: GetEvent?.time == null ? "50%" : "33.33%",
                                                                borderRightWidth: lastIndex ? ms(0) : ms(1),

                                                            }
                                                        ]}
                                                    >
                                                        <Text style={[styles.ws_info_hade, { color: theme.subtext }]}>{item.title}</Text>
                                                        <Text style={[styles.ws_info_text, { color: theme.text }]}>{translate(item.subText, { numPersons: item.value })}</Text>
                                                    </View>
                                                )
                                            })
                                    }
                                </View>
                                {
                                    GetEvent.user_type && (
                                        <View style={[styles.ws_action_info, { backgroundColor: theme.background, }]}>
                                            {(GetEvent.type === "general" ? GeneralActionData : ActionData).map((item, index) => {
                                                const Icon = item.Icon;
                                                return (
                                                    <TouchableOpacity
                                                        style={styles.ws_action_btn}
                                                        key={index}
                                                        onPress={item.OnPress}
                                                    >
                                                        <Icon style={{ marginBottom: ms(7) }} {...IconProps(ms(21))} fill={theme.text} />
                                                        <Text style={[styles.ws_action_text, { color: theme.text }]}>{translate(item.Text)}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    )
                                }
                                {
                                    type === "invitation" ?
                                        <View style={styles.ws_btn_box}>
                                            <TouchableOpacity
                                                style={[styles.ws_status_box, { backgroundColor: theme.card_bg }]}
                                                onPress={() => HandleInvitationEvent(GetEvent, "accepted")}
                                            >
                                                <Text style={[styles.ws_status_text, { color: theme.text }]}>Accept</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.ws_status_box, { backgroundColor: Colors.ws_reject }]}
                                                onPress={() => HandleInvitationSheet(GetEvent, "rejected")}
                                            >
                                                <Text style={[styles.ws_status_text, { color: "white" }]}>Reject</Text>
                                            </TouchableOpacity>
                                        </View> : null
                                }
                            </View>
                            <View style={{ marginTop: ms(23) }}>
                                <TabUnderLineMenu
                                    {...{
                                        SelectedTab,
                                        setSelectedTab,
                                        Data: manage_tab_list,
                                    }}
                                />
                            </View>
                            <View style={styles.ws_tab_box}>
                                {SelectedTab === 'Wishes' ?
                                    <WishesEventList
                                        {...{
                                            EventId: GetEvent.slug,
                                            ID: GetEvent.id,
                                            AddEventWishes,
                                            GetEventWishes,
                                            GetEvent,
                                            loaging,
                                            type
                                        }}
                                    />
                                    : null}
                                {SelectedTab === 'Guests' ?
                                    <GuestEventList
                                        {...{
                                            EventId: GetEvent.slug,
                                            ID: GetEvent.id,
                                            AddEventGuest,
                                            GetEventGuest,
                                            GetEvent,
                                            user: GetEvent.user_type,
                                            loaging
                                        }}
                                    />
                                    : null}
                            </View>
                        </ScrollView>
                }
            </View>
            <ActionSheet
                {...{
                    BottomSheetRef: DeleteRef,
                    Points: SettingSheetHeight,
                    type: "logout",
                    btnText: "common.delete",
                    btnTitle: `common.sureDelete`,
                    SheetIcon: TrashIcon,
                    onPress: EventDelete
                }}
            />
            <ActionSheet
                {...{
                    BottomSheetRef: PublishRef,
                    Points: SettingSheetHeight,
                    type: "logout",
                    btnText: Data.published == true ? "common.unpublish" : "common.publish",
                    btnTitle: `Are you sure you want to ${Data.published == true ? "Unpublished" : "Published"} this event`,
                    SheetIcon: TrashIcon,
                    bgcolr: "#00a700AC",
                    onPress: PublishEvent
                }}
            />
            <ActionSheet
                {...{
                    BottomSheetRef: InvitationRef,
                    Points: SettingSheetHeight,
                    type: "logout",
                    btnText:  "Reject",
                    btnTitle: "Are you sure you want to Reject",
                    SheetIcon: RejectIcon,
                    onPress: HandleInvitationEvent
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

export default ManageEvent

