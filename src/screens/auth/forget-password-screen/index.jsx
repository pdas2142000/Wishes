/** React Import */
import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View} from 'react-native'

/** Local Import */
import Formfields from '../../../utils/models/FormFields.json'
import { ms, toast } from '../../../utils/helpers/metrics'
import { IconProps } from '../../../utils/helpers/Iconprops'
import { useLanguage } from '../../../utils/context/LanguageContext'
import { useTheme } from '../../../utils/context/ThemeContext'

/** Library */
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigation } from '@react-navigation/native'

/** Components */
import SubmitButton from '../../../components/submit-button'
import { makeRequest } from '../../../utils/make-request'
import CustomCountryCodePicker from '../../../components/form-utils/custom-country-code-picker'

/** Styles */
import { AuthStyles, MainStackStyles } from '../common/auth-styles'

/** Icons */
import InfoIcon from "../../../../assets/svgs/info.svg"
import LeftIcon from "../../../../assets/svgs/left.svg"

/** Main Export */
const ForgotScreen = () => {

	const Navigation = useNavigation()
	const { translate } = useLanguage()
	const { theme } = useTheme()

	const [Loading, SetLoading] = useState(false)
	const [callingCode, setCallingCode] = useState('')
	const { reset, control, handleSubmit } = useForm({
		resolver: yupResolver(Schema),
	})

	const FormBuilder = [
		{
			name: 'phone',
			parent: 'reset',
			type: 'select',
			control,
			label: false,
			placeholder: true,
			styles: MainStackStyles,
			setCallingCode
		},
	]

	/** 
	 * Form submit function
	 * @param {form data} data 
	 */
	const OnSubmit = async data => {
		SetLoading(true)
		const NewData = { ...data, country: callingCode }
		try {
			const Response = await makeRequest("POST", "password/forget/otp", null, null, NewData, false)
			if (Response.success === 2) {
				toast("success", {
					title: Response.message,
				})
				Navigation.navigate("otp", { data: data, type: "reset" })
			} else if (Response.success === 0) {
				toast("error", {
					title: Response.message,
				})
			}
			reset()
		} catch (error) {
			console.log(error)
		} finally {
			SetLoading(false)
		}
	}

	return (
		<View style={[AuthStyles.ws_auth, { backgroundColor: theme.background }]}>
			<SafeAreaView />
			<View style={AuthStyles.ws_header}>
				<Text style={[AuthStyles.ws_header_text, { color: theme.text }]}>{translate("ForgotPassword.heading")}</Text>
			</View>
			<View style={[AuthStyles.ws_forget_box, { backgroundColor: theme.card_bg, borderColor: theme.border }]}>
				<InfoIcon {...IconProps(ms(13))} fill={theme.iconactive} />
				<Text style={[AuthStyles.ws_forget_text, { color: theme.subtext }]}>{translate("ForgotPassword.forgotPasswordExplainLine")}</Text>
			</View>
			{FormBuilder.map((item, index) => {
				return <CustomCountryCodePicker {...item} key={index} />
			})}
			<SubmitButton
				{...{
					type: "reset",
					title: "ForgotPassword.sendConfirmationCode",
					Loading: Loading,
					OnPress: handleSubmit(OnSubmit)
				}}
			/>
			<TouchableOpacity style={AuthStyles.ws_button} onPress={() => Navigation.goBack()}>
				<LeftIcon {...IconProps(ms(22))} fill={theme.text} />
				<Text style={[AuthStyles.ws_user_forget_text, { color: theme.text, marginLeft: ms(5) }]}>{translate("common.backLogin")}</Text>
			</TouchableOpacity>
		</View>
	)
}

export default ForgotScreen

const NumberRgx = /^[1-9]\d{9}$/
const Schema = yup.object().shape({
	phone: yup
		.string()
		.matches(NumberRgx, Formfields.reset.phone.errors.pattern)
		.required(Formfields.reset.phone.errors.required),
})