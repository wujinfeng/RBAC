<template>
  <el-aside width="200px">
    <el-menu :router="true" unique-opened>
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>用户管理</template>
        <el-menu-item :route="{name: 'UserList'}" index="1-1">用户列表</el-menu-item>
        <el-menu-item :route="{name: 'UserAdd'}" index="1-2">用户添加</el-menu-item>
        <el-menu-item :route="{name: 'UserRoleList'}" index="1-3">用户角色</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>角色管理</template>
        <el-menu-item :route="{name: 'RoleList'}" index="2-1">角色列表</el-menu-item>
        <el-menu-item :route="{name: 'RoleAdd'}" index="2-2">角色添加</el-menu-item>
        <el-menu-item :route="{name: 'RoleAccessList'}" index="2-3">角色权限</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>权限管理</template>
        <el-menu-item :route="{name: 'MenuAccessList'}" index="3-1">菜单权限</el-menu-item>
        <el-menu-item :route="{name: 'EleAccessList'}" index="3-2">元素权限</el-menu-item>
      </el-submenu>
      <el-submenu index="35">
        <template slot="title"><i class="el-icon-news"></i>优惠活动</template>
        <el-menu-item :route="{name: 'CouponList'}" index="35-1">优惠列表</el-menu-item>
        <el-menu-item :route="{name: 'CouponAdd'}" index="35-2">优惠添加</el-menu-item>
        <el-menu-item :route="{name: 'CouponUserList'}" index="35-3">散客领取</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title"><i class="el-icon-date"></i>日志管理</template>
        <el-menu-item :route="{name: 'LoginLogList'}" index="4-1">登录日志</el-menu-item>
        <el-menu-item :route="{name: 'HandleLogList'}" index="4-2">操作日志</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
  export default {
    name: 'LeftMenu',
    data() {
      return {
        msg: ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
