/** React Import */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'

/** Styles */
import { AuthStyles, MainStackStyles } from '../common/auth-styles'

/** Components */
import CustomInput from '../../../components/form-utils/custome-inputs'
import SubmitButton from '../../../components/submit-button'
import { makeRequest } from '../../../utils/make-request'

/** Local Import */
import Formfields from '../../../utils/models/FormFields.json'
import { ms, toast } from '../../../utils/helpers/metrics'
import { useTheme } from '../../../utils/context/ThemeContext'
import { IconProps } from '../../../utils/helpers/Iconprops'

/** Library */
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigation } from '@react-navigation/native'

/** Icons */
import LockIcon from "../../../../assets/svgs/lock.svg"
import LeftIcon from "../../../../assets/svgs/left.svg"
import { useLanguage } from '../../../utils/context/LanguageContext'

/** Main Export */
const ChnagePassword = ({ route }) => {

    const { ForgetData, Token } = route.params
    const Navigation = useNavigation()
    const { theme } = useTheme()
    const { translate } = useLanguage()

    const [Loading, SetLoading] = useState()

    const { control, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(Schema),
    })

    const FormBuilder = [
        {
            name: 'password',
            parent: 'ChangePassword',
            type: 'newpassword',
            control,
            label: true,
            Icon: LockIcon,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'password_confirmation',
            parent: 'ChangePassword',
            type: 'password',
            control,
            label: true,
            Icon: LockIcon,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    /**
     * Form submit function
     * @param {form data} data  
     */
    const OnSubmit = async (data) => {
        const NewData = { ...data, phone: ForgetData?.phone, otp: ForgetData?.otp }
        SetLoading(true)
        try {
            const Response = await makeRequest('POST', 'password/set', null, Token, NewData)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                Navigation.navigate("login")
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

    return (
        <View style={[AuthStyles.ws_auth, { backgroundColor: theme.background }]}>
            <SafeAreaView />
            <View style={AuthStyles.ws_header}>
                <Text style={[AuthStyles.ws_header_text, { color: theme.text }]}>{translate("ChangePasswordScreen.changePassword")}</Text>
            </View>
            {FormBuilder.map((item, index) => {
                return <CustomInput {...item} key={index} />
            })}
            <SubmitButton
                {...{
                    type: "submit",
                    title: "common.submit",
                    Loading: Loading,
                    OnPress: handleSubmit(OnSubmit)
                }}
            />
            <TouchableOpacity style={AuthStyles.ws_button} onPress={() => Navigation.goBack()}>
                <LeftIcon {...IconProps(ms(22))} fill={theme.text} />
                <Text style={[AuthStyles.ws_user_forget_text, { color: theme.text, marginLeft: ms(5) }]}>{translate("common.backLogin")}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ChnagePassword

const Schema = yup.object().shape({
    password: yup
        .string()
        .required(Formfields.ChangePassword.password.errors.required)
        .min(
            Formfields.ChangePassword.password.errors.minLength.value,
            Formfields.ChangePassword.password.errors.minLength.message
        )
        .max(
            Formfields.ChangePassword.password.errors.maxLength.value,
            Formfields.ChangePassword.password.errors.maxLength.message
        ),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], Formfields.ChangePassword.password_confirmation.errors.match)
        .required(Formfields.ChangePassword.password_confirmation.errors.required)
})