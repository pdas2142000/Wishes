/**React import */
import React from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

/**Local import */
import { ms } from '../../../../utils/helpers/metrics'
import { Colors, Fonts } from '../../../../utils/styles'

/** Library */
import { useNavigation } from '@react-navigation/native'
import { useLanguage } from '../../../../utils/context/LanguageContext'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** MainExport */
const FooterText = ({ text, subText, nav, type }) => {
    const Navigation = useNavigation()
    const { translate } = useLanguage()
    const { theme } = useTheme()

    return (
        <>
            <View style={styles.ws_account_info_box} >
                <TouchableOpacity style={styles.ws_button} onPress={nav}>
                    <Text style={[styles.ws_button_text, { color: theme.text }]}>{translate(subText)}</Text>
                    {/* {
                        type === "register" ?
                            <Text style={[styles.ws_button_text_two,{color:theme.text}]}> ({translate("LoginScreen.itsFree")})</Text> : null
                    } */} 
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
                { 
                    type === "signup" ?
                        <View style={styles.ws_image_signup}>
                            <Image style={styles.ws_image} source={require("../../../../../assets/images/logo/logo-login.png")} />
                        </View> :
                        <View style={styles.ws_image_box}>
                            <Image style={styles.ws_image} source={require("../../../../../assets/images/logo/logo-login.png")} />
                        </View>
                }
            </View>
        </>
    )
}
export default FooterText

const styles = StyleSheet.create({
    ws_account_info_box: {
        alignItems: "center",
        marginTop: ms(30),
        marginBottom: ms(20),
    },
    ws_button: {
        flexDirection: "row",
        alignItems: "center"
    },
    ws_account_text: {
        fontFamily: Fonts.Font_400,
        color: Colors.ws_text,
        fontSize: ms(10),
        marginBottom: ms(3)
    },
    ws_button_text: {
        fontFamily: Fonts.Font_500,
        color: Colors.ws_primary_blue,
        fontSize: ms(13),
    },
    ws_button_text_two: {
        color: Colors.ws_primary_blue,
        fontFamily: Fonts.Font_500,
        fontSize: ms(9),
    },
    
    ws_image_signup: {
        width: ms(80),
        height: ms(80),
    },
    ws_image: {
        width: "100%",
        height: "100%"
    },
    ws_image_box: {
        width: ms(125),
        height: ms(125),
    },
})