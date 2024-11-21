/** React Import */
import { View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

/** Local Import */
import Formfields from "../../../../utils/models/FormFields.json"
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Styles */
import { AppCommonStyle } from '../../../../utils/styles'
import { ms, toast } from '../../../../utils/helpers/metrics'
import { MainStackStyles } from '../../../auth/common/auth-styles'

/** Component*/
import CustomInput from '../../../../components/form-utils/custome-inputs'
import CustomCountryCodePicker from '../../../../components/form-utils/custom-country-code-picker'
import FilePicker from '../../../../components/form-utils/file-picker'
import ToggleSwitch from '../../../../components/form-utils/toggle-switch'
import SubmitButton from '../../../../components/submit-button'
import AppHeader from '../../../../components/header'

/** Library */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/** Main Export */
const EditAcountInfo = () => {

    const { Token, login } = useAuth()
    const Navigation = useNavigation()
    const ProfileImageRef = useRef()
    const { theme } = useTheme()
    const isFocused = useIsFocused()

    const [callingCode, setCallingCode] = useState('')
    const [AllUser, SetAllUser] = useState(null)
    const [Loading, SetLoading] = useState(false)

    const { control, handleSubmit, setValue, formState: { errors }, } = useForm(
        { resolver: yupResolver(Schema) }
    )

    const FormBuilder = [
        {
            name: 'file',
            parent: 'edit_profile',
            type: 'edit_profile',
            control,
            BottomSheetRef: ProfileImageRef,
            styles: MainStackStyles,
        },
        {
            name: 'first_name',
            parent: 'edit_profile',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'last_name',
            parent: 'edit_profile',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'phone',
            parent: 'edit_profile',
            type: 'select',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
            setCallingCode
        },
        {
            name: 'time_format',
            parent: 'edit_profile',
            type: 'toggle',
            control,
            styles: MainStackStyles,
        },
    ]

    /** 
     * Update user 
     */
    const OnSubmit = async (data) => {
        SetLoading(true)
        const NewData = { ...data, callingCode }
        const formData = new FormData()
        formData.append('country_code', NewData.callingCode)
        formData.append('phone', NewData.phone)
        formData.append('first_name', NewData.first_name)
        formData.append('last_name', NewData.last_name)
        formData.append('time_format', NewData.time_format)
        if (data.file) {
            formData.append('file', {
                name: data.file.fileName,
                type: data.file.type,
                uri: data.file.uri,
                size: data.file.fileSize
            })
        }
        try {
            const EditResponse = await makeRequest("POST", "profile/me", null, Token, formData, true)
            if (EditResponse.success === 1) {
                Navigation.goBack()
                toast("success", {
                    title: EditResponse.message,
                })
                login({
                    Token: EditResponse.data.token || null,
                    user: EditResponse || null
                })
            } else if (EditResponse.success === 0) {
                toast("error", {
                    title: EditResponse.message,
                })
            } else if (EditResponse.success === 2) {
                Navigation.navigate("profileOtp", { EditData: NewData, })
                toast("success", {
                    title: EditResponse.message,
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            SetLoading(false)
        }
    }

    /**
     * Get users
     */
    const GetUser = async () => {
        try {
            const GetUserResponse = await makeRequest("GET", "profile/me", null, Token)
            SetAllUser(GetUserResponse?.data)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     *  Get users screen update
     */
    useEffect(() => {
        GetUser()
    }, [isFocused]);

    /**
     * Set all values to the fields
     */
    useEffect(() => {
        setValue('first_name', AllUser?.first_name)
        setValue('last_name', AllUser?.last_name)
        setValue('phone', AllUser?.phone)
        setValue('file', { uri: AllUser?.$avatar_url })
    }, [setValue, AllUser])

    return (
        <>
            <AppHeader
                {...{
                    title: "EditAccountInfoScreen.editAccountInfo",
                    willGoBack: true
                }}
            />
            <View style={[AppCommonStyle.ws_main_container, { backgroundColor: theme.background }]}>
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    extraScrollHeight={135}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {FormBuilder.map((item, index) => {
                        if (item.type === 'edit_profile') {
                            return <FilePicker {...item} key={index} />
                        }
                        if (item.type === 'text') {
                            return <CustomInput {...item} key={index} flag="create" />
                        }
                        if (item.type === 'select') {
                            return <CustomCountryCodePicker {...item} key={index} />
                        }
                        if (item.type === 'toggle') {
                            return <ToggleSwitch {...item} key={index} />
                        }
                        return null
                    })}
                    <View style={{ marginTop: ms(15) }}>
                        <SubmitButton
                            {...{
                                type: "submit",
                                title: "submit",
                                Loading: Loading,
                                OnPress: handleSubmit(OnSubmit)
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </>
    )
}

export default EditAcountInfo

const NumberRgx = /^[1-9]\d{9}$/
const Schema = yup.object().shape({
    phone: yup
        .string()
        .matches(NumberRgx, Formfields.edit_profile.phone.errors.pattern)
        .required(Formfields.edit_profile.phone.errors.required),

    first_name: yup
        .string()
        .required(Formfields.edit_profile.first_name.errors.required)
        .min(
            Formfields.edit_profile.first_name.errors.minLength.value,
            Formfields.edit_profile.first_name.errors.minLength.message
        )
        .max(
            Formfields.edit_profile.first_name.errors.maxLength.value,
            Formfields.edit_profile.first_name.errors.maxLength.message
        ),

    last_name: yup
        .string()
        .required(Formfields.edit_profile.last_name.errors.required)
        .min(
            Formfields.SignUp.last_name.errors.minLength.value,
            Formfields.SignUp.last_name.errors.minLength.message
        )
        .max(
            Formfields.edit_profile.last_name.errors.maxLength.value,
            Formfields.edit_profile.last_name.errors.maxLength.message
        ),
})
