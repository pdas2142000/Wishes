/** React Import */
import { StyleSheet } from "react-native"

/** Local Import */
import { ms } from "../../../../utils/helpers/metrics"
import { Colors, Fonts } from "../../../../utils/styles"

/** Styles */
export const AuthStyles = StyleSheet.create({
    ws_auth: {
        backgroundColor: Colors.ws_background,
        flex: 1,
        paddingHorizontal: ms(20)
    },
    ws_user_forget: {
        marginBottom:ms(10)
    },
    ws_user_forget_text: {
        fontFamily: Fonts.Font_500,
        color: Colors.ws_primary_blue,
        fontSize: ms(13),
    },
    ws_button_text: {
        color: Colors.ws_primary_blue,
        fontFamily: Fonts.Font_600,
        fontSize: ms(12),
    },
    ws_button: {
        alignItems: "center",
        marginTop: ms(25),
        flexDirection:"row",
        justifyContent:"center"
    },
    sa_cancel_btn: {
        backgroundColor: Colors.ws_gray + '60',
        borderRadius: ms(10),
        height: ms(42),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: ms(15)
    },
    sa_cancel_btn_text: {
        fontFamily: Fonts.Font_600,
        fontSize: ms(15),
        color: Colors.sa_primary_text, 
    },
    sa_simple_btn_text_color: {
        fontFamily: Fonts.Font_600,
    },
    sa_simple_btn: {
        marginBottom:ms(10),
    },
    sa_simple_btn_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
        color: Colors.ws_text,
        lineHeight: ms(20),
    },
    sa_otp_btn_text: {
        color: Colors.ws_gray,
        fontFamily: Fonts.Font_400,
        fontSize: ms(14),
    },
    ws_header: {
        marginTop: Platform.OS === "android" ? ms(35) : ms(15),
        marginBottom: ms(13)
    },
    ws_header_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(27),
        color: Colors.ws_text,
    },
    ws_forget_box: {
        backgroundColor: "#f6e6de",
        padding: ms(7),
        borderRadius: ms(10),
        borderWidth: ms(.9),
        borderColor: "#f7d7ca",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: ms(17)
    },
    ws_forget_text: {
        fontFamily: Fonts.Font_400,
        color: "#4f4e4d",
        fontSize: ms(10),
        flex: 1,
        paddingLeft: ms(15),
        lineHeight: ms(14)
    },
    ws_image: {
        width: "100%",
        height: "100%"
    },
    ws_logo_image_box: {
        width: ms(125),
        height: ms(125),
    },

})

/** Styles */
export const MainStackStyles = StyleSheet.create({
    wrapper: {
        height: ms(48),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.ws_white,
        borderRadius: ms(10),
        paddingLeft: ms(10),  
    },
    input_field_wrap: {
        flexDirection: "row",
        alignItems: "center",
        flexDirection: "row-reverse",
    },
    ws_import_box: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        height: ms(50)
    },
    input_field: {
        fontSize: ms(13),
        fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
        flex: 1,
        height:"100%",
        paddingLeft:ms(10)
    },
    ws_contryCode: {
        marginTop: ms(-2.9),
        marginLeft: ms(-5),
        fontFamily: Fonts.Font_600,
        fontSize: ms(13),
    },
    ws_number_input: {
        borderWidth: ms(1.2),
        borderColor: Colors.ws_border,
        flex: 1,
        borderRadius: ms(12),
        fontFamily: Fonts.Font_500,
        fontSize: ms(15),
        color: Colors.ws_text,
        paddingLeft: ms(15),
        height: ms(50)
    },
    ws_lable: {
        fontFamily: Fonts.Font_600,
        color: Colors.ws_text,
        fontSize: ms(12),
        // textTransform: "capitalize",
        paddingBottom: ms(5),
    },
    ws_error: {
        color: "red",
        fontFamily: Fonts.Font_400,
        fontSize: ms(10),
        paddingTop: ms(3)
    },
    ws_error_border: {
        borderColor: 'red',
        borderWidth: ms(.7)
    },
    ws_lable_optional: {
        flexDirection: "row",
        alignItems: "center"
    },
    ws_optional_text: {
        fontFamily: Fonts.Font_600,
        color: Colors.ws_text,
        fontSize: ms(9),
        marginTop: ms(-3)
    },
    ws_code_name: {
        fontFamily: Fonts.Font_600,
        color: Colors.ws_text,
        letterSpacing: 1.5,
        marginRight: ms(5)
    },
    ws_code: {
        borderWidth: ms(1.2),
        borderColor: Colors.ws_border,
        height: "100%",
        borderRadius: ms(12),
        marginRight: ms(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: ms(9)
    },
    formCont: {
        marginBottom: ms(12)
    },
    sa_otp_container: {
        display: "flex",
        justifyContent:"space-between",
        alignItems: "center",
        flexDirection: "row",
        marginVertical: ms(10)
    },
    sa_otp_input: {
        borderWidth: ms(1),
        borderColor: Colors.ws_primary_blue,
        backgroundColor: Colors.ws_input_bg,
        borderRadius: ms(10),
        height: ms(43),
        width: ms(50),
        textAlign: "center",
        fontFamily: Fonts.Font_600,
        color: Colors.ws_text,
        fontSize: ms(16),
    },
    sa_normal: {
        marginLeft: ms(-2)
    },
    textarea: {
        textAlignVertical: "top",
        paddingHorizontal: ms(10),
        marginTop:ms(10),
        height: "100%",
    },
    ws_textarea_wrapper: {
        height: ms(120),
        borderRadius: ms(10)
    },
    countryName: {
        fontFamily: Fonts.Font_600,
        fontSize: ms(13),
        color: "black",
        marginTop: ms(-3),
        marginLeft: ms(5)
    },
    ws_icon_box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: ms(25),
        marginBottom: ms(-10),
    },
    ws_edit_container:{
        width: ms(35),
        height: ms(35),
        borderRadius: ms(20),
        backgroundColor:Colors.ws_white,
        alignItems:"center",
        justifyContent:"center",
        position: "relative",
        top: ms(-17),
        left: ms(45),
        padding:ms(3)
    },
    ws_edit_box: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: `${Colors.ws_black}D6`, 
        borderRadius:ms(50)
    },
    ws_image_box: {
        width: ms(120),
        aspectRatio: 1,
        borderRadius: ms(60),
        overflow: "hidden",
        borderWidth: 3,
        borderStyle: 'dashed',
        borderColor:Colors.ws_primary_blue,
        justifyContent:"center",
        alignItems:"center"
    },
    ws_image_container:{
        width: ms(104),
        aspectRatio: 1,
        borderRadius:ms(50),
        overflow:"hidden"
    },
    ws_img: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    ws_toggle_box: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: ms(5)
    },
    ws_toggle_text: {
        fontFamily: Fonts.Font_700,
        fontSize: ms(13),
        color: Colors.ws_text
    },
    ws_image_content: {
        height: ms(210),
        width: "100%",
        backgroundColor: Colors.ws_white,
        borderRadius: ms(10),
        alignItems: "center",
        justifyContent: "center",
        // marginBottom: ms(15),
        marginTop:ms(15),
        overflow:"hidden"
    },
    ws_img_box: {
        width: ms(80),
        height: ms(80),
        resizeMode: "cover",
    },

})