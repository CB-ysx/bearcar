import axios from 'axios'
import Qs from 'qs'

/* eslint-disable */
const API_ROOT = 'http://codebear.cn/bearcarproject/index.php/admin'


/* eslint-enable */
axios.defaults.baseURL = API_ROOT
axios.defaults.headers.Accept = 'application/json'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  config.headers['isDebug'] = true
  return config
}, function (error) {
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
  }
  return Promise.reject(error)
})

export default {
  /**
   * 用户登录
   */
  login (params) {
    return axios.post('login', Qs.stringify(params))
  }
}
