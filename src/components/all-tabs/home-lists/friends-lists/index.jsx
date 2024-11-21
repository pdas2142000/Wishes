/** React Import */
import React, { useCallback, useEffect, useState } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'

/** Librarys */
import { useIsFocused } from '@react-navigation/native'
import { debounce } from 'lodash'

/** Local Imports */
import { AppCommonStyle } from '../../../../utils/styles'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'

/** Components */
import { WishesBanner } from '../../../wishes-banner'

/** Icons */
import SearchBar from '../../../search-bar'
import NotFound from '../../../not-found'

/** Main Export */
const HomeEventList = () => {
    const isFocused = useIsFocused()
    const { theme } = useTheme()
    const { Token } = useAuth()

    const [EventData, setEventData] = useState([])
    const [ItemSearch, SetItemSearch] = useState()
    const [Page, setPage] = useState(1);
    const [LoadPages, setLoadPages] = useState({ totalPages: 1 });
    const [LoadMoreLoading, setLoadMoreLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [apiResponse, setApiResponse] = useState(null)

    const GetEvent = async (search, page) => {
        setLoadMoreLoading(true);
        try {
            const Response = await makeRequest('GET', 'event', { search: search, limit: "10", page, list_type: "event", type:"friend" }, Token,)
            search || page === 1 ? setEventData(Response?.data?.items) : setEventData(prevData => [...prevData, ...Response?.data?.items]);

            setLoadPages(Response?.data?.meta);
            setApiResponse(Response)
        } catch (error) {
            console.error("Error loading wishes:", error);
        } finally {
            setLoadMoreLoading(false);
        }
    }

    useEffect(() => {
        GetEvent(ItemSearch, Page)
    }, [isFocused, ItemSearch, Page])

    const LoadMorePage = () => {
        if (LoadPages?.totalPages > Page && !LoadMoreLoading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        if (Page > 1) {
            GetEvent(ItemSearch, Page);
        }
    }, [Page, Token, ItemSearch, isFocused]);

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
            setSearchPerformed(true)
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
                (!EventData || EventData.length === 0) ? (
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
                    EventData && EventData.length > 0 ? (
                        <>
                            {EventData.map((item, index) => (
                                <View key={index}>
                                    <WishesBanner
                                        {...{
                                            item,
                                        }}
                                    />
                                </View>
                            ))}
                            {LoadMoreLoading && (
                                <View style={AppCommonStyle.ws_indicator_box}>
                                    <ActivityIndicator color={theme.text} size="small" />
                                </View>
                            )}
                        </>
                    ) : (
                        <NotFound
                            {...{
                                title: 'common.notFoundText',
                            }}
                        />
                    )
                )}
        </ScrollView>
    )
}

export default HomeEventList

