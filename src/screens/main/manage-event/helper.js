import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../utils/styles";
import { ms } from "../../../utils/helpers/metrics";


export const Management_event_styles = StyleSheet.create({
    ws_main_container: {
        flex: 1,
        backgroundColor: Colors.ws_bg,
    },
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
    },
    ws_event_org: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: ms(17),
        marginBottom: ms(8)
    },
    ws_organised_owner: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
        marginLeft: ms(8)
    },
    ws_location_box: {
        marginTop: ms(5)
    },
    ws_location_text: {
        color: Colors.ws_text,
        fontFamily: Fonts.Font_400,
        fontSize: ms(11),
    },
    org_info: {
        height: ms(70),
        backgroundColor: Colors.ws_white,
        marginTop: ms(12),
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: ms(1),
        borderBottomWidth: ms(1),
        borderColor: Colors.ws_border_gray
    },
    ws_info_hade: {
        color: Colors.ws_gray,
        textTransform: "uppercase",
        fontFamily: Fonts.Font_400,
        fontSize: ms(10),
        marginBottom: ms(2)
    },
    ws_info_text: {
        color: Colors.ws_text,
        fontFamily: Fonts.Font_500,
        fontSize: ms(12)
    },
    ws_action_info: {
        height: ms(70),
        borderRadius: ms(9),
        paddingVertical: ms(12),
        paddingHorizontal: ms(27),
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: ms(1),
        borderColor: Colors.ws_border_gray 
    },
    ws_action_btn: {
        alignItems: "center",
        marginTop: ms(8)
    },
    ws_action_text: {
        color: Colors.ws_gray_drack,
        fontFamily: Fonts.Font_500,
        fontSize: ms(13),
        textTransform: "capitalize"
    },
    ws_padding: {
        paddingHorizontal: ms(15)
    },
    ws_event_info: {
        alignItems: "center",
        height: "60%",
        justifyContent: "center",
        borderColor: Colors.ws_border_gray
    },
    ws_general_event_info: {
        width: "50%",
        height: "60%",
        alignItems: "center",
        justifyContent: "center",
        borderColor: Colors.ws_border_gray
    },
    ws_user_image: {
        width: ms(28),
        height: ms(28),
        borderRadius: ms(50),
        overflow: "hidden"
    },
    ws_tab_box: {
        paddingHorizontal: ms(15),
        paddingBottom: ms(20)
    },
    ws_status_box: {
        backgroundColor: Colors.ws_lite_bg,
        width: "47%",
        height: ms(42),
        borderRadius: ms(10),
        alignItems: "center",
        justifyContent: "center",
    },
    ws_status_text: {
        fontSize: ms(13),
        color: Colors.ws_primary_blue,
        fontFamily: Fonts.Font_500,
        textTransform: "capitalize"
    },
    ws_btn_box: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        marginTop:ms(20),
    },

    //Image popup style
    modalContainer: {
        flex: 1, 
        backgroundColor: "black"
    },
    modalImage: {
        width: "100%",
        height: "100%",
        resizeMode:"contain",
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
    sa_chat_image_box:{
        width: ms(150),
        height:ms(150),
        borderRadius: ms(10),
        overflow: "hidden",
        marginBottom:ms(5)
    },
    sa_image:{
        width:"100%",
        height:"100%",
    }
})

export const manage_tab_list = [
    {
        id: 1,
        title: "Wishes",
        value: "common.wishPlural"
    },
    {
        id: 2,
        title: "Guests",
        value: "common.guestPlural"
    },
]