/** React Import */
import React, { useEffect } from 'react'
import { View, StyleSheet, } from 'react-native'

/** Components */
import AppHeader from '../../../../components/header'

/** Local Import */
import { ms } from '../../../../utils/helpers/metrics'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'

/** Styles */
import { Colors } from '../../../../utils/styles'

/** Library */
import { useForm } from 'react-hook-form'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { CommonBanner } from '../../../../components/wishes-banner'

/** Main Export */
const BlockedContacts = () => {

    const { Token } = useAuth()
    const { theme } = useTheme()

    const {  control, handleSubmit, setValue, formState: { errors }, } = useForm()

    const OnSubmit = data => {
        console.log(data)
    }

    /**
     * Get all users
     */
    const GetAllUser = async () => {
        const GetAllUserResponse = await makeRequest("GET", "user", null, Token)
    }

    useEffect(() => {
        GetAllUser()
    }, []);

    return (
        <>
            <AppHeader
                {...{
                    title: "BlockedUserScreen.blockedContacts",
                    willGoBack: true
                }}
            />
            <View style={[styles.ws_main_container, { backgroundColor: theme.background }]}>
                <View style={{ marginTop: ms(15) }}>
                    {
                        Data.map((item, index) => {
                            return (
                                <View key={index} >
                                    <CommonBanner
                                        {...{
                                            item
                                        }}
                                    />
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        </>
    )
}

export default BlockedContacts

const styles = StyleSheet.create({
    ws_main_container: {
        backgroundColor: Colors.ws_bg,
        flex: 1,
        paddingHorizontal: ms(15),
    },
})

const Data = [
    {
        image: require("../../../../../assets/dummy/man1.jpg"),
        text: "Ethan Carter",
        subtext: '+919867456783',
    },
    {
        image: require("../../../../../assets/dummy/girl1.jpg"),
        text: "Liam Bennett",
        subtext: '+917788654323',
    },
    {
        image: require("../../../../../assets/dummy/man3.jpg"),
        text: "Mason Brooks",
        subtext: '+917865439876',
    },
    {
        image: require("../../../../../assets/dummy/girl2.jpg"),
        text: "Alexander Hayes",
        subtext: '+919911234523',
    },
    {
        image: require("../../../../../assets/dummy/girl4.jpg"),
        text: "Amelia Griffin",
        subtext: '+9199556732143',
    },
    {
        image: require("../../../../../assets/dummy/man4.jpg"),
        text: "Harper Sullivan",
        subtext: '+918899009754',
    },
]