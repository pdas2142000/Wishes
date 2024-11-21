/** React Import */
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

/** Local Imports */
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import { AppCommonStyle } from '../../../../utils/styles'

/** Libraries */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { debounce } from 'lodash'

/** Components */
import SwipeableComponent from '../../../swipeable-component'
import { WishesBanner } from '../../../wishes-banner'
import SearchBar from '../../../search-bar'
import NotFound from '../../../not-found'

/** Main Export */
const ArchiveList = () => {

    const Navigation = useNavigation()
    const { theme } = useTheme()
    const { translate } = useLanguage()
    const { Token } = useAuth()
    const isFocused = useIsFocused()

    const [ItemSearch, SetItemSearch] = useState()
    const [selectedSlug, setSelectedSlug] = useState(null)
    const [Page, setPage] = useState(1);
    const [LoadPages, setLoadPages] = useState({ totalPages: 1 });
    const [LoadMoreLoading, setLoadMoreLoading] = useState(false);
    const [Archive, SetArchive] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [apiResponse, setApiResponse] = useState(null)

    /**
     * Get wishes
     */
    const GetArchive = async (page, search) => {
        setLoadMoreLoading(true);
        try {
            const Response = await makeRequest('GET', 'event', { search: search, limit: "10", page, list_type: "archive" }, Token,)
            search || page === 1 ? SetArchive(Response?.data?.items) : SetArchive(prevData => [...prevData, ...Response?.data?.items]);

            setLoadPages(Response?.data?.meta);
            setApiResponse(Response)
        } catch (error) {
            console.error("Error loading wishes:", error);
        } finally {
            setLoadMoreLoading(false);
        }
    };

    useEffect(() => {
        GetArchive(Page, ItemSearch);
    }, [isFocused, Token, ItemSearch]);

    useEffect(() => {
        if (Page > 1) {
            GetArchive(Page);
        }
    }, [Page, Token]);

    /**
     * Load more 
     */

    const LoadMorePage = () => {
        if (LoadPages?.totalPages > Page && !LoadMoreLoading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

        if (distanceFromBottom < 100 && LoadPages?.totalPages > Page && !LoadMoreLoading) {
            LoadMorePage();
        }
    };

    /** 
    * Search store
    */
    const BebouncedSearch = useCallback(
        debounce((search) => {
            setSearchPerformed(true);
            SetItemSearch(search)
        }, 500),
        []
    )

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <SearchBar
                {...{
                    onSearch: BebouncedSearch
                }}
            />
            {
                (!Archive || Archive.length === 0) ? (
                    searchPerformed || apiResponse ? (
                        <NotFound
                            title="common.notFoundText"
                        />
                    ) : (
                        <View style={AppCommonStyle.ws_top_indicator_box}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                    )
                ) : (
                    Archive && Archive.length > 0 ? (
                        <>
                            {
                                Archive.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <WishesBanner
                                                {...{
                                                    item,
                                                }}
                                            />
                                        </View>
                                    )
                                })
                            }
                            {LoadMoreLoading && (
                                <View style={AppCommonStyle.ws_indicator_box}>
                                    <ActivityIndicator color={theme.text} size="small" />
                                </View>
                            )}
                        </>
                    ) : (
                        <NotFound
                            title="common.notFoundText"
                        />
                    )
                )
            }
        </ScrollView>
    )
}

export default ArchiveList


