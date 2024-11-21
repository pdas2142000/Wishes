/** React Import */
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TouchableWithoutFeedback, View } from 'react-native'

/** Library */
import { useForm, } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import TimeZone from "react-native-timezone"
import { OneSignal } from 'react-native-onesignal'
import { useNavigation } from '@react-navigation/native'

/** Components */
import CustomInput from '../../../components/form-utils/custome-inputs'
import SubmitButton from '../../../components/submit-button'
import FooterText from '../common/footer-text'
import CustomCountryCodePicker from '../../../components/form-utils/custom-country-code-picker'

/** Local Import */
import { useAuth } from '../../../utils/context/AuthContext'
import { makeRequest } from '../../../utils/make-request'
import { toast } from '../../../utils/helpers/metrics'
import Formfields from '../../../utils/models/FormFields.json'
import { useLanguage } from '../../../utils/context/LanguageContext'
import { useTheme } from '../../../utils/context/ThemeContext'

/** Icons */
import LockIcon from "../../../../assets/svgs/lock.svg"

/** Styles */
import { AuthStyles, MainStackStyles } from '../common/auth-styles'

/** Main Export */
const LoginScreen = () => {

    const { login } = useAuth()
    const { translate } = useLanguage()
    const { theme } = useTheme()
    const Navigation = useNavigation()

    const [Loading, SetLoading] = useState(false)
    const [callingCode, setCallingCode] = useState('')

    const { reset, control, handleSubmit, setValue } = useForm({
        resolver: yupResolver(Schema),
    })

    /**
     * login form submission
     * @param data form data
    */
    const onSubmit = async (data) => {
        SetLoading(true)
        let Zone = await TimeZone.getTimeZone()
        const onesignal = await OneSignal.User.pushSubscription.getIdAsync()
        const NewData = {
            ...data,
            timezone: Zone,
            username: data.phone,
            password: data.password,
            callingcode: callingCode,
            onesignal: onesignal
        }
        try {
            const Response = await makeRequest("POST", "authentication/login", null, null, NewData, false)
            if (Response.success === 1) {
                login({
                    Token: Response.data.token || null,
                    user: Response || null
                })
                toast("success", {
                    title: Response.message,
                })
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
            reset()
        } catch (error) {
            console.log(error)
        } finally {
            SetLoading(false)
        }
    }

    const FormBuilder = [
        {
            name: 'phone',
            parent: 'LogIn',
            type: 'select',
            control,
            label: false,
            placeholder: true,
            styles: MainStackStyles,
            setCallingCode
        },
        {
            name: 'password',
            parent: 'LogIn',
            type: 'text',
            control,
            Icon: LockIcon,
            label: false,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    useEffect(() => {
        setValue('phone', "9937636430")
        setValue('password', "00000000")
    }, [setValue]) 

    return (
        <View style={[AuthStyles.ws_auth, { backgroundColor: theme.background }]} >
            <SafeAreaView />
            <View style={AuthStyles.ws_header}>
                <Text style={[AuthStyles.ws_header_text, { color: theme.text }]}>{translate("LoginScreen.logIn")}</Text>
            </View>
            {FormBuilder.map((item, index) => {
                if (item.type === 'text') {
                    return <CustomInput {...item} key={index} />
                }
                if (item.type === 'select') {
                    return <CustomCountryCodePicker {...item} key={index} />
                }
                return null
            })}
            <TouchableWithoutFeedback onPress={() => Navigation.navigate("forgot")} >
                <View style={AuthStyles.ws_user_forget}>
                    <Text style={[AuthStyles.ws_user_forget_text, { color: theme.text }]}>{translate("LoginScreen.forgotPassText")}</Text>
                </View>
            </TouchableWithoutFeedback>
            <SubmitButton
                {...{
                    type: "login",
                    title: "LoginScreen.logIn",
                    Loading: Loading,
                    OnPress: handleSubmit(onSubmit)
                }}
            />
            <FooterText
                text="LoginScreen.dontHaveAccount"
                subText="LoginScreen.dontHaveAccount"
                nav={() => Navigation.navigate("register")}
                type="register"
            />
        </View>
    )
}

export default LoginScreen

const NumberRgx = /^[1-9]\d{9}$/
const Schema = yup.object().shape({
    phone: yup
        .string()
        .matches(NumberRgx, Formfields.LogIn.phone.errors.pattern)
        .required(Formfields.LogIn.phone.errors.required),

    password: yup
        .string()
        .required(Formfields.LogIn.password.errors.required)
        .min(
            Formfields.LogIn.password.errors.minLength.value,
            Formfields.LogIn.password.errors.minLength.message
        )
        .max(
            Formfields.LogIn.password.errors.maxLength.value,
            Formfields.LogIn.password.errors.maxLength.message
        ),

})

