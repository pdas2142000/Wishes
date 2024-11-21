/** React Imports */
import React, { useEffect, useRef, useState } from 'react'
import { Platform, View } from 'react-native'

/** Components */
import AppHeader from '../../header'
import CustomInput from '../../form-utils/custome-inputs'
import FilePicker from '../../form-utils/file-picker'
import SubmitButton from '../../submit-button'

/** Local Imports */
import { AppCommonStyle } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'
import { MainStackStyles } from '../../../screens/auth/common/auth-styles'
import { WishlistSchema } from '../../../screens/main/home-screen/helper'
import { makeRequest } from '../../../utils/make-request'
import { toast } from '../../../utils/helpers/metrics'
import { useAuth } from '../../../utils/context/AuthContext'

/** Libraries */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/** Main Export */
const WishlistAddScreen = ({ route }) => {

    const { Data, type } = route.params || {}
    const { Token } = useAuth()
    const { theme } = useTheme()
    const NewWishlistRef = useRef()
    const Navigation = useNavigation()

    const [Loading, SetLoading] = useState(false)
    const [SingleEvent, setSingleEvent] = useState({})

    const { control, handleSubmit, setValue } = useForm({
        resolver: yupResolver(WishlistSchema),
    })

    /**
     * Add wish list
     * @param {data} data 
     */
    const OnSubmit = async (data) => {
        SetLoading(true)
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.file) {
            formData.append('file', {
                name: data.file.fileName,
                type: data.file.type,
                uri: data.file.uri,
                size: data.file.fileSize
            })
        }
        try {
            const requestMethod = type === "wishlist_edit" ? 'PUT' : 'POST'
            const requestURL = type === "wishlist_edit" ? `event/${Data.slug}` : 'event'

            const Response = await makeRequest(requestMethod, requestURL, null, Token, formData, true)

            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                Navigation.navigate("me")
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            toast("error", {
                title: 'Something went wrong!'
            })
        }
        SetLoading(false)
    }

    const FormBuilder = [
        {
            name: 'file',
            parent: 'new_wishlist',
            type: 'image_pick',
            control,
            label: false,
            placeholder: false,
            styles: MainStackStyles,
            BottomSheetRef: NewWishlistRef
        },
        {
            name: 'name',
            parent: 'new_wishlist',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    /**
     * Get single data
     */
    const GetSingleEvent = async () => {
        const Response = await makeRequest("GET", `event/${Data.slug}`, null, Token)
        setSingleEvent(Response.data)
    }

    useEffect(() => {
        if (type) {
            GetSingleEvent()
        }
    }, [type])

    useEffect(() => {
        if (type && SingleEvent) {
            setValue("name", SingleEvent.name)
            setValue("file", SingleEvent.$avatar_url)
        }
    }, [type, SingleEvent])

    return (
        <>
            <AppHeader
                {...{
                    title: type === "wishlist_edit" ? "common.editWishList" : "common.addNew",
                    willGoBack: true
                }} 
            />
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === "ios" ? 55 : 40}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: theme.background }}
            >
                <View style={[AppCommonStyle.ws_main_container, { backgroundColor: theme.background }]}>
                    {FormBuilder.map((item, index) => {
                        if (item.type == "text") {
                            return <CustomInput {...item} key={index} flag={"create"} />
                        }
                        if (item.type == "image_pick") {
                            return <FilePicker {...item} key={index} />
                        }
                    })}
                    <SubmitButton
                        {...{
                            type: "submit",
                            title: "common.submit",
                            Loading: Loading,
                            OnPress: handleSubmit(OnSubmit)
                        }}
                    />
                </View >
            </KeyboardAwareScrollView>
        </>
    )
}

export default WishlistAddScreen
