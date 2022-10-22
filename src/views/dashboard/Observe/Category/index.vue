<template>
  <el-card>

    <div class="header">
      <span>销售额类别占比</span>
      <el-radio-group v-model="categoryData" size="mini">
        <el-radio-button label="全部渠道" />
        <el-radio-button label="线上" />
        <el-radio-button label="门店" />
      </el-radio-group>
    </div>

    <div ref="charts" class="charts" />
  </el-card>

</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      categoryData: '全部渠道'
    }
  },
  mounted() {
    const pieCharts = this.$echarts.init(this.$refs.charts)
    pieCharts.setOption({
      title: {
        text: 'Search Engine',
        subtext: '1048',
        left: 'center',
        top: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['55%', '85%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    pieCharts.on('mouseover', (params) => {
      const { name, value } = params.data
      pieCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px ;
}
.charts{
  width: 100%;
  height: 300px;
  display: flex;
  align-content: center;
}
</style>
