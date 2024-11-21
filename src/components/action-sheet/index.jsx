/**React Import */
import React, { useMemo, useState, } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

/** Library */
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, } from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'

/** Styles */
import { ms } from '../../utils/helpers/metrics'
import BottomSheetHeader from '../bottomsheet-header'
import { ActionSheetstyles } from './ActionHelper'

/** Icon */
import IconCheck from "../../../assets/svgs/check.svg"
import IconCircle from "../../../assets/svgs/circle_new.svg"
import PdfIcon from "../../../assets/svgs/pdf.svg"
import ImageIcon from "../../../assets/svgs/image_file.svg"

/** Local Imports */
import { Colors } from '../../utils/styles'
import { IconProps } from '../../utils/helpers/Iconprops'
import { useLanguage } from '../../utils/context/LanguageContext'
import { useTheme } from '../../utils/context/ThemeContext'

/** Components */
import { CommonBanner } from '../wishes-banner'
import FilterSheet from '../filter-sheet'
import SubmitButton from '../submit-button'
import Counter from '../form-utils/counter'


/** Main Export */
const ActionSheet = ({
    BottomSheetRef,
    type,
    Points,
    Title,
    Data,
    onSelect,
    selectedItem,
    currentTheme,
    btnText,
    btnTitle,
    SheetIcon,
    onPress,
    bgcolr,
    launchGallery,
    HandlePickDocument,
    FormBuilder,
    handleSubmit
}) => {

    const { translate } = useLanguage()
    const styles = ActionSheetstyles
    const { theme } = useTheme()

    const [IsActive, setIsActive] = useState(selectedItem || currentTheme)

    const HandleCloseBottomsheet = () => {
        BottomSheetRef?.current?.close()
    }

    const SnapPoints = useMemo(() => [Points], [Points])

    const HandleSelectItem = (item) => {
        setIsActive(item)
    }

    const HandleDone = () => {
        onSelect(IsActive)
        HandleCloseBottomsheet()
    }

    return (
        <>
            <Portal hostName='BottomSheet'>
                <BottomSheet
                    snapPoints={SnapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={RenderBackdrop}
                    ref={BottomSheetRef}
                    backgroundStyle={{ backgroundColor: theme.background }}
                    handleIndicatorStyle={{ backgroundColor: theme.subtext }}
                    index={-1}
                >
                    {
                        type != 'logout' ?
                            <BottomSheetHeader
                                {...{
                                    HandleClose: HandleCloseBottomsheet,
                                    title: Title
                                }}
                            /> : null
                    }
                    <View style={[styles.ws_main_content]}>
                        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                            {
                                type === "filter" ?
                                    <FilterSheet SheetClose={HandleCloseBottomsheet}
                                    /> :
                                    type === "pick_Profile" ?
                                        <View style={styles.ws_options_box}>
                                            {
                                                Data.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={styles.ws_options}
                                                            onPress={item.onpress}
                                                        >
                                                            <Text style={[styles.ws_options_text, { color: theme.text }]}>{item.text}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View> :
                                        type === "contact" ?
                                            <View style={styles.ws_options_box}>
                                                {
                                                    Data.map((item, index) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.ws_options}
                                                                onPress={item.onpress}
                                                                key={index}
                                                            >
                                                                <Text style={[styles.ws_options_text, { color: theme.text }]}>{item.text}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </View>
                                            :
                                            type === "group_user" ?
                                                <View style={{ marginTop: ms(20) }}>
                                                    <ScrollView showsVerticalScrollIndicator={false}>
                                                        {
                                                            Data?.map((item, index) => {
                                                                return (
                                                                    <View key={index} >
                                                                        <CommonBanner
                                                                            {...{
                                                                                item,
                                                                                type: "guest"
                                                                            }}
                                                                        />
                                                                    </View>
                                                                )
                                                            })
                                                        }

                                                    </ScrollView>
                                                </View>
                                                :
                                                type === "logout" ?
                                                    <View style={{ marginTop: ms(20) }}>
                                                        <View style={styles.sa_top_content}>
                                                            <SheetIcon {...IconProps(ms(35))} fill={"#dbdbdb"} />
                                                            <Text style={[styles.sa_text, { color: theme.text }]}>{translate(btnTitle)}</Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                HandleCloseBottomsheet()
                                                                onPress()
                                                            }}
                                                            style={[styles.sa_cancel_btn, { backgroundColor: bgcolr ? bgcolr : Colors.ws_reject }]}
                                                        >
                                                            <Text style={[styles.sa_cancel_btn_text, { color: Colors.ws_white }]}>
                                                                {translate(btnText)}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => HandleCloseBottomsheet()}
                                                            style={[styles.sa_cancel_btn, { backgroundColor: theme.card_bg }]}
                                                        >
                                                            <Text style={[styles.sa_cancel_btn_text, { color: theme.text }]}>
                                                                {translate("common.cancel")}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    :
                                                    type === "gift" ?
                                                        <View style={{justifyContent: "space-evenly", flex: 1, height:ms(190) }}>
                                                            {FormBuilder.map((item, index) => {
                                                                return <Counter {...item} key={index} />
                                                            })}
                                                            <View>
                                                                <SubmitButton
                                                                    {...{
                                                                        type: "submit",
                                                                        title: "common.submit",
                                                                        OnPress: ()=>{
                                                                            onPress();
                                                                            HandleCloseBottomsheet();
                                                                        }
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                        :
                                                        type === "chat_file" ?
                                                            <View style={{ marginTop: ms(20) }}>
                                                                <TouchableOpacity style={[styles.ws_options, { flexDirection: "row", alignItems: "center" }]} onPress={HandlePickDocument}>
                                                                    <PdfIcon {...IconProps(ms(20))} fill={theme.text} />
                                                                    <Text style={[styles.ws_options_text, { color: theme.text, marginLeft: ms(10) }]}>Choose PDF</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity style={[styles.ws_options, { flexDirection: "row", alignItems: "center" }]} onPress={launchGallery}>
                                                                    <ImageIcon {...IconProps(ms(20))} fill={theme.text} />
                                                                    <Text style={[styles.ws_options_text, { color: theme.text, marginLeft: ms(10) }]}>Choose image</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            :
                                                            <View style={styles.ws_content}>
                                                                <ScrollView showsVerticalScrollIndicator={false}>
                                                                    <View style={[styles.ws_language_box]}>
                                                                        {
                                                                            Data.map((item, index) => {
                                                                                return (
                                                                                    <TouchableOpacity
                                                                                        key={index}
                                                                                        style={styles.ws_content_btn}
                                                                                        onPress={() => HandleSelectItem(item)}
                                                                                    >
                                                                                        <Text style={[styles.ws_btn_text, { color: theme.text }]}>{item.text}</Text>
                                                                                        {IsActive?.value === item.value ? (
                                                                                            <IconCheck {...IconProps(ms(23))} fill={theme.text} />
                                                                                        ) : (
                                                                                            <IconCircle {...IconProps(ms(23))} fill={theme.text} />
                                                                                        )}
                                                                                    </TouchableOpacity>
                                                                                )
                                                                            })
                                                                        }
                                                                    </View>
                                                                </ScrollView>
                                                                <View style={styles.ws_action_btn_box}>
                                                                    <TouchableOpacity
                                                                        style={[styles.ws_btn,
                                                                        { backgroundColor: Colors.ws_primary_blue }]} onPress={HandleDone}  >
                                                                        <Text style={[styles.ws_action_text, { color: Colors.ws_white }]}>{translate("common.done")}</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <SafeAreaView />
                                                            </View>
                            }
                        </BottomSheetScrollView>
                    </View>
                </BottomSheet>
            </Portal>
        </>

    )
}

export default ActionSheet

const RenderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
)
