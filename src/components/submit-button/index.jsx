/** React Import */
import React from 'react'
import {
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'

/** Style */
import { Colors, Fonts } from '../../utils/styles'
import { ms } from '../../utils/helpers/metrics'
import { useTheme } from '../../utils/context/ThemeContext'
import { useLanguage } from '../../utils/context/LanguageContext'

/** Main Export */
const SubmitButton = ({ Loading, OnPress, type, title }) => {

    const {theme}=useTheme()
    const {translate}=useLanguage()
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={OnPress}
            disabled={Loading}
            style={[styles.ws_button,{backgroundColor:theme.btn_bg}]}
        >
            {
                Loading ? (
                    <ActivityIndicator size="small" color={"white"} />
                ) : (
                    <Text style={styles.ws_text}>{translate(title)}</Text>
                )
            }
        </TouchableOpacity>
    )
}

export default SubmitButton

const styles = StyleSheet.create({
    ws_button: {
        backgroundColor: Colors.ws_primary_blue,
        borderRadius: ms(10),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: ms(47),
        marginTop: ms(10)
    },
    ws_text: {
        fontFamily: Fonts.Font_600,
        color: Colors.ws_white,
        fontSize: ms(14),
    },
})
