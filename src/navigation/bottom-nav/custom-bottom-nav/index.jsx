/**React Import */
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    SafeAreaView
} from 'react-native'

/**local Import */
import { IconProps } from '../../../utils/helpers/Iconprops'
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'

/** Styles */
import { Colors, Fonts } from '../../../utils/styles'
import { ms } from '../../../utils/helpers/metrics'

/**Icon */
import ChatIcon from "../../../../assets/svgs/comment.svg"
import SettingIcon from "../../../../assets/svgs/cog.svg"
import BankIcon from "../../../../assets/svgs/user_icon.svg"
import HomeIcon from "../../../../assets/svgs/home.svg"

/** Main Export */
export function MyTabBar({ state, descriptors, navigation }) {
    const { theme } = useTheme()
    const { translate } = useLanguage()

    return (
        <SafeAreaView style={{ backgroundColor: theme.card_bg }}>
            <View style={[styles.ws_main_wrapper, { backgroundColor: theme.card_bg }]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key]
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name
                    const isFocused = state.index === index
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        })
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params)
                        }
                    }
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        })
                    }

                    const toggle_color = isFocused ? theme.iconactive : theme.iconinactive
 
                    return (
                        <TouchableOpacity
                            style={styles.ws_content_box}
                            activeOpacity={0.7}
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                        >
                            {
                                label == "wishlists" ?
                                    <>
                                        <HomeIcon
                                            {...IconProps(ms(23))}
                                            fill={toggle_color}
                                        />
                                        <Text
                                            style={[
                                                styles.ws_button_text,
                                                { color: toggle_color }
                                            ]}
                                        >
                                            {translate("MainNavigation.home")}
                                        </Text>
                                    </>
                                    :
                                    label == "chat" ?
                                        <>
                                            <ChatIcon
                                                {...IconProps(ms(23))}
                                                fill={toggle_color}
                                            />
                                            <Text
                                                style={[
                                                    styles.ws_button_text,
                                                    { color: toggle_color }
                                                ]}
                                            >
                                                {translate("MainNavigation.chat")}
                                            </Text>
                                        </> :
                                        label == "me" ?
                                            <>
                                                <BankIcon
                                                    {...IconProps(ms(23))}
                                                    fill={toggle_color}
                                                // style={{marginBottom:ms(2)}}
                                                />

                                                <Text
                                                    style={[
                                                        styles.ws_button_text,
                                                        { color: toggle_color }
                                                    ]}
                                                >
                                                    {translate("MainNavigation.me")}
                                                </Text>
                                            </> :
                                            label == "settings" ?
                                                <>

                                                    <SettingIcon
                                                        {...IconProps(ms(23.8))}
                                                        fill={toggle_color}
                                                    />

                                                    <Text
                                                        style={[
                                                            styles.ws_button_text,
                                                            { color: toggle_color }
                                                        ]}
                                                    >
                                                        {translate("MainNavigation.settings")}
                                                    </Text>
                                                </> : null

                            }
                        </TouchableOpacity>
                    )
                })}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    ws_main_wrapper: {
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: Colors.ws_white,
        borderTopRightRadius: ms(15),
        borderTopLeftRadius: ms(15),
        height: ms(60),
    },
    ws_button_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(12),
        textTransform: "capitalize",
        marginBottom: ms(-5),
        marginTop: ms(5)
    },
    ws_img_box: {
        width: ms(50),
        aspectRatio: 1 / 0.3,
        marginBottom: ms(3),
        marginTop: ms(2)
    },
    ws_content_box: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: ms(5)
    },
    ws_img: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    ws_active_icon_box: {
        backgroundColor: "#98a7db8a",
    },
    ws_setting_box: {
        width: ms(40),
        height: ms(40),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: ms(20)
    }
})