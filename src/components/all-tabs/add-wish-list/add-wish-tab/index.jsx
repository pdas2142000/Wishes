/** React Import */
import React, { useRef, useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View
} from 'react-native'

/** Styles */
import { MainStackStyles } from '../../../../screens/auth/common/auth-styles'

/** Library */
import { useForm, } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/** Component */
import CustomInput from '../../../form-utils/custome-inputs'
import Counter from '../../../form-utils/counter'
import SubmitButton from '../../../submit-button'

/** Local Import */
import Formfields from '../../../../utils/models/FormFields.json'
import FilePicker from '../../../form-utils/file-picker'
import { useAuth } from '../../../../utils/context/AuthContext'
import { makeRequest } from '../../../../utils/make-request'
import { useNavigation } from '@react-navigation/native'
import { ms, toast } from '../../../../utils/helpers/metrics'

/** Main Export */
const AddWishTab = ({ wish_bank, EventId }) => {

    const WishBankRef = useRef()
    const { Token } = useAuth()
    const Navigation = useNavigation()

    const [Loading, SetLoading] = useState(false)

    const { control, handleSubmit,formState: { errors } } = useForm({
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
     * @param {Dta} data 
     */
    const OnSubmit = async (data) => {
        SetLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append("quantity", data.quantity)
            EventId && formData.append("event_id", EventId)
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
            const WishResponse = await makeRequest("POST", "wish", null, Token, formData, true)
            if (WishResponse.success === 1) {
                toast("success", {
                    title: WishResponse.message,
                })
                Navigation.navigate('me', { tab: "Wishes" })
            }
        } catch (error) {
            console.log(error)
        } finally {
            SetLoading(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={120}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginTop: ms(7) }}>

                    {FormBuilder.map((item, index) => {
                        if (item.type === 'quantity') {
                            return <Counter {...item} key={index} wish_bank={wish_bank} />
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
        </SafeAreaView>
    )
}

export default AddWishTab

const styles = StyleSheet.create({

})

const Schema = yup.object().shape({
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
