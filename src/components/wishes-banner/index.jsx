/** React Imports */
import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'

/** Local Imports */
import { Colors } from '../../utils/styles'
import { ms } from '../../utils/helpers/metrics'
import { useLanguage } from '../../utils/context/LanguageContext'
import { useTheme } from '../../utils/context/ThemeContext'
import { IconProps } from '../../utils/helpers/Iconprops'
import { Banner_styles } from '../../utils/styles/BannerStyle'

/** Components */
import { useNavigation } from '@react-navigation/native'

/** Icons */
import CheckIcon from "../../../assets/svgs/check.svg"

/** Main Export */
export const WishesBanner = ({ item, HandleInvitationSheet, type, event_flag ,HandleInvitationEvent}) => {
    
    const { translate } = useLanguage()
    const Navigation = useNavigation()
    const { theme } = useTheme()

    const styles = Banner_styles

    return (
        <View style={[styles.ws_archive_box, { backgroundColor: theme.card_bg }]}>
            <TouchableOpacity onPress={() => Navigation.navigate("manageevent", { Data: item, type })}>
                <View style={[styles.ws_top_box_content, { justifyContent: "space-between" }]}>
                    <View style={styles.ws_top_box_content}>
                        <View style={styles.ws_image_box}>
                            {
                                item?.$avatar_url ?
                                    <Image style={styles.ws_img} source={{ uri: item?.$avatar_url }} /> :
                                    <Image style={styles.ws_img} source={require("../../../assets/images/image.png")} />
                            }
                        </View>
                        <View style={styles.ws_content_text}>
                            {
                                type === "wish_bank" || type === "general" ?
                                    <Text style={[styles.ws_title, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text> :
                                    <>
                                        <Text style={[styles.ws_title, { color: theme.text }]}>{item.name}</Text>
                                        <Text style={[styles.ws_subtext, { color: theme.subtext }]} numberOfLines={1} ellipsizeMode="tail">{item?.user_name}</Text>
                                    </>
                            }
                        </View>
                    </View>
                    {
                        type === "wish_bank" ?
                            <View style={[
                                styles.ws_tag,
                                { backgroundColor: theme.card_bg }
                            ]}>
                                {
                                    item?.published == true ?
                                        <Text style={[styles.ws_tag_text, { color: theme.subtext }]}>Published</Text> :
                                        <Text style={[styles.ws_tag_text, { color: theme.subtext }]}>Draft</Text>
                                }
                            </View> : null
                    }
                </View>
                <View style={[styles.ws_border, { backgroundColor: theme.border }]} />
                {
                    item.general === true || event_flag ?
                        <View style={styles.ws_bottom_content}>

                            <View style={styles.ws_general_event_info}>
                                <Text style={[styles.ws_bottom_content_text, { color: theme.text }]}>
                                {translate("common.icuGuest", { numPersons: item.guests })}
                                </Text>
                            </View>
                            <View style={styles.ws_general_event_info}>
                                <Text style={[styles.ws_bottom_content_text, { color: theme.text }]}>
                                {translate("common.icuWishe", { numPersons: item.wishes_count })}
                                </Text>
                            </View>
                        </View>
                        :
                        <View style={styles.ws_bottom_content}>
                            <View style={styles.ws_event_info}>
                                <Text style={[styles.ws_bottom_content_text, { color: theme.text }]}>
                                    {translate("common.icuGuest", { numPersons: item.guests })}
                                </Text>
                            </View>
                            <View style={styles.ws_event_info}>
                                <Text style={[styles.ws_bottom_content_text, { color: theme.text }]}>
                                    {translate("common.icuWishe", { numPersons: item.wishes_count })}
                                </Text>
                            </View>
                            <View style={styles.ws_event_info}>
                                <Text style={[styles.ws_bottom_content_text, { color: theme.text }]}>{item.date}</Text>
                            </View>
                        </View>
                }

            </TouchableOpacity>
            {
                type === "invitation" ?
                    <View style={styles.ws_btn_box}>
                        <TouchableOpacity
                            style={[styles.ws_status_box, { backgroundColor: theme.background }]}
                            onPress={() => HandleInvitationEvent(item, "accepted", )}
                        >
                            <Text style={[styles.ws_status_text, { color: theme.text }]}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.ws_status_box, { backgroundColor: Colors.ws_reject }]}
                            onPress={() => HandleInvitationSheet(item, "rejected")}
                        >
                            <Text style={[styles.ws_status_text, { color: "white" }]}>Reject</Text>
                        </TouchableOpacity>
                    </View> : null
            }
        </View>
    )
}

export const CommonBanner = ({ item, onpress, type, default_image }) => {

    const { theme } = useTheme()
    const { translate } = useLanguage()
    const styles = Banner_styles

    return (
        <TouchableWithoutFeedback onPress={onpress} >
            <View style={[styles.ws_container, { backgroundColor: theme.card_bg }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.ws_image}>
                        {
                            item?.$avatar_url ?
                                <Image
                                    style={[styles.ws_img]}
                                    source={{ uri: item?.$avatar_url }}
                                /> :
                                <Image
                                    style={[styles.ws_img, { tintColor: theme.subtext }]}
                                    source={default_image}
                                />

                        }
                    </View>
                    <View style={styles.ws_content_text}>
                        {
                            type === "guest" ?
                                <Text style={[styles.ws_title, { color: theme.text }]}>{item.first_name} {item.last_name}</Text> :
                                <Text style={[styles.ws_title, { color: theme.text }]}>{item.name}</Text>
                        }
                        {
                            type === "guest" &&
                            <Text style={[styles.ws_subtext, { color: theme.subtext }]}>{item.phone}</Text>
                        }
                        {
                            item.subtext ?
                                <Text style={[styles.ws_subtext, { color: theme.subtext }]}>{translate("common.labelQuantity")} {item.subtext}</Text> :
                                null
                        }
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export const SelectableBanner = ({ item, onpress, select, type }) => {

    const { theme } = useTheme()
    const styles = Banner_styles
    const { translate } = useLanguage()

    return (
        <TouchableOpacity style={[styles.ws_selectable_container, { backgroundColor: theme.card_bg }]} onPress={onpress}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.ws_select_image}>
                    {
                        item?.$avatar_url ?
                            <Image style={styles.ws_img} source={{ uri: item?.$avatar_url }} /> :
                            <Image style={[styles.ws_img, { tintColor: theme.subtext }]} source={require("../../../assets/images/user.png")} />
                    }
                </View>
                <View style={styles.ws_info}>
                    {
                        type === "contact" ?
                            <>
                                <Text style={[styles.ws_title, { color: theme.text }]}>{item.first_name} {item.last_name}</Text>
                                <Text style={[styles.ws_subtext, { color: theme.subtext }]}>{item.subtext} </Text>
                            </> :
                            <>
                                <Text style={[styles.ws_title, { color: theme.text }]}>{item.name}</Text>
                                <Text style={[styles.ws_subtext, { color: theme.subtext }]}>{`${translate("common.labelQuantity")} ${item.subtext}`}</Text>
                            </>
                    }


                </View>
            </View>
            {
                select ?
                    <CheckIcon {...IconProps(ms(23))} fill={theme.text} /> :
                    <Text style={[styles.ws_info_status, { color: theme.text }]}>{item.status}</Text>
            }
        </TouchableOpacity>
    )
}