/** React Imports */
import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'

/** Local Imports */
import { AppCommonStyle, Colors, Fonts } from '../../../../utils/styles'
import { IconProps } from '../../../../utils/helpers/Iconprops'
import { ms, toast } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'

/** Components */
import SwipeableComponent from '../../../swipeable-component'
import { CommonBanner } from '../../../wishes-banner'

/** Icons */
import AddIcon from "../../../../../assets/svgs/add.svg"

/** Libraries */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useAuth } from '../../../../utils/context/AuthContext'
import { makeRequest } from '../../../../utils/make-request'
import NotFound from '../../../not-found'

/** Main Export */
const GuestEventList = ({ EventId, AddEventGuest, ID, GetEventGuest, GetEvent, user }) => {
    const Navigation = useNavigation()
    const { theme } = useTheme()
    const { translate } = useLanguage()
    const { Token } = useAuth()
    const isFocused = useIsFocused()

    const [selectedSlug, setSelectedSlug] = useState(null)
    const [Loading, SetLoading] = useState(false)

    /**
    * Remove guest from the event
    */
    const RemoveGuest = async () => {
        SetLoading(true)
        try {
            const Response = await makeRequest("DELETE", `group/${selectedSlug}`, { event_id: ID }, Token)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                GetEventGuest()
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            toast("error", {
                title: 'Something went wrong!',
            })
        } finally {
            SetLoading(false)
        }
    }

    return (
        <>
            <View style={styles.ws_content_box}>
                {
                    GetEvent.user_type == true ?
                        <TouchableOpacity style={[styles.ws_add_box,]} onPress={() => Navigation.navigate("addguest", { EventId })} >
                            <AddIcon {...IconProps(ms(19))} fill={theme.text} />
                            <Text style={[styles.ws_add_text, { color: theme.text }]}>{translate("common.addguest")}</Text>
                        </TouchableOpacity> : null
                }
            </View>
            <View style={{ marginTop: ms(20) }}> 
                {
                    Loading ? (
                        <View style={AppCommonStyle.ws_indicator_box}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                    ) :
                        (
                            AddEventGuest && AddEventGuest.length > 0 ? (
                                AddEventGuest.map((item, index) => {
                                    return (
                                        <View key={index} >
                                            {
                                                item.user_type ? (
                                                    <SwipeableComponent
                                                        slug={item.id}
                                                        setSelectedSlug={setSelectedSlug}
                                                        onDelete={RemoveGuest}
                                                        type="wishes"
                                                        swipetext="common.remove"
                                                        btntext="common.remove"
                                                        subtext="common.removeText"
                                                    >
                                                        <CommonBanner
                                                            item={item}
                                                            type="guest"
                                                            default_image={require("../../../../../assets/images/gift.png")}
                                                        />
                                                    </SwipeableComponent>
                                                ) : (
                                                    <CommonBanner
                                                        item={item}
                                                        type="guest"
                                                        default_image={require("../../../../../assets/images/gift.png")}
                                                    />
                                                )
                                            }
                                        </View>
                                    )
                                })
                            ) : (
                                <NotFound
                                    {...{
                                        title: 'common.gaustNot',
                                    }}
                                />
                            )
                        )
                }
            </View >
        </>
    )
}

export default GuestEventList

const styles = StyleSheet.create({
    ws_content_box: {
        marginTop: ms(15),
        flex: 1,
        alignItems: "flex-end"
    },
    ws_add_box: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: ms(1),
    },
    ws_add_text: {
        color: Colors.ws_black,
        fontFamily: Fonts.Font_500,
        fontSize: ms(12),
        textTransform: "capitalize",
        marginTop: ms(1),
        marginLeft: ms(6)
    },
    ws_not_found: {
        width: "100%",
        height: ms(100),
        alignItems: "center",
        justifyContent: "center"
    },
    ws_not_found_text: {
        color: Colors.ws_text,
        fontFamily: Fonts.Font_400,
        fontSize: ms(12)
    },
    ws_container: {
        width: "100%",
        height: ms(65),
        backgroundColor: Colors.ws_white,
        borderRadius: ms(12),
        paddingHorizontal: ms(15),
        flexDirection: "row"
    },
    ws_image: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(50),
        overflow: "hidden"
    },
    ws_gift_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(13),
        color: Colors.ws_text,
        marginLeft: ms(10),
    },
    ws_img: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    }
})


const Data = [
    {
        image: require("../../../../../assets/dummy/man1.jpg"),
        text: "John Doe",
        subtext: "+91 9900998876"
    },
    {
        image: require("../../../../../assets/dummy/man2.jpg"),
        text: "Jane Smith",
        subtext: "+91 9900998876"
    },
    {
        image: require("../../../../../assets/dummy/man3.jpg"),
        text: "Michael Johnson",
        subtext: "+91 9900998876"
    },
    {
        image: require("../../../../../assets/dummy/girl1.jpg"),
        text: "Emily Davis",
        subtext: "+91 9900998876"
    },
]
