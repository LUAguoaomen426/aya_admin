<template>
  <div style="display: inline-block">
    <el-dialog
      :visible.sync="dialog"
      :close-on-click-modal="false"
      :before-close="cancel"
      :title="title"
      append-to-body
      width="500px"
      @close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="username" prop="username">
          <el-input v-model="form.username" auto-complete="on" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">cancel</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { forgetPassword } from '@/api/user.js'

export default {
  data() {
    return {
      loading: false, dialog: false, title: 'Retrieve password', form: { username: '' },
      rules: {
        username: [
          { required: true, message: 'please enter your account', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          forgetPassword(this.form.username).then(response => {
            console.log(response)
            if (response.code === 0) {
              this.resetForm()
              this.$notify({
                title: 'The password has been sent to the mailbox, please check',
                type: 'success',
                duration: 1500
              })
              this.loading = false
            } else {
              this.loading = false
            }
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { username: '' }
    }
  }
}
</script>

<style scoped>
</style>
