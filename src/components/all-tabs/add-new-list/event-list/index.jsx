/** React Imports */
import React, { useRef, useState } from 'react'
import { View } from 'react-native'

/** Components */
import CustomInput from '../../../form-utils/custome-inputs'
import SubmitButton from '../../../submit-button'
import { DatePickerModal, TimePickerModal } from '../../../date-time-picker-modal'
import FilePicker from '../../../form-utils/file-picker'

/** Libraries */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment-timezone'

/** Styles */
import { MainStackStyles } from '../../../../screens/auth/common/auth-styles'

/** Local Import */
import { EventSchema } from '../../../../screens/main/home-screen/helper'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import { ms, toast } from '../../../../utils/helpers/metrics'

/** Main Export */
const EventList = () => {
    const { Token } = useAuth()
    const NewEventRef = useRef()
    const Navigation = useNavigation()

    const [Loading, SetLoading] = useState()

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(EventSchema),
    })

    /**
     * Submit form 
     * @param {Data} data 
     */
    const OnSubmit = async (data) => {
        SetLoading(true)
        const formattedDate = moment(data.date, "DD/MM/YYYY").format("YYYY-MM-DD")
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append("date", formattedDate)
        formData.append("venue", data.venue)
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
            parent: 'add_wish',
            type: 'image_pick',
            control,
            label: false,
            placeholder: false,
            styles: MainStackStyles,
            BottomSheetRef: NewEventRef
        },
        {
            name: 'name',
            parent: 'new_event',
            type: 'text',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'date',
            parent: 'new_event',
            type: 'date',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'time',
            parent: 'new_event',
            type: 'time',
            control,
            label: true,
            placeholder: true,
            styles: MainStackStyles,
        },
        {
            name: 'venue',
            parent: 'new_event',
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
                if (item.type === "text") {
                    return <CustomInput {...item} key={index} flag={"create"} />
                }
                if (item.type === "date") {
                    return (
                        <View key={index} >
                            <DatePickerModal {...item} key={index} />
                        </View>
                    )
                }
                if (item.type === "time") {
                    return (
                        <View key={index} style={{ marginVertical: ms(10) }}>
                            <TimePickerModal {...item} key={index} />
                        </View>
                    )
                }
                if (item.type === "image_pick") {
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

export default EventList
