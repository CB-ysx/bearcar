import api from 'API/index'

const actions = {
  /**
   * 发布资讯
   */
  publishNews (store, params) {
    return api.publishNews(params)
      .then((response) => {
        return Promise.resolve(response.data.data)
      })
      .catch(({response}) => {
        return Promise.reject(response)
      })
  },
  /**
   * 获取资讯列表
   */
  getNewsList (store, params) {
    return api.getNewsList(params)
      .then((response) => {
        return Promise.resolve(response.data.data)
      })
      .catch(({response}) => {
        return Promise.reject(response)
      })
  },
  /**
   * 获取资讯
   */
  getNewsInfo (store, newsId) {
    return api.getNewsInfo(newsId)
      .then((response) => {
        return Promise.resolve(response.data.data)
      })
      .catch(({response}) => {
        return Promise.reject(response)
      })
  },
  /**
   * 删除资讯
   */
  deleteNews (store, newsId) {
    return api.deleteNews(newsId)
      .then((response) => {
        return Promise.resolve(response.data.data)
      })
      .catch(({response}) => {
        return Promise.reject(response)
      })
  }
}

export default {
  actions
}
