import { StyleSheet } from "react-native";
import { ms } from "../../utils/helpers/metrics";
import { Colors, Fonts } from "../../utils/styles";

export const ActionSheetstyles = StyleSheet.create({
    ws_main_content: {
        flex: 1,
        paddingHorizontal: ms(15),
        paddingBottom: ms(20)
    },
    ws_content: {
        justifyContent: "space-between",     
        height:ms(280)
    },
    ws_language_box:{ 
        marginTop: ms(20) 
    },
    ws_btn_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
        textTransform: "capitalize",
        marginBottom:ms(15)
    },
    ws_content_btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: ms(7)
    },
    ws_action_btn_box: {
        flexDirection: "row",
        justifyContent: "space-between",
       marginBottom:ms(10)
    }, 
    ws_btn: {
        width: "100%",
        alignItems: "center", 
        paddingVertical: ms(13),
        borderRadius: ms(10)
    },
    ws_action_text: {
        fontSize: ms(14),
        textTransform: "capitalize",
        fontFamily: Fonts.Font_500
    },
    ws_options_box:{
        marginTop:ms(17)
    },
    ws_options:{
        marginBottom:ms(17)
    },
    ws_options_text:{
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
        // textTransform: "capitalize",
    }, 
    sa_delete_container: {
        paddingHorizontal: ms(20),
        justifyContent:"center"
    },
    sa_cancel_btn: {
        backgroundColor: Colors.ws_gray + '80',
        borderRadius: ms(10),
        height: ms(50),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: ms(15)
    },
    sa_text: {
        fontFamily:Fonts.Font_500,
        fontSize:ms(15),
        marginTop:ms(20),
    },
    sa_top_content:{ 
        alignItems: "center", 
        justifyContent: "center", 
        marginBottom: ms(20) 
    },
    sa_cancel_btn_text: {
        fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
        fontSize: ms(14),
        textTransform: "capitalize",
    },
});


