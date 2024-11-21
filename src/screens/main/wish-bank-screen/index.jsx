/** React Import */
import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Share } from 'react-native'

/** Local Import */
import { IconProps } from '../../../utils/helpers/Iconprops'
import { ms } from '../../../utils/helpers/metrics'

/** Icon */
import AddIcon from "../../../../assets/svgs/add.svg"
import ShareIcon from "../../../../assets/svgs/share.svg"

/** Component */
import AppHeader from '../../../components/header'
import WishsList from '../../../components/all-tabs/wish-bank-list/wishes-list'
import WishListsLists from '../../../components/all-tabs/wish-bank-list/wish-lists-list'
import TabUnderLineMenu from '../../../components/tab-underline-menu'

/** Styles */
import { Colors, Fonts } from '../../../utils/styles'
import { useTheme } from '../../../utils/context/ThemeContext'

/** Libraries */
import { useNavigation } from '@react-navigation/native'
import WishBankEventList from '../../../components/all-tabs/wish-bank-list/wish-bank-event-list'
import WishBankArchive from '../../../components/all-tabs/wish-bank-list/wish-bank-archive'

/** Main Export */
const WishBankScreen = ({ route }) => {

    const Navigation = useNavigation()
    const { theme } = useTheme()
    const { tab } = route.params || {}

    const [SelectedTab, setSelectedTab] = useState(tab || "Wish_list")

    /**
     * Share event
     */
    const OnShare = async () => {
        try {
            const result = await Share.share({
                message: 'Join this event',
                url: 'https://wishes-app.com/',
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    /**
     * Tab Add navigations
     */
    const HandleNavigation = () => {
        if (SelectedTab === "Wish_list") {
            Navigation.navigate("wishlist_add_new")
        } else if (SelectedTab === "Event") {
            Navigation.navigate("event_add_new")
        } else if (SelectedTab === "Wishes") {
            Navigation.navigate("wishbankaddnew")
        }
    }

    return (
        <>
            <AppHeader title="MainNavigation.me">
                <TouchableOpacity style={styles.ws_header_icon} onPress={() => OnShare()} >
                    <ShareIcon  {...IconProps(ms(23))} fill={theme.text} />
                </TouchableOpacity>
                {
                    SelectedTab != "Archive" ?
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
                        col_bank: "bank"
                    }}
                />
            </View>
            <View style={[styles.ws_container, { backgroundColor: theme.background }]}>
                <View style={{ marginTop: ms(20), flex: 1 }}>
                    {SelectedTab === 'Wish_list' ? <WishListsLists /> : null}
                    {SelectedTab === 'Event' ? <WishBankEventList /> : null}
                    {SelectedTab === 'Wishes' ? <WishsList /> : null}
                    {SelectedTab === 'Archive' ? <WishBankArchive Archive={Archive} /> : null}
                </View>
            </View>
        </>
    )
}

export default WishBankScreen

const styles = StyleSheet.create({
    ws_header_icon: {
        marginRight: ms(10)
    },
    ws_container: {
        flex: 1,
        backgroundColor: Colors.ws_bg,
        paddingHorizontal: ms(15)
    },
    ws_list_wrap: {
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
    },
    ws_list_btn: {
        height: ms(55),
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: ms(2),
    },
    ws_text: {
        fontSize: ms(15),
        color: Colors.ws_lite_blue,
        fontFamily: Fonts.Font_500
    },
})

export const List = [
    {
        id: 2,
        title: "Wish_list",
        value: "common.wishListPlural"
    },
    {
        id: 1,
        title: "Event",
        value: "common.events"
    },
    {
        id: 3,
        title: "Wishes",
        value: "common.wishPlural" 
    },
    {
        id: 4,
        title: "Archive",
        value: "HomeScreen.archive",
    }
]

const Archive = [
    {
        image: require("../../../../assets/dummy/housewarming.jpeg"),
        name: 'John Doe',
        date: '2024-10-01',
        guests: 10,
        wishes: 1,
        location: 'Paris, France',
        respond: "Published",
        type: "archive",
        description: "Housewarming - New home"
    },
    {
        image: require("../../../../assets/dummy/cake.jpg"),
        name: 'Jane Smith',
        date: '2024-10-02',
        guests: 2,
        wishes: 6,
        location: 'Toronto, Canada',
        respond: "Draft",
        type: "archive",
        description: "Birthday - joyful milestone"
    },
    {
        image: require("../../../../assets/dummy/baby.jpg"),
        name: 'Michael Johnson',
        date: '2024-10-03',
        guests: 9,
        wishes: 4,
        location: 'Sydney, Australia',
        respond: "Published",
        type: "archive",
        description: "Baby Shower - New arrival"
    },
    {
        image: require("../../../../assets/dummy/christmas.jpg"),
        name: 'Emily Davis',
        date: '2024-10-04',
        guests: 5,
        wishes: 8,
        location: 'London, UK',
        respond: "Draft",
        type: "archive",
        description: "Christmas - Love and cheer"
    },
    {
        image: require("../../../../assets/dummy/anniversary.jpeg"),
        name: 'David Wilson',
        date: '2024-10-05',
        guests: 2,
        wishes: 1,
        location: 'New York, USA',
        respond: "Published",
        type: "archive",
        description: "Anniversary - Love celebration"
    }
]
