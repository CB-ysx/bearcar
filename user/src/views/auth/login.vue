<template>
  <div id="login">
    <h1 class="login-title">Hi~好久不见~</h1>
    <div class="login-form-wrap">
      <el-form :model="loginForm"
               :rules="loginRules"
               ref="loginForm">
        <el-form-item prop="phone">
          <el-input type="text"
                    :maxlength="11"
                    placeholder="请输入你的手机号码"
                    v-model="loginForm.phone">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    :maxlength="16"
                    placeholder="请输入你的密码"
                    v-model="loginForm.password">
        </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('loginForm')"
                     :disabled="btnDisabled">
                     立即登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-options">
      <a @click="changeView('register')" class="login-toregister">注册账号</a>
      <a @click="changeView('resetPsw')" class="login-toreset">忘记密码</a>
    </div>
  </div>
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      loginRules: {
        phone: [
          { validator: this.$validator.checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '未填写密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于6位', trigger: 'blur' }
        ]
      },
      message: ''
    }
  },
  computed: {
    ...mapGetters([
      'phone'
    ]),
    btnDisabled () {
      return this.loginForm.phone === '' ||
            this.loginForm.password === '' ||
            this.loginForm.password.length < 6
    }
  },
  mounted () {
    this.loginForm.phone = this.phone
  },
  methods: {
    changeView (type) {
      this.$emit('changeView', type)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let loginFormParams = {
            phone: this.loginForm.phone,
            password: this.loginForm.password
          }
          if (this.message) {
            this.message.close()
          }
          this.login(loginFormParams)
            .then((info) => {
              window.location.reload()
            })
            .catch((err) => {
              this.error(err.data.msg)
            })
        } else {
          return false
        }
      })
    },
    error (err) {
      this.message = this.$message({
        showClose: true,
        message: err,
        type: 'error'
      })
    },
    ...mapActions([
      'login'
    ])
  }
}
</script>
<style lang="stylus" scoped>
  @import '~STYLUS/color.styl'
  #login
    .login-title
      margin-top: 50px
      font-size: 38px
      color: $color-blue
      text-align: center
    .login-form-wrap
      margin: 40px auto 0
      width: 400px
    .login-options
      width: 400px
      margin: 0 auto
      display: flex
      justify-content: space-between
    .login-toregister, .login-toreset
      font-size: 14px
      color: $color-mid-grey
      border-bottom: 1px solid $color-light-grey
      padding: 0
      height: 14px
      line-height: 14px
      cursor: pointer
    .login-toreset
      &:hover
        color: $color-blue
        border-bottom: 1px solid $color-blue
    .login-toregister
      &:hover
        color: $color-orange
        border-bottom: 1px solid $color-orange
    .el-button
      width: 100%
      height: 40px
      font-size: 16px
      border-radius: 5px
      border: none
      background: #24b9ff
      &.is-disabled
        border: none
        background: #e5e5e5
        color: #ffffff
        &:hover
          background: #e5e5e5
          color: #ffffff
</style>