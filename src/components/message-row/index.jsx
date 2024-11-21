/** React Imports */
import React from 'react'
import { View, Text, Image, Platform } from 'react-native'

/** Components */
import Pdfhandle from '../some-handler/pdf-viewer';
import ImageHandle from '../some-handler/image-handle'

/** Local Imports */
import { Colors } from '../../utils/styles'
import { styles } from '../../screens/main/chat-screen/style'
import { useTheme } from '../../utils/context/ThemeContext'
import { useAuth } from '../../utils/context/AuthContext'

// /** Icons */
import Check from "../../../assets/svgs/checkstrock.svg"
import DubbleCheck from "../../../assets/svgs/dubble_check_inactive.svg"
import DubbleCheckActive from "../../../assets/svgs/dubble_check_seen.svg"
import { IconProps } from '../../utils/helpers/Iconprops';
import { ms } from '../../utils/helpers/metrics';

/** Main Export */
const MessageRow = ({ type, item, UserSeen }) => {

    const { theme } = useTheme()
    const { user } = useAuth()

    const CheckUser = item?.user_id === user?.data?.user?.id

    return (
        <>
            <View style={[styles.sa_chat_box, { alignSelf: CheckUser ? "flex-end" : "flex-start", }]} >
                {
                    !CheckUser ?
                        <View style={styles.ws_group_user_image}>
                            <Image style={styles.ws_img} source={{ uri: item?.user?.$avatar_url }} />
                        </View>
                        : null
                }
                <View>
                    <View style={styles.sa_msg_container}>
                        <View
                            style={[
                                styles.sa_msg_box,
                                {
                                    borderTopLeftRadius:!CheckUser ? ms(1):ms(8),
                                    borderTopRightRadius:ms(8),
                                    borderBottomRightRadius:ms(8),
                                    borderBottomLeftRadius:ms(8)
                                }
                            ]}
                        >
                            {
                                !CheckUser ?
                                    <Text style={[styles.ws_user_name, {marginBottom:Platform.OS === "ios"? ms(3):0}]}>{item?.user?.first_name} {item?.user?.last_name}</Text> : null
                            }
                            {
                                type === "text" ?
                                    <Text
                                        style={[
                                            styles.sa_msg_text,
                                            {
                                                color: CheckUser ? Colors.ws_black : Colors.ws_black,
                                                marginTop: CheckUser ? ms(4) : null
                                            }
                                        ]}
                                    >
                                        {item.text}
                                    </Text>
                                    :
                                    type === "pdf" ?
                                        <Pdfhandle PdfFile={item} CheckUser={CheckUser} /> :
                                        type === "image" ?
                                            <ImageHandle ResponseImage={item} CheckUser={CheckUser} />
                                            :
                                            null
                            }
                            <View style={styles.sa_check_box}>
                                <Text style={[styles.sa_chat_time, { color: Colors.ws_text,marginRight: CheckUser ? ms(5) :null }]} >
                                    {item.timestamp}
                                </Text>
                                {/* {
                                    CheckUser ? (
                                        UserSeen?.status === null || item?.seen === null ? (
                                            <Check {...IconProps(ms(12))} />
                                        ) : UserSeen?.status === 0 || item?.seen === 0 ? (
                                            <DubbleCheck {...IconProps(ms(19))} />
                                        ) : UserSeen?.status === 2 || item?.seen === 2 ? (
                                            <DubbleCheckActive {...IconProps(ms(19))} />
                                        ) : null
                                    ) : null
                                } */}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

export default MessageRow
