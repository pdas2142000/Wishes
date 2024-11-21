/** React Import */
import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'

/** Component */
import Counter from '../../form-utils/counter'
import FilePicker from '../../form-utils/file-picker'
import CustomInput from '../../form-utils/custome-inputs'
import SubmitButton from '../../submit-button'
import AppHeader from '../../header'

/** Styles */
import { AppCommonStyle } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'
import { MainStackStyles } from '../../../screens/auth/common/auth-styles'

/** Libraries  */
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import Formfields from '../../../utils/models/FormFields.json'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useIsFocused, useNavigation } from '@react-navigation/native'

/** Local Imports */
import { ms, toast } from '../../../utils/helpers/metrics'
import { makeRequest } from '../../../utils/make-request'
import { useAuth } from '../../../utils/context/AuthContext'

/** Main Export */
const WishBankAddNew = ({ route }) => {

    const { Data, type } = route.params || {}
    const { theme } = useTheme()
    const WishBankRef = useRef()
    const Navigation = useNavigation()
    const isFocused = useIsFocused()
    const { Token } = useAuth()

    const [Loading, SetLoading] = useState(false)
    const [SingleData, setSingleData] = useState(null)

    const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(Schema),
    })

    const FormBuilder = [
        {
            name: 'file',
            parent: 'add_wish',
            type: 'image_pick',
            control,
            label: false,
            placeholder: false,
            styles: MainStackStyles,
            BottomSheetRef: WishBankRef
        },
        {
            name: 'name',
            parent: 'add_wish',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles
        },
        {
            name: 'quantity',
            parent: 'add_wish',
            type: 'quantity',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'url',
            parent: 'add_wish',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'description',
            parent: 'add_wish',
            type: 'textarea',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    /**
     * Submit form
     * @param {Data} data 
     */
    const OnSubmit = async (data) => {
        SetLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', data.name)
            data.quantity && formData.append("quantity", parseInt(data.quantity))
            data.description && formData.append("description", data.description)
            data.url && formData.append("url", data.url)
            if (data.file) {
                formData.append('file', {
                    name: data.file.fileName,
                    type: data.file.type,
                    uri: data.file.uri,
                    size: data.file.fileSize
                })
            }
            const Methord = type == "edit_wishes" ? "PUT" : "POST"
            const Url = type == "edit_wishes" ? `wish/${Data.slug}` : "wish"

            const WishResponse = await makeRequest(Methord, Url, null, Token, formData, true)

            if (WishResponse.success === 1) {
                toast("success", {
                    title: WishResponse.message,
                })
                reset();
                Navigation.navigate("me");
            } else {
                toast("error", {
                    title: WishResponse.message,
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            SetLoading(false)
        }
    }

    /**
     * Get data
     */
    const GetData = async () => {
        try {
            const Response = await makeRequest("GET", `wish/${Data.slug}`, null, Token)
            setSingleData(Response.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        GetData()
    }, [isFocused]);

    /**
     * Set data
     */
    useEffect(() => {
        if (type && SingleData) {
            setValue("name", SingleData?.name)
            setValue("file", SingleData?.$avatar_url)
            setValue("quantity", SingleData?.quantity == null ? "0" : SingleData?.quantity)
            setValue("url", SingleData?.url)
            setValue("description", SingleData?.description)
        }
    }, [type, SingleData])

    return (
        <>
            <AppHeader 
                {...{
                    title: type === "edit_wishes" ? "common.editWishes" : "common.addNew",
                    willGoBack: true
                }}
            />
            <View style={[AppCommonStyle.ws_main_container, { backgroundColor: theme.background }]}>
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    extraScrollHeight={Platform.OS === "ios" ? 115 : 170}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: ms(7) }}>
                        {FormBuilder.map((item, index) => {
                            if (item.type === 'quantity') {
                                return <Counter {...item} key={index} />
                            } else if (item.type === "image_pick") {
                                return <FilePicker {...item} key={index} />
                            }
                            return <CustomInput {...item} key={index} />
                        })}
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
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </>
    )
}

export default WishBankAddNew

const styles = StyleSheet.create({

})

const Schema = yup.object().shape({
    // file: yup
    //     .string()
    //     .required(Formfields.add_wish.file.errors.required),
    name: yup
        .string()
        .required(Formfields.add_wish.name.errors.required)
        .min(
            Formfields.add_wish.name.errors.minLength.value,
            Formfields.add_wish.name.errors.minLength.message
        )
        .max(
            Formfields.add_wish.name.errors.maxLength.value,
            Formfields.add_wish.name.errors.maxLength.message
        ),
})