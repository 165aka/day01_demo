<template>
  <div>
    <!-- 条件查询start -->
    <el-form :inline="true" :model="userVo" size="mini" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="userVo.username" placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择开始日期" v-model="userVo.startCreated" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择结束日期" v-model="userVo.endCreated" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="conditionUser(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 条件查询end -->
    <!-- 列表start -->
    <el-table
      :data="userPage.records"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话"
        width="150">
      </el-table-column>
      <el-table-column
        prop="email"
        label="电子邮件"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roles"
        label="角色"
        width="150">
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
    </el-table>
    <!-- 列表end -->

    <!-- 分页条 start    -->
    <el-pagination
      @size-change="handleUserSizeChange"
      @current-change="conditionUser"
      :current-page="userPage.current"
      :page-sizes="[1,2,3,5,10]"
      :page-size="userPage.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userPage.total">
    </el-pagination>
    <!-- 分页条 end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      userVo: {
        username:'',
        startCreated: '',
        endCreated: ''
      },
      userPage: {
        size: 3,
        current: 1,
      }
    }
  },
  methods: {
    async conditionUser(num) {
      if(num) {
        this.userPage.current = num
      }
      let url = `/eduUser/condition/${this.userPage.size}/${this.userPage.current}`
      let baseResult = await this.$axios.post(url, this.userVo)
      this.userPage = baseResult.data
    },
    handleUserSizeChange(size) {
      this.userPage.size = size
      this.conditionUser(1)
    }
  },
  mounted() {
    //查询所有用户
    this.conditionUser()
  },
}
</script>

<style>

</style>
