/** React Imports */
import React, { useRef, useState } from 'react'

/** Styles */
import { MainStackStyles } from '../../../../screens/auth/common/auth-styles'

/** Local Import */
import { WishlistSchema } from '../../../../screens/main/home-screen/helper'

/** Components */
import SubmitButton from '../../../submit-button'
import CustomInput from '../../../form-utils/custome-inputs'
import FilePicker from '../../../form-utils/file-picker'

/** Library */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { makeRequest } from '../../../../utils/make-request'
import { toast } from '../../../../utils/helpers/metrics'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../../../utils/context/AuthContext'

/** Main Export */
const NewWishlist = () => {

    const [Loading, SetLoading] = useState()
    const Navigation = useNavigation()
    const {Token} =useAuth()
    const NewWishlistRef = useRef()

    const { control, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(WishlistSchema),
    })

    const OnSubmit = async (data) => {
        SetLoading(true)
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.file) {
            formData.append('file', {
                name: data.file.fileName,
                type: data.file.type,
                uri: data.file.uri,
                size: data.file.fileSize
            })
        }
        try {
            const Response = await makeRequest("POST", "event", null, Token, formData, true)
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
        } catch (error) {
            toast("error", {
                title: 'Something went wrong!'
            })
        }
        SetLoading(false)
    }

    const FormBuilder = [
        {
            name: 'file',
            parent: 'new_wishlist',
            type: 'image_pick',
            control,
            label: false,
            placeholder: false,
            styles: MainStackStyles,
            BottomSheetRef: NewWishlistRef
        },
        {
            name: 'name',
            parent: 'new_wishlist',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
    ]

    return (
        <>
            {FormBuilder.map((item, index) => {
                if (item.type == "text") {
                    return <CustomInput {...item} key={index} flag={"create"} />
                }
                if (item.type == "image_pick") {
                    return <FilePicker {...item} key={index} />
                }
            })}
            <SubmitButton
                {...{
                    type: "submit",
                    title: "common.submit",
                    Loading: Loading,
                    OnPress: handleSubmit(OnSubmit)
                }}
            />
        </>

    )
}

export default NewWishlist


