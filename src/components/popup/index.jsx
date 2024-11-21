/** React Import */
import React from 'react'
import { View, Modal, TouchableOpacity, SafeAreaView, Image, StatusBar } from 'react-native'

/** Icon */
import LeftIcon from "../../../assets/svgs/left.svg"
import { ms } from '../../utils/helpers/metrics'
import { IconProps } from '../../utils/helpers/Iconprops'

/** Main Export */
const PopUp = ({ Vsible, Close, MainData, styles }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={Vsible}
        >
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ backgroundColor: "black" }} />
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.sa_btn_box} onPress={Close}>
                    <LeftIcon {...IconProps(ms(33))} fill={"white"} />
                </TouchableOpacity>
                <View style={styles.sa_main_view}>
                    {MainData && (
                        <View style={styles.sa_image_box}>
                            <Image style={styles.modalImage} source={{ uri: MainData }} />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    )
}

export default PopUp
