/** React Imports */
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View, } from 'react-native'

/** Local Imports */
import { AppCommonStyle } from '../../../../utils/styles'
import { toast } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'
import { useAuth } from '../../../../utils/context/AuthContext'
import { makeRequest } from '../../../../utils/make-request'

/** Components */
import SwipeableComponent from '../../../swipeable-component'
import { WishesBanner } from '../../../wishes-banner'
import SearchBar from '../../../search-bar'
import NotFound from '../../../not-found'

/** Libraries */
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { debounce } from 'lodash'

/** Main Export */
const WishBankArchive = () => {
    const { theme } = useTheme()
    const { translate } = useLanguage()
    const Navigation = useNavigation()

    const isFocused = useIsFocused()
    const { Token } = useAuth()

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
            const Response = await makeRequest('GET', 'event', { type:"my",search: search, limit: "10", page, list_type: "archive" }, Token,)
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

    /**
    * Delete Archive
    */
    const DeleteArchive = async () => {
        try {
            const Response = await makeRequest('DELETE', `event/${selectedSlug}`, null, Token)
            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                await GetArchive(Page)
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

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleScroll}
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
                                Archive.map((item, index) => (
                                    <SwipeableComponent
                                        key={index}
                                        slug={item.slug}
                                        setSelectedSlug={setSelectedSlug}
                                        onDelete={DeleteArchive}
                                        swipetext="common.delete"
                                        btntext="common.delete"
                                        subtext="common.sureDelete"
                                    >
                                        <WishesBanner
                                            item={item}
                                            type="wish_bank"
                                        />
                                    </SwipeableComponent>
                                ))
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

export default WishBankArchive
