import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    BackHandler,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//expo camera
import { Camera } from 'expo-camera'

//expo AV
import { Video, AVPlaybackStatus } from 'expo-av'

//custom components
import HeaderX from '../components/HeaderX'
import CameraButton from '../components/CameraButton'
import EditorBottomActions from '../components/CameraComponents/EditorBottomActions'
import BottomSheet from '../components/CameraComponents/BottomSheet'

//ionicons
import { Entypo, Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

//colors
import colors from '../constants/colors'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//redux
import { takePicture, addToGallery } from '../store/camera/actions'
import { useDispatch, useSelector } from 'react-redux'

// MediaLibrary
import * as MediaLibrary from 'expo-media-library'

//gesture handlers
import {
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent,
    State,
    TapGestureHandler,
    TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler'
import Reanimated, {
    Extrapolate,
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedProps,
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    runOnUI,
} from 'react-native-reanimated'

//nav 5
import { useFocusEffect } from '@react-navigation/native'

//status bar
import { StatusBar } from 'expo-status-bar'

const { height, width } = Dimensions.get('window')

const CameraScreen = ({ navigation, route }) => {
    let checkMarkSet = useRef(route.params?.checkMarkSet).current
    const galleryIDPassed = useRef(route.params?.galleryID).current
    const newGalleryID = useRef(route.params?.newGalleryID).current

    //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------
    const bottomSheetRef = useRef()
    //----------------------------------------------------------------BOTTOM SHEET----------------------------------------------------------------

    // RATIO SETTER
    const [imagePadding, setImagePadding] = useState(0)
    const [ratio, setRatio] = useState('4:3') // default is 4:3
    const [previewRatio, setPreviewRatio] = useState(1) // default is 4:3
    const [picture64, setPicture64] = useState()
    // console.log(
    //     '🚀 ~ file: CameraScreen.js ~ line 79 ~ CameraScreen ~ previewRatio',
    //     previewRatio
    // )
    const screenRatio = height / width
    const [isRatioSet, setIsRatioSet] = useState(false)
    const prepareRatio = useCallback(async () => {
        let desiredRatio = '4:3' // Start with the system default
        // This issue only affects Android
        if (Platform.OS === 'android') {
            const ratios = await cameraRef.current.getSupportedRatiosAsync()
            // console.log(
            //     '🚀 ~ file: CameraScreen.js ~ line 88 ~ prepareRatio ~ ratios',
            //     ratios
            // )
            let distances = {}
            let realRatios = {}
            let minDistance = null
            let previewRatio = 1
            for (const ratio of ratios) {
                const parts = ratio.split(':')
                const ratioHeight = parseInt(parts[0])
                const ratioWidth = parseInt(parts[1])
                const realRatio = ratioHeight / ratioWidth

                realRatios[ratio] = realRatio
                // ratio can't be taller than screen, so we don't want an abs()
                const distance = screenRatio - realRatio
                distances[ratio] = realRatio
                if (minDistance == null) {
                    minDistance = ratio
                } else {
                    if (distance >= 0 && distance < distances[minDistance]) {
                        minDistance = ratio
                    }
                }
            }
            // set the best match
            desiredRatio = minDistance
            const parts = desiredRatio.split(':')
            const ratioHeight = parseInt(parts[0])
            const ratioWidth = parseInt(parts[1])
            previewRatio = ratioWidth / ratioHeight
            const picSize =
                await cameraRef.current.getAvailablePictureSizesAsync(
                    desiredRatio
                )
            // console.log(
            //     '🚀 ~ file: CameraScreen.js ~ line 123 ~ prepareRatio ~ picSize',
            //     picSize
            // )
            //  calculate the difference between the camera width and the screen height
            const remainder = Math.floor(
                height - realRatios[desiredRatio] * width
            )

            // set the preview padding and preview ratio
            setImagePadding(remainder)
            setRatio(desiredRatio)
            setPreviewRatio(+previewRatio.toFixed(2))
            // Set a flag so we don't do this
            // calculation each time the screen refreshes
            setIsRatioSet(true)
        }
    }, [])

    const setCameraReady = async () => {
        if (!isRatioSet) {
            await prepareRatio()
        }
    }
    // RATIO SETTER

    const [type, setType] = useState(Camera.Constants.Type.back)
    const [activateCamera, setActivateCamera] = useState(false)
    const [video, setVideo] = useState('')
    const [showVideoModal, setShowVideoModal] = useState(false)
    const insets = useSafeAreaInsets()

    //----------------------------------------------------------------ACTIVATE CAMERA----------------------------------------------------------------
    useFocusEffect(() => {
        if (navigation.isFocused()) {
            setActivateCamera(true)
        }
    })
    //----------------------------------------------------------------ACTIVATE CAMERA----------------------------------------------------------------

    const [pic, setPic] = useState(null)

    const [showModal, setShowPicture] = useState(false)

    const cameraRef = useRef()

    const dispatch = useDispatch()

    const [zooming, setZooming] = useState(0)

    //camera settings
    const [flashMode, setFlashMode] = useState('off')

    // const picTaken = useSelector((state) => state.cameraReducer.pictureUri)
    // console.log(
    //     '🚀 ~ file: CameraScreen.js ~ line 36 ~ CameraScreen ~ picTaken',
    //     picTaken
    // )

    // camera Functions
    const takePictureHandler = async () => {
        try {
            if (cameraRef.current) {
                const options = {
                    quality: 0.1,
                    base64: true,
                    skipProcessing: true,
                }
                let photo = await cameraRef.current.takePictureAsync(options)
                setPic(photo.uri)
                setPicture64(photo.base64)
                dispatch(takePicture(photo.uri, photo.base64))
                setShowPicture(true)
            }
        } catch (err) {
            console.log(err)
        }

        // setPickedImage(image.uri)
        // props.onImageTaken(image.uri)
    }

    const flipCameraHandler = useCallback(() => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        )
    }, [])

    function flashSwitchHandler() {
        if (flashMode === 'off') {
            setFlashMode('on')
        }
        if (flashMode === 'on') {
            setFlashMode('off')
        }
    }

    async function savePictureLocallyHandler(localUri) {
        const { status } = await MediaLibrary.getPermissionsAsync()
        if (status === 'undetermined') {
            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status === 'granted') {
                const asset = await MediaLibrary.createAssetAsync(localUri)
            }
        }

        if (status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(localUri)
            if (asset) {
                //display check mark showing it was saved.
            }
        }

        if (status === 'denied') {
            console.log('Open settings and give permission')
        }
    }

    // zoom gesture handler
    const zoom = useSharedValue(0)
    const MAX_ZOOM_FACTOR = 20
    const SCALE_FULL_ZOOM = 20
    const formatMaxZoom = 1
    const maxZoomFactor = Math.min(formatMaxZoom, MAX_ZOOM_FACTOR)
    const neutralZoomScaled = (neutralZoom / maxZoomFactor) * formatMaxZoom
    const maxZoomScaled = (1 / formatMaxZoom) * maxZoomFactor

    const neutralZoom = 0
    useAnimatedProps(
        () => ({
            zoom: interpolate(
                zoom.value,
                [0, neutralZoomScaled, 1],
                [0, neutralZoom, maxZoomScaled],
                Extrapolate.CLAMP
            ),
        }),
        [maxZoomScaled, neutralZoom, neutralZoomScaled, zoom]
    )

    function updateValue() {
        setZooming(zoom.value)
    }
    function willThisWork() {
        'worklet'
        runOnJS(updateValue)()
    }

    const onPinchGesture = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.startZoom = zoom.value
        },
        onActive: (event, context) => {
            // trying to map the scale gesture to a linear zoom here
            const startZoom = context.startZoom ?? 0
            const scale = interpolate(
                event.scale,
                [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
                [-1, 0, 1],
                Extrapolate.CLAMP
            )
            zoom.value = interpolate(
                scale,
                [-1, 0, 1],
                [0, startZoom, 1],
                Extrapolate.CLAMP
            )
            willThisWork()
        },
    })

    // VIDEO RECORDING
    async function beginRecording() {
        let video = await cameraRef.current.recordAsync()
        setVideo(video)
        // dispatch(takePicture(photo.uri))
    }
    async function endRecording() {
        cameraRef.current.stopRecording()
        setShowVideoModal(true)
    }

    //UPLOADING PICTURE
    const uploadPhotoHandler = async () => {
        try {
            dispatch(
                addToGallery(
                    `data:image/jpeg;base64,${picture64}`,
                    newGalleryID ? [`${newGalleryID}`] : [galleryIDPassed]
                )
            )
            setShowPicture(false)

            // if (!newGalleryID) {
            //     navigation.navigate('GalleryView', {
            //         shouldRefresh: 'shouldRefresh',
            //     })
            // }
        } catch (err) {}
    }

    return (
        <View
            style={{
                ...styles.container,
                // paddingTop: Platform.OS === 'android' ? insets.top : null,
            }}
        >
            <StatusBar
                style=""
                translucent
                backgroundColor="rgba(255,255,255,0)"
            />
            <PinchGestureHandler onGestureEvent={onPinchGesture}>
                <Reanimated.View
                    style={{
                        flex: 1,
                        backgroundColor: 'black',
                        justifyContent: 'flex-start',
                        paddingBottom: -imagePadding,
                    }}
                >
                    {activateCamera && (
                        <Camera
                            style={{
                                // marginTop: imagePadding,
                                // marginBottom: imagePadding,
                                // height: height - imagePadding * 4,
                                // width: '100%',
                                aspectRatio:
                                    Platform.OS === 'android'
                                        ? previewRatio
                                        : null,
                                flex: 1,
                            }}
                            ref={cameraRef}
                            type={type}
                            flashMode={flashMode}
                            zoom={zooming}
                            onCameraReady={setCameraReady}
                            ratio={ratio}
                            maxDuration={10000}
                            autoFocus="on"
                        ></Camera>
                    )}
                    <View
                        style={[
                            styles.contentContainer,
                            {
                                paddingTop: insets.top,
                                paddingBottom: insets.bottom,
                                top: insets.top,
                                bottom: insets.bottom,
                            },
                        ]}
                    >
                        <View style={styles.topLeftCont}>
                            <TouchableOpacity onPress={flipCameraHandler}>
                                <Entypo
                                    name="loop"
                                    size={27}
                                    color="white"
                                    style={styles.flipIcon}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={flashSwitchHandler}>
                                <Ionicons
                                    name={
                                        flashMode !== 'off'
                                            ? 'flash'
                                            : 'flash-off'
                                    }
                                    size={27}
                                    color="white"
                                    style={styles.cameraSettingsButton}
                                />
                            </TouchableOpacity>
                        </View>

                        <CameraButton
                            style={{
                                ...styles.floatingPlusCont,
                                left: width / 2 - 45,
                            }}
                            onLongPress={beginRecording}
                            onEndPress={endRecording}
                            onTap={takePictureHandler}
                        />
                    </View>
                </Reanimated.View>
            </PinchGestureHandler>
            {showModal && (
                <View style={{ ...styles.modal, height: height }}>
                    <ImageBackground
                        source={{ uri: pic }}
                        style={{
                            ...styles.takenImage,
                            paddingTop: insets.top,
                            paddingBottom: insets.bottom,
                        }}
                    >
                        <HeaderX
                            color="white"
                            goBack={() => {
                                setShowPicture(false)
                                setPic('')
                            }}
                        />
                        <EditorBottomActions
                            onSave={savePictureLocallyHandler}
                            onUpload={uploadPhotoHandler}
                            checkMarkSet={checkMarkSet}
                            onPresentGalleries={() => {
                                bottomSheetRef.current?.handlePresentModalPress()
                            }}
                        />
                    </ImageBackground>
                </View>
            )}
            {showVideoModal && (
                <View style={{ ...styles.modal, height: height }}>
                    <Video
                        // ref={video}
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: 'black',
                                height: height,
                            },
                        ]}
                        source={{
                            uri: video.uri,
                        }}
                        resizeMode="contain"
                        isLooping
                        shouldPlay={true}
                        // onPlaybackStatusUpdate={(status) =>
                        //     setStatus(() => status)
                        // }
                    />
                    <View
                        style={{
                            paddingTop: insets.top,
                        }}
                    ></View>
                    <HeaderX
                        color="white"
                        goBack={() => {
                            setShowVideoModal(false)
                            setVideo('')
                        }}
                    />
                </View>
            )}
            {showModal || showVideoModal ? (
                <BottomSheet
                    ref={bottomSheetRef}
                    navigation={navigation}
                    base64Pic={picture64}
                    dismissModal={() => {
                        setShowPicture(false)
                    }}
                />
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    contentContainer: {
        flex: 1,
        position: 'absolute',
        right: 0,
        left: 0,
    },
    camera: {
        flex: 1,
        flexDirection: 'row',
    },

    topLeftCont: {
        position: 'absolute',
        width: 45,
        top: 0,
        right: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(184,184,184,0.42)',
        alignItems: 'center',
        justifyContent: 'space-between',
        // flexDirection: 'row',
        padding: 5,
    },
    flipIcon: {
        marginVertical: 7,
        transform: [
            {
                rotate: '90deg',
            },
        ],
    },
    cameraSettingsButton: { marginVertical: 7 },
    modal: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
    },
    takenImage: {
        flex: 1,
        justifyContent: 'space-between',
    },
    bottomCont: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 10,
    },
    bottomButtonsCont: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    floatingPlusCont: {
        bottom: 25,
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    loadingView: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        // marginLeft: 10,
        height: 40,
        width: 60,
        borderRadius: 20,
        backgroundColor: colors.lightTint,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default CameraScreen
