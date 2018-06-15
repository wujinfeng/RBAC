<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
    <el-form-item label="旅行社" prop="name">
      <el-input v-model="ruleForm.name" placeholder="旅行社名称"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="orgAddr">
      <el-input v-model="ruleForm.orgAddr" placeholder="旅行社地址"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="ruleForm.mobile"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" :disabled="setDisabled" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="ruleForm.sex">
        <el-option
          v-for="item in optionsSex"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否预付费" prop="isPrepay">
      <el-select v-model="ruleForm.isPrepay">
        <el-option
          v-for="item in optionsIsPrepay"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="统一社会信用代码" prop="creditCode">
      <el-input v-model="ruleForm.creditCode"></el-input>
    </el-form-item>
    <el-form-item label="营业执照" prop="authPic">
      <el-upload
        class="upload"
        action="/admin/user/upload"
        :headers="setHeaders"
        :on-preview="handlePreview"
        :on-remove="handleRemoveF"
        :before-upload="beforeUpload"
        :on-error="uploadError"
        :on-success="uploadSuccessF"
        name="image"
        :limit=1
        list-type="picture"
        :on-exceed="handleExceed"
        :file-list="fileListF">
        <el-button size="mini" type="primary">点击上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
        <div slot="tip" class="el-upload__tip">只能上传 jpg, png</div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'TravelUserAdd',
    data() {
      var checkMobile = (rule, value, callback) => {
        let that = this
        if (!value) {
          return callback(new Error('手机号不能为空'))
        }
        let mobile = value.toString()
        if (!/^1\d{10}$/.test(mobile)) {
          return callback(new Error('填写正确的手机号'))
        }
        that.$axios.get('/admin/user/checkMobile/?pageStatus=' + that.pageStatus + '&mobile=' + mobile).then(function (res) {
          if (res.status === 200 && res.data.code === 200) {
            return callback()
          } else {
            return callback(new Error(res.data.msg))
          }
        }).catch((err) => {
          return callback(err)
        })
      }
      var checkPassword = (rule, value, callback) => {
        let that = this
        if (that.pageStatus === 'edit') {
          return callback()
        }
        if (!value) {
          return callback(new Error('密码不能为空'))
        }

        if (value.length < 8 || value.length > 20) {
          return callback(new Error('密码长度在 8 - 20 位'))
        } else {
          return callback()
        }
      }
      return {
        pageStatus: 'add', // 页面默认添加 add ,edit
        loading: false,
        setHeaders: {
          Authorization: `Bearer ${this.$store.state.token}`
        },
        ruleForm: {
          orgAddr: '',
          mobile: '',
          password: '',
          name: '',
          sex: '',
          isPrepay: '',
          creditCode: '',
          authPic: ''
        },
        rules: {
          orgAddr: [{required: true, message: '请输入旅行社地址', trigger: 'blur'}],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ],
          password: [{validator: checkPassword, trigger: 'blur'}],
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
          isPrepay: [{required: true, message: '请选择', trigger: 'blur'}],
          creditCode: [{required: true, message: '请填写统一社会信用代码', trigger: 'blur'},
            {min: 18, max: 18, message: '18位', trigger: 'blur'}
          ],
          authPic: [{required: true, message: '请上传', trigger: 'blur'}]
        },
        id: '',
        fileListF: [],
        setDisabled: false,
        optionsSex: [{
          value: 1,
          label: '男'
        }, {
          value: 2,
          label: '女'
        }, {
          value: 3,
          label: '其他'
        }],
        optionsIsPrepay: [{
          value: 1,
          label: '是'
        }, {
          value: 2,
          label: '否'
        }, {
          value: 3,
          label: '未签约'
        }]
      }
    },
    beforeMount() {
      let that = this
      that.pageStatus = 'add'
      that.id = that.$route.params.id
      that.row = that.$route.params.row
      if (that.id) {
        console.log('id:', that.id)
        that.pageStatus = 'edit'
        that.setDisabled = true
        that.ruleForm = that.row
        if (that.row.authPic) {
          that.fileListF = [{name: that.row.authPic, url: that.row.authPic}]
        }
      }
    },
    methods: {
      submitForm(formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              id: that.id || '',
              orgAddr: that.ruleForm.orgAddr,
              mobile: that.ruleForm.mobile,
              password: that.ruleForm.password,
              name: that.ruleForm.name,
              sex: that.ruleForm.sex,
              isPrepay: that.ruleForm.isPrepay,
              creditCode: that.ruleForm.creditCode,
              authPic: that.ruleForm.authPic,
              status: -1
            }
            console.log(form)
            let url = '/admin/user/travelAdd'
            if (that.id) {
              url = '/admin/user/edit'
            }
            that.$axios.post(url, form).then(function (res) {
              if (res.status === 200 && res.data.code === 200) {
                that.$message({type: 'success', message: '保存成功'})
                that.$router.push({name: 'TravelUserList'}) // 跳转列表页
              } else {
                that.$message({type: 'error', message: '添加失败'})
              }
            }).catch(function (err) {
              console.log('查询err:')
              console.log(err)
              that.$message({type: 'error', message: '保存失败'})
            })
          }
        })
      },
      handleRemoveF(file, fileList) { // 文件列表移除文件时的钩子
        console.log('handleRemoveF:')
        console.log('file')
        console.log(file)
        console.log('fileList')
        console.log(fileList)
        this.ruleForm.authPic = ''
      },
      handlePreview(file) { // 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
        console.log('handlePreview:')
        console.log(file)
      },
      handleExceed(files, fileList) { // 文件超出个数限制时的钩子
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      // 上传成功后的回调
      uploadSuccessF(response, file, fileList) {
        console.log('responseF:')
        console.log(response)
        if (response.code === 200) {
          console.log('upload ok')
          this.ruleForm.authPic = response.data.relativeDir
          this.$message({message: '上传成功！', type: 'success'})
        } else {
          this.$message({message: response.msg, type: 'error'})
        }
      },
      // 上传错误
      uploadError(err, file, fileList) {
        this.$message({message: '上传失败，请重试！', type: 'error'})
        console.log(err)
      },
      beforeUpload(file) {
        console.log('file:')
        console.log(file)
        // file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
        let isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
        let isLtM = file.size / 1024 / 1024 < 10
        if (!isJPG) {
          this.$message.error('上传正确的格式!')
        }
        if (!isLtM) {
          this.$message.error('文件大小不能超过 10MB!')
        }
        return isJPG && isLtM
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-form {
    max-width: 450px;
  }
</style>
