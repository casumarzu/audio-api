import {
  TEST_SUCCESS,
  TEST_PENDING,
  TEST_ERROR
} from 'Constants/Test.Constants'

import { test } from 'Api/Test'

export function test(race_id) {
  return (test) => {
    test(race_id).then(
      json => dispatch({
        type: TEST_SUCCESS,
        payload: json
      }),
      err => dispatch({
        type: TEST_ERROR,
        payload: err
      })
    )
  }
}

export function done(json) {
  return (json) => {
    json => dispatch({
      type: TEST_SUCCESS,
      payload: json
    })
  }
}

export function fail(json) {
  return (json) => {
    json => dispatch({
      type: TEST_ERROR,
      payload: json
    })
  }
}
