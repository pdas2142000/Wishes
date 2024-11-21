/** React Import */
import { View, Text } from 'react-native'

/** Library */
import { Controller } from 'react-hook-form'

/** Component */
import CustomOtp from './custom-otp'

/** Local Import */
import Formfields from '../../../utils/models/FormFields.json'
import { ms } from '../../../utils/helpers/metrics'

/** Main Export */
const OtpInput = ({
    name,
    parent,
    control,
    label,
    type,
    styles
}) => {

    const Fields = Formfields
    const FieldName = parent ? (Fields[parent])[name] : Fields[name]

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
                        {label ? (
                            <Text style={styles.ws_lable}>{FieldName?.label}</Text>
                        ) : null}
                        <CustomOtp
                            {...{
                                numberOfInputs: 6,
                                onOtpChange: (code) => onChange(code.toUpperCase()),
                                type,
                                styles
                            }}
                        />
                        {
                            errorMessage ?
                                <Text
                                    style={[styles.ws_error, {marginLeft:ms(3), marginTop:ms(-8)}]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {errorMessage}
                                </Text> : null
                        }
                    </View>
                )
            }}
        />
    )
}

export default OtpInput

