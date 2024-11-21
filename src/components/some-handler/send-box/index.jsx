
/** React Import */
import React from 'react'
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

/** Local Import */
import { ms } from '../../../utils/helpers/metrics'
import { Colors, Fonts } from '../../../utils/styles'
import { IconProps } from '../../../utils/helpers/Iconprops'
import { useTheme } from '../../../utils/context/ThemeContext'

/** Icon */
import ClipIcon from "../../../../assets/svgs/clip.svg"
import SendIcon from "../../../../assets/svgs/send.svg"

/** Library */
import { useNavigation } from '@react-navigation/native'

/** Main export */
const SendBox = ({ message, setMessage, HandleChatFileSheet, sendMessage, GetSingleGroup }) => {
    const { height } = Dimensions.get('window')

    const Navigation = useNavigation()
    const { theme } = useTheme()

    const handleSend = () => {
        if (message.trim() === '') {
            Keyboard.dismiss();
        } else {
            sendMessage();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? "padding" : 'height'}
            keyboardVerticalOffset={height > 700 ? 59 : 20}
        >
            <SafeAreaView style={{ backgroundColor: theme.background, }}>
                <View style={[styles.sa_send_box_container, { backgroundColor: theme.background, }]} >
                    <View style={styles.sa_foot_box}>
                        <TouchableOpacity
                            onPress={HandleChatFileSheet}
                            style={[styles.sa_msg_send, { backgroundColor: theme.card_bg }]}
                        >
                            <ClipIcon {...IconProps(ms(19))} fill={theme.iconactive} />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.card_bg, color: theme.subtext }]}
                            placeholder='Hay, good morning'
                            placeholderTextColor={theme.subtext}
                            multiline={true}
                            value={message}
                            autoGrow={true}
                            editable={true}
                            enablesReturnKeyAutomatically={true}
                            onChangeText={(value) => setMessage(value)}
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            style={[styles.sa_msg_send, { backgroundColor: theme.card_bg }]} >
                            <SendIcon {...IconProps(ms(19))} fill={theme.iconactive} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default SendBox

const styles = StyleSheet.create({
    sa_foot_box: {
        backgroundColor: Colors.sa_secondary,
        paddingHorizontal: ms(10),
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        textAlignVertical: "center",
        paddingVertical: ms(10)
    },
    sa_msg_send: {
        backgroundColor: Colors.ws_gray,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: ms(50),
        paddingVertical: ms(14),
        paddingHorizontal: ms(14),
    },
    input: {
        fontFamily: Fonts.Font_500,
        color: Colors.sa_primary_text,
        fontSize: ms(13),
        maxHeight: ms(100),
        paddingVertical: Platform.OS === "ios" ? ms(16) : null,
        paddingTop: Platform.OS === "ios" ? ms(15) : null,
        flex: 1,
        backgroundColor: Colors.ws_bg,
        alignItems: "center",
        borderRadius: ms(15),
        paddingHorizontal: ms(20),
        marginHorizontal: ms(10),
    },
    sa_suggest_btn_box: {
        backgroundColor: Colors.ws_primary,
        padding: ms(15),
        marginHorizontal: ms(22),
        marginVertical: ms(10),
        alignItems: "center",
        borderRadius: ms(7)
    },
    sa_sugg_btn_text: {
        fontFamily: Fonts.Font_600,
        fontSize: ms(16),
        color: Colors.ws_white
    },
    sa_send_box_container: {
        backgroundColor: Colors.ws_white,
        // paddingBottom: Platform.OS === "android" ? ms(12) : null
    },
})