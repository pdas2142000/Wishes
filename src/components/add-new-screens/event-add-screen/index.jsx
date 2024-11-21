/** React Imports */
import React, { useEffect, useRef, useState } from 'react'
import { Platform, View } from 'react-native'

/** Components */
import AppHeader from '../../header'
import FilePicker from '../../form-utils/file-picker'
import SubmitButton from '../../submit-button'
import CustomInput from '../../form-utils/custome-inputs'
import { DatePickerModal, TimePickerModal } from '../../date-time-picker-modal'

/** Local Imports */
import { MainStackStyles } from '../../../screens/auth/common/auth-styles'
import { EventSchema } from '../../../screens/main/home-screen/helper'
import { AppCommonStyle } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'
import { ms, toast } from '../../../utils/helpers/metrics'
import { useAuth } from '../../../utils/context/AuthContext'
import { makeRequest } from '../../../utils/make-request'

/** Libraries */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment-timezone'
import { DateTime } from 'luxon'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/** Main Export */
const EventAddScreen = ({ route }) => {
    const { Data, type } = route.params || {}

    const { theme } = useTheme()
    const NewEventRef = useRef()
    const { Token } = useAuth()
    const Navigation = useNavigation()

    const [Loading, SetLoading] = useState(false)
    const [SingleEvent, setSingleEvent] = useState({})

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(EventSchema),
    })

    /**
     * Submit form
     * @param {Data} data 
     */
    const OnSubmit = async (data) => {
        SetLoading(true)
        const formattedDate = moment(data.date, "DD/MM/YYYY").format("YYYY-MM-DD")
        const Time = DateTime.fromJSDate(data.time).toFormat("hh:mm a")
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append("date", formattedDate)
        data.venue && formData.append("venue", data.venue)
        formData.append("time", Time)
        if (data.file) {
            formData.append('file', {
                name: data.file.fileName,
                type: data.file.type,
                uri: data.file.uri,
                size: data.file.fileSize
            })
        }
        try {
            const requestMethod = type === "event_edit" ? 'PUT' : 'POST'
            const requestURL = type === "event_edit" ? `event/${Data.slug}` : 'event'

            const Response = await makeRequest(requestMethod, requestURL, null, Token, formData, true)

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

    /**
     * Get data
     */
    const GetSingleEvent = async () => {
        const Response = await makeRequest("GET", `event/${Data.slug}`, null, Token)
        setSingleEvent(Response.data)
    }
    useEffect(() => {
        if (type) {
            GetSingleEvent()
        }
    }, [type])

    const Time = moment(SingleEvent.time, 'hh:mm A').toDate();

    /**
     * Set all value
     */
    useEffect(() => {
        if (type && SingleEvent) {
            setValue("name", SingleEvent.name)
            setValue("file", SingleEvent.$avatar_url)
            setValue("date", new Date(SingleEvent.date))
            setValue("venue", SingleEvent.venue)
            setValue("time", SingleEvent.time != null ? Time : "")
        }
    }, [type, SingleEvent])

    return (
        <>
            <AppHeader
                {...{
                    title: type === "event_edit" ? "Edit Event" : "common.addNew",
                    willGoBack: true
                }}
            />
            <View style={[AppCommonStyle.ws_main_container, { backgroundColor: theme.background }]}>
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    extraScrollHeight={Platform.OS === "ios" ? 20 : 160}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
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
                </KeyboardAwareScrollView>

            </View>
        </>
    )
}

export default EventAddScreen
