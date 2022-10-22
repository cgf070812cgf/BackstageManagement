<template>
  <div>
    <el-card class="box-card" style="margin-top: 16px;">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <!-- " @tab-click="handleClick" -->
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale" />
          <el-tab-pane label="访问量" name="visite" />
        </el-tabs>

        <!-- 头部左侧内容 -->
        <div class="right">
          <a @click="setDay">今日</a>
          <a @click="setWeek">本周</a>
          <a @click="setMonth">本月</a>
          <a @click="setYear">本年</a>

          <!-- 日历 -->
          <el-date-picker
            v-model="myDate"
            value-format="yyyy-MM-dd"
            class="date"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </div>
      <!-- 内容 -->
      <div>
        <el-row :gutter="20">
          <el-col :span="18" :offset="0">
            <BarChart :title="title" />
          </el-col>
          <el-col :span="6" class="right">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex" style="margin-right: 0px;">1</span>
                <span>肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex" style="margin-right: 0px;">2</span>
                <span>麦当劳</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex" style="margin-right: 0px;">3</span>
                <span>汉堡王</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>4</span>
                <span>西贝筱面村</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>5</span>
                <span>蒸功夫</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>6</span>
                <span>新石器烤肉</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span>7</span>
                <span>华莱士</span>
                <span class="rvalue">123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>

      </div>

    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import BarChart from './BarChart'
export default {
  name: 'Sale',
  components: { BarChart },
  data() {
    return {
      activeName: 'sale',
      myDate: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.myDate = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.myDate = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.myDate = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.myDate = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}

.right {
  position: absolute;
  right: 0px;
}

.date {
  width: 250px;
  margin: 0px 20px;
}

.right a {
  margin: 0px 15px;
}
.right span {
  margin: 0px 15px;
}

ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}

ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}

/* li.rindex{
  margin-right: 0px;
} */
.rvalue {
  float: right;
}
</style>

<style>
  .el-card__header{
    border-bottom:none ;
    padding-bottom: 0;
  }
</style>

