/** React Import */
import React, { useState } from 'react'
import { Text, View, Switch } from 'react-native'

/** Library */
import { Controller } from 'react-hook-form'

/** Local Import */
import Formfields from '../../../utils/models/FormFields.json'

/** Styles */
import { Colors } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'

/** Main Export */
const ToggleSwitch = ({ 
    name,
    parent,
    control,
    styles,
}) => {

    const [is24Hour, setIs24Hour] = useState(true);
    const { theme } = useTheme()

    const toggleSwitch = (onChange) => {
        const newFormat = !is24Hour ? "HH:mm" : "hh:mm";
        setIs24Hour((previousState) => !previousState);
        onChange(newFormat);
    };

    const Formfield = Formfields
    const FieldName = parent ? Formfield[parent][name] : Formfield[name]

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={is24Hour ? "HH:mm" : "hh:mm"}
            render={({ field: { value, onChange }, fieldState: { error } }) => {

                return (
                    <>
                        <View style={styles.ws_toggle_box}>
                            <Text style={[styles.ws_toggle_text, {color:theme.text}]}>24-Hours</Text>
                            <Switch
                                trackColor={{ false: "red", true: '#6dd005' }}
                                thumbColor={"#f4f3f4"}
                                ios_backgroundColor={Colors.ws_gray}
                                onValueChange={() => toggleSwitch(onChange)}
                                value={is24Hour}
                            />
                        </View>
                        {error ? <Text style={styles.error} numberOfLines={1} ellipsizeMode='tail'>{error.message}</Text> : null}
                    </>
                )
            }}
        />
    )
}

export default ToggleSwitch
