/** React Import */
import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

/* Library */
import { useNavigation } from '@react-navigation/native'

/** Local Imports */


/** Icon */
import PDF from "../../../../assets/svgs/pdf.svg"
import { IconProps } from '../../../utils/helpers/Iconprops'
import { ms } from '../../../utils/helpers/metrics'
import { Colors, Fonts } from '../../../utils/styles'


/** Main Export */
const Pdfhandle = ({ PdfFile,CheckUser }) => {
    const Data = PdfFile?.file[0]

    const Navigation = useNavigation()

    const TruncateText = (text) => {
        const maxLetters = 15;
        if (text.length > maxLetters) {
            return text.slice(0, maxLetters) + '...';
        } else {
            return text;
        }
    }
    return (
        <>
            <TouchableOpacity
                onPress={() => Navigation.navigate("viewscreen", { Link: Data?.$avatar_url, name: Data?.name })}
                activeOpacity={0.5}
                style={[styles.sa_container,{marginTop:!CheckUser? ms(-5):null}]}
            >
                <View style={styles.sa_content}>
                    <View style={styles.sa_icon_box}>
                        <PDF {...IconProps(ms(30))} fill={"#E23510"} />
                    </View>
                    <View>
                        <Text style={styles.sa_text}>{TruncateText(Data?.name)}</Text>
                        <Text style={[styles.sa_size,{color:Colors.ws_text}]}>{formatFileSize(Data?.size)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

export default Pdfhandle

const styles = StyleSheet.create({
    sa_container: {
        backgroundColor: Colors.sa_secondary,
        padding: ms(5),
        borderRadius: ms(10),
        paddingTop:ms(8)
    },
    sa_content: {
        backgroundColor: Colors.ws_white,
        borderRadius: ms(10),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: ms(10)
    },
    sa_icon_box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: ms(15),
        marginRight: ms(10)
    },
    sa_text: {
        fontFamily: Fonts.Font_600,
        fontSize: ms(13),
        color: Colors.ws_black,
        textTransform: "capitalize",
    },
    sa_size: {
        fontSize: ms(9),
        color: Colors.ws_dark_gray,
        textTransform: "capitalize",
        fontFamily: Fonts.Font_600,
    },

})

const formatFileSize = (bytes) => {
    const kb = bytes / 1024
    const mb = kb / 1024

    if (mb >= 1) {
        return `${mb.toFixed(2)} MB`
    } else {
        return `${kb.toFixed(2)} KB`
    }
}