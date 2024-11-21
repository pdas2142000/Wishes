/** React Imports */
import React from 'react'
import { View, TextInput } from 'react-native'

/** Icons */
import SearchIcon from "../../../assets/svgs/search.svg"

/** Local Imports */
import { ms } from '../../utils/helpers/metrics'
import { AppCommonStyle } from '../../utils/styles'
import { IconProps } from '../../utils/helpers/Iconprops'
import { useTheme } from '../../utils/context/ThemeContext'
import { useLanguage } from '../../utils/context/LanguageContext'

/** Main Export */
const SearchBar = ({ onSearch,type,setSearchQuery }) => {
    const { translate } = useLanguage()
    const { theme } = useTheme()
    return (
        <View style={[AppCommonStyle.ws_common_search_box, { backgroundColor: theme.card_bg }]}>
            <SearchIcon {...IconProps(ms(20))} fill={theme.subtext} />
            <TextInput
                style={[AppCommonStyle.ws_common_input_Style, { color: theme.text }]}
                placeholder={translate("common.searchPlaceholder")}
                placeholderTextColor={theme.subtext}
                onChangeText={text => type === "guest" ? setSearchQuery(text) : onSearch(text)}
            />
        </View>
    )
}

export default SearchBar
