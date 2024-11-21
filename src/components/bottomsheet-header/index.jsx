/** React Import */
import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

/** Icon */
import CrossIcon from "../../../assets/svgs/cross.svg"

/** Styles */
import { Colors, Fonts } from '../../utils/styles'
import { ms } from '../../utils/helpers/metrics'

/** Local Import */
import { IconProps } from '../../utils/helpers/Iconprops'
import { useTheme } from '../../utils/context/ThemeContext'
import { useLanguage } from '../../utils/context/LanguageContext'

/** Main Export */
const BottomSheetHeader = ({ HandleClose, title }) => {
    const { theme } = useTheme()
    const { translate } = useLanguage()
    return (
        <View style={styles.sa_wrapper_hade} >
            <Text style={[styles.sa_wrapper_text, { color: theme.text }]}>
                {translate(title)}
                {/* {title} */}
            </Text>
            <TouchableOpacity onPress={HandleClose}>
                <CrossIcon {...IconProps(ms(27))} fill={theme.text} />
            </TouchableOpacity>
        </View>
    )
}

export default BottomSheetHeader

const styles = StyleSheet.create({
    sa_wrapper_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(17),
        color: Colors.ws_black,
    },
    sa_wrapper_hade: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: ms(.8),
        borderColor: Colors.ws_border,
        paddingBottom: ms(20),
        paddingHorizontal: ms(15),
    },
    sa_wrapper_close: {
        width: ms(22),
        aspectRatio: 1,
        borderRadius: ms(50),
        justifyContent: "center",
        alignItems: "center",
    },
})