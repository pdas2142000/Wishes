/** React Imports */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, View, } from 'react-native'

/** Local Imports */
import { AppCommonStyle, Colors, Fonts } from '../../../../utils/styles'
import { ms, toast } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'
import { useAuth } from '../../../../utils/context/AuthContext'
import { makeRequest } from '../../../../utils/make-request'

/** Components */
import SwipeableComponent from '../../../swipeable-component'
import { CommonBanner } from '../../../wishes-banner'
import SearchBar from '../../../search-bar'
import { useIsFocused, useNavigation } from '@react-navigation/native'

/** Libraries */
import { debounce } from 'lodash'
import NotFound from '../../../not-found'

/** Main Export */
const WishsList = () => {
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
    const [Wishes, SetWishes] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [apiResponse, setApiResponse] = useState(null)

    /**
     * Get wishes
     */
    const GetWishes = async (page, search) => {
        setLoadMoreLoading(true);
        try {
            const Response = await makeRequest('GET', 'wish/bank', { search: search, page, limit: "10" }, Token);

            search || page === 1 ? SetWishes(Response?.data?.items) : SetWishes(prevData => [...prevData, ...Response?.data?.items]);

            setLoadPages(Response?.data?.meta);
            setApiResponse(Response)
        } catch (error) {
            console.error("Error loading wishes:", error);
        } finally {
            setLoadMoreLoading(false);
        }
    }; 

    /**
     * Handle rerender
     */
    const wishesData = useMemo(() => {
        return GetWishes(1, ItemSearch);
    }, [isFocused, Token, ItemSearch]);
    
    useEffect(() => {
        setPage(1);
    }, [isFocused, Token, ItemSearch]);

    const LoadMorePage = () => {
        if (LoadPages?.totalPages > Page && !LoadMoreLoading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        if (Page > 1) {
            GetWishes(Page);
        }
    }, [Page, Token]);

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
    * Delete Wish
    */
    const DeleteWish = async () => {
        try {
            const Response = await makeRequest('DELETE', `wish/${selectedSlug}`, null, Token)

            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                await GetWishes(Page)
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
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        >
            <SearchBar
                {...{
                    onSearch: BebouncedSearch
                }}
            />
            {
                (!Wishes || Wishes.length === 0) ? (
                    searchPerformed || apiResponse ? (
                        <NotFound
                            title="ManageWishesScreen.noWishes"
                        />
                    ) : (
                        <View style={AppCommonStyle.ws_top_indicator_box}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                    )
                ) :
                    (
                        Wishes && Wishes.length > 0 ? (
                            <>
                                {Wishes.map((item, index) => (
                                    <SwipeableComponent
                                        key={index}
                                        slug={item.slug}
                                        setSelectedSlug={setSelectedSlug}
                                        type="wishes"
                                        onDelete={DeleteWish}
                                        swipetext="common.delete"
                                        btntext="common.delete"
                                        subtext="common.sureDelete"
                                    >
                                        <CommonBanner
                                            item={item}
                                            onpress={() => Navigation.navigate("wishesinfoscreen", { Data: item })}
                                            default_image={require("../../../../../assets/images/gift.png")}
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
                                    title: 'ManageWishesScreen.noWishes',
                                }}
                            />
                        )
                    )
            }
        </ScrollView>
    );
}

export default WishsList
