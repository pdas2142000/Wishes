/** Icons */
import SettingIcons from "../../../../assets/svgs/cog.svg"
import KeyIcon from "../../../../assets/svgs/key.svg"
import TranslateIcon from "../../../../assets/svgs/translate.svg"
import DeleteuserIcon from "../../../../assets/svgs/deleteuser.svg"
import PowerIcon from "../../../../assets/svgs/power.svg"
import StarIcon from "../../../../assets/svgs/star.svg"
import FeedBackIcon from "../../../../assets/svgs/feedback.svg"
import PaletteIcon from "../../../../assets/svgs/palette.svg"
import { ms } from "../../../utils/helpers/metrics"
import { Colors, Fonts } from "../../../utils/styles"
import { StyleSheet } from "react-native"

export const Data = [
	{
		icon: SettingIcons,
		text: "ProfileScreen.accountSettings",
		nav: "accountinfo",
		size:20
	},
	{
		icon: KeyIcon,
		text: "ProfileScreen.accountPassword",
		nav: "ProfileChangePassword",
		size:20
	},
	{
		icon: TranslateIcon,
		text: "common.selectLanguage",
		subText: "English",
		type: "language",
		nav: "home",
		size:20
	},
	{
		icon: DeleteuserIcon,
		text: "BlockedUserScreen.blockedContacts",
		nav: "blocked",
		size:20
	},
	{
		icon: StarIcon,
		text: "common.rateApp",
		type: "rate",
		size:20
	},
	{
		icon: FeedBackIcon,
		text: "common.feedback",
		nav: "feedback",
		size:20
	},
	{
		icon: PaletteIcon,
		text: "common.theme",
		subText: "dark",
		type: "theme",
		size:20
	},
	{
		icon: PowerIcon,
		text: "common.logout",
		type: "logout",
		size:20
	},
]

export const languageData = [
	{
		id: 1,
		text: "english",
		value: "en"
	},
	{
		id: 2,
		text: "danske",
		value: "da"
	},
]
export const  AllTheme= [
	{
		text:"light",
		value:"light"
	},
	{
		text:"dark",
		value:"dark"
	},
	{
		text:"pink",
		value:"pink"
	},
]

/**
 * setting screen styles 
 */

export const setting_styles = StyleSheet.create({
	ws_main_wrapper: {
		paddingHorizontal: ms(15),
		backgroundColor: Colors.ws_bg,
		flex: 1,
	},
	ws_content_box: {
		marginBottom: ms(20)
	},
	ws_user_profile: {
		backgroundColor: Colors.ws_white,
        borderRadius: ms(15),
        paddingHorizontal: ms(12), 
        paddingVertical: ms(11),
		flexDirection:"row",
		alignItems:"center",
		marginTop:ms(15)
	},
	ws_user_image: {
		width: ms(75),
		height: ms(75),
		borderRadius: ms(50),
		alignItems: "center",
		justifyContent: "center", 
		overflow: "hidden"
	},
	ws_user_info:{
		marginLeft: ms(13),
	},
	ws_img: {
		width: "100%",
		height: "100%",
		borderRadius: ms(50),
	},
	ws_user_name: {
		fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
        fontSize: ms(18),
        textTransform: "capitalize",
        marginBottom:ms(2)
	},
	ws_text_two:{
		fontFamily: Fonts.Font_400, 
		color: Colors.ws_text_gray,
		fontSize: ms(14),
		marginTop: ms(4),
	},
	ws_settings_menu: {
		marginTop: ms(15),
		paddingHorizontal: ms(12),
		paddingVertical: ms(12),
		borderRadius: ms(15),
	},
	ws_menu_text: {
		fontFamily: Fonts.Font_400,
        color: Colors.ws_text_gray,
        fontSize: ms(12),
		textTransform:"capitalize"
	},
	ws_settings_menu_box: {
		paddingHorizontal: ms(10)
	},
	ws_menu_btn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: ms(9),
		marginTop: ms(8),
	},
	ws_btn_text: {
		marginLeft: ms(18),
		fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
        fontSize: ms(14),
        textTransform: "capitalize",
        marginBottom:ms(2)
	},
	ws_btn_left: {
		flexDirection: "row",
		alignItems: "center"
	},
	ws_text_right: {
		fontFamily: Fonts.Font_500,
		color: "#b4b4b4",
		fontSize: ms(10),
		// textTransform: "capitalize"
	},
	ws_delete_box: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.ws_reject,
		paddingVertical: ms(13),
		borderRadius: ms(10),
		paddingHorizontal: ms(13),
		marginVertical: ms(15)
	},
	ws_delete_text: {
		fontFamily: Fonts.Font_600,
		color: Colors.ws_white,
		fontSize: ms(13),
		marginLeft: ms(20),
		textTransform: "capitalize"
	},
	ws_version_text: {
		color: Colors.ws_gray,
		fontFamily: Fonts.Font_400,
		fontSize: ms(10),
		textAlign: "center"
	},
})