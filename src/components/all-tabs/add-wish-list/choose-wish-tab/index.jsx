/** React Imports */
import React, { useCallback, useEffect, useState } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'

/** Components */
import { SelectableBanner } from '../../../wishes-banner'
import SearchBar from '../../../search-bar'

/** Local Imports */
import { AppCommonStyle } from '../../../../utils/styles'
import { ms } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'

/** Libraries */
import { useIsFocused } from '@react-navigation/native'
import { debounce } from 'lodash'
import NotFound from '../../../not-found'

/** Main Export */
const ChooseWishTab = ({ EventId }) => {

    const { theme } = useTheme()
    const { translate } = useLanguage()
    const { Token } = useAuth()
    const isFocused = useIsFocused()

    const [Wishes, SetWishes] = useState([]);
    const [IsSelect, SetIsSelect] = useState([])
    const [ItemSearch, SetItemSearch] = useState()
    const [Page, setPage] = useState(1);
    const [LoadPages, setLoadPages] = useState({ totalPages: 1 });
    const [LoadMoreLoading, setLoadMoreLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null)
    const [searchPerformed, setSearchPerformed] = useState(false);

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

    useEffect(() => {
        GetWishes(Page, ItemSearch);
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
     * Post wish
     * @param {*} updatedIds 
     */
    const AddWishToEvent = async (updatedIds) => {
        const NewData = { event_id: EventId, wish_ids: updatedIds };
        const Response = await makeRequest("POST", "wish/add-from-bank", null, Token, NewData)
    };

    /**
     * Toggle wish 
     * @param {wish ID} ID 
     */
    const HandleTogle = (ID) => {
        SetIsSelect((prevId) => {
            const updatedIds = prevId.includes(ID)
                ? prevId.filter((id) => id !== ID)
                : [...prevId, ID];

            AddWishToEvent(updatedIds);
            return updatedIds;
        });
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
        <>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={{ flexGrow: 1 }}>
                    <View style={{ marginTop: ms(22), marginBottom: ms(-5) }}>
                        <SearchBar
                            {...{
                                onSearch: BebouncedSearch
                            }}  
                        />
                    </View> 
                    {
                        (!Wishes || Wishes.length === 0) ? (
                            searchPerformed || apiResponse ? (
                                <NotFound
                                    title="common.wishNot"
                                />
                            ) : (
                                <View style={AppCommonStyle.ws_top_indicator_box}>
                                    <ActivityIndicator color={theme.text} size="small" />
                                </View>
                            )
                        ) : (
                            Wishes && Wishes.length > 0 ? (
                                <>
                                    {Wishes?.map((item, index) => {
                                        const IsClick = item.slug
                                        const isSelected = IsSelect.includes(IsClick)

                                        return (
                                            <View key={index}>
                                                <SelectableBanner
                                                    {...{
                                                        onpress: () => HandleTogle(IsClick),
                                                        select: isSelected,
                                                        item
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
                                        title: 'common.wishNot',
                                    }}
                                />
                            )
                        )
                    }
                </View>
            </ScrollView>
        </>
    )
}

export default ChooseWishTab