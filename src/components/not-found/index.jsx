/** React Imports */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/** Local Imports */
import { Fonts } from '../../utils/styles';
import { ms } from '../../utils/helpers/metrics';
import { useTheme } from '../../utils/context/ThemeContext';
import { useLanguage } from '../../utils/context/LanguageContext';

/** Main Export */
const NotFound = ({title}) => {

    const { theme } = useTheme()
    const { translate } = useLanguage()

    return (
        <View style={styles.ws_notfound_box}> 
            <Text style={[styles.ws_notfound_text, {color:theme.text }]}>{translate(title)}</Text>
        </View>
    );
}

export default NotFound;
const styles = StyleSheet.create({
    ws_notfound_box: {
        alignItems: "center",
        justifyContent: "center",
        height:ms(100),
    },
    ws_notfound_text:{ 
        fontFamily: Fonts.Font_500, 
        color: "white", 
        fontSize: ms(14) 
    }
});
