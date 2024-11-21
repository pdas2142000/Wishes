/** React Import */
import React from 'react'
import {
    Dimensions,
    Image,
    PermissionsAndroid,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

/** Library */
import { Controller } from 'react-hook-form'
import * as ImagePicker from 'react-native-image-picker';

/** Local Import */
import Formfields from '../../../utils/models/FormFields.json'
import { IconProps } from '../../../utils/helpers/Iconprops'

/** Styles */
import { ms } from '../../../utils/helpers/metrics'
import { Colors } from '../../../utils/styles'

/** Icon */
import Pencil from "../../../../assets/svgs/pencil.svg"

/** Components */
import ActionSheet from '../../action-sheet'
import { useTheme } from '../../../utils/context/ThemeContext';

const screenHeight = Dimensions.get('window').height;
const SheetPoints = screenHeight > 800 ? screenHeight * 0.3 : screenHeight * 0.35;

/** Main Export */
const FilePicker = ({
    name,
    parent,
    control,
    label,
    type,
    styles,
    BottomSheetRef
}) => {

    const { theme } = useTheme()

    const Formfield = Formfields
    const FieldName = parent ? Formfield[parent][name] : Formfield[name]

    /**
     * Handle bottom sheet here
     */
    const HandleFile = () => {
        if (BottomSheetRef?.current) {
            BottomSheetRef?.current?.snapToIndex(0)
        }
    }

    /**
     * Open gallary to choose photo
     * @param {Image data} onChange 
     */
    const launchGallery = async (onChange) => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo'
        });
        if (result && !result.didCancel) {
            const { assets } = result;
            if (assets && assets.length > 0) {
                const selectedImage = assets[0];
                onChange(selectedImage);
                BottomSheetRef?.current?.close()
            }
        }
    }

    /**
     * Camera permission android
     */
    async function requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'We need access to your camera to take photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    /**
     * Takeing photo useing device camera
     * @param {Image data} onChange 
     */
    const TakeAPhoto = async (onChange) => {
        try {
            await requestCameraPermission();
            const image = await ImagePicker.launchCamera({
                mediaType: 'photo',
            });
            if (image && !image.didCancel) {
                const selectedImage = image.assets[0];
                onChange(selectedImage);
                BottomSheetRef?.current?.close();
            }
        } catch (error) {
            console.error('Error launching camera:', error);
        }
    };

    /**
     * Remove current image
     * @param {Image data} onChange 
     */
    const RemoveImage = (onChange) => {
        onChange(null);
        BottomSheetRef?.current?.close();
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange }, fieldState: { error } }) => {

                const EditAccount = [
                    {
                        text: "Choose from gallery",
                        onpress: () => launchGallery(onChange),
                    },
                    {
                        text: "Take a photo",
                        onpress: () => TakeAPhoto(onChange),
                    },
                    {
                        text: "Remove image",
                        onpress: () => RemoveImage(onChange),
                    },
                ]

                return (
                    <View>
                        {label ? (
                            <Text style={styles.FormLabel}>{FieldName?.label}</Text>
                        ) : null}
                        {
                            type === "image_pick" ?
                                <View style={{ marginBottom: ms(12) }}>
                                    <TouchableOpacity style={[styles.ws_image_content, { backgroundColor: theme.card_bg }]} onPress={HandleFile}>
                                        {
                                            value ?
                                                <Image style={[styles.ws_img]} source={{ uri: value?.uri ? value.uri : value }} />
                                                :
                                                <View style={styles.ws_img_box}>
                                                    <Image
                                                        style={[styles.ws_img, { tintColor: theme.subtext }]}
                                                        source={require("../../../../assets/images/photo.png")}
                                                    />
                                                </View>
                                        }
                                    </TouchableOpacity>
                                    {error ? <Text style={styles.ws_error} numberOfLines={1} ellipsizeMode='tail'>{error.message}</Text> : null}
                                </View>
                                :
                                <View style={styles.ws_icon_box}  >
                                    <TouchableOpacity onPress={HandleFile}>
                                        <View style={[styles.ws_image_box, { borderColor: theme.editinfoborder }]} >
                                            <View style={[styles.ws_image_container,]} >
                                                {
                                                    value ?
                                                        <Image style={styles.ws_img} source={{ uri: value.uri }} /> :
                                                        <Image style={[styles.ws_img, { tintColor: theme.card_bg }]} source={require("../../../../assets/images/user.png")} />
                                                }
                                            </View>
                                        </View>
                                        <View style={[styles.ws_edit_container,]}>
                                            <View style={[styles.ws_edit_box,]} >
                                                <Pencil {...IconProps(ms(15))} fill={Colors.ws_white} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        }
                        <ActionSheet
                            {...{
                                BottomSheetRef: BottomSheetRef,
                                type: "pick_Profile",
                                Points: SheetPoints,
                                Title: "Choose image",
                                Data: EditAccount
                            }}
                        />
                    </View>

                )
            }}
        />
    )
}


export default FilePicker


