/** React Import */
import React, { useEffect, useState } from 'react'
import { Image, LogBox, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native'

/** Component */
import { AppNavigation } from './navigation/stack-nav'

/** Local Imports */
import { AuthProvider } from './utils/context/AuthContext'
import { ThemeProvider } from './utils/context/ThemeContext'
import { LanguageProvider } from './utils/context/LanguageContext'
import '../src/utils/i18n/i18n'
import { Colors, Fonts } from './utils/styles'
import { ms } from './utils/helpers/metrics'

/** Liabary*/
import { NavigationContainer } from '@react-navigation/native'
import { PortalProvider } from '@gorhom/portal'
import Toast from 'react-native-toast-message'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import "../reanimatedConfig"
import NetInfo from '@react-native-community/netinfo'
import { LogLevel, OneSignal } from 'react-native-onesignal';

/** App */
const App = () => {
    const [IsConnected, SetIsConnected] = useState(true);

    LogBox.ignoreAllLogs()

    useEffect(() => {
        // const unsubscribe = NetInfo.addEventListener((state) => {
        //     SetIsConnected(state.isConnected);
        // });

        OneSignal.Debug.setLogLevel(LogLevel.Verbose);

        OneSignal.initialize("870a88b2-efb3-4661-ba8e-891d95ec4511");

        OneSignal.Notifications.requestPermission(true);

        // return () => {
        //     unsubscribe();
        // };
    }, []);

    const NetworkNotConnect = () => {
        return (
            <>
                <SafeAreaView />
                <StatusBar backgroundColor="#b52424" barStyle="default" />
                <View style={styles.ws_ofline_container}>
                    <View style={styles.ws_ofline_text_content} >
                        <Text style={styles.ws_ofline_text}>No internet connection</Text>
                    </View>
                    <View style={styles.ws_internet_box}>
                        <View style={styles.ws_image_box}>
                            <Image style={styles.ws_img} source={require("../assets/images/wifi.png")} />
                        </View>
                    </View>
                </View>
            </>
        )
    }

  

    return (
        <>
            <LanguageProvider>
                {
                    IsConnected ? (
                        <GestureHandlerRootView>
                            <PortalProvider>
                                <ThemeProvider>
                                    <NavigationContainer>
                                        <AuthProvider>
                                            <AppNavigation />
                                        </AuthProvider>
                                    </NavigationContainer>
                                </ThemeProvider>
                            </PortalProvider>
                        </GestureHandlerRootView>
                    ) : (
                        <NetworkNotConnect />
                    )
                }
            </LanguageProvider>
            <Toast
                {
                ...{
                    topOffset: 50,
                    position: 'top',
                    keyboardOffset: 10,
                }
                }
            />
        </>
    )
}

export default App

const styles = StyleSheet.create({
    ws_ofline_container: {
        flex: 1,
        backgroundColor: Colors.ws_background
    },
    ws_ofline_text_content: {
        width: "100%",
        height: ms(30),
        backgroundColor: "#b52424",
        justifyContent: "center",
        alignItems: "center",
    },
    ws_ofline_text: {
        color: Colors.ws_white,
        fontSize: ms(10),
        fontFamily: Fonts.Font_400,
    },
    ws_internet_box: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    ws_image_box: {
        width: ms(85),
        aspectRatio: 1
    },
    ws_img: {
        width: "100%",
        height: "100%"
    }
})