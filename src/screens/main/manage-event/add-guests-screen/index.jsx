/** React Imports */
import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Dimensions,
    Share,
    ActivityIndicator,
} from 'react-native'

/** Libraries */
import Contacts from 'react-native-contacts'
import * as yup from 'yup'

/** Components */
import AppHeader from '../../../../components/header'
import TabUnderLineMenu from '../../../../components/tab-underline-menu'
import SubmitButton from '../../../../components/submit-button'
import CustomInput from '../../../../components/form-utils/custome-inputs'
import CustomCountryCodePicker from '../../../../components/form-utils/custom-country-code-picker'
import SearchBar from '../../../../components/search-bar'
import ActionSheet from '../../../../components/action-sheet'
import { SelectableBanner } from '../../../../components/wishes-banner'
import NotFound from '../../../../components/not-found'

/** Local Imports */
import { useLanguage } from '../../../../utils/context/LanguageContext'
import { Colors, Fonts } from '../../../../utils/styles'
import { useForm, } from 'react-hook-form'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import { ms, toast } from '../../../../utils/helpers/metrics'
import Formfields from "../../../../utils/models/FormFields.json"
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Styles */
import { MainStackStyles } from '../../../auth/common/auth-styles'

/** Library */
import { yupResolver } from '@hookform/resolvers/yup'
import { baseUrl } from '../../../../utils/api-url'

const screenHeight = Dimensions.get('window').height
const SheetPoints = screenHeight * 0.3

