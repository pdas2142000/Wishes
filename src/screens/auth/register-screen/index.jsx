/** React Import */
import React, { useState } from 'react'
import { Linking, SafeAreaView, ScrollView, Text, View, Platform} from 'react-native'

/** Local Import */
import { ms, toast } from '../../../utils/helpers/metrics'
import Formfields from "../../../utils/models/FormFields.json"
import { useLanguage } from '../../../utils/context/LanguageContext'
import { useTheme } from '../../../utils/context/ThemeContext'
import { Colors } from '../../../utils/styles'
import { makeRequest } from '../../../utils/make-request'

/** Library */
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import TimeZone from "react-native-timezone"
import { useNavigation } from '@react-navigation/native'
import { OneSignal } from 'react-native-onesignal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/** Components */
import FooterText from '../common/footer-text'
import CustomInput from '../../../components/form-utils/custome-inputs'
import SubmitButton from '../../../components/submit-button'
import CustomCountryCodePicker from '../../../components/form-utils/custom-country-code-picker'

/** Icons */
import LockIcon from "../../../../assets/svgs/lock.svg"
import UserIcon from "../../../../assets/svgs/userone.svg"

/** Styles */
import { AuthStyles, MainStackStyles } from '../common/auth-styles'

/** Main Export */
const RegisterScreen = () => {

    const Navigation = useNavigation()
    const { translate } = useLanguage()
    const { theme } = useTheme()

    const [callingCode, setCallingCode] = useState('')
    const [Loading, SetLoading] = useState(false)

    const { reset, control, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(Schema),
    })

    /**
     * login form submission
     * @param data form data  
     */
    const OnSubmit = async data => {
        const onesignal = await OneSignal.User.pushSubscription.getIdAsync()
        SetLoading(true)
        let Zone = await TimeZone.getTimeZone()
        data = {
            ...data,
            country_code: callingCode,
            country: callingCode,
            timezone: Zone,
            onesignal: onesignal
        }
        try {
            const Response = await makeRequest("POST", "authentication/register", null, null, { ...data }, false)
            console.log("🚀 ~ OnSubmit ~ Response:", Response)
            if (Response.success == 2) {
                Navigation.navigate("otp", { data: data })
                toast("success", {
                    title: Response.message,
                })
                reset()
            } else if (Response.success == 0) {
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

    const FormBuilder = [
        {
            name: 'phone',
            parent: 'SignUp',
            type: 'select',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
            setCallingCode
        },
        {
            name: 'first_name',
            parent: 'SignUp',
            type: 'text',
            control,
            Icon: UserIcon,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'last_name',
            parent: 'SignUp',
            type: 'text',
            control,
            Icon: UserIcon,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'password',
            parent: 'SignUp',
            type: 'text',
            control,
            Icon: LockIcon,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'password_confirmation',
            parent: 'SignUp',
            type: 'text',
            control,
            Icon: LockIcon,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },

    ]

    /**
     * Open Privacy Policy 
     */
    const OpenPrivacyPolicy = () => {
        Linking.openURL('https://wishes-app.com/privacy-policy');
    };

    return (
        <View style={[AuthStyles.ws_auth, { backgroundColor: theme.background }]}>
            <SafeAreaView />
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={ Platform.OS === "ios"? 50 : 70}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingBottom:  ms(50) }}>
                    <View style={AuthStyles.ws_header}>
                        <Text style={[AuthStyles.ws_header_text, { color: theme.text }]}>Register</Text>
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
                    <Text style={[AuthStyles.ws_user_forget_text, AuthStyles.ws_user_forget, { color: theme.text }]}>{translate("RegisterScreen.accText")}
                        <Text onPress={OpenPrivacyPolicy} style={{ color: Colors.ws_primary_blue }}> {translate("RegisterScreen.policyText")}</Text>
                    </Text>
                    <SubmitButton
                        {...{
                            type: "signup",
                            title: "Register",
                            Loading: Loading,
                            OnPress: handleSubmit(OnSubmit)
                        }}
                    />
                    <FooterText
                        text="RegisterScreen.alreadyAccount"
                        subText="RegisterScreen.alreadyAccount"
                        nav={() => Navigation.navigate("login")}
                        type="signup"
                    />
                </View>
            </KeyboardAwareScrollView>
        </View>

    )
}
const NumberRgx = /^[1-9]\d{9}$/
const Schema = yup.object().shape({
    first_name: yup
        .string()
        .required(Formfields.SignUp.first_name.errors.required)
        .min(
            Formfields.SignUp.first_name.errors.minLength.value,
            Formfields.SignUp.first_name.errors.minLength.message
        )
        .max(
            Formfields.SignUp.password.errors.maxLength.value,
            Formfields.SignUp.password.errors.maxLength.message
        ),

    last_name: yup
        .string()
        .required(Formfields.SignUp.last_name.errors.required)
        .min(
            Formfields.SignUp.last_name.errors.minLength.value,
            Formfields.SignUp.last_name.errors.minLength.message
        )
        .max(
            Formfields.SignUp.password.errors.maxLength.value,
            Formfields.SignUp.password.errors.maxLength.message
        ),
    password: yup
        .string()
        .required(Formfields.SignUp.password.errors.required)
        .min(
            Formfields.SignUp.password.errors.minLength.value,
            Formfields.SignUp.password.errors.minLength.message
        )
        .max(
            Formfields.SignUp.password.errors.maxLength.value,
            Formfields.SignUp.password.errors.maxLength.message
        ),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], Formfields.SignUp.password_confirmation.errors.not_equal)
        .required(Formfields.SignUp.password_confirmation.errors.required),
    phone: yup
        .string()
        .matches(NumberRgx, Formfields.SignUp.phone.errors.pattern)
        .required(Formfields.SignUp.phone.errors.required),
})
export default RegisterScreen