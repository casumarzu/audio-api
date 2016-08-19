import * as colors from 'material-ui/styles/colors'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {}

firebase.initializeApp(config)

export const muiStyle = {
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: colors.blue500,
    primary2Color: colors.blue700,
    primary3Color: colors.blue400,
    accent1Color: colors.blueA200,
    accent2Color: colors.grey100,
    accent3Color: colors.grey500,
    textColor: colors.darkBlack,
    alternateTextColor: colors.white,
    canvasColor: colors.white,
    borderColor: colors.grey300,
    // disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: colors.cyan500,
    // clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: colors.fullBlack
  }
}
