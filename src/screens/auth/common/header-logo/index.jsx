/**React Import */
import React from 'react'
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native'

/**Local Import */
import { ms } from '../../../../utils/helpers/metrics'
import { Colors, Fonts } from '../../../../utils/styles'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Main Export */
const AuthHeader = ({ header, subText, number, type }) => {
    const {theme}=useTheme()
    return (
        <SafeAreaView> 
            <View style={styles.ws_wrapper_content}>
                {/* {
                    type != "profile_otp" ?
                        <View style={styles.ws_img_box}>
                            <Image style={styles.ws_img} source={require("../../../../../assets/images/logo/logo-login.png")} />
                        </View> : null
                } */}
                <View style={styles.ws_header_box}>
                    <Text style={[styles.ws_header_text,{color:theme.text}]}>{header}</Text>
                    <Text style={[[styles.ws_otp_text,{color:theme.subtext}]]}>{subText}</Text>
                    <Text style={[styles.ws_otp_text, styles.ws_otp_number,{color:theme.subtext}]}>{number}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AuthHeader

const styles = StyleSheet.create({
    ws_wrapper_content: {
        paddingTop: ms(20),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    ws_img_box: {
        width: ms(85),
        height: ms(60)
    },
    ws_img: {
        width: "100%",
        height: "100%"
    },
    ws_header_text: {
        fontFamily: Fonts.Font_600,
        fontSize: ms(23),
        color: Colors.ws_black
    },
    ws_header_box: {
        alignItems: "center",
    },
    ws_otp_text: {
        fontFamily: Fonts.Font_400,
        fontSize: ms(14),
        color: Colors.ws_gray,
        textAlign: "center",
        lineHeight: ms(20),
        marginTop: ms(5)
    },
    ws_otp_number: {
        color: Colors.ws_text,
    }
})