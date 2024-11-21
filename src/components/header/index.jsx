import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Colors, Fonts } from '../../utils/styles';
import { ms } from '../../utils/helpers/metrics';

/** Icon */
import LeftIcon from "../../../assets/svgs/left.svg"

/** Library */
import { useNavigation } from '@react-navigation/native'
import { IconProps } from '../../utils/helpers/Iconprops';
import { useTheme } from '../../utils/context/ThemeContext';
import { useLanguage } from '../../utils/context/LanguageContext';

const AppHeader = ({ title, willGoBack, children }) => {
    const Navigation = useNavigation()
    const { theme } = useTheme()
    const { translate } = useLanguage()
    return (
        <>
            <SafeAreaView backgroundColor={theme.background} />
            <View style={[styles.ws_header_content, { backgroundColor: theme.background }]}>
                {title ? <Text style={[styles.HeaderTextStyle, { color: theme.text }]}>{translate(title)}</Text> : null}
                {
                    willGoBack ?
                        <View style={styles.BackButtonWrapStyle}>
                            <TouchableOpacity
                                style={[
                                    styles.ws_hade_contvent,
                                    styles.ws_search_back
                                ]}
                                onPress={() => Navigation.goBack()}
                            >
                                <LeftIcon fill={theme.text}  {...IconProps(ms(33))} />
                            </TouchableOpacity>
                        </View> : null
                }

                <View style={styles.ws_content_style}>
                    {children}
                </View>
            </View>
        </>
    );
}

export default AppHeader;

const styles = StyleSheet.create({
    ws_header_content: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'relative',
        paddingHorizontal: ms(15),
        height: ms(55)
    },
    HeaderTextStyle: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(16),
        color: Colors.ws_black,
        textTransform: "capitalize"
    },
    BackButtonWrapStyle: {
        position: 'absolute',
        left: ms(8),
    },
    ws_content_style: {
        position: 'absolute',
        right: ms(17),
        flexDirection: "row"
    },
    ws_hade_contvent: {
        flexDirection: "row",
        alignItems: 'center'
    },
    ws_search_back: {
        height: "100%"
    },
});
