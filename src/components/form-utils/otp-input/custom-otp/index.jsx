/** React Import */
import React, { useState, useRef, useEffect} from 'react'
import { View, TextInput } from 'react-native'

/** Styles */
import { Colors } from '../../../../utils/styles'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Main Export */
const CustomOtp = ({
    numberOfInputs = 6,
    onOtpChange,
    styles
}) => {

    const [otp, setOtp] = useState(new Array(numberOfInputs).fill(''))
    const inputsRef = useRef([])
    const {theme}=useTheme()

    useEffect(() => {
        onOtpChange && onOtpChange(otp.join(''))
    }, [otp, onOtpChange])

    const HandleChange = (text, index) => {
        const newOtp = [...otp]
        newOtp[index] = text
        setOtp(newOtp)
        if (text && index < numberOfInputs - 1) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const HandleKeyPress = (event, index) => {
        if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp]
            newOtp[index - 1] = ''
            setOtp(newOtp)
            inputsRef.current[index - 1]?.focus()
        }
    }

    const inputs = Array.from({ length: numberOfInputs }, (_, index) => (
        <TextInput
            key={index}
            style={[styles.sa_otp_input,{backgroundColor:theme.background,color:theme.text,borderColor:theme.iconactive}]}
            value={otp[index]}
            onChangeText={(text) => HandleChange(text.toUpperCase(), index)}
            maxLength={1}
            onFocus={() => {
                const newOtp = [...otp]
                newOtp[index] = ''
                setOtp(newOtp)
            }}
            secureTextEntry={true}
            placeholder='-'
            placeholderTextColor={theme.text}
            onKeyPress={(e) => HandleKeyPress(e, index)}
            ref={(ref) => inputsRef.current[index] = ref}
        />
    ))

    return (
        <View style={styles.sa_otp_container}>
            {inputs}
        </View>
    )
}

export default CustomOtp