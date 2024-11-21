/** React Import */
import React, { useState } from 'react'
import {
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'

/** Local Import */
import { ms } from '../../../utils/helpers/metrics'

/**Components */
import PopUp from '../../popup'

/** Library */
import moment from 'moment-timezone'

/**Main Export */
const ImageHandle = ({ ResponseImage, CheckUser }) => {
    const Data = ResponseImage?.file[0]
 
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

    const OpenModal = (image) => {
        setSelectedImage(image)
        setModalVisible(true)
    }

    const CloseModal = () => {
        setModalVisible(false)
    }

    return (
        <>

            <TouchableOpacity style={[styles.sa_chat_image_box,{marginTop:CheckUser ? ms(10):ms(4)}]} onPress={() => OpenModal(Data?.$avatar_url)}>
                <Image style={styles.sa_image} source={{ uri: Data?.$avatar_url }} />
            </TouchableOpacity>

            <PopUp
                {...{
                    Vsible: modalVisible,
                    Close: CloseModal,
                    MainData: selectedImage,
                    styles
                }}
            />
        </>
    )
}

export default ImageHandle

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, 
        backgroundColor: "black"
    },
    modalImage: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain',
        marginTop: Platform.OS === "ios" ? ms(-40) : ms(-40)
    },
    sa_image_box: {
        width: "100%",
    },
    sa_main_view: {
        justifyContent: "center",
        alignItems: "center",
    },
    sa_btn_box: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginLeft: ms(5),
    },
    sa_chat_image_box:{
        width: ms(150),
        height:ms(150),
        borderRadius: ms(10),
        overflow: "hidden",
        marginBottom:ms(5)
    },
    sa_image:{
        width:"100%",
        height:"100%",
        resizeMode:"cover"
    }

}) 