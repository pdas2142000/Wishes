/**React Import */
import { KeyboardAvoidingView, Platform, StyleSheet, } from 'react-native'
import React from 'react'

/** Library */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

/**Component */
import HomeScreen from '../../screens/main/home-screen'
import ChatScreen from '../../screens/main/chat-screen'
import { MyTabBar } from './custom-bottom-nav'
import SettingScreen from '../../screens/main/setting-screen'
import WishBankScreen from '../../screens/main/wish-bank-screen'

const Tab = createBottomTabNavigator()

/** Main Export */
const BottomNav = () => {
  
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "android" ? 'height' : undefined}
            keyboardVerticalOffset={Platform.OS === 'android' ? -50 : 0}
        >
            <Tab.Navigator
                tabBar={(props) => <MyTabBar {...props} />}
                screenOptions={{
                    headerShown: false, 
                    keyboardHidesTabBar: true,
                }}
            >
                <Tab.Screen name="wishlists" component={HomeScreen} />
                <Tab.Screen name="chat" component={ChatScreen} />
                <Tab.Screen name="me" component={WishBankScreen} />
                <Tab.Screen name="settings" component={SettingScreen} />
            </Tab.Navigator>
        </KeyboardAvoidingView>
    )
}

export default BottomNav

const styles = StyleSheet.create({})
