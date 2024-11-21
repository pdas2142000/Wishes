/** React Imports */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native'

/** Local Imports */
import { Colors, Fonts } from '../../utils/styles'
import { ms } from '../../utils/helpers/metrics'
import { useLanguage } from '../../utils/context/LanguageContext'
import { useTheme } from '../../utils/context/ThemeContext'
import { IconProps } from '../../utils/helpers/Iconprops'

/** Libraries */
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetBackdrop, } from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { ActionSheetstyles } from '../action-sheet/ActionHelper'

/** Icons */
import TrashIcon from "../../../assets/svgs/trash.svg"

const { width } = Dimensions.get('window')

/** Main Export */
const SwipeableComponent = ({ children, type, slug, setSelectedSlug,onDelete,swipetext,btntext,subtext }) => {

    const swipeableRef = useRef(null)
    const { translate } = useLanguage() 
    const { theme } = useTheme()

    const sheet_style = ActionSheetstyles

    const [isModalVisible, setModalVisible] = useState(false)

    const SnapPoints = useMemo(() => ["35%"], [])

    const handleSwipeRight = () => {
        setModalVisible(true)
        setSelectedSlug(slug)
    }

    const handleCancel = () => {
        swipeableRef.current?.close()
        setModalVisible(false)
    }

    const RightSwip = () => {
        return (
            <View style={[[
                styles.ws_archive_box,
                {
                    height: type === "wishes" ? ms(65) : Platform.OS === "android" ? ms(105) : ms(100),
                }
            ]]}>
                <Text style={styles.ws_delete_text}>{translate(swipetext)}</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={RightSwip}
                onSwipeableRightOpen={handleSwipeRight}
            >
                {children}
            </Swipeable>

            {isModalVisible && (
                <Portal hostName='BottomSheet'>
                    <BottomSheet
                        snapPoints={SnapPoints}
                        enablePanDownToClose={true}
                        backdropComponent={RenderBackdrop}
                        backgroundStyle={{ backgroundColor: theme.background }}
                        handleIndicatorStyle={{ backgroundColor: theme.text }}
                        onClose={handleCancel}
                    >
                        <View style={sheet_style.sa_delete_container} >
                            <View style={{ marginTop: ms(20) }}>
                                <View style={sheet_style.sa_top_content}>
                                    <TrashIcon {...IconProps(ms(35))} fill={"#dbdbdb"} />
                                    <Text style={[sheet_style.sa_text, { color: theme.text }]}>{translate(subtext)}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        onDelete();
                                        handleCancel(); 
                                    }}
                                    style={[sheet_style.sa_cancel_btn, { backgroundColor: "#ef5c5c" }]}
                                >
                                    <Text style={[sheet_style.sa_cancel_btn_text, { color: Colors.ws_white }]}>
                                        {translate(btntext)}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleCancel}
                                    style={[sheet_style.sa_cancel_btn, { backgroundColor: theme.card_bg }]}
                                >
                                    <Text style={[sheet_style.sa_cancel_btn_text, { color: theme.text }]}>
                                        {translate("common.cancel")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BottomSheet>
                </Portal>
            )}
        </GestureHandlerRootView>
    )
}

export default SwipeableComponent

const RenderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
)

const styles = StyleSheet.create({
    ws_archive_box: {
        backgroundColor: Colors.ws_reject,
        paddingHorizontal: ms(20),
        borderRadius: ms(12),
        width: width - ms(150),
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: ms(-20),
    },
    ws_delete_text: {
        color: Colors.ws_white,
        fontSize: ms(14),
        fontFamily: Fonts.Font_500
    },
})