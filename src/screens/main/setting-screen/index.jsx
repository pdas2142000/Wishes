/** React Imports */
import React, { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View, Dimensions } from 'react-native'

/** Local Imports */
import { ms, toast } from '../../../utils/helpers/metrics'
import { IconProps } from '../../../utils/helpers/Iconprops'
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'
import { useAuth } from '../../../utils/context/AuthContext'
import { AllTheme, Data, languageData, setting_styles } from './SettingHelper'

/** Components*/
import ActionSheet from '../../../components/action-sheet'
import AppHeader from '../../../components/header'

/** Icons */
import TrashIcon from "../../../../assets/svgs/trash.svg"
import PowerIcon from "../../../../assets/svgs/power.svg"

/** Library */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { makeRequest } from '../../../utils/make-request'
import DeviceInfo from 'react-native-device-info';

const languageNames = {
	en: 'English',
	da: 'Danske', 
}

const screenHeight = Dimensions.get('window').height;

const SettingSheetHeight = screenHeight > 800 ? screenHeight * 0.44 : screenHeight * 0.55;
const SettingSheetHeightTwo = screenHeight > 800 ? screenHeight * 0.35 : screenHeight * 0.42;

/** Main Export */
const SettingScreen = () => {

	const { logout, Token, } = useAuth()
	const Navigation = useNavigation()
	const LanguageRef = useRef()
	const ThemeRef = useRef()
	const LogoutRef = useRef()
	const DeleteRef = useRef()
	const isFocused = useIsFocused()

	const { changeTheme, theme } = useTheme()
	const { translate, language, changeLanguage } = useLanguage()
	const styles = setting_styles

	const [ProfileInfo, SetProfileInfo] = useState(null)

	const appVersion = DeviceInfo.getVersion();

	/**
	 * All seting buttons
	 * @param {button} item 
	 */
	const HandleClick = (item) => {
		if (item.type == "language") {
			HandleLanguageSheet()
		} else if (item.type == "theme") {
			HandleThemeSheet()
		} else if (item.type == "rate") {
		} else {
			Navigation.navigate(item.nav)
		}
	}

	/**
	 * language action sheet open
	 */
	const HandleLanguageSheet = () => {
		if (LanguageRef.current) {
			LanguageRef.current.snapToIndex(0)
		}
	}

	/**
	 * Theme action sheet open
	 */
	const HandleThemeSheet = () => {
		if (ThemeRef.current) {
			ThemeRef.current.snapToIndex(0)
		}
	}

	/**
	 * logout action sheet open
	 */
	const HandleLogSheet = () => {
		if (LogoutRef.current) {
			LogoutRef.current.snapToIndex(0)
		}
	}
	/**
	 * logout action sheet open
	 */
	const HandleDeleteSheet = () => {
		if (DeleteRef.current) {
			DeleteRef.current.snapToIndex(0)
		}
	}

	/**
	 * Change language
	 * @param {language} item 
	 */
	const HandleLanguageSelect = (item) => {
		changeLanguage(item.value)
	}

	/**
	 * Update theme mode
	 * @param {theme mode} item 
	 */
	const HandleThemeSelect = (item) => {
		changeTheme(item.text)
	}

	/**
	 * Theme change 
	 */
	useEffect(() => {
		HandleThemeSelect({ text: theme.themeMode })
	}, [theme.themeMode])

	/**
	 * Delete user account
	 */
	const HandleAccountDelete = async () => {
		try {
			const DeleteResponse = await makeRequest("DELETE", "user/delete", null, Token)
			if (DeleteResponse.success === 1) {
				toast("success", {
					title: DeleteResponse.message,
				})
				logout()
			} else if (DeleteResponse.success === 0) {
				toast("error", {
					title: DeleteResponse.message,
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * Get profile Information
	 */
	const GetProfile = async () => {
		try {
			const Response = await makeRequest("GET", "profile/me", null, Token)
			SetProfileInfo(Response?.data)
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 *  Get users screen update
	 */
	useEffect(() => {
		GetProfile()
	}, [isFocused]);

	return (
		<>
			<AppHeader title="ProfileScreen.settings" />
			<View style={[styles.ws_main_wrapper, { backgroundColor: theme.background }]}>
				<ScrollView showsVerticalScrollIndicator={false} >
					<View style={styles.ws_content_box}>
						<View style={[styles.ws_user_profile, { backgroundColor: theme.card_bg }]}>
							<View style={styles.ws_user_image}>
								<Image
									source={{ uri: ProfileInfo?.$avatar_url }}
									style={ styles.ws_img}
								/>
							</View>
							<View style={styles.ws_user_info}>
								<Text style={[styles.ws_user_name, { color: theme.text }]}>
									{ProfileInfo?.first_name} {ProfileInfo?.last_name}
								</Text>
								<Text style={[styles.ws_text_two, { color: theme.subtext }]}>+ {ProfileInfo?.country_code} {ProfileInfo?.phone}</Text>
							</View>
						</View>
						<View style={[styles.ws_settings_menu, { backgroundColor: theme.card_bg }]}>
							<Text style={[styles.ws_menu_text, { color: theme.subtext }]}>{translate("common.menu")}</Text>
							<View style={styles.ws_settings_menu_box} >
								{
									Data.map((item, index) => {
										const Icon = item.icon
										return (
											<TouchableOpacity
												key={index} style={styles.ws_menu_btn}
												onPress={() => item.type === "logout" ? HandleLogSheet() : HandleClick(item)}
											>
												<View style={styles.ws_btn_left}>
													<Icon {...IconProps(ms(23))} fill={theme.text} />
													<Text style={[styles.ws_btn_text, { color: theme.text }]}>{translate(item.text)}</Text>
												</View>
												{
													item.type === "language" ?
														<Text style={[styles.ws_menu_text, { color: theme.subtext }]} >
															{languageNames[language]}
														</Text> : null
												}
												{
													item.type === "theme" ?
														<Text style={[styles.ws_menu_text, { color: theme.subtext }]} >{theme.themeMode}</Text> : null
												}
											</TouchableOpacity>
										)
									})
								}
							</View>
						</View>
							<TouchableOpacity
								style={styles.ws_delete_box}
								onPress={() => HandleDeleteSheet()}
							>
								<TrashIcon {...IconProps(ms(23))} fill={theme.text} />
								<Text style={[styles.ws_btn_text, { color: theme.text }]}>{translate("common.delete")}</Text>
							</TouchableOpacity>
							<View style={{ alignItems: "center" }}>
								<Text style={[styles.ws_menu_text, { color: theme.subtext }]}>Version {appVersion} </Text>
							</View>
					</View> 
				</ScrollView>
			</View>
			<ActionSheet
				{...{
					BottomSheetRef: LanguageRef,
					Points: SettingSheetHeight,
					Title: "common.selectLanguage",
					Data: languageData,
					onSelect: HandleLanguageSelect,
					selectedItem: languageData.find(item => item.value === language),
				}}
			/>
			<ActionSheet
				{...{
					BottomSheetRef: ThemeRef,
					Points: SettingSheetHeight,
					Title: "common.selectTheme",
					Data: AllTheme,
					onSelect: HandleThemeSelect,
					currentTheme: theme.themeMode
				}}
			/>
			<ActionSheet
				{...{
					BottomSheetRef: LogoutRef,
					Points: SettingSheetHeightTwo,
					type: "logout",
					btnText: "common.logout",
					btnTitle: "ProfileScreen.logoutConfirmation",
					SheetIcon: PowerIcon,
					onPress: () => logout()
				}}
			/>
			<ActionSheet
				{...{
					BottomSheetRef: DeleteRef,
					Points: SettingSheetHeightTwo,
					type: "logout",
					btnText: "common.delete",
					btnTitle: "AddAndEditWishScreen.confirmDelete",
					SheetIcon: TrashIcon,
					onPress: HandleAccountDelete
				}}
			/>
		</>
	)
}

export default SettingScreen

