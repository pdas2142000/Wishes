/** React Imports */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'

/** Components */
import AppHeader from '../../../../components/header'
import SubmitButton from '../../../../components/submit-button'
import FilePicker from '../../../../components/form-utils/file-picker'

/** Library */
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form' 
import { debounce } from 'lodash'

/** Local Import */
import { Colors, AppCommonStyle, Fonts } from '../../../../utils/styles'
import { IconProps } from '../../../../utils/helpers/Iconprops'
import { MainStackStyles } from '../../../auth/common/auth-styles'
import CustomInput from '../../../../components/form-utils/custome-inputs'
import Formfields from '../../../../utils/models/FormFields.json'
import { ms, toast } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'

/** Icons */
import SearchIcon from "../../../../../assets/svgs/search.svg"
import CheckIcon from "../../../../../assets/svgs/check.svg"

/** Styles */
import { Banner_styles } from '../../../../utils/styles/BannerStyle'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import NotFound from '../../../../components/not-found'
import { useNavigation } from '@react-navigation/native'

/** Main Export */
const CreateChatScreen = () => {

    const InputRef = useRef()
    const { theme } = useTheme()
    const { translate } = useLanguage()
    const CreateChatRef = useRef()
    const { Token } = useAuth()
    const Navigation = useNavigation()

    const [Loading, SetLoading] = useState(false)
    const [isSelect, setIsSelect] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [user, SetUser] = useState()
    const [ItemSearch, SetItemSearch] = useState()
    const { reset, control, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(Schema),
    })

    const FormBuilder = [
        {
            name: 'file',
            parent: 'create_chat',
            type: 'image_pick',
            control,
            label: false,
            placeholder: false,
            styles: MainStackStyles,
            BottomSheetRef: CreateChatRef
        },
        {
            name: 'name',
            parent: 'create_chat',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    /**
     * Create group
     */
    const OnSubmit = async (data) => {
        SetLoading(true)
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('user_id', selectedItems)
        if (data.file) {
            formData.append('file', {
                name: data.file.fileName,
                type: data.file.type,
                uri: data.file.uri,
                size: data.file.fileSize
            })
        }
        try {
            const Response = await makeRequest("POST", "conversation/from-group", null, Token, formData, true)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                reset()
                Navigation.goBack()
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            SetLoading(false)
        }
    }

    useEffect(() => {
        if (InputRef.current) {
            InputRef.current.focus()
        }
    }, [])

    const HandleSelectAll = () => {
        if (isSelect) {
            setSelectedItems([]);
        } else {
            const allItems = user?.items.map(item => item.slug);
            setSelectedItems(allItems);
        }
        setIsSelect(!isSelect);
    };

    const handleItemSelect = (user) => {
        if (selectedItems.includes(user.slug)) {
            setSelectedItems(selectedItems.filter(item => item !== user.slug));
        } else {
            setSelectedItems([...selectedItems, user.slug]);
        }
    };

    /**
     * Get all contact
     */
    const GetUser = async (search) => {
        const Response = await makeRequest("GET", "user/group-by-friends", { search: search }, Token)
        SetUser(Response.data)
    }

    useEffect(() => {
        GetUser(ItemSearch)
    }, [ItemSearch]);

    /** 
    * Search Event
    */
    const BebouncedSearch = useCallback(
        debounce((search) => {
            SetItemSearch(search)
        }, 500),
        []
    )
    return (
        <>
            <AppHeader
                {...{
                    title: "common.createChat",
                    willGoBack: true
                }}
            />
            <View style={[AppCommonStyle.ws_main_container, { backgroundColor: theme.background }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexGrow: 1 }}>
                        {FormBuilder.map((item, index) => {
                            if (item.type === "text") {
                                return <CustomInput {...item} key={index} flag="create" />
                            }
                            if (item.type === "image_pick") {
                                return <FilePicker {...item} key={index} />
                            }
                        })}
                        <View style={styles.ws_search_header}>
                            <Text style={[styles.ws_search_header_text, { color: theme.text }]} >{translate("common.participants")}</Text>
                            <TouchableOpacity onPress={HandleSelectAll}>
                                <Text style={[styles.ws_search_header_text, { color: theme.text }]}>
                                    {isSelect ? translate("common.deselectAll") : translate("common.selectAll")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.ws_user_box, { backgroundColor: theme.card_bg, }]}>
                            <View style={[styles.ws_search_box, { backgroundColor: theme.background }]}>
                                <SearchIcon {...IconProps(ms(20))} fill={theme.subtext} />
                                <TextInput
                                    ref={InputRef}
                                    style={[styles.ws_input_Style, { color: theme.text }]}
                                    placeholder={translate("common.searchPlaceholder")}
                                    placeholderTextColor={theme.subtext}
                                    onChangeText={text => BebouncedSearch(text)}
                                />
                            </View>
                            {user?.items?.length > 0 ? (
                                user.items.map((item, index) => {
                                    const isItemSelected = selectedItems.includes(item.slug);
                                    return (
                                        <View key={index}>
                                            <TouchableOpacity
                                                style={[
                                                    Banner_styles.ws_selectable_container,
                                                    { backgroundColor: theme.background }
                                                ]}
                                                onPress={() => handleItemSelect(item)}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <View style={Banner_styles.ws_select_image}>
                                                        <Image style={Banner_styles.ws_img} source={{ uri: item.$avatar_url }} />
                                                    </View>
                                                    <View style={Banner_styles.ws_info}>
                                                        <Text style={[Banner_styles.ws_title, { color: theme.text }]}>
                                                            {item.first_name} {item.last_name}
                                                        </Text>
                                                        <Text style={[
                                                            styles.ws_subtext,
                                                            { color: theme.subtext, fontSize: ms(12) }
                                                        ]}>
                                                            {item.phone}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {isItemSelected ? (
                                                    <CheckIcon {...IconProps(ms(23))} fill={theme.text} />
                                                ) : null}
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })
                            ) : (
                                <NotFound
                                    title="friends not found"
                                />
                            )}
                        </View>
                    </View>
                </ScrollView>
                <SafeAreaView>
                    <SubmitButton
                        {...{
                            type: "submit",
                            title: "common.createChat",
                            Loading: Loading,
                            OnPress: handleSubmit(OnSubmit)
                        }}
                    />
                </SafeAreaView>
            </View>
        </>
    )
}

export default CreateChatScreen

const Schema = yup.object().shape({
    name: yup
        .string()
        .required(Formfields.create_chat.name.errors.required)
        .min(
            Formfields.create_chat.name.errors.minLength.value,
            Formfields.create_chat.name.errors.minLength.message
        )
        .max(
            Formfields.create_chat.name.errors.maxLength.value,
            Formfields.create_chat.name.errors.maxLength.message
        ),
})

const styles = StyleSheet.create({
    ws_search_header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: ms(5),
        marginTop: ms(4)
    },
    ws_search_header_text: {
        color: Colors.ws_text,
        fontFamily: Fonts.Font_600,
        fontSize: ms(11)
    },
    ws_search_box: {
        backgroundColor: Colors.ws_white,
        height: ms(48),
        borderRadius: ms(10),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: ms(12),
        marginTop: ms(5),
        marginBottom: ms(5)
    },
    ws_input_Style: {
        flex: 1,
        paddingHorizontal: ms(10)
    },
    ws_user_box: {
        paddingHorizontal: ms(15),
        borderRadius: ms(10),
        paddingBottom: ms(10),
        paddingTop: ms(10),
    }
})
