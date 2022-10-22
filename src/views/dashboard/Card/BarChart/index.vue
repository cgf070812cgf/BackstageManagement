<template>
  <div ref="charts" class="charts" />
</template>

<script>
export default {
  name: 'BarChart',
  mounted() {
    const BarChart = this.$echarts.init(this.$refs.charts)
    BarChart.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 33, 22, 8],
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts{
  width: 100%;
  height: 100%;
}
</style>
