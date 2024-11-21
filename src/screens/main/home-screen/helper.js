/** React Imports */
import { StyleSheet } from 'react-native'

/** Local Imports */
import { Colors, Fonts } from '../../../utils/styles'
import { ms } from '../../../utils/helpers/metrics'
import Formfields from '../../../utils/models/FormFields.json'

/** Libraries */
import * as yup from 'yup'

/**
 * Home screen tabs
 */
export const List = [
    {
        id: 2,
        title: "General",
        value: "common.wishListPlural"
    },
    {
        id: 3,
        title: "Event",
        value: "common.events"
    },
    {
        id: 4,
        title: "Invitations",
        value: "Invitations",
    },
    {
        id: 5,
        title: "Archive",
        value: "HomeScreen.archive",
    },
]

/**
 * Home screen styles
 */
export const home_styles = StyleSheet.create({
    ws_mainContainer: {
        flex: 1,
        paddingHorizontal: ms(15),
    },
    ws_header: {
        flexDirection: "row",
        alignItems: "center",
    },
    ws_header_icon: {
        marginRight: ms(10)
    },
    ws_wish_list: {
        height: "100%",
        width: "33.33%",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: ms(2),
        borderColor: Colors.ws_gray,
    },
    ws_wish_list_txt: {
        fontSize: ms(13),
        color: Colors.ws_lite_blue,
        fontFamily: Fonts.Font_600
    },
    ws_active_border: {
        borderColor: Colors.ws_primary_blue
    },
    ws_active_text: {
        color: Colors.ws_primary_blue
    },
    ws_header_container: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: ms(45),
        alignItems: "center",
        overflow: "hidden",
    },

    //Event style
    ws_main_container: {
        flex: 1,
        backgroundColor: Colors.ws_bg,
        paddingHorizontal: ms(15)
    },
    ws_button_box: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: ms(14),
    },
    ws_btn: {
        width: "48.5%",
        paddingVertical: ms(7),
        borderRadius: ms(6),
        alignItems: "center",
        justifyContent: "center"
    },
    ws_btn_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(13),
        textTransform: "capitalize"
    },
    ws_content_box: {
        marginTop: ms(5),
    }
})

/**
 * Events tab
 */
export const Data_Info = [
    {
        id: 1,
        title: "event",
        value: "Event"
    },
    {
        id: 2,
        title: "wishlist",
        value: "Wishlist"
    },
]

/**
 * Event schema
 */

export const EventSchema = yup.object().shape({
    name: yup
        .string()
        .required(Formfields.new_event.name.errors.required)
        .min(
            Formfields.new_event.name.errors.minLength.value,
            Formfields.new_event.name.errors.minLength.message
        )
        .max(
            Formfields.new_event.name.errors.maxLength.value,
            Formfields.new_event.name.errors.maxLength.message
        ),
})

/**
 * Wishlist schema
 */
export const WishlistSchema = yup.object().shape({
    name: yup
        .string()
        .required(Formfields.new_wishlist.name.errors.required)
        .min(
            Formfields.new_wishlist.name.errors.minLength.value,
            Formfields.new_wishlist.name.errors.minLength.message
        )
        .max(
            Formfields.new_wishlist.name.errors.maxLength.value,
            Formfields.new_wishlist.name.errors.maxLength.message
        ),
})
