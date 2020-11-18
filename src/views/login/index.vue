<template>
  <div class="login-container">
    <el-row :gutter="20">
      <el-col :span="10" style="padding-right: 0px;">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" style="background-color:white;height:600px;margin-top:150px;float: right;">

          <div class="title-container">
            <h4 class="title">Login</h4>
          </div>
          <div style="padding: 50px;">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Username"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-link type="primary" style="font-size: 15px;" @click="$refs.pass.dialog = true">FORGET PASSWORD</el-link>
              </el-col>
              <el-col :span="12">
                <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;height: 50px;float: right" @click.native.prevent="handleLogin">Login</el-button>
              </el-col>
            </el-row>

          </div>
          <el-row :gutter="20">
            <el-col :span="24" style="text-align: center;margin-top: 150px;">
              TEL:400-921-5988
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="14" style="padding-left: 0px">
        <div style="color: black;margin-top: 150px;height: 600px;width: 1000px;background-size: 100% 100%;padding: 30px;" :style="{backgroundImage:'url('+require('../../assets/bg.jpg')+')'}">
          <el-row>
            <el-col :span="2">
              <el-image
                :src="require('@/assets/IMG_2958.png')"
                fit="fill"
                class="icon-left"
              />
            </el-col>
            <el-col :span="22">
              <el-link :underline="false" class="list-content" @click="previewFile('关于发票与就诊日期不一致的说明.pdf')">1. FAQs</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <el-image
                :src="require('@/assets/IMG_2957.png')"
                fit="fill"
                class="icon-left"
              />
            </el-col>
            <el-col :span="22">
              <el-link :underline="false" class="list-content" @click="download('Bilingual DB Claim Form.pdf')">2. Download Direct Billing Claim Form</el-link>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="2">
              <el-image
                :src="require('@/assets/IMG_2957.png')"
                fit="fill"
                class="icon-left"
              />
            </el-col>
            <el-col :span="22">
              <el-link :underline="false" class="list-content" @click="download('Bilingual PA Request Form.pdf')">3. Download Pre-authorization Request Form</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <el-image
                :src="require('@/assets/IMG_2957.png')"
                fit="fill"
                class="icon-left"
              />
            </el-col>
            <el-col :span="22">
              <el-link :underline="false" class="list-content" @click="download('关于发票与就诊日期不一致的说明.pdf')">4. Download Receipt Explanation Form</el-link>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <updatePass ref="pass" />
  </div>
</template>

<script>
import updatePass from './components/updatePass'
import { download } from '@/api/user'
export default {
  name: 'Login',
  components: { updatePass },
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    previewFile(filename) {
      download(filename).then(response => {
        const binaryData = []
        binaryData.push(response)
        this.pdfUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }))
        window.open(this.pdfUrl)
      }).catch(error => {
        console.log(error)
      })
    },
    download(filename) {
      window.location.href = '/aya/common/file/download?fileName=' + filename
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: black;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: black;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid black;
    border-radius: 5px;
    color: #454545;
  }

  .el-input__inner::placeholder {
    color: black;
    text-align:center;
  }
  /* 谷歌 */
  .el-input__inner::-webkit-input-placeholder {
    color: black;
    text-align:center;
  }
  /* 火狐 */
  .el-input__inner:-moz-placeholder {
    color: black;
    text-align:center;
  }
  /*ie*/
  .el-input__inner:-ms-input-placeholder {
    color: black;
    text-align:center;
  }
}
</style>

<style lang="scss" scoped>
$bg:#D3D3D3;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    //padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    background-color: red;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: left;
      font-weight: bold;
      padding: 6px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  .list-content{
    padding: 10px;
    font-size: 20px;
    font-family: Cursive;
    margin-top: 50px;
    margin-left: 20px;
    color: white;
    width: 450px;
    display:inline-block;
    text-decoration: underline;
  }
  .icon-left{
    float: right;
    width: 60px;
    margin-top: 40px;
  }
}
</style>
