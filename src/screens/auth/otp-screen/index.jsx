/** React Import */
import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

/** Components */
import SubmitButton from '../../../components/submit-button'
import { makeRequest } from '../../../utils/make-request'
import { useAuth } from '../../../utils/context/AuthContext'
import CustomInput from '../../../components/form-utils/custome-inputs'

/** Styles */
import { AuthStyles, MainStackStyles } from '../common/auth-styles'

/** Library */
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigation } from '@react-navigation/native'

/** Local Import */
import { IconProps } from '../../../utils/helpers/Iconprops'
import { ms, toast } from '../../../utils/helpers/metrics'
import Formfields from '../../../utils/models/FormFields.json'
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'

/** Icons */
import LeftIcon from "../../../../assets/svgs/left.svg"

/** Main Export */
const OtpScreen = ({ route }) => {

    const { data, type } = route.params || ""
    const Navigation = useNavigation()
    const { theme } = useTheme()
    const { login } = useAuth()
    const { translate } = useLanguage()

    const [Loading, SetLoading] = useState(false)
    const [Timer, SetTimer] = useState(30)

    const { reset, control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(Schema),
        defaultValues: {
            phone: data?.phone,
            first_name: data?.first_name,
            last_name: data?.last_name,
            password: data.password,
            country: data.country,
            country_code: data.country_code,
            timezone: data.timezone,
            onesignal: data.onesignal,
            password_confirmation: data.password_confirmation
        }
    })

    const FormBuilder = [
        {
            name: 'otp',
            parent: 'otp',
            type: 'text',
            control,
            label: false,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    /**
     * Form submit function
     * @param {form data} data 
     */
    const OnSubmit = async data => {
        SetLoading(true)
        try {
            SetLoading(false)
            const endpoint = type === "reset" ? "password/forget/otp" : "authentication/register"
            const Response = await makeRequest("POST", endpoint, null, null, data, false)
            console.log("Response", Response)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                const nextScreen = type === "reset" ? "changepassword" : "login"
                if (type === "reset") {
                    Navigation.navigate("changepassword", { ForgetData: data, Token: Response.data.token });
                } else {
                    Navigation.navigate(nextScreen);
                }
                login({
                    user: Response || null
                })
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
                reset()
            }
        } catch (error) {
            console.log(error)
        } finally {
            SetLoading(false)
        }
    }

    /**
     * Resend OTP timer function
     */
    useEffect(() => {
        let interval
        if (Timer > 0) {
            interval = setInterval(() => {
                SetTimer(prevTimer => prevTimer - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [Timer])

    /**
     * Resend OTP function
     */
    const HandleResendOTP = async () => {
        SetTimer(30)
        try {
            const endpoint = type === "reset" ? "password/forget/otp" : "authentication/register"
            const Response = await makeRequest('POST', endpoint, null, null, data, false,)
            console.log("Response", Response)
            if (Response.success === 2) {
                toast('success', {
                    title: Response.message
                })
            } else if (Response.success === 0) {
                toast('success', {
                    title: Response.message
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={[AuthStyles.ws_auth, { backgroundColor: theme.background }]} >
            <SafeAreaView />
            <View style={[AuthStyles.ws_header]}>
                <Text style={[AuthStyles.ws_header_text, { color: theme.text }]}>{translate("OtpScreen.hadeing")}</Text>
            </View>
            <View style={[AuthStyles.ws_user_forget, { marginBottom: ms(4) }]}>
                <Text style={[AuthStyles.ws_user_forget_text, { color: theme.text }]}>{translate("OtpScreen.otpText")}</Text>
                <Text style={[AuthStyles.ws_user_forget_text, { color: theme.text }]}>{`+91 ${"990099XXXX" || '...'}`}</Text>
            </View>
            <View style={{ marginTop: ms(5) }}>
                {
                    FormBuilder.map((item, index) => {
                        return <CustomInput {...item} key={index} flag={"create"} />
                    })
                }
            </View>
            <TouchableOpacity
                style={[AuthStyles.sa_simple_btn]}
                onPress={HandleResendOTP}
                disabled={Timer > 0}
            >
                <Text style={[AuthStyles.ws_user_forget_text, { color: theme.subtext }]}>{translate("OtpScreen.notReceive")}
                    <Text style={[AuthStyles.sa_simple_btn_text_color, { color: theme.text }]}> {translate("OtpScreen.resendText")}</Text>
                    {
                        Timer > 0 &&
                        <>
                            <Text style={[AuthStyles.sa_simple_btn_text_color, { color: theme.text }]}> in </Text>
                            <Text style={[AuthStyles.sa_simple_btn_text_color, { color: theme.text }]}>{Timer}s</Text>
                        </>
                    }
                </Text>
            </TouchableOpacity>
            <View>
                <SubmitButton
                    {...{
                        type: "submit",
                        title: "common.submit",
                        Loading: Loading,
                        OnPress: handleSubmit(OnSubmit)
                    }}
                />
            </View>
            <View style={{ alignItems: "center" }} >
                <TouchableOpacity style={[AuthStyles.ws_button, { marginBottom: ms(18) }]} onPress={() => Navigation.goBack()}>
                    <LeftIcon {...IconProps(ms(22))} fill={theme.text} />
                    <Text style={[AuthStyles.ws_user_forget_text, { color: theme.text, marginLeft: ms(5) }]}>{translate("common.backLogin")}</Text>
                </TouchableOpacity>
                <View style={AuthStyles.ws_logo_image_box}>
                    <Image style={AuthStyles.ws_image} source={require("../../../../assets/images/logo/logo-login.png")} />
                </View>
            </View>
        </View>

    )
}

export default OtpScreen

const Schema = yup.object().shape({
    otp: yup
        .string()
        .required(Formfields.otp.otp.errors.required)
        .length(
            Formfields.otp.otp.errors.pattern.value,
            Formfields.otp.otp.errors.pattern.message,
        )
})

