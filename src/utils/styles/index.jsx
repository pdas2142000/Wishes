import { Platform, StyleSheet } from "react-native"
import { ms } from "../helpers/metrics"

export const Fonts = {
    Font_100: 'Poppins-Thin',
    Font_200: 'Poppins-ExtraLight',
    Font_300: 'Poppins-Light',
    Font_400: 'Poppins-Regular',
    Font_500: "Poppins-Medium",
    Font_600: 'Poppins-SemiBold',
    Font_700: 'Poppins-Bold',
    Font_800: 'Poppins-Black',
}

export const Colors = {
    ws_primary_blue: "#445EBE",
    ws_secondry_blue: "#a1afde",
    ws_lite_bg: "#d9dff2",
    ws_input_bg: "#f2f7ff",
    ws_lite_blue: "#8f9cd4",
    ws_text_blue: "#3b486c",
    ws_white: "white",
    ws_black: "#050017",
    ws_input: "#e9eef4",
    ws_text: "#2D3B62",
    ws_border: "#b3b2b882",
    ws_gray: "#e6e6e6de",
    ws_gray_drack: "#abb5c2",
    ws_orange: "#fd894c",
    ws_dark_gray: "#9f9f9f",
    ws_dark_blue: "#2c3c62",

    // new color
    ws_bg: "#f7f7f7",
    ws_text_gray: "#818384",
    ws_active: "#3b3b3b",
    ws_reject: "#ff4d4dA1",
    ws_border_gray:"#929292E0"
} 

export const AppCommonStyle = StyleSheet.create({
    ws_main_container: {
        flex: 1,
        backgroundColor: Colors.ws_bg,
        paddingHorizontal: ms(15)
    },
    ws_common_search_box: {
        backgroundColor: "#f6f6f6",
        height: ms(45),
        borderRadius: ms(9),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: ms(12),
        marginBottom: ms(10)
    },
    ws_common_input_Style: {
        flex: 1,
        paddingHorizontal: ms(10)
    },
    ws_indicator_box: {
        height: ms(50),
        alignItems: "center",
        justifyContent: "center"
    },
    ws_top_indicator_box: {
        height: ms(100),
        alignItems: "center",
        justifyContent: "center"
    },
    ws_common_size_country:{
        marginBottom:Platform.OS === "android"?ms(-5):null
    },
    ws_common_size_number:{
        marginBottom:Platform.OS === "android"?ms(-7):null
    }
}) 
