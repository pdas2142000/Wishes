/** React Imports */
import React, { useState } from 'react'
import { View } from 'react-native'

/** Components */
import AppHeader from '../../../../components/header'
import TabUnderLineMenu from '../../../../components/tab-underline-menu'
import ChooseWishTab from '../../../../components/all-tabs/add-wish-list/choose-wish-tab'
import AddWishTab from '../../../../components/all-tabs/add-wish-list/add-wish-tab'

/** Local Imports */
import { AppCommonStyle } from '../../../../utils/styles'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'

/** Main Export */
const AddWishScreen = ({ route }) => {

    const { EventId } = route.params || {}
    const { theme } = useTheme()
    const { translate } = useLanguage()  


    const [SelectedTab, setSelectedTab] = useState("choose wish")

    return (  
        <> 
            <AppHeader
                {...{
                    title: "common.addwish",
                    willGoBack: true
                }}
            />
            <View style={{backgroundColor:theme.background}}>
                <TabUnderLineMenu 
                    {...{
                        SelectedTab,
                        setSelectedTab,
                        Data: List,
                        tab_no: "2"
                    }} 
                />
            </View>
            <View style={[AppCommonStyle.ws_main_container, { backgroundColor: theme.background }]}>
                {SelectedTab === 'choose wish' ?
                    <ChooseWishTab  
                        {...{
                            EventId,
                        }}
                    />
                    : null}
                {SelectedTab === 'add wish' ?
                    <AddWishTab
                        {...{
                            EventId
                        }}
                    />
                    : null}
            </View>
        </>
    )
}

export default AddWishScreen

export const List = [
    {
        id: 1,
        title: "choose wish",
        value: "common.chooseWish"
    },
    {
        id: 2,
        title: "add wish",
        value: "common.createnew"
    },
]
