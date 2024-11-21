/** React Import */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, ScrollView, ActivityIndicator, Dimensions } from 'react-native'

/** Local Imports */
import { toast } from '../../../../utils/helpers/metrics'
import { useTheme } from '../../../../utils/context/ThemeContext'
import { useLanguage } from '../../../../utils/context/LanguageContext'

/** Components */
import { WishesBanner } from '../../../wishes-banner'
import SearchBar from '../../../search-bar'
import { makeRequest } from '../../../../utils/make-request'
import { useAuth } from '../../../../utils/context/AuthContext'
import ActionSheet from '../../../action-sheet'

/** Icons */
import RejectIcon from "../../../../../assets/svgs/reject.svg"

/** Libraries */ 
import { useIsFocused } from '@react-navigation/native'
import { debounce } from 'lodash'
import { AppCommonStyle, Colors } from '../../../../utils/styles'
import NotFound from '../../../not-found'


const screenHeight = Dimensions.get('window').height;
const SettingSheetHeight = screenHeight > 800 ? screenHeight * 0.35 : screenHeight * 0.42;

/** Main Export */
const InvitationList = ({ GetInvitationItem }) => {
    const { theme } = useTheme()
    const { translate } = useLanguage()
    const { Token } = useAuth()
    const InvitationRef = useRef()
    const isFocused = useIsFocused()

    const [InvitationId, SetInvitationId] = useState()
    const [InvitationType, SetInvitationType] = useState()
    const [InvitationData, setInvitationData] = useState([])
    const [searchPerformed, setSearchPerformed] = useState(false);

    const [ItemSearch, SetItemSearch] = useState()
    const [Page, setPage] = useState(1);
    const [LoadPages, setLoadPages] = useState({ totalPages: 1 });
    const [LoadMoreLoading, setLoadMoreLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null)

    /**
     * Get invitation data
     */
    const GetInvitation = async (search, page) => {
        setLoadMoreLoading(true);
        try {
            const Response = await makeRequest("GET", "event/invitations", { search: search, limit: "10", page, list_type: "invitation" }, Token)
            search || page === 1 ? setInvitationData(Response?.data?.items) : setInvitationData(prevData => [...prevData, ...Response?.data?.items]);

            setLoadPages(Response?.data?.meta);
            setApiResponse(Response)
        } catch (error) {
            console.log(error)
        }
        setLoadMoreLoading(false);
    }

    // useEffect(() => {
    //     GetInvitation(ItemSearch, Page)
    // }, [isFocused, ItemSearch, Page]);

    /**
    *  Handle rerender
    */
    const wishesData = useMemo(() => {
        return GetInvitation(ItemSearch, 1);
    }, [isFocused, Token, ItemSearch]);

    useEffect(() => {
        if (Page) {
            GetInvitation(ItemSearch, Page);
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
            setSearchPerformed(true);
            SetItemSearch(search)
        }, 500),
        []
    )

    /** 
     * Handdle reject sheet open
     */
    const HandleInvitationSheet = (Data, type) => {
        SetInvitationId(Data.slug)
        SetInvitationType(type)
        if (InvitationRef.current) {
            InvitationRef.current.snapToIndex(0)
        }
    }

    /**
     * Handle accept and reject
     */
    const HandleInvitationEvent = async (Data, type) => {
        try {

            const TYPE = type == "accepted" ? type : InvitationType
            const ID = type == "accepted" ? Data.slug : InvitationId

            const Response = await makeRequest("PUT", `group/${ID}/${TYPE}`, null, Token)

            if (Response.success === 1) {
                toast("success", {
                    title: Response.message,
                })
                await GetInvitation(ItemSearch, 1)
                await GetInvitationItem()
            } else if (Response.success === 0) {
                toast("error", {
                    title: Response.message,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
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
                {(!InvitationData || InvitationData.length === 0) ? (
                    searchPerformed || apiResponse ? (
                        <NotFound
                            title="common.invitationNot"
                        />
                    ) : (
                        <View style={AppCommonStyle.ws_top_indicator_box}>
                            <ActivityIndicator color={theme.text} size="small" />
                        </View>
                    )
                ) : (
                    InvitationData && InvitationData.length > 0 ? (
                        <>
                            {InvitationData.map((item, index) => (
                                <View key={index}>
                                    <WishesBanner
                                        {...{
                                            item,
                                            HandleInvitationSheet,
                                            type: "invitation",
                                            HandleInvitationEvent
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
                                title: "common.invitationNot",
                            }}
                        />
                    )
                )
                }

            </ScrollView>
            <ActionSheet
                {...{
                    BottomSheetRef: InvitationRef,
                    Points: SettingSheetHeight,
                    type: "logout",
                    btnText: "Reject",
                    btnTitle: `Are you sure you want to Reject?`,
                    SheetIcon: RejectIcon,
                    onPress: HandleInvitationEvent,
                    bgcolr: Colors.ws_reject,
                }}
            />
        </>
    )
}

export default InvitationList
