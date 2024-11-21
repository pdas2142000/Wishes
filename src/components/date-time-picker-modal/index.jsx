/** React Imports */
import React, { useState } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

/** Local Imports */
import { MainStackStyles } from '../../screens/auth/common/auth-styles'
import { ms } from '../../utils/helpers/metrics'
import { Colors, Fonts } from '../../utils/styles'
import { useLanguage } from '../../utils/context/LanguageContext'
import { useTheme } from '../../utils/context/ThemeContext'

/** Libraries */
import { Controller } from 'react-hook-form'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { DateTime } from 'luxon'

/** Main Export */
export const DatePickerModal = ({ control, name }) => {
    const { theme } = useTheme()
    const { translate } = useLanguage()

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

    const ShowDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const HideDatePicker = () => {
        setDatePickerVisibility(false)
    }

    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                    const HandleDateConfirm = (date) => {
                        setDatePickerVisibility(false)
                        onChange(date)
                    }
                    const Date = DateTime.fromJSDate(value).toFormat('MMMM d, yyyy')

                    return (
                        <>
                            <Text style={[MainStackStyles.ws_lable, { color: theme.text }]}>{translate("EventDetailsScreen.date")}</Text>
                            <TouchableOpacity style={[MainStackStyles.wrapper, { backgroundColor: theme.card_bg }]} onPress={ShowDatePicker} >
                                {
                                    value ?
                                        <Text style={[styles.ws_datepicker_text, { color: theme.text }]}>
                                            {value ? Date : "select date"}
                                        </Text> :
                                        <Text style={[styles.ws_datepicker_text, { color: theme.subtext }]}>
                                            {translate("EventDetailsScreen.selectDate")}
                                        </Text>
                                }
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={HandleDateConfirm}
                                onCancel={HideDatePicker}
                                confirmTextIOS={translate("common.confirm")}
                                cancelTextIOS={translate("common.cancel")}
                                headerTextIOS={translate("common.selectDate")}
                            />
                        </>
                    )
                }}
            />
        </>
    )
}

/** Main Export */
export const TimePickerModal = ({ control, name }) => {

    const { theme } = useTheme()
    const { translate } = useLanguage()

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false)

    const HideTimePicker = () => {
        setTimePickerVisibility(false)
    }

    const ShowTimePicker = () => {
        setTimePickerVisibility(true)
    }

    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                    const HandleTimeConfirm = (time) => {
                        setTimePickerVisibility(false)
                        onChange(time)
                    }
                    const Time = DateTime.fromJSDate(value).toFormat("hh:mm a")

                    return (
                        <>
                            <Text style={[MainStackStyles.ws_lable, { color: theme.text }]}>
                                {translate("EventDetailsScreen.time")}
                                <Text style={[MainStackStyles.ws_optional_text, { color: theme.text }]}>({translate("common.optional")})</Text>
                            </Text>
                            <TouchableOpacity style={[MainStackStyles.wrapper, { backgroundColor: theme.card_bg }]} onPress={ShowTimePicker} >
                                {
                                    value ?
                                        <Text style={[styles.ws_datepicker_text, { color: theme.text }]}>
                                            {value ? Time : "select date"}
                                        </Text> :
                                        <Text style={[styles.ws_datepicker_text, { color: theme.subtext }]}>
                                            {translate("EventDetailsScreen.selectTime")}
                                        </Text>
                                }
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={HandleTimeConfirm}
                                onCancel={HideTimePicker}
                                confirmTextIOS={translate("common.confirm")}
                                cancelTextIOS={translate("common.cancel")}
                                headerTextIOS={translate("common.selectTime")}
                                timeZoneName='utc'
                            />
                        </>
                    )
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    ws_datepicker_text: {
        fontSize: ms(13),
        fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
        paddingLeft: ms(6)
    }
}) 
