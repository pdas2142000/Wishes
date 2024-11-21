import { StyleSheet } from "react-native";
import { ms } from "../../../utils/helpers/metrics";
import { Colors, Fonts } from "../../../utils/styles";

export const styles = StyleSheet.create({
    ws_archive_box: {
        backgroundColor: Colors.ws_white,
        borderRadius: ms(15),
        paddingHorizontal: ms(12),
        paddingVertical: ms(10),
    },
    ws_top_box_content: {
        flexDirection: "row",
        alignItems: "center",
        alignItems: "flex-start",
    },
    ws_image_box: {
        width: ms(42),
        aspectRatio: 1,
        borderRadius: ms(25),
        overflow: "hidden",
    },
    ws_img: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    ws_content_text: {
        marginLeft: ms(10),
        marginTop: ms(2),
        maxWidth: ms(250)
    },
    ws_text_one: {
        fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
        fontSize: ms(14),
        textTransform: "capitalize",
        marginBottom: ms(2)
    },
    ws_text_two: {
        fontFamily: Fonts.Font_500,
        color: Colors.ws_text_gray,
        fontSize: ms(12),
    },
    ws_tag_text: {
        fontSize: ms(11),
        color: Colors.ws_black,
        fontFamily: Fonts.Font_500,
        textTransform: "capitalize",
    },
    ws_container: {
        flex: 1,
        backgroundColor: Colors.ws_bg,
        paddingHorizontal: ms(15),
    },
    ws_header_icon: {
        marginRight: ms(10)
    },
    ws_not_found: {
        height: ms(100),
        alignItems: "center",
        justifyContent: "center"
    },
    ws_not_found_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(12),
        color: Colors.ws_text
    },

    // single chat
    sa_main_container: {
        backgroundColor: Colors.ws_bg,
        flex: 1,
    },
    sa_msg_box: {
        paddingHorizontal: ms(7),
        width: "100%",
        backgroundColor:"#cdcdcd"
    },
    sa_msg_container: {
        width: "100%",
        maxWidth: ms(280)
    },
    sa_check_box: {
        justifyContent: "flex-end",
        flexDirection: "row",
        paddingBottom:ms(3)
    },
    sa_check_box_patient: {
        alignItems: "flex-start",
        marginTop: ms(5)
    },
    sa_chat_time: {
        fontFamily: Fonts.Font_600,
        fontSize: ms(9),
    },
    sa_chat_box: {
        borderRadius: ms(15),
        padding: ms(10),
        flexDirection: "row",
    },
    ws_group_user_image: {
        width: ms(25),
        height: ms(25),
        borderRadius: ms(100),
        marginRight: ms(5),
        overflow: "hidden",
    },
    sa_msg_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(13),
        marginRight:ms(30),
    },
    ws_check_margin: {
        marginRight: ms(5),
    },
    sa_scroll_container: {
        flexGrow: 1,
        paddingHorizontal: ms(14),
    },
    ws_list_text: {
        flexDirection: "row",
        alignItems: "center"
    },
    ws_user_name: {
        marginTop: ms(5),
        fontFamily: Fonts.Font_500,
        fontSize: ms(10),
        color: Colors.ws_black
    },
    ws_typing_container: {
        position: "relative",
        paddingBottom: ms(30),
        paddingHorizontal: ms(10),
        marginTop: ms(5),
    },
    ws_typing_left: {
        left: ms(20),
    },
    ws_typeing_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(10),
        color: Colors.ws_black,
        marginBottom: ms(2)
    },
    ws_type_container: {
        backgroundColor: Colors.ws_gray,
        width: ms(90),
        height: ms(50),
        borderRadius: ms(7)
    }
})
