/** React Imports */
import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native'

/** Local Imports */
import { ms } from '../../utils/helpers/metrics'
import { Colors, Fonts } from '../../utils/styles'
import { useTheme } from '../../utils/context/ThemeContext'
import { useLanguage } from '../../utils/context/LanguageContext'

const screenWidth = Dimensions.get('window').width;

/** Main Export */
const TabUnderLineMenu = ({ SelectedTab, setSelectedTab, Data, type, col_bank,InvitationCount }) => {
    const { theme } = useTheme()
    const { translate } = useLanguage()

    const HandleSelect = (item) => {
        setSelectedTab(item.title)
    }
    
    const paddingHorizontal = col_bank ? (4.3 / 100) * screenWidth : (3 / 100) * screenWidth;

    return (
        <>
            <View style={[styles.ws_list_wrap, { borderBottomColor: theme.tebbg }]}>
                <ScrollView
                    horizontal
                    style={styles.ws_scroll}
                    contentContainerStyle={
                        {
                            flexGrow: 1,
                            paddingRight: type === "home" ? ms(15) : ms(0)
                        }
                    }
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        Data.map((item, index) => {
                            const isActive = item.title === SelectedTab
                            return (
                                <TouchableOpacity
                                    style={[styles.tabItem, {
                                        borderColor: isActive ? theme.text : "transparent",
                                        width: type != "home" ? "46%" : null,
                                        marginRight: type != "home"? ms(16) :ms(14),
                                    }]}
                                    key={item.id}
                                    onPress={() => HandleSelect(item)}
                                >
                                    <View
                                        style={[
                                            styles.ws_btn,
                                            {
                                                backgroundColor: isActive ? theme.card_bg : null,
                                                paddingHorizontal: paddingHorizontal
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.ws_text, { color: theme.text }]}>{translate(item.value)}</Text>
                                        {
                                            item.value === "Invitations" ?
                                                <View style={styles.ws_tag_box} >
                                                    <Text style={styles.ws_invite_tag}>{InvitationCount}</Text>
                                                </View>
                                                : null
                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View >
        </>
    )
}

const styles = StyleSheet.create({
    ws_list_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderBottomWidth: ms(1),
    },
    ws_text: {
        fontSize: ms(13),
        color: Colors.ws_lite_blue,
        fontFamily: Fonts.Font_500,
        color: Colors.ws_black,
    },
    ws_btn: {
        paddingVertical: ms(10),
        borderRadius: ms(10),
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    tabItem: {
        paddingBottom: ms(8),
        borderBottomWidth: ms(1.5),
    },
    ws_invite_tag: {
        fontFamily: Fonts.Font_700,
        fontSize: ms(10),
        color:Colors.ws_black
    },
    ws_tag_box: {
        backgroundColor: Colors.ws_white,
        width: ms(15),
        height: ms(15),
        borderRadius: ms(50),
        marginLeft: ms(4),
        alignItems: "center",
        justifyContent: "center"
    },
    ws_scroll: {
        flex: 1,
        paddingLeft: ms(17)
    }

})
export default TabUnderLineMenu
