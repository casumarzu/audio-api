import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router'
import { routerMiddleware, push } from 'react-router-redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk'
import { persistState } from 'redux-devtools'
import DevTools from 'Containers/DevTools'

let enhancer

if(process.env.NODE_ENV === 'development'){
  enhancer = compose(
    applyMiddleware(thunk, routerMiddleware(browserHistory)),
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    // DevTools.instrument(),
    persistState(
      window.location.href.match(
        /[?&]debug_session=([^&#]+)\b/
      )
    )
  )
}else {
  enhancer = compose(
    applyMiddleware(thunk, routerMiddleware(browserHistory))
  )
}

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
