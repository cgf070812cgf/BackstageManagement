<template>
  <div ref="charts" class="charts" />
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      BarChart: undefined
    }
  },
  watch: {
    title() {
      this.BarChart.setOption({
        title: {
          text: `${this.title}的趋势`
        }
      })
    }
  },
  mounted() {
    this.BarChart = this.$echarts.init(this.$refs.charts)
    this.BarChart.setOption({
      title: {
        text: '销售额的趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390, 330]
        }
      ]
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 300px;
}
</style>
