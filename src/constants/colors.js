import { Dimensions } from 'react-native'
//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')
export default {
    // placeHolder: '#9f7676',
    placeHolder: 'rgba(117,113,154,1)',
    buttonColor: '#d3a3f9',
    textColor: '#3f016e',
    textInputBg: 'rgba(197,198,186,1)',
    mediumTint: 'rgba(107,0,188,1)',
    lightTint: 'rgba(177,77,255,1)',
    evenLighterTint: 'rgba(193,113,255,1)',
    buttonPurple: 'rgba(155,97,234,1)',
    buttonPink: 'rgba(252,140,250,1)',
    buttonPinkTransparent: 'rgba(252,140,250,.25)',
    pinkLESSTransparent: 'rgba(252,180,250,.70)',
    bottomBorderTint: 'rgba(177,77,255,1)',
    transparentModal: 'rgba(0,0,0,0.43)',
    yellow: 'rgba(255, 237, 187, 1)',
    blue: 'rgba(150, 227, 255, 1)',
    blue2: 'rgba(72,150,239,1)',
    blue3: 'rgba(67,97,238,1)',
    blue4: 'rgba(1,53,139,1)',
    pinkUnderLine: '#e896be',
    separatorLine: 'rgba(224,224,224,1)',

    //biyoura purple
    biyouraPurple: 'rgba(67, 0, 138, 1)',

    // new pallet
    nPButton: 'rgba(107,126,225,1)',
    nPButtonOld: 'rgba(245, 97, 139, 1)',
    darkestColorP1: '#1A1B1E',
    darkColorP1: 'rgba(42,44,58,1)',
    lightestColorP1: 'rgba(146, 136, 153, 1)',
    backgroundBlurLight: 'rgba(235,235,235, 0.75)',
    inputBorderColor: 'rgba(235,235,235,1)',
    overallBackground: '#e0e0e0',

    // new pallet 2
    mainColorP2: 'rgba(107,126,225,1)',
    mainColorP3: '#7300ff',
    borderRadius: 16,
    maxFontSizeMultiplier: 1.2,
    screenHeight: height,
    screenWidth: width,
    iOSBlue: 'rgba(0,122,225,1)',
    iOSGrey: 'rgba(209,209,234,1)',

    // currentMainColor: 'rgba(28,73,179,1)',
    currentMainColor: 'rgba(237, 88, 94, 1)',
    currentMainColorOpacity05: 'rgba(237, 88, 94, 0.5)',
    currentMainColorOpacity03: 'rgba(237, 88, 94, 0.3)',

    grey: '#969897',
    darkGrey: 'rgba(71,71,71,1)',

    rowHeight: (width * 16) / 9,

    semiBold: 'Poppins_600SemiBold',
    font: 'Poppins_400Regular',
}
