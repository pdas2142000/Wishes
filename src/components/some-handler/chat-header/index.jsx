/**React Import */
import React from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

/** Icons */
import LeftIcon from "../../../../assets/svgs/left.svg"
import DotIcon from "../../../../assets/svgs/dots.svg"

/** Local Imports */
import { IconProps } from '../../../utils/helpers/Iconprops'
import { ms } from '../../../utils/helpers/metrics'
import { Colors, Fonts } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'

/**Main Export */
const ChatHeader = ({ HandleFilterSheet, Data, headerSubTest, goBack }) => {

    const { theme } = useTheme()

    return (
        <View style={[styles.sa_container, { backgroundColor: theme.background }]}>
            <View style={styles.sa_header_content} >
                <TouchableOpacity style={styles.sa_back_nav} onPress={() => { goBack(); }}>
                    <LeftIcon {...IconProps(ms(33))} fill={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sa_user_info} >
                    <View style={styles.sa_user_box}>
                        <Image style={styles.sa_user_image} source={{ uri: Data?.$avatar_url }} />
                    </View>
                    <View>
                        <Text style={[styles.sa_user_name, { color: theme.text }]}>{Data.name}</Text>
                        <Text style={[styles.sa_user_text, { color: theme.subtext }]}>{headerSubTest}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={HandleFilterSheet}>
                <DotIcon {...IconProps(ms(20))} fill={theme.text} />
            </TouchableOpacity>
        </View>
    )
}

export default ChatHeader

const styles = StyleSheet.create({
    sa_container: {
        backgroundColor: Colors.ws_bg,
        paddingTop: ms(10),
        paddingHorizontal: ms(20),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: ms(5)
    },
    sa_header_content: {
        flexDirection: "row",
        alignItems: "center",
    },
    sa_user_info: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: ms(10),
    },
    sa_user_box: {
        width: ms(45),
        aspectRatio: 1 / 1,
        marginRight: ms(10),
        overflow: "hidden",
        borderRadius: ms(50)
    },
    sa_user_image: {
        width: "100%",
        height: "100%"
    },
    sa_user_name: {
        fontFamily: Fonts.Font_600,
        color: Colors.ws_black,
        textTransform: "capitalize",
        fontSize: ms(15),
        marginBottom: ms(2)
    },
    sa_user_text: {
        fontFamily: Fonts.Font_500,
        color: Colors.sa_text_light,
        maxWidth: ms(180),
        fontSize: ms(11)
    },
}) 