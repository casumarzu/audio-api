import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import test from './Test.Reducer'

export default combineReducers({
  test,
  routing
})
