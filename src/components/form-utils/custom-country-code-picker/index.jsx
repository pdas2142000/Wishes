/** React Import */
import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform
} from 'react-native'

/** Library */
import { Controller } from 'react-hook-form'
import CountryPicker from 'react-native-country-picker-modal'

/** Local Import */
import Formfields from '../../../utils/models/FormFields.json'

/** Local Import */
import { ms } from '../../../utils/helpers/metrics'
import { AppCommonStyle, Colors, Fonts } from '../../../utils/styles'
import { useLanguage } from '../../../utils/context/LanguageContext'
import { useTheme } from '../../../utils/context/ThemeContext'

/** Main  Import */
const CustomCountryCodePicker = ({
    name,
    parent,
    control,
    label,
    styles,
    setCallingCode
}) => {
    const { translate } = useLanguage()
    const { theme } = useTheme()

    const Fields = Formfields
    const FieldName = parent ? Fields[parent][name] : Fields[name]
    const [selectedCountry, setSelectedCountry] = useState({ cca2: 'IN', callingCode: ['91'] })
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
        setCallingCode(`+${selectedCountry.callingCode[0]}`)
    }, [setCallingCode, selectedCountry])

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
                const errorMessage = error ? (error.message ? error.message : error) : ''
                return (
                    <View style={styles.formCont}>
                        {label ? <Text style={[styles.ws_lable, { color: theme.text }]}>{translate(FieldName?.label)}</Text> : null}
                        <View style={[
                            styles.wrapper,
                            errorMessage ? styles.ws_error_border : null, 
                            {backgroundColor: theme.card_bg}
                        ]}
                        >
                            <View style={[styles.input_field_wrap,]}>
                                {selectedCountry && (
                                    <View style={[styles.input_country_code,AppCommonStyle.ws_common_size_country]}>
                                        <Text style={[styles.countryName, { color: theme.text }]}>+{selectedCountry.callingCode}</Text>
                                    </View>
                                )}
                                <View style={{ marginRight: ms(-10) }}>
                                    <CountryPicker
                                        style={styles.input_field}
                                        withFilter
                                        countryCode={selectedCountry.cca2}
                                        onSelect={(country) => {
                                            setSelectedCountry(country)
                                            setCallingCode(`+${country.callingCode[0]}`)
                                        }}
                                        filterProps={{
                                            style: customStyles.filterInput
                                        }}
                                    />
                                </View>
                            </View>
                            <TextInput
                                style={[styles.input_field, styles.ws_contryCode,AppCommonStyle.ws_common_size_number, { color: theme.text }]}
                                value={value}
                                placeholder={translate(FieldName?.placeholder)}
                                onBlur={onBlur}
                                onFocus={onBlur}
                                onChangeText={(text) => {
                                    setPhoneNumber(text)
                                    onChange(text)
                                }}
                                placeholderTextColor={theme.subtext}
                                autoCapitalize="none"
                                keyboardType={"number-pad"}
                            />
                        </View>
                        {errorMessage ? (
                            <Text style={styles.ws_error}>{translate(errorMessage)}</Text>
                        ) : null}
                    </View>
                )
            }}
        />
    )
}

export default CustomCountryCodePicker

const customStyles = StyleSheet.create({
    filterInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingLeft: ms(10),
        marginRight: ms(20),
        height: ms(45),
        flex: 1,
        fontFamily: Fonts.Font_600,
        color: Colors.ws_black
    },
})