/** React Import */
import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator
} from 'react-native'

/** Library */
import Pdf from 'react-native-pdf'

/** Local Import */
import { ms } from '../../../../utils/helpers/metrics'
import { Colors, Fonts } from '../../../../utils/styles'
import AppHeader from '../../../header'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Main Export */
const PdfViewScreen = ({ route }) => {

    const { Link, name } = route.params || null
    const { theme } = useTheme()

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    const source = { uri: Link, cache: true }

    return (
        <>
          <AppHeader
                {...{
                    title:name,
                    willGoBack: true
                }}
            />
            <View style={[styles.sa_main_container, {backgroundColor:theme.background}]}>
                {isLoading && (  // Show the ActivityIndicator while loading
                    <ActivityIndicator
                        size="large"
                        color={Colors.sa_primary}
                        style={styles.loadingIndicator}
                    />
                )}
                {
                    error ? (
                        <Text style={styles.errorText}>Something went wrong. Please try again later.</Text>
                    ) : (
                        <Pdf
                            trustAllCerts={false}
                            source={source}
                            onLoadComplete={() => setIsLoading(false)}
                            onError={(err) => {
                                setIsLoading(false)
                                setError(true)
                            }}
                            style={[styles.pdf,{backgroundColor:theme.background}]}
                        />
                    )
                }
            </View>
        </>
    )
}

export default PdfViewScreen

const styles = StyleSheet.create({
    sa_main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    loadingIndicator: {
        position: 'absolute',
        zIndex: 1,
    },
    errorText: {
        color: Colors.ws_black,
        fontFamily: Fonts.Font_600,
        fontSize: ms(16),
        textAlign: 'center',
        marginHorizontal: ms(20),
        marginTop: ms(-70)
    },
})
