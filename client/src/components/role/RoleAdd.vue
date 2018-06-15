<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="地点" prop="addr">
      <el-input v-model="ruleForm.addr" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="mobile">
      <el-input v-model="ruleForm.mobile"></el-input>
    </el-form-item>
    <el-form-item label="小程序appid" prop="appid">
      <el-input v-model="ruleForm.appid"></el-input>
    </el-form-item>
    <el-form-item label="等级" prop="level">
      <el-select v-model="ruleForm.level" placeholder="">
        <el-option
          v-for="item in optionsLevel"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="ruleForm.status" placeholder="">
        <el-option
          v-for="item in optionsStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'PlaceAdd',
    data() {
      return {
        ruleForm: {
          name: '',
          addr: '',
          mobile: '',
          level: '',
          appid: '',
          status: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          addr: [
            {required: true, message: '请输入地点', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入联系电话', trigger: 'blur'}
          ],
          appid: [
            {required: true, message: '请输入小程序appid', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请选择等级', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ]
        },
        id: '',
        optionsLevel: [{
          value: 1,
          label: '1A'
        }, {
          value: 2,
          label: '2A'
        }, {
          value: 3,
          label: '3A'
        }, {
          value: 4,
          label: '4A'
        }, {
          value: 5,
          label: '5A'
        }],
        optionsStatus: [{
          value: 1,
          label: '启用'
        }, {
          value: 5,
          label: '禁用'
        }]
      }
    },
    beforeMount() {
      let that = this
      that.id = that.$route.params.id
      that.row = that.$route.params.row
      if (that.id) {
        that.ruleForm = that.row
      }
    },
    methods: {
      submitForm(formName) {
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              id: that.id || '',
              name: that.ruleForm.name,
              addr: that.ruleForm.addr,
              mobile: that.ruleForm.mobile,
              level: that.ruleForm.level,
              appid: that.ruleForm.appid,
              status: that.ruleForm.status
            }
            console.log(form)
            let url = '/admin/place/add'
            if (that.id) {
              url = '/admin/place/edit'
            }
            that.$axios.post(url, form).then(function (res) {
              if (res.status === 200 && res.data.code === 200) {
                that.$message({type: 'success', message: '添加成功'})
                that.$router.push({name: 'PlaceList'}) // 跳转列表页
              } else {
                that.$message({type: 'error', message: '添加失败'})
              }
            }).catch(function (err) {
              console.log('查询err:')
              console.log(err)
              that.$message({type: 'error', message: '添加失败'})
            })
          } else {
            that.$message({type: 'error', message: '提交失败'})
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
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
