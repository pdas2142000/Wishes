/** React Imports */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

/** Components */
import SwipeableComponent from '../../../swipeable-component'
import { WishesBanner } from '../../../wishes-banner'
import SearchBar from '../../../search-bar'
import NotFound from '../../../not-found'

/** Local Imports */
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import { toast } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'

/** Styles */
import { AppCommonStyle } from '../../../../utils/styles'

/** Libraries */
import { useIsFocused } from '@react-navigation/native'
import { debounce } from 'lodash'

/** Main Export */
const WishBankEventList = () => {

    const isFocused = useIsFocused()
    const { Token } = useAuth()
    const { theme } = useTheme()

    const [selectedSlug, setSelectedSlug] = useState(null)
    const [EventData, setEventData] = useState([])
    const [ItemSearch, SetItemSearch] = useState()
    const [Page, setPage] = useState(1);
    const [LoadPages, setLoadPages] = useState({ totalPages: 1 });
    const [LoadMoreLoading, setLoadMoreLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [apiResponse, setApiResponse] = useState(null)

    /**
     * Get Event 
     */
    const GetEvent = async (search, page) => {
        setLoadMoreLoading(true);
        try {
            const Response = await makeRequest('GET', 'event', { type: "my", list_type: "event", search: search, limit: "10", page, }, Token,)
            search || page === 1 ? setEventData(Response?.data?.items) : setEventData(prevData => [...prevData, ...Response?.data?.items]);

            setLoadPages(Response?.data?.meta);
            setApiResponse(Response)
        } catch (error) {
            console.error("Error loading wishes:", error);
        } finally {
            setLoadMoreLoading(false);
        }
    }

    /**
     *  Handle rerender
     */
    const wishesData = useMemo(() => {
        return GetEvent(ItemSearch, 1);
    }, [isFocused, Token, ItemSearch]);

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
    * Delete event
    */
    const DeleteEvent = async () => {
        try {
            const Response = await makeRequest('DELETE', `event/${selectedSlug}`, null, Token)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                await GetEvent(ItemSearch, 1)
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            toast("error", {
                title: 'Something went wrong!',
            })
        }
    }

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
                                <SwipeableComponent
                                    key={index}
                                    slug={item.slug}
                                    setSelectedSlug={setSelectedSlug}
                                    onDelete={DeleteEvent}
                                    swipetext="common.delete"
                                    btntext="common.delete"
                                    subtext="common.sureDelete"
                                >
                                    <WishesBanner
                                        item={item}
                                        type="wish_bank"
                                    />
                                </SwipeableComponent>
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

export default WishBankEventList
