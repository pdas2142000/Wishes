/** React Imports */
import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'

/** Icons */
import AddIcon from "../../../../../assets/svgs/add.svg"

/** Local Imports */
import { IconProps } from '../../../../utils/helpers/Iconprops'
import { AppCommonStyle, Colors, Fonts } from '../../../../utils/styles'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { ms, toast } from '../../../../utils/helpers/metrics'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'

/** Components */
import NotFound from '../../../not-found'
import SwipeableComponent from '../../../swipeable-component'
import { CommonBanner } from '../../../wishes-banner'

/** Libraries */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useLanguage } from '../../../../utils/context/LanguageContext'

/** Main Export */
const WishesEventList = ({ EventId, AddEventWishes, GetEventWishes, ID, GetEvent, loaging, type }) => {

    const Navigation = useNavigation()
    const { theme } = useTheme()
    const { Token } = useAuth()
    const { translate } = useLanguage()
    const isFocused = useIsFocused()

    const [selectedSlug, setSelectedSlug] = useState(null)

    /**
    * Remove wishes from the event
    */
    const RemoveWishes = async () => {
        try {
            const Response = await makeRequest("DELETE", `wish/gift/${selectedSlug}`, { event_id: ID }, Token)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                GetEventWishes()

            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            toast("error", {
                title: 'Something went wrong!',
            })
        }
    }


    return (
        <>
            {
                GetEvent.user_type ?
                    <View style={styles.ws_content_box}>
                        <TouchableOpacity style={[styles.ws_add_box,]} onPress={() => Navigation.navigate("addwish", { EventId })}>
                            <AddIcon {...IconProps(ms(19))} fill={theme.text} />
                            <Text style={[styles.ws_add_text, { color: theme.text }]}>{translate("common.addwish")}</Text>
                        </TouchableOpacity>
                    </View> : null
            }
            <View style={{ marginTop: ms(20) }}>
                {
                    loaging ? (
                        <View style={AppCommonStyle.ws_indicator_box}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                    ) : (
                        AddEventWishes && AddEventWishes.length > 0 ? (
                            AddEventWishes?.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <SwipeableComponent
                                            slug={item.id}
                                            setSelectedSlug={setSelectedSlug}
                                            onDelete={RemoveWishes}
                                            type="wishes"
                                            swipetext="common.remove"
                                            btntext="common.remove"
                                            subtext="common.removeText"
                                        >
                                            <CommonBanner
                                                {...{
                                                    item,
                                                    type: "wishes",
                                                    onpress: type !== "invitation"
                                                        ? () => Navigation.navigate("wishesinfoscreen", {
                                                            Data: item,
                                                            Event_id: GetEvent.slug,
                                                            Discussion_id: GetEvent.id,
                                                            Event_info: GetEvent
                                                        })
                                                        : null
                                                }
                                                }
                                            />
                                        </SwipeableComponent>
                                    </View>
                                )
                            })
                        ) : (
                            <NotFound
                                {...{
                                    title: 'common.wishNot',
                                }}
                            />
                        )
                    )
                }
            </View >
        </>
    )
}

export default WishesEventList

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
        marginLeft: ms(6)
    },
})