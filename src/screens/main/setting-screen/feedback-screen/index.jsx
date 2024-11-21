/** React Import */
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

/** Component*/
import CustomInput from '../../../../components/form-utils/custome-inputs'
import AppHeader from '../../../../components/header'
import SubmitButton from '../../../../components/submit-button'

/** Styles */
import { Colors } from '../../../../utils/styles'
import { MainStackStyles } from '../../../auth/common/auth-styles'

/** Libraries */
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigation } from '@react-navigation/native'

/** Local Import */
import { useAuth } from '../../../../utils/context/AuthContext'
import { makeRequest } from '../../../../utils/make-request'
import { ms, toast } from '../../../../utils/helpers/metrics'
import Formfields from '../../../../utils/models/FormFields.json'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Main Export */
const FeedbackScreen = () => {

    const { Token } = useAuth()
    const { theme } = useTheme()
    const Navigation = useNavigation()

    const [IsLoading, SetIsLoading] = useState(false)

    const { reset, control, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(Schema),
    })

    /** 
     * Form submit
     * @param {form data} data 
     */
    const OnSubmit = async data => {
        SetIsLoading(true)
        try {
            const RateResponse = await makeRequest('POST', 'feedback', null, Token, data)
            if (RateResponse.success === 1) {
                toast("success", {
                    title: RateResponse.message,
                });
                Navigation.goBack()
            } else if (RateResponse.success === 0) {
                toast("error", {
                    title: RateResponse.message,
                });
            }
            reset()
        } catch (error) {
            console.log(error)
        } finally {
            SetIsLoading(false)
        }
    }

    const FormBuilder = [
        {
            name: 'subject',
            parent: 'feedback',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'message',
            parent: 'feedback',
            type: 'textarea',
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
                    title: "common.feedback",
                    willGoBack: true
                }}
            />
            <View style={[styles.ws_container, { backgroundColor: theme.background }]}>
                {FormBuilder.map((item, index) => {
                    return <CustomInput {...item} key={index} flag="create" />
                })}
                <SubmitButton
                    {...{
                        type: "submit",
                        title: "common.submit",
                        Loading: IsLoading,
                        OnPress: handleSubmit(OnSubmit)
                    }}
                />
            </View>
        </>
    )
}

export default FeedbackScreen

const styles = StyleSheet.create({
    ws_container: {
        flex: 1,
        backgroundColor: Colors.ws_bg,
        paddingHorizontal: ms(15),
        paddingVertical: ms(15)
    }
})

const Schema = yup.object().shape({
    subject: yup
        .string()
        .required(Formfields.feedback.subject.errors.required)
        .min(
            Formfields.feedback.subject.errors.minLength.value,
            Formfields.feedback.subject.errors.minLength.message
        )
        .max(
            Formfields.feedback.subject.errors.maxLength.value,
            Formfields.feedback.subject.errors.maxLength.message
        ),

    message: yup
        .string()
        .required(Formfields.feedback.message.errors.required)
        .min(
            Formfields.feedback.message.errors.minLength.value,
            Formfields.feedback.message.errors.minLength.message
        )
        .max(
            Formfields.feedback.message.errors.maxLength.value,
            Formfields.feedback.message.errors.maxLength.message
        ),

})
