/** React Import */
import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

/** Style */
import { Colors } from '../../../utils/styles'

/** Main Export */
const SplashScreen = () => {
  return (
    <View style={styles.ws_container}>
        <View style={styles.ws_image_box}>
            <Image style={styles.ws_img} source={require("../../../../assets/images/logo/logo.png")}/>
        </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    ws_container:{
        flex:1,
        justifyContent:'center',
        alignItems:"center",
        backgroundColor:Colors.ws_white
    },
    ws_image_box:{
        width:180,
        aspectRatio:1/0.64,
    },
    ws_img:{
        width:"100%",
        height:"100%",
        resizeMode:"cover"
    }
})