<template>
  <div>
    <el-row :gutter="10">
      <el-input v-model="name" placeholder="旅行社名称"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-row>
    <hr>
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="income" label="充值金额/元"></el-table-column>
      <el-table-column prop="rechargeTime" label="充值时间"></el-table-column>
      <el-table-column prop="time" label="创建时间"></el-table-column>
      <el-table-column prop="operatorName" label="操作者"></el-table-column>
      <el-table-column :formatter="formatStatus" label="审核状态"></el-table-column>
      <el-table-column width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small"
                     @click="authStatus(scope.row.id, scope.$index, 'pass', scope.row.status)">通过
          </el-button>
          <el-button type="danger" size="small"
                     @click="authStatus(scope.row.id, scope.$index, 'nopass', scope.row.status)">拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-on:getPageData="getTablePageData" :total-num="totalNum"></pagination>
  </div>
</template>

<script>
  export default {
    name: 'PrepayList',
    data() {
      return {
        name: '',
        tableData: [],
        totalNum: 0
      }
    },
    methods: {
      getTablePageData(pagerObj) {
        let params = {
          name: this.name,
          currentPage: pagerObj.currentPage,
          pageSize: pagerObj.pageSize
        }
        this.query(this, params)
      },
      search() {
        let params = {
          name: this.name
        }
        this.query(this, params)
      },
      authStatus(val, index, status, currentStatus) {
        let that = this
        if (currentStatus === 1) {
          return that.$message({type: 'error', message: '已经审核通过，不能在修改'})
        }
        if (!val || !status) {
          return that.$message({type: 'info', message: '此条数据有错误'})
        }
        that.$confirm('请仔细审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$axios.get('/admin/prepay/auth?id=' + val + '&status=' + status).then(function (res) {
            if (res.status === 200 && res.data.code === 200) {
              if (status === 'pass') {
                that.tableData[index].status = 1
              } else {
                that.tableData[index].status = 5
              }
              that.$message({type: 'success', message: '提交成功!'})
            } else {
              that.$message({type: 'error', message: '提交失败'})
            }
          })
        }).catch(() => {
          that.$message({type: 'info', message: '已取消提交'})
        })
      },
      formatStatus(row, column, cellValue) {
        let text = ''
        let status = row.status
        if (status === 1) {
          text = '通过'
        } else if (status === 5) {
          text = '拒绝'
        } else {
          text = '提交审核'
        }
        return text
      },
      query(that, params) {
        console.log(params)
        that.$axios.get('/admin/prepay/list', {params: params}).then(function (res) {
          console.log(`查询ok`)
          if (res.status === 200 && res.data.code === 200) {
            that.tableData = res.data.data.tableData
            that.totalNum = res.data.data.totalNum
          } else {
            that.tableData = []
            that.totalNum = 0
          }
        }).catch((error) => {
          console.log(`查询err: ${error}`)
          that.tableData = []
          that.totalNum = 0
        })
      }
    },
    mounted() {
      this.query(this, {})
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-input {
    display: inline-block;
    width: 140px;
  }

  .el-select {
    width: 100px;
  }

</style>
