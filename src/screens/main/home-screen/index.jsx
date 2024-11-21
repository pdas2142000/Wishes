/** React Import */
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, TouchableOpacity, View } from 'react-native'

/** Local Import */
import { IconProps } from '../../../utils/helpers/Iconprops'
import { ms } from '../../../utils/helpers/metrics'
import { home_styles, List } from './helper'
import { useTheme } from '../../../utils/context/ThemeContext'
import { useLanguage } from '../../../utils/context/LanguageContext'

/** Component */
import AppHeader from '../../../components/header'
import TabUnderLineMenu from '../../../components/tab-underline-menu'
import ActionSheet from '../../../components/action-sheet'
import InvitationList from '../../../components/all-tabs/home-lists/invitation'
import ArchiveList from '../../../components/all-tabs/home-lists/archive-lists'
import WishLists from '../../../components/all-tabs/home-lists/wish-lists'
import HomeEventList from '../../../components/all-tabs/home-lists/friends-lists'

/** Icon */
import AddIcon from "../../../../assets/svgs/add.svg"

/** Library */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { makeRequest } from '../../../utils/make-request'
import { useAuth } from '../../../utils/context/AuthContext'

const { height } = Dimensions.get('window')
const HomeSheetHeight = height * 0.4

/** Main Export */ 
const HomeScreen = () => {

    const Navigation = useNavigation()
    const FilterRef = useRef()
    const { theme } = useTheme()
    const { translate } = useLanguage()
    const {Token}=useAuth()
    const isFocused = useIsFocused()

    const styles = home_styles

    const [SelectedTab, setSelectedTab] = useState("General")
    const [InvitationCount, SetInvitationsCount] = useState()

    /**
     * Handle navigation tab
     */
    const HandleNavigation = () => {
        if (SelectedTab == 'General') {
            Navigation.navigate("homeaddnew", { tab: "wishlist" })
        } else {
            Navigation.navigate("homeaddnew", { tab: "event" })
        }
    } 

    const GetInvitationItem = async ()=>{
        try {
            const Response = await makeRequest("GET", "event/invitations", null, Token)
            SetInvitationsCount(Response?.data?.meta?.totalItems)
        } catch (error) {
            console.log( error)
        }
    }

    useEffect(() => {
        GetInvitationItem()
    }, [isFocused]);

    return (
        <>
            <AppHeader title="MainNavigation.home">
                {
                    SelectedTab == 'General' || SelectedTab == 'Event' ?
                        <TouchableOpacity onPress={HandleNavigation}>
                            <AddIcon  {...IconProps(ms(23))} fill={theme.text} />
                        </TouchableOpacity> : null
                }
            </AppHeader>
            <View style={{ backgroundColor: theme.background }}>
                <TabUnderLineMenu
                    {...{
                        SelectedTab,
                        setSelectedTab,
                        Data: List,
                        type: "home",
                        InvitationCount
                    }}
                />
            </View>
            <View style={[styles.ws_mainContainer, { backgroundColor: theme.background }]}>
                <View style={{ marginTop: ms(20), flex: 1 }}>
                    {SelectedTab === 'General' ? <WishLists /> : null}
                    {SelectedTab === 'Event' ? <HomeEventList /> : null}
                    {SelectedTab === 'Invitations' ?<InvitationList GetInvitationItem = {GetInvitationItem}/>: null}
                    {SelectedTab === 'Archive' ? <ArchiveList /> : null}
                </View >
                <ActionSheet
                    {...{
                        BottomSheetRef: FilterRef,
                        type: "filter",
                        Points: HomeSheetHeight,
                        Title: "Filters"
                    }}
                />
            </View>
        </>
    )
}

export default HomeScreen

