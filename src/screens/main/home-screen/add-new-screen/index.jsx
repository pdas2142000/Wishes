/** React Imports */
import React, { useState } from 'react'
import { Platform, View } from 'react-native'

/** Components */
import AppHeader from '../../../../components/header'
import EventList from '../../../../components/all-tabs/add-new-list/event-list'
import NewWishlist from '../../../../components/all-tabs/add-new-list/new-wishlist'

/** Local Imports */
import { useTheme } from '../../../../utils/context/ThemeContext'
import { home_styles } from '../helper'

/** Components */
import TabUnderLineMenu from '../../../../components/tab-underline-menu'

/** Libraries */
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/** Main Export */
const AddNewScreen = ({ route }) => {

    const { theme } = useTheme()
    const { type, Data, tab } = route.params || {}
    const styles = home_styles

    const [SelectedTab, setSelectedTab] = useState(tab)

    /**
     * Keyboard Aware ScrollView
     */
    let AvoidScroll;
    if (SelectedTab === "wishlist") {
        AvoidScroll = Platform.OS === "ios" ? 55 : 45;
    } else {
        AvoidScroll = Platform.OS === "ios" ? 80 : 220;
    }

    return (
        <>
            <AppHeader
                {...{
                    title: type === "event_edit" ? "common.editEvent" : "common.addNew",
                    willGoBack: true
                }}
            />
            <View style={{ backgroundColor: theme.background }}>
                <TabUnderLineMenu
                    {...{
                        SelectedTab,
                        setSelectedTab,
                        Data: Data_Info,
                    }}
                />
            </View>
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={AvoidScroll}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: theme.background }}
            >
                <View style={[styles.ws_main_container, { backgroundColor: theme.background }]}>
                    <View style={styles.ws_content_box}>
                        {
                            SelectedTab === 'event' ?
                                <EventList
                                    {...{
                                        type,
                                        Data
                                    }}
                                />
                                : null}
                        {SelectedTab === 'wishlist' ? <NewWishlist /> : null}
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </>
    )
}

export default AddNewScreen

export const Data_Info = [
    {
        id: 1,
        title: "event",
        value: "common.events"
    },
    {
        id: 2,
        title: "wishlist",
        value: "common.wishListPlural"
    },
]