/** Main Export */
const AddGuestsScreen = ({ route }) => {

    const { EventId } = route.params || {}
    const { theme } = useTheme()

    const { translate } = useLanguage()
    const { Token } = useAuth()
    const ContactRef = useRef()

    const [SelectedTab, setSelectedTab] = useState("contact")
    const [callingCode, setCallingCode] = useState('')
    const [ContactPermission, setContactPermission] = useState(false)
    const [IsSelect, SetIsSelect] = useState([])
    const [AllContact, setAllContact] = useState([])
    const [permissionGranted, setPermissionGranted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");

    const { reset, control, handleSubmit, formState: { errors } } = useForm(
        { resolver: yupResolver(Schema), }
    )

    const FormBuilder = [
        {
            name: 'first_name',
            parent: 'add_contact',
            type: 'text',
            control,
            label: true,
            full: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'last_name',
            parent: 'add_contact',
            type: 'text',
            control,
            label: true,
            full: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'phone',
            parent: 'add_contact',
            type: 'select',
            control,
            label: true,
            full: false,
            placeholder: true,
            styles: MainStackStyles,
            setCallingCode
        },
    ]

    /**
     * Add contact submit button
     * @param {Data} data 
     */
    const SubmitContact = async (data) => {
        const NewData = { ...data, country: callingCode, event_id: EventId, country_code: callingCode }
        try {
            const Response = await makeRequest("POST", "user/invite/", null, Token, NewData)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                reset()
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Contact Request Permission
     */
    const RequestContactPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setContactPermission(true);
                return true;
            } else {
                setContactPermission(false);
                return true;
            }
        } else {
            setContactPermission(true);
            return true;
        }
    };

    /**
     * Get all contact
     */
    const GetContacts = async () => {
        const permissionGranted = await RequestContactPermission()
        setPermissionGranted(permissionGranted)
        if (permissionGranted) {
            try {
                const contacts = await Contacts.getAll()
                const response = await fetch(`${baseUrl}/user/phonebook`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`
                    },
                    body: JSON.stringify({
                        body: contacts,
                    }),
                })
                const FormatData = await response.json()
                setAllContact(FormatData.data)

            } catch (error) {
                console.error('Error fetching contacts:', error)
            }
        } else {
            console.log('Permission denied')
        }
    }

    useEffect(() => {
        GetContacts()
    }, [])

    /**
     * Search guest by name
     */
    const filteredContacts = permissionGranted
        ? AllContact.filter(contact =>
            (contact.first_name + " " + contact.last_name).toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    /** 
    * Handle bottom sheet here
    */
    const HandleInviteSheet = () => {
        if (ContactRef?.current) {
            ContactRef?.current?.snapToIndex(0)
        }
    }

    /**
     * Add guest to event
     * @param {selected user} userdata 
     */
    const AddWishToEvent = async (userdata) => {
        const dataArray = Array.isArray(userdata) ? userdata : [userdata];
        const Response = await makeRequest("POST", `group/${EventId}`, null, Token, { user_ids: dataArray })
    };

    /**
     * Multi-select guest
     * @param {Active status} status 
     * @param {Guest id} guestId 
     */
    const HandleToggle = (ID, status, guestId) => {
        SetIsSelect((prevId) => {
            const isSelected = prevId.includes(ID);

            if (status === "Add") {
                if (isSelected) {
                    AddWishToEvent()
                    return prevId.filter((id) => id !== ID);
                } else {
                    AddWishToEvent(guestId);
                    return [...prevId, ID];
                }
            } else if (status === "Invite") {
                HandleInviteSheet();
            }
            return prevId;
        });
    };

    /**
     * Invite to join the Wishes app.
     */
    const OnShare = async () => {
        try {
            const result = await Share.share({
                message: 'Join this event',
                url: 'https://wishes-app.com/',
            })
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type: ', result.activityType)
                } else {
                    console.log('Content shared successfully!')
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed')
            }
        } catch (error) {
            console.error('Error sharing content: ', error.message)
        }
    }

    const ContactUser = [
        {
            text: "Text message (sms)",
            onpress: () => OnShare()
        },
        {
            text: "Whatsapp",
            onpress: () => OnShare()
        },
        {
            text: "Other option",
            onpress: () => OnShare()
        },
    ]

    return (
        <>
            <AppHeader
                {...{
                    title: "common.addguest",
                    willGoBack: true
                }}
            />
            <View style={{ backgroundColor: theme.background }}>
                <TabUnderLineMenu
                    {...{
                        SelectedTab,
                        setSelectedTab,
                        Data: List,
                        tab_no: "2"
                    }}
                />
            </View>
            <View style={[styles.ws_main_container, { backgroundColor: theme.background }]}>
                {SelectedTab === 'contact' ?
                    <>
                        <View style={styles.ws_context_box}>
                            <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ paddingBottom: ms(20) }} showsVerticalScrollIndicator={false}>
                                <View style={{ marginTop: ms(22), marginBottom: ms(-5) }}>
                                    <SearchBar
                                        {...{
                                            setSearchQuery,
                                            type: "guest"
                                        }}
                                    />
                                </View>
                                {
                                    ContactPermission ? (
                                        filteredContacts.map((item, index) => {
                                            const isSelected = IsSelect.includes(index);
                                            return (
                                                <View key={index}>
                                                    <SelectableBanner
                                                        onpress={() => HandleToggle(index, item.status, item.id)}
                                                        select={isSelected}
                                                        item={item}
                                                        type="contact"
                                                    />
                                                </View>
                                            );
                                        })
                                    ) : (
                                        <View style={styles.ws_no_contact}>
                                            <Text style={[styles.ws_no_contact_text, { color: theme.text }]}>No Contact Found!</Text>
                                            <Text style={[styles.ws_no_contact_text, { color: theme.text }]}>Please allow permissions for contacts</Text>
                                            <View style={{ width: "100%" }}>
                                                <SubmitButton
                                                    type="login"
                                                    title="Allow"
                                                    OnPress={() => GetContacts()}
                                                />
                                            </View>
                                        </View>
                                    )
                                }
                            </ScrollView>
                        </View>
                    </>
                    : null}

                {SelectedTab === 'add contact' ?
                    <View style={{ paddingHorizontal: ms(15), marginTop: ms(15) }}>
                        {FormBuilder.map((item, index) => {
                            if (item.type === 'text') {
                                return (
                                    <CustomInput {...item} key={index} />
                                )
                            }
                            if (item.type === 'select') {
                                return (
                                    <View key={index} style={item.full ? styles.ws_half_width : styles.ws_full_width}>
                                        <CustomCountryCodePicker {...item} key={index} />
                                    </View>
                                )
                            }

                        })}
                        <SubmitButton
                            {...{
                                type: "submit",
                                title: "common.submit",
                                OnPress: handleSubmit(SubmitContact)
                            }}
                        />
                    </View>
                    : null}
            </View>
            <ActionSheet
                {...{
                    BottomSheetRef: ContactRef,
                    type: "contact",
                    Points: SheetPoints,
                    Title: "invite via",
                    Data: ContactUser
                }}
            />
        </>
    )
}

export default AddGuestsScreen

const styles = StyleSheet.create({
    ws_main_container: {
        flex: 1,
        backgroundColor: Colors.ws_bg,
    },
    ws_search_box: {
        backgroundColor: Colors.ws_white,
        height: ms(50),
        borderRadius: ms(9),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: ms(12),
        marginTop: ms(15),
        marginBottom: ms(5),
        // marginHorizontal: ms(20)
    },
    ws_input_Style: {
        flex: 1,
        paddingHorizontal: ms(10)
    },
    ws_context_box: {
        flex: 1,
        paddingHorizontal: ms(15),
    },
    ws_no_contact: {
        alignItems: "center",
        marginTop: ms(40),
    },
    ws_no_contact_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14)
    },
    ws_half_width: {
        width: "48%",
    },
    ws_full_width: {
        width: "100%",
    },
    ws_input_box: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: ms(15)
    },
})

export const List = [
    {
        id: 1,
        title: "contact",
        value: "common.contacts"
    },
    {
        id: 2,
        title: "add contact",
        // value: "common.addContact"
        value: "common.createnew"
    },
]


const NumberRgx = /^[1-9]\d{9}$/
const Schema = yup.object().shape({
    first_name: yup
        .string()
        .required(Formfields.add_contact.first_name.errors.required)
        .min(
            Formfields.add_contact.first_name.errors.minLength.value,
            Formfields.add_contact.first_name.errors.minLength.message
        )
        .max(
            Formfields.add_contact.first_name.errors.maxLength.value,
            Formfields.add_contact.first_name.errors.maxLength.message
        ),

    last_name: yup
        .string()
        .required(Formfields.add_contact.last_name.errors.required)
        .min(
            Formfields.add_contact.last_name.errors.minLength.value,
            Formfields.SignUp.last_name.errors.minLength.message
        )
        .max(
            Formfields.add_contact.last_name.errors.maxLength.value,
            Formfields.add_contact.last_name.errors.maxLength.message
        ),
    phone: yup
        .string()
        .matches(NumberRgx, Formfields.add_contact.phone.errors.pattern)
        .required(Formfields.add_contact.phone.errors.required),
})