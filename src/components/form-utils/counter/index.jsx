/** React Import */
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

/** Library */
import { Controller } from 'react-hook-form'

/** Local Import */
import Formfields from '../../../utils/models/FormFields.json'

/** Styles */
import { ms } from '../../../utils/helpers/metrics'
import { Colors, Fonts } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'

/** Main Export */
const Counter = ({
    name,
    parent,
    control,
    label,
    type,
    styles,
    wish_bank,
}) => {
    const { theme } = useTheme()
    const { translate } = useLanguage()

    const Formfield = Formfields
    const FieldName = parent ? Formfield[parent][name] : Formfield[name]

    const handleIncrease = (value, onChange) => {
        const newValue = value + 1
        onChange(newValue)
    }

    const handleDecrease = (value, onChange) => {
        if (value > 1) {
            const newValue = value - 1
            onChange(newValue)
        }
    }
    const defaultValue = wish_bank === "wish_bank" ? 0 : 1
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({ field: { value, onChange }, fieldState: { error } }) => {

                return (
                    <View style={{ marginBottom: ms(13),alignItems:type === "gift"? "center" :null}}>
                        {label ? (
                            <Text style={[styles.ws_lable, { color: theme.text }]}>{translate(FieldName?.label)}</Text>
                        ) : null}
                        <View
                            style={[
                                CounterStyle.ws_container,
                                {
                                    backgroundColor: theme.card_bg,
                                    height: type == "gift" ? ms(48) :ms(40) ,
                                    width: "50%"
                                }
                            ]}>
                            <TouchableOpacity
                                style={[CounterStyle.ws_counter_increse, { backgroundColor: theme.card_bg, borderColor: theme.border }]}
                                onPress={() => handleDecrease(value, onChange)}
                            >
                                <Text style={[CounterStyle.ws_counter_text, { color: theme.text }]}>-</Text>
                            </TouchableOpacity>

                            <View style={[CounterStyle.ws_content_box, { backgroundColor: theme.card_bg, }]}>
                                <Text style={[CounterStyle.ws_content_text, { color: theme.text }]} >{value}</Text>
                            </View>

                            <TouchableOpacity style={[CounterStyle.ws_counter_decrese, { backgroundColor: theme.card_bg, borderColor: theme.border }]} onPress={() => handleIncrease(value, onChange)}>
                                <Text style={[CounterStyle.ws_counter_text, { color: theme.text }]}>+</Text>
                            </TouchableOpacity>
                        </View>
                        {error ? <Text style={styles.error} numberOfLines={1} ellipsizeMode='tail'>{error.message}</Text> : null}
                    </View>
                )
            }}
        />
    )
}

export default Counter

const CounterStyle = StyleSheet.create({
    ws_container: {
        backgroundColor: "white",
        borderRadius: ms(8),
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center"
    },
    ws_counter_increse: {
        width: "30%",
        height: "100%",
        backgroundColor: "#334eb1",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: ms(.8),
    },
    ws_content_box: {
        width: "40%",
        height: "100%",
        backgroundColor: Colors.ws_white,
        alignItems: "center",
        justifyContent: "center"
    },
    ws_content_text: {
        color: Colors.ws_black,
        fontFamily: Fonts.Font_500,
        fontSize: ms(16)
    },
    ws_counter_decrese: {
        width: "30%",
        height: "100%",
        backgroundColor: "#334eb1",
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: ms(.8),
    },
    ws_counter_text: {
        color: Colors.ws_white,
        fontFamily: Fonts.Font_500,
        fontSize: ms(17)
    }
})