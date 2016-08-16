import _ from 'lodash'
import {
  TEST_SUCCESS,
  TEST_PENDING,
  TEST_ERROR,
} from 'Constants/Test.Constants'

const initialState = {
  list: [],
  error: {}
}

export default function testReducer(state = initialState, action) {
  switch (action.type) {
    case TEST_SUCCESS:
      return { ...state, list: action.payload }
    case TEST_ERROR:
      return { ...state, error: action.payload }
    default:
      return state;
  }
}
