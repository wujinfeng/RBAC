<template>
  <div>
    <el-row :gutter="10">
      <el-input v-model="orderId" placeholder="订单号"></el-input>
      <el-input v-model="sourceName" placeholder="二维码来源"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-row>
    <hr>
    <el-table :data="tableData">
      <el-table-column prop="id" label="订单号"></el-table-column>
      <el-table-column :formatter="formatType" label="类型"></el-table-column>
      <el-table-column prop="sourceName" label="二维码来源"></el-table-column>
      <el-table-column prop="sourceMobile" label="来源者手机"></el-table-column>
      <el-table-column prop="userName" label="购买者名称"></el-table-column>
      <el-table-column prop="mobile" label="购买者手机"></el-table-column>
      <el-table-column prop="unit" label="单价/元"></el-table-column>
      <el-table-column prop="number" label="张数"></el-table-column>
      <el-table-column prop="totalPrice" label="票总价/元"></el-table-column>
      <el-table-column prop="discountFee" label="优惠/元"></el-table-column>
      <el-table-column prop="actualFee" label="实际支付/元"></el-table-column>
      <el-table-column prop="couponId" label="优惠券编号"></el-table-column>
      <el-table-column :formatter="formatStatus" label="支付状态"></el-table-column>
      <el-table-column :formatter="formatpayWay" label="支付方式"></el-table-column>
      <el-table-column prop="payNum" label="微信流水号"></el-table-column>
      <el-table-column prop="reserveDate" label="预约日期"></el-table-column>
      <el-table-column prop="enterTime" label="入园时间"></el-table-column>
      <el-table-column prop="time" label="创建日期"></el-table-column>
      <!--<el-table-column prop="mark" label="备注"></el-table-column>-->
    </el-table>
    <pagination v-on:getPageData="getTablePageData" :total-num="totalNum"></pagination>
  </div>
</template>

<script>
  export default {
    name: 'OrderList',
    data() {
      return {
        dialogTableVisible: false,
        sourceName: '',
        orderId: '',
        tableData: [],
        totalNum: 0,
        gridData: []
      }
    },
    methods: {
      getTablePageData(pagerObj) {
        let params = {
          sourceName: this.sourceName,
          orderId: this.orderId,
          currentPage: pagerObj.currentPage,
          pageSize: pagerObj.pageSize
        }
        this.query(this, params)
      },
      search() {
        let params = {
          sourceName: this.sourceName,
          orderId: this.orderId
        }
        this.query(this, params)
      },
      formatStatus(row, column, cellValue) {
        let text = ''
        let status = row.payStatus
        if (status === 1) {
          text = '未支付'
        } else if (status === 5) {
          text = '支付中'
        } else if (status === 10) {
          text = '支付成功'
        } else if (status === 15) {
          text = '支付失败'
        } else if (status === 20) {
          text = '已申请退款'
        } else if (status === 25) {
          text = '退款成功'
        } else if (status === 26) {
          text = '退款失败'
        } else if (status === 30) {
          text = '失效'
        } else if (status === 35) {
          text = '实际支付金额不对'
        }
        return text
      },
      formatType(row, column, cellValue) {
        let text = ''
        let type = row.type
        if (type === 1) {
          text = '线上'
        } else {
          text = '线下'
        }
        return text
      },
      formatTicketType(row, column, cellValue) {
        let text = ''
        let type = row.type
        if (type === 1) {
          text = '团体购票'
        } else {
          text = '个体票'
        }
        return text
      },
      formatpayWay(row, column, cellValue) {
        let text = ''
        let type = row.payWay
        if (type === 1) {
          text = '预充值'
        } else if (type === 3) {
          text = '微信'
        } else if (type === 5) {
          text = '现金'
        } else if (type === 7) {
          text = '支付宝'
        }
        return text
      },
      query(that, params) {
        console.log(params)
        that.$axios.get('/admin/order/list', {params: params}).then(function (res) {
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
