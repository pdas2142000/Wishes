/** React Import */
import { Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

/** Components */
import SubmitButton from '../../../../components/submit-button'
import AppHeader from '../../../../components/header'
import CustomInput from '../../../../components/form-utils/custome-inputs'

/** Styles */
import { AuthStyles, MainStackStyles } from '../../../auth/common/auth-styles'

/** Library */
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigation } from '@react-navigation/native'

/** Local Import */
import Formfields from '../../../../utils/models/FormFields.json'
import { ms, toast } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'

/** Main Export */
const ProfileOtpScreen = ({ route }) => {

    const { EditData } = route.params || {}
    const { theme } = useTheme()
    const Navigation = useNavigation()
    const { login, Token } = useAuth()

    const [Loading, SetLoading] = useState(false)
    const [Timer, SetTimer] = useState(30)

    const { reset, control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(Schema),
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
        const formData = new FormData()
        formData.append('country_code', EditData.callingCode)
        formData.append('phone', EditData.phone)
        formData.append('first_name', EditData.first_name)
        formData.append('last_name', EditData.last_name)
        formData.append('otp', data.otp)
        if (EditData.file) {
            formData.append('file', {
                name: EditData.file.name,
                type: EditData.file.type,
                uri: EditData.file.uri,
                size: EditData.file.size
            })
        }
        try {
            SetLoading(false)
            const Response = await makeRequest("POST", "profile/me", null, Token, formData, true)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                login({
                    Token: Response.data.token || null,
                    user: Response || null
                })
                Navigation.navigate("settings")
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
            const Response = await makeRequest('POST', "profile/me", null, Token, EditData, false,)
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
        <>
            <AppHeader
                {...{
                    title: "Varify code",
                    willGoBack: true
                }}
            />
            <View style={[AuthStyles.ws_auth, { backgroundColor: theme.background, }]} >
                <View style={[AuthStyles.ws_user_forget, { marginBottom: ms(4), marginTop: ms(15) }]}>
                    <Text style={[AuthStyles.ws_user_forget_text, { color: theme.text }]}>{`Please enter the code we send to your number.`}</Text>
                    <Text style={[AuthStyles.ws_user_forget_text, { color: theme.text }]}>{`+91 ${"990099XXXX" || '...'}`}</Text>
                </View>
                <View style={{marginTop:ms(5)}}>
                    {
                        FormBuilder.map((item, index) => {
                            return <CustomInput {...item} key={index} flag={"create"} />
                        })
                    }
                </View>
                <View style={{ marginTop: ms(-9) }}>
                    <SubmitButton
                        {...{
                            type: "submit",
                            title: "Submit",
                            Loading: Loading,
                            OnPress: handleSubmit(OnSubmit)
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={[AuthStyles.sa_simple_btn, {marginTop:ms(6)}]}
                    onPress={HandleResendOTP}
                    disabled={Timer > 0}
                >
                    <Text style={[AuthStyles.ws_user_forget_text, { color: theme.subtext }]}>Didn't receive otp?
                        <Text style={[AuthStyles.sa_simple_btn_text_color, { color: theme.text }]}> Resend OTP</Text>
                        {
                            Timer > 0 &&
                            <>
                                <Text style={[AuthStyles.sa_simple_btn_text_color, { color: theme.text }]}> in </Text>
                                <Text style={[AuthStyles.sa_simple_btn_text_color, { color: theme.text }]}>{Timer}s</Text>
                            </>
                        }
                    </Text>
                </TouchableOpacity>

            </View>
        </>
    )
}

export default ProfileOtpScreen

const Schema = yup.object().shape({
    otp: yup
        .string()
        .required(Formfields.otp.otp.errors.required)
        .length(
            Formfields.otp.otp.errors.pattern.value,
            Formfields.otp.otp.errors.pattern.message,
        )
})

