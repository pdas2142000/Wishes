/** React Import */
import React, { useEffect, useState } from 'react'

/** Liabary*/
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PortalHost } from '@gorhom/portal'

/** Components */
import BottomNav from '../bottom-nav'
import { useAuth } from '../../utils/context/AuthContext'

/** Screen */
import RegisterScreen from '../../screens/auth/register-screen'
import ForgotScreen from '../../screens/auth/forget-password-screen'
import LoginScreen from '../../screens/auth/login-screen'
import ChatScreen from '../../screens/main/chat-screen'
import OtpScreen from '../../screens/auth/otp-screen'
import ChnagePassword from '../../screens/auth/change-password'
import SplashScreen from '../../screens/main/splash-screen'
import SingleChat from '../../screens/main/chat-screen/single-chat'
import BlockedContacts from '../../screens/main/setting-screen/blocked-contacts'
import AddNewScreen from '../../screens/main/home-screen/add-new-screen'
import ManageEvent from '../../screens/main/manage-event'
import AddWishScreen from '../../screens/main/manage-event/add-wish-screen'
import AddGuestsScreen from '../../screens/main/manage-event/add-guests-screen'
import CreateChatScreen from '../../screens/main/chat-screen/create-chat-screen'
import WishBankAddNew from '../../components/add-new-screens/wish-bank-add-new'
import EditAcountInfo from '../../screens/main/setting-screen/edit-acount-info'
import FeedbackScreen from '../../screens/main/setting-screen/feedback-screen'
import ProfileChangePassword from '../../screens/main/setting-screen/profile-change-password'
import ProfileOtpScreen from '../../screens/main/setting-screen/profile-otp-screen'
import EventList from '../../components/all-tabs/add-new-list/event-list'
import EventAddScreen from '../../components/add-new-screens/event-add-screen'
import WishlistAddScreen from '../../components/add-new-screens/wishlist-add-screen'
import WishesInfoScreen from '../../screens/main/wishes-info-screen'
import { SocketProvider } from '../../utils/context/socket-context'
import PdfViewScreen from '../../components/some-handler/pdf-viewer/view-screen'

const Stack = createNativeStackNavigator()

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName='login'
        >
            <Stack.Screen name='home' component={BottomNav} />
            <Stack.Screen name="chat" component={ChatScreen} />
            <Stack.Screen name="singlechat" component={SingleChat} />
            <Stack.Screen name='accountinfo' component={EditAcountInfo} />
            <Stack.Screen name='ProfileChangePassword' component={ProfileChangePassword} />
            <Stack.Screen name='blocked' component={BlockedContacts} />
            <Stack.Screen name='profileOtp' component={ProfileOtpScreen} />
            <Stack.Screen name='feedback' component={FeedbackScreen} />
            <Stack.Screen name='homeaddnew' component={AddNewScreen} />
            <Stack.Screen name='manageevent' component={ManageEvent} />
            <Stack.Screen name='addwish' component={AddWishScreen} />
            <Stack.Screen name='addguest' component={AddGuestsScreen} />
            <Stack.Screen name='createchat' component={CreateChatScreen} />
            <Stack.Screen name='wishbankaddnew' component={WishBankAddNew} />
            <Stack.Screen name='eventlist' component={EventList} />
            <Stack.Screen name='event_add_new' component={EventAddScreen} />
            <Stack.Screen name='wishlist_add_new' component={WishlistAddScreen} />
            <Stack.Screen name='wishesinfoscreen' component={WishesInfoScreen} />
            <Stack.Screen name='viewscreen' component={PdfViewScreen} />

        </Stack.Navigator>
    )
}

const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='login'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='login' component={LoginScreen} />
            <Stack.Screen name='register' component={RegisterScreen} />
            <Stack.Screen name='forgot' component={ForgotScreen} />
            <Stack.Screen name='otp' component={OtpScreen} />
            <Stack.Screen name='changepassword' component={ChnagePassword} />
        </Stack.Navigator>
    )
}

export const AppNavigation = () => {

    const { Token } = useAuth()

    const [Loading, SetLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            SetLoading(false)
        }, 1000)
    }, [])

    if (Loading) {
        return <SplashScreen />
    } else {
        return (
            <>
                {Token ? (
                    <SocketProvider>
                        <MainStack />
                    </SocketProvider>
                ) : (
                    <AuthStack />
                )}
                <PortalHost name="BottomSheet" />
            </>
        )
    }
}






