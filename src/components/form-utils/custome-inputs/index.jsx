/**React Import */
import React from 'react'
import { View, Text, TextInput, Platform } from 'react-native'

/**Component */
import Formfields from '../../../utils/models/FormFields.json'

/** Library */
import { Controller } from 'react-hook-form'

/**Local Import */
import { IconProps } from '../../../utils/helpers/Iconprops'

/** Styles */
import { AppCommonStyle, Colors } from '../../../utils/styles'
import { ms } from '../../../utils/helpers/metrics'
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'

/** Main Export */
const CustomInput = ({
    name,
    parent,
    control, 
    type,
    label, 
    styles,
    Icon,
    keyboardType,
    flag,
}) => {
    const { theme } = useTheme()
    const { translate } = useLanguage()

    const Fields = Formfields
    const FieldName = parent ? Fields[parent][name] : Fields[name]

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
                const errorMessage = error
                    ? error.message
                        ? error.message
                        : error
                    : ''
                return (
                    <View style={styles.formCont}>
                        {label ?
                            <View style={styles.ws_lable_optional}>
                                <Text style={[styles.ws_lable, { color: theme.text }]}>{translate(FieldName?.label)}</Text>
                                {
                                    FieldName?.optional ?
                                        <Text style={[styles.ws_optional_text, { color: theme.text }]}>
                                            ({translate(FieldName?.optional)})
                                        </Text> : null
                                }
                            </View>
                            : null}
                        <View
                            style={[
                                styles.wrapper,
                                type === 'textarea' ? styles.ws_textarea_wrapper : null,
                                errorMessage ? styles.ws_error_border : null,
                                {backgroundColor:theme.card_bg}
                            ]}
                        >
                            {Icon && (
                                <View style={{ marginTop: ms(-3) }} >
                                    <Icon {...IconProps(18)} fill={theme.text} />
                                </View>
                            )}
                            <TextInput
                                style={[
                                    styles.input_field,
                                    type === 'textarea' ? styles.textarea : null,
                                    {
                                        marginLeft: flag === 'create' ? ms(-5) : null,
                                        color: theme.text,
                                        marginBottom:Platform.OS === "android"?ms(-2):null
                                    }
                                ]}
                                placeholder={translate(FieldName?.placeholder)}
                                value={value || ''}
                                onBlur={onBlur}
                                onFocus={onBlur} 
                                onChangeText={onChange}
                                placeholderTextColor={theme.subtext} 
                                autoCapitalize="none"
                                multiline={type == 'textarea' ? true : false}
                                keyboardType={keyboardType}
                                secureTextEntry={type === 'password'}
                            />
                        </View>
                        {errorMessage ? (
                            <Text style={styles.ws_error} numberOfLines={1} ellipsizeMode="tail">
                                {translate(errorMessage)}
                            </Text>
                        ) : null
                        }
                    </View>
                )
            }}
        />
    )
}

export default CustomInput
