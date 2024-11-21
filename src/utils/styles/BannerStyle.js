import { StyleSheet } from "react-native";
import { ms } from "../helpers/metrics";
import { Colors, Fonts } from ".";

export const Banner_styles = StyleSheet.create({
    // wish banner style
    ws_archive_box: {
        borderRadius: ms(15),
        paddingHorizontal: ms(12),
        paddingVertical: ms(11),
        marginBottom: ms(10)
    },
    ws_top_box_content: {
        flexDirection: "row",
        alignItems: "center",
    },
    ws_image_box: {
        width: ms(42),
        aspectRatio: 1,
        borderRadius: ms(25),
        overflow: "hidden",
    },
    ws_content_text: {
        marginLeft: ms(10),
    },
    ws_title: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
        color: Colors.ws_black,
    },
    ws_status_box: {
        backgroundColor: Colors.ws_lite_bg,
        width: "48.5%",
        height: ms(35),
        borderRadius: ms(8),
        alignItems: "center",
        justifyContent: "center",
    },
    ws_btn_box: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        marginTop: ms(8)
    },
    ws_status_text: {
        fontSize: ms(12),
        color: Colors.ws_primary_blue,
        fontFamily: Fonts.Font_500,
        textTransform: "capitalize"
    },
    ws_border: {
        height: ms(.6),
        marginTop: ms(10)
    },
    ws_bottom_content: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        marginTop: ms(10)
    },
    ws_event_info: {
        width: "33.33%",
        alignItems: "center",
    },
    ws_general_event_info: {
        width: "45%",
        alignItems: "center",
    },
    ws_bottom_content_text: {
        fontFamily: Fonts.Font_500,
        color: "#a4a4a4",
        fontSize: ms(11),
        color: Colors.ws_black,

    },
    ws_tag: {
        paddingHorizontal: ms(10),
        paddingVertical: ms(3),
        borderRadius: ms(10),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: ms(0.7),
        borderColor: Colors.ws_lite_bg
    },
    ws_tag_text: {
        fontSize: ms(11),
        color: Colors.ws_primary_blue,
        fontFamily: Fonts.Font_500,
        textTransform: "capitalize"
    },

    // common banner style

    ws_container: {
        width: "100%",
        height: ms(65),
        borderRadius: ms(15),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: ms(12),
        justifyContent: "space-between",
        marginBottom:ms(10)
    },
    ws_image: {
        width: ms(42),
        height: ms(42),
        borderRadius: ms(50),
        overflow: "hidden",
        alignItems:"center",
        justifyContent:"center"
    },
    ws_img: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    ws_content_text: {
        marginLeft: ms(10),
    },
    ws_subtext: { 
        fontFamily: Fonts.Font_500,
        color: Colors.ws_text_gray,
        fontSize: ms(12),
        textTransform: "capitalize"
    },

    //selectable banner style

    ws_info_number: {
        fontSize: ms(13),
        fontFamily: Fonts.Font_500,
        color: Colors.ws_gray
    },
    ws_info_name: {
        fontSize: ms(14),
        fontFamily: Fonts.Font_600,
        color: Colors.ws_black
    }, 
    ws_info_status: {
        fontSize: ms(11),
        fontFamily: Fonts.Font_600,
        color: Colors.ws_text,
        textTransform: "capitalize"
    },
    ws_select_image: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(50),
        overflow: "hidden"
    },
    ws_selectable_container: {
        width: "100%",
        height: ms(65),
        backgroundColor: Colors.ws_white,
        borderRadius: ms(10),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: ms(14),
        marginVertical: ms(5),
        justifyContent: "space-between"
    },
    ws_info: {
        marginLeft: ms(15)
    },
})