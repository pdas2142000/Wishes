/** React Imports */
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

/** Components */
import SearchBar from '../../../search-bar'
import { WishesBanner } from '../../../wishes-banner'
import NotFound from '../../../not-found'

/** Libraries */
import { useIsFocused } from '@react-navigation/native'
import { debounce } from 'lodash'

/** Local Imports */
import { useAuth } from '../../../../utils/context/AuthContext'
import { makeRequest } from '../../../../utils/make-request'
import { AppCommonStyle } from '../../../../utils/styles'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Main Export */
const WishLists = () => {

    const isFocused = useIsFocused()
    const { Token } = useAuth()
    const { theme } = useTheme()

    const [WishListData, setWishListData] = useState()
    const [ItemSearch, SetItemSearch] = useState()
    const [Page, setPage] = useState(1);
    const [LoadPages, setLoadPages] = useState({ totalPages: 1 });
    const [LoadMoreLoading, setLoadMoreLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [apiResponse, setApiResponse] = useState(null)

    /**
     * Get all wish lists 
     */
    const GetWishList = async (search, page) => {
        setLoadMoreLoading(true);
        try {
            const Response = await makeRequest("GET", "wish/list", { search: search, limit: "10", page, list_type: "general", type:"friend" }, Token)
            search || page === 1 ? setWishListData(Response?.data?.items) : setWishListData(prevData => [...prevData, ...Response?.data?.items]);
            setLoadPages(Response?.data?.meta);
            setApiResponse(Response)
        } catch (error) {
            console.log(error)
        }
        setLoadMoreLoading(false);
    }

    useEffect(() => {
        GetWishList(ItemSearch, Page)
    }, [isFocused, ItemSearch, Page]);

    useEffect(() => {
        if (Page) {
            GetWishList(ItemSearch, Page);
        }
    }, [Page, Token, ItemSearch, isFocused]);

    const LoadMorePage = () => {
        if (LoadPages?.totalPages > Page && !LoadMoreLoading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    /**
    * Scroll to fetch data 
    */
    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

        if (distanceFromBottom < 100 && LoadPages?.totalPages > Page && !LoadMoreLoading) {
            LoadMorePage();
        }
    };

    /** 
    * Search Event
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
                (!WishListData || WishListData.length === 0) ? (
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
                    WishListData && WishListData.length > 0 ? (
                        <>
                            {WishListData?.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <WishesBanner
                                            {...{
                                                item,
                                                event_flag: "general"
                                            }}
                                        />
                                    </View>
                                )
                            })}
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
                )
            }
        </ScrollView>
    )
}

export default WishLists
