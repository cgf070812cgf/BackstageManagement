<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">

      <div class="header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="main">
        <el-row :gutter="10">
          <el-col :span="12" :offset="0">
            <LineChart />
          </el-col>
          <el-col :span="12" :offset="0">
            <LineChart />
          </el-col>
        </el-row>
      </div>

      <div class="footer">
        <el-table
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
        >
          <el-table-column type="index" label="排名" width="80" align="center" />
          <el-table-column prop="" label="搜索关键字" width="width" />
          <el-table-column prop="" label="用户数" width="width" sortable />
          <el-table-column prop="" label="周涨幅" width="width" sortable />
        </el-table>

        <el-pagination
          layout="prev, pager, next"
          :total="1000"
          class="pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import LineChart from './LineChart'
export default {
  name: 'Search',
  components: { LineChart },
  data() {
    return {
      tableData: [{}]
    }
  }
}
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.main{
  margin-top: 30px;
}
.footer{
  margin-top: 30px;
}
.pagination{
  float: right;
  padding: 8px 0;
}
</style>
