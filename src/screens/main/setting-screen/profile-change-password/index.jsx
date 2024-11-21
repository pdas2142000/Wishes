/** React Import */
import React, { useState } from 'react'
import { View } from 'react-native'

/** Component */
import CustomInput from '../../../../components/form-utils/custome-inputs'
import AppHeader from '../../../../components/header'
import SubmitButton from '../../../../components/submit-button'

/** Styles */
import { AppCommonStyle, } from '../../../../utils/styles'
import { MainStackStyles } from '../../../auth/common/auth-styles'

/** Library */
import { useNavigation } from '@react-navigation/native'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

/** Local Import */
import { useAuth } from '../../../../utils/context/AuthContext'
import { makeRequest } from '../../../../utils/make-request'
import Formfields from '../../../../utils/models/FormFields.json'
import { toast, } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Main Export */
const ProfileChangePassword = () => {

    const { user, Token } = useAuth()
    const Navigation = useNavigation()
    const { theme } = useTheme()

    const [Loading, SetLoading] = useState()

    const { reset, control, handleSubmit, setValue, formState: { errors }, } = useForm({
        resolver: yupResolver(Schema),
    })

    const Phone = user?.data?.user?.phone

    /**
     * Data submit sunction
     * @param {Data} data 
     */
    const OnSubmit = async data => {
        SetLoading(true)
        const NewData = { ...data, phone: Phone }
        try {
            const Response = await makeRequest('POST', 'password/change', null, Token, NewData)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                Navigation.goBack()
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
            reset()
        } catch (error) {
            console.log(error)
        }finally{
            SetLoading(false)
        }
    }

    const FormBuilder = [
        {
            name: 'old_password',
            parent: 'profile_change_password',
            type: 'password',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'password',
            parent: 'profile_change_password',
            type: 'password',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'password_confirmation',
            parent: 'profile_change_password',
            type: 'password',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    return (
        <>
            <AppHeader
                {...{
                    title: "Change password",
                    willGoBack: true
                }}
            />
            <View style={[AppCommonStyle.ws_main_container, {backgroundColor:theme.background}]}>
                {FormBuilder.map((item, index) => {
                    return <CustomInput {...item} key={index} flag="create" />
                })}
                <SubmitButton
                    {...{
                        type: "submit",
                        title: "Submit",
                        Loading: Loading,
                        OnPress: handleSubmit(OnSubmit)
                    }}
                />
            </View>
        </>
    )
}

export default ProfileChangePassword

const Schema = yup.object().shape({
    password: yup
        .string()
        .required(Formfields.profile_change_password.password.errors.required)
        .min(
            Formfields.profile_change_password.password.errors.minLength.value,
            Formfields.profile_change_password.password.errors.minLength.message
        )
        .max(
            Formfields.profile_change_password.password.errors.maxLength.value,
            Formfields.profile_change_password.password.errors.maxLength.message
        ),
    old_password: yup
        .string()
        .required(Formfields.profile_change_password.old_password.errors.required)
        .min(
            Formfields.profile_change_password.old_password.errors.minLength.value,
            Formfields.profile_change_password.old_password.errors.minLength.message
        )
        .max(
            Formfields.profile_change_password.old_password.errors.maxLength.value,
            Formfields.profile_change_password.old_password.errors.maxLength.message
        ),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], Formfields.profile_change_password.password_confirmation.errors.message)
        .required(Formfields.profile_change_password.password.errors.required)
})
