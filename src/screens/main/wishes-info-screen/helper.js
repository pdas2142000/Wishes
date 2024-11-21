import { Platform, StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../utils/styles";
import { ms } from "../../../utils/helpers/metrics";

export const wish_info_styles = StyleSheet.create({

    ws_event_box: {
        width: "100%",
        backgroundColor: Colors.ws_white,
        marginTop: ms(15),
    },
    ws_event_image: {
        width: "100%",
        height: ms(230),
        borderRadius: ms(9),
        overflow: "hidden"
    },
    ws_img: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    ws_event_header: {
        color: Colors.ws_text,
        fontFamily: Fonts.Font_600,
        fontSize: ms(17),
        marginBottom: ms(2),
    },
    ws_organised_owner: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
    },
    ws_location_text: {
        color: Colors.ws_text,
        fontFamily: Fonts.Font_600,
        fontSize: ms(16),
    },
    ws_info_text: {
        marginTop: ms(12),
    },
    ws_title: {
        fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
        fontSize: ms(14),
        marginBottom: ms(2)
    },
    ws_subtext: {
        fontFamily: Fonts.Font_500,
        color: Colors.ws_text_gray,
        fontSize: ms(12),
    },
    ws_action_btn: {
        alignItems: "center",
        justifyContent: "center",
        width: "30%",
        // backgroundColor:"red"
    },
    ws_action_text: {
        color: Colors.ws_gray_drack,
        fontFamily: Fonts.Font_500,
        fontSize: ms(13),
        textTransform: "capitalize"
    },
    ws_action_info: {
        height: ms(70),
        borderRadius: ms(9),
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
        borderWidth: ms(1),
        marginTop: ms(10),
        borderColor: Colors.ws_border_gray
    },
    ws_container: {
        width: "100%",
        height: ms(65),
        borderRadius: ms(9),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: ms(12),
        justifyContent: "space-between",
        marginBottom: ms(10),
        marginTop: ms(10)
    },
    ws_comment_container: {
        width: "100%",
        borderRadius: ms(9),
        padding: ms(12),
        marginBottom: ms(10),
        marginTop: ms(10)
    },

    // Image popup style

    modalContainer: {
        flex: 1,
        backgroundColor: "black"
    },
    modalImage: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain',
        marginTop: Platform.OS === "ios" ? ms(-40) : ms(-40)
    },
    sa_image_box: {
        width: "100%",
    },
    sa_main_view: {
        justifyContent: "center",
        alignItems: "center",
    },
    sa_btn_box: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginLeft: ms(5),
    },
})