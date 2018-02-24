import api from 'API/index'
import {
  SET_LOGIN_STATUS,
  SET_USER_INFO,
  SET_LOGIN_MASK_STATUS,
  SHOW_TOKEN_ERROR
} from '../mutation-types'

import {
  saveAccessToken,
  getAccessToken,
  cachedUserInfo,
  cachedPhone
} from 'API/cacheService'

const state = {
  loginMaskShow: false,
  loginView: 'login',
  isLogin: getAccessToken() ? true : false, // eslint-disable-line
  userInfo: cachedUserInfo.load() || {},
  tokenError: false,
  phone: cachedPhone.load() || ''
}

const getters = {
  loginMaskShow (state) {
    return state.loginMaskShow
  },
  loginView (state) {
    return state.loginView
  },
  isLogin (state) {
    return state.isLogin
  },
  userInfo (state) {
    return state.userInfo
  },
  tokenError (state) {
    return state.tokenError
  },
  phone (state) {
    return state.phone
  }
}

const mutations = {
  [SET_LOGIN_MASK_STATUS] (state, data) {
    state.loginMaskShow = data.show
    state.loginView = data.view
  },
  [SET_LOGIN_STATUS] (state, data) {
    state.isLogin = data
  },
  [SET_USER_INFO] (state, data) {
    state.userInfo = data
  },
  [SHOW_TOKEN_ERROR] (state, data) {
    state.tokenError = data
  }
}

const actions = {

  setLoginMaskStatus (store, data) {
    store.commit(SET_LOGIN_MASK_STATUS, data)
  },
  /**
   * 用户登录
   */
  login (store, params) {
    return api.login(params)
      .then((response) => {
        saveAccessToken(response.data.data.token.accessToken, response.data.data.token.exp)
        cachedUserInfo.save(response.data.data)
        cachedPhone.save(response.data.data.phone)
        store.commit(SET_LOGIN_STATUS, true)
        store.commit(SET_USER_INFO, response.data.data)
        // 关闭登录mask
        store.commit(SET_LOGIN_MASK_STATUS, false)
        return Promise.resolve(response.data)
      })
      .catch(({response}) => {
        return Promise.reject(response)
      })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
