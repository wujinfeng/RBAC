<template>
  <div>
    <el-row :gutter="10">
      <el-input v-model="name" placeholder="姓名"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-row>
    <hr>
    <el-table :data="tableData">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="parentName" label="景区"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="sex" :formatter="formatSex" label="性别"></el-table-column>
      <el-table-column prop="status" :formatter="formatStatus" label="状态"></el-table-column>
      <el-table-column prop="time" label="创建日期"></el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <router-link :to="{name:'PlaceUserAdd',params:{id: scope.row.id, row: scope.row}}">
            <el-button type="primary" size="small">编辑</el-button>
          </router-link>
          <router-link :to="{name:'Password',params:{id: scope.row.id, mobile: scope.row.mobile}}">
            <el-button type="warning" size="small" title="修改密码">改密</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-on:getPageData="getTablePageData" :total-num="totalNum"></pagination>
  </div>
</template>

<script>
  export default {
    name: 'PlaceUserList',
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
      del(val, index) {
        let that = this
        that.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$axios.get('/admin/user/delete/' + val).then(function (res) {
            if (res.status === 200 && res.data.code === 200) {
              that.tableData.splice(index, 1)
              that.$message({type: 'success', message: '删除成功!'})
            } else {
              that.$message({type: 'error', message: '删除失败'})
            }
          })
        }).catch(() => {
          that.$message({type: 'info', message: '已取消删除'})
        })
      },
      formatStatus(row, column, cellValue) {
        let text = ''
        let status = row.status
        if (status === 1) {
          text = '在岗启用'
        } else if (status === 5) {
          text = '离岗禁用'
        }
        return text
      },
      formatSex(row, column, cellValue) {
        let text = ''
        let sex = row.sex
        if (sex === 1) {
          text = '男'
        } else if (sex === 2) {
          text = '女'
        } else if (sex === 3) {
          text = '其他'
        }
        return text
      },
      query(that, params) {
        console.log(params)
        that.$axios.get('/admin/user/placeUserList', {params: params}).then(function (res) {
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
