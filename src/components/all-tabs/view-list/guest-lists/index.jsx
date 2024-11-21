/** React Import */
import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

/** Data*/
import { WishesSingle } from '../../../../screens/main/wishes-list-view-screen/wishes-list-view'

/** Style */
import { Colors, Fonts } from '../../../../utils/styles'
import { ms } from '../../../../utils/helpers/metrics'

/** Main Export */
const GuestLists = () => {
    return (
        <View style={styles.ws_container}>
            {
                WishesSingle.map((item, index) => {
                    const isLastIndex = index === WishesSingle.length - 1 
                    return (
                        <View key={item.id} style={[styles.ws_content, isLastIndex && { marginBottom: 0 }]}>
                            <View style={styles.ws_image_box}>
                                <Image style={styles.ws_img} source={item.imgs} />
                            </View>
                            <View style={styles.ws_border} />
                            <Text style={styles.ws_name}>{item.name}</Text>
                        </View>
                    )
                })
            }
        </View>
    )
}

export default GuestLists

const styles = StyleSheet.create({
    ws_container: {
        backgroundColor: Colors.ws_white,
        padding: ms(10),
        marginTop: ms(18),
        borderRadius: ms(10),
        marginBottom: ms(20)
    },
    ws_content: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: ms(15)
    },
    ws_image_box: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(10),
        overflow: "hidden"
    },
    ws_img: {
        width: "100%",
        height: "100%"
    },
    ws_border: {
        borderRightWidth: ms(1.2),
        borderColor: Colors.ws_dark_gray,
        height: ms(47),
        width: ms(0),
        marginLeft: ms(10)
    },
    ws_name: {
        fontFamily: Fonts.Font_500,
        fontSize: ms(14),
        color: Colors.ws_text,
        marginLeft: ms(10),

    }
})