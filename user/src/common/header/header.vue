<template>
  <div id="header-main" v-show="showHeader">
    <div id="header-body">
      <div class="header-wrap" :style="style">
        <!-- logo -->
        <a class="header-logo" :href="homeLink"></a>
        <!-- logo 结束 -->
        <!-- 选择城市 -->
        <div class="header-city" @mouseover="showCityPickerF" @mouseout="hideCityPickerF">
          <div class="city-name">{{currentCity.cityName}}</div>
          <i class="el-icon-arrow-down"></i>
          <city-picker
            class="city-picker"
            v-show="showCityPicker"
            :currentCity="currentCity"
            :hotCities="hotCities" 
            :allCities="allCities"
            @city-click="cityClick">
          </city-picker>
        </div>
        <!-- 选择城市 结束 -->
        <!-- tab -->
        <tab-view 
          class="header-tab"
          :tabs="tabs"
          :activeTab="activeTab"
          @tab-click="tabClick">
        </tab-view>
        <!-- tab 结束 -->
        <!-- 登录注册信息 -->
        <div class="header-right-wrap">
          <div class="header-login">
            <div class="header-user" v-if="!isLogin">
              <span class="header-user-registered" @click="toRegister">注册</span>
              /
              <span class="header-user-login" @click="toLogin">登录</span>
            </div>
            <div class="header-user" v-else>
              <span class="header-avatar">
                <img src="~IMAGES/icon_user.png" alt="">
                <span>{{ userInfo.phone }}</span>
                <!-- 用户信息下拉 -->
                <div class="user-info">
                  <ul class="user-info-ul">
                    <li class="info-content info-border" @click="toMyCar">
                      <span class="icon-page"></span>
                      <span class="info-content-text">我的车</span>
                    </li>
                    <li class="info-out" @click="signOut">退出账号</li>
                  </ul>
                </div>
                <!-- 用户信息下拉结束 -->
              </span>
            </div>
          </div>
        </div>
        <!-- 登录注册信息 结束 -->
      </div>
    </div>
    <!-- 空白 占位用 -->
    <div id="header-space"></div>
    <!-- 空白 占位用 结束 -->
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex'

import {
  SET_CURRENT_CITY,
  SET_LOGIN_STATUS,
  SET_USER_INFO
} from 'STORE/mutation-types'

import { cachedUserInfo, removeAccessToken } from 'API/cacheService'

import clickoutside from 'UTIL/clickoutside.js'
import cityPicker from 'COMMON/cityPicker/cityPicker'
import tabView from 'COMMON/tabView/tabView'

export default {
  name: 'page-header',
  directives: {
    clickoutside
  },
  components: {
    cityPicker,
    tabView
  },
  data () {
    return {
      homeLink: `${window.location.origin}/`,
      showCityPicker: false,
      style: {
        left: '0px'
      },
      tabs: [
        {
          id: 0,
          name: '首页'
        },
        {
          id: 1,
          name: '我要买车'
        },
        {
          id: 2,
          name: '我要卖车'
        },
        // {
        //   id: 3,
        //   name: '车辆评估'
        // },
        {
          id: 3,
          name: '资讯'
        }
      ],
      activeTab: {}
    }
  },
  created () {
    this.getHotCity(10)
    this.getCitySort()
  },
  mounted () {
    this.activeTab = this.tabs[0]
    window.addEventListener('scroll', this.fixTopBarScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.fixTopBarScroll)
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'showHeader',
      'allCities',
      'hotCities',
      'currentCity',
      'userInfo',
      'headerActiveTab'
    ])
  },
  watch: {
    headerActiveTab (pos) {
      this.activeTab = (pos === -1 ? {} : this.tabs[pos])
    }
  },
  methods: {
    showCityPickerF () {
      this.showCityPicker = true
    },
    hideCityPickerF () {
      this.showCityPicker = false
    },
    cityClick (city) {
      this.changeCity(city)
      this.hideCityPickerF()
    },
    tabClick (tab) {
      this.activeTab = tab
      switch (tab.id) {
        case 0:
          this.toIndex()
          break
        case 1:
          this.toBuyCar()
          break
        case 2:
          this.toSellCar()
          break
        case 3:
          this.$router.push({ name: 'newsList' })
          break
      }
    },
    toRegister () {
      this.setLoginMaskStatus({ show: true, view: 'register' })
    },
    toLogin () {
      this.setLoginMaskStatus({ show: true, view: 'login' })
    },
    signOut () {
      removeAccessToken()
      cachedUserInfo.delete()
      this.$store.commit(SET_LOGIN_STATUS, false)
      this.$store.commit(SET_USER_INFO, {})
      this.toIndex()
    },
    toIndex () {
      this.$router.push({ name: 'home' })
    },
    toBuyCar () {
      this.$router.push({ name: 'searchCar' })
    },
    toSellCar () {
      this.$router.push({ name: 'sellCar' })
    },
    toMyCar () {
      this.$router.push({ name: 'myCar' })
    },
    fixTopBarScroll () {
      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
      this.style.left = `-${scrollLeft}px`
    },
    ...mapActions([
      'getCitySort',
      'getHotCity',
      'setLoginMaskStatus'
    ]),
    ...mapMutations({
      'changeCity': SET_CURRENT_CITY
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import '~STYLUS/mixin.styl'
  @import '~STYLUS/color.styl'
  #header-body
    width: 100%
    position: fixed
    top: 0
    left: 0
    right: 0
    background: $color-white
    user-select: none
    z-index: 20
    box-shadow: 1px 1px 10px 1px rgba(15, 166, 255, .1)
    .header-wrap
      position: relative
      height 70px
      width: 1170px
      margin: 0 auto
      padding-left: 3px
      padding-right: 3px
      .header-logo
        display: inline-block
        margin: 23px 0
        height: 24px
        width: 112px
        background: url('~IMAGES/bearcar_logo.png') no-repeat
        background-position: 50% 50%
        background-size: 112px 24px
        cursor: pointer
      .header-city
        display: inline-block
        padding: 26px 0
        vertical-align: top
        margin-left: 20px
        font-size: 16px
        cursor: pointer
        color: $color-dark-grey
        &:hover
          color: $color-blue
        .city-name
          display: inline-block
      .header-tab
        display: inline-block
        padding: 14px 0
        vertical-align: top
        margin-left: 240px
      .header-right-wrap
        float: right
        .header-user
          display: inline-block
          vertical-align: top
          height: 70px
          line-height: 70px
          // margin-right: 30px
          color: $color-mid-grey
          font-size: 16px
          cursor: pointer
          .header-user-registered
            &:hover
              color: $color-orange
          .header-user-login
            &:hover
              color: $color-blue
        .header-avatar
          display: inline-block
          position: relative
          &:hover
            .user-info
              display: block
          > img
            vertical-align: middle
            width: 38px
            height: 38px
            border-radius: 50%
          .user-info
            position: absolute
            top: 70px
            left: 50%
            width: 160px
            transform: translateX(-50%)
            background: $color-white
            box-shadow: 1px 1px 10px 1px #d4efff
            z-index: 10
            font-size: 16px
            cursor: default
            display: none
            &:before
              position: absolute
              content: ' '
              left: 50%
              top: 0px
              width: 20px
              height: 10px
              background: $color-bg-grey
              transform: translateX(-50%)
              z-index: 9
            &:after
              position: absolute
              left: 50%
              top: -5px
              content: ' '
              width: 10px
              height: 10px
              box-shadow: 1px 1px 10px 1px #d4efff
              transform: translateX(-50%) rotate(45deg)
              background: $color-white
            .info-out
              background: $color-bg-grey
              color: $color-light-grey
              font-size: 16px
              height: 50px
              line-height: 50px
              text-align: center
              cursor: pointer
            .info-content
              padding: 0 20px
              display: flex
              justify-content: flex-start
              align-items: center
              height: 50px
              cursor: pointer
            .info-content-text
              margin-left: 10px
              height: @height
              color: $color-dark-grey
              &:hover
                color: $color-blue
            .icon-page
              display: inline-block
              height: 20px
              width: 20px
              background: url('~IMAGES/icon_car.png') no-repeat
              background-size: cover
            .info-border
              border-bottom: 1px solid $color-border
  #header-space
    width: 100%
    height: 70px
  .city-picker
    position: absolute
    top: 60px
    z-index: 100
</style>
