import React, { useState } from 'react'
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView 
} from 'react-native'

/** Icon */
import IconCircle from "../../../assets/svgs/circle_new.svg"
import IconCheck from "../../../assets/svgs/check.svg"

/** Local Import */
import { IconProps } from '../../utils/helpers/Iconprops'

/** Stytle */
import { ms } from '../../utils/helpers/metrics'
import { Colors, Fonts } from '../../utils/styles'
import { useTheme } from '../../utils/context/ThemeContext'

/** Main Export */
const FilterSheet = ({ SheetClose }) => {

    const [IsSelect, SetIsSelect] = useState()

    const SelectGroup = (ID) => {
        SetIsSelect((prevID) => (prevID === ID ? null : ID));
    }

    const { theme } = useTheme()

    return (
        <View style={styles.ws_content}>
            <View style={{ flexGrow: 1 }}>
                <View style={{ marginTop: ms(20) }}>
                    <Text style={[styles.ws_btn_text, { color: theme.text, fontFamily: Fonts.Font_600 }]} >Group by</Text>
                </View>
                {
                    FilterData.map((item, index) => {
                        const IsClick = item.id
                        return (
                            <TouchableOpacity key={index} style={styles.ws_content_btn} onPress={() => SelectGroup(IsClick)}>
                                <Text style={[styles.ws_btn_text, { color: theme.text }]}>{item.text}</Text>
                                {
                                    IsSelect === IsClick ?
                                        <IconCheck {...IconProps(ms(25))} fill={Colors.ws_primary_blue} /> :
                                        <IconCircle {...IconProps(ms(25))} fill={Colors.ws_primary_blue} />
                                }
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
            <SafeAreaView>
                <View style={styles.ws_action_btn_box}>
                    <TouchableOpacity
                        style={[styles.ws_btn, { backgroundColor: Colors.ws_primary_blue }]}
                        onPress={SheetClose}
                    >
                        <Text style={[styles.ws_action_text, { color: Colors.ws_white }]}>done</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default FilterSheet

const styles = StyleSheet.create({
    ws_content_btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: ms(13)
    },
    ws_content: {
        justifyContent: "space-between",
        flex: 1
    },
    ws_btn_text: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
        textTransform: "capitalize",
        marginBottom: ms(0)
    },
    ws_action_btn_box: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom:ms(10)
    },
    ws_btn: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: ms(13),
        borderRadius: ms(10)
    },
    ws_action_text: {
        fontSize: ms(14),
        textTransform: "capitalize",
        fontFamily: Fonts.Font_500
    },
    ws_search_box: {
        backgroundColor: "#f6f6f6",
        height: ms(45),
        borderRadius: ms(9),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: ms(12),
        marginTop: ms(15),
        marginBottom: ms(10)
    },
    ws_input_Style: {
        flex: 1,
        paddingHorizontal: ms(10)
    }
})
const FilterData = [
    {
        id: 1,
        text: "Users"
    },
    {
        id: 2,
        text: "List"
    },

]