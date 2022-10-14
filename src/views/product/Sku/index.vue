<template>
  <div>
    <!-- 表格 -->
    <el-table :data="records" style="width: 100%;" border stripe>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(kg)" width="80" align="center" />
      <el-table-column prop="price" label="价格(元)" width="80" align="center" />
      <el-table-column label="操作" width="width" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.isSale===1" type="info" size="mini" icon="el-icon-sort-down" @click="cancelSale(row)" />
          <el-button v-else type="success" size="mini" icon="el-icon-sort-up" @click="onSale(row)" />
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="$message('正在开发中！')" />
          <el-button type="info" size="mini" icon="el-icon-info" @click="getSkuInfo(row)" />
          <el-button type="danger" size="mini" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="margin: 20px;textAlign:center"
      :current-page.sync="currentPage"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="totalNum"
      background
      :pager-count="7"
      @size-change="sizeChange"
      @current-change="currentChange"
    />

    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="skuAttrValue in skuInfo.skuAttrValueList" :key="skuAttrValue.id" type="success" style="margin: 5px;">{{ skuAttrValue.attrId }}:{{ skuAttrValue.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="320px">
            <el-carousel-item v-for="skuImage in skuInfo.skuImageList" :key="skuImage.id">
              <img :src="skuImage.imgUrl" alt="" style="width: 100%;height: 100%;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      records: [],
      skuInfo: {},
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取skuList
    async getSkuList() {
      const result = await this.$api.sku.reqGetSkuList(this.currentPage, this.pageSize)
      if (result.code === 200) {
        this.records = result.data.records
        this.totalNum = result.data.total
      }
    },
    // 当前页改变的回调
    currentChange(page) {
      this.currentPage = page
      this.getSkuList()
    },
    // 每页数量改变的回调
    sizeChange(limit) {
      this.pageSize = limit
      this.getSkuList()
    },
    // 上架按钮的回调
    async onSale(row) {
      const result = await this.$api.sku.reqGetOnSale(row.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '上架成功'
        })
        this.getSkuList()
      }
    },
    // 下架按钮的回调
    async cancelSale(row) {
      const result = await this.$api.sku.reqGetCancelSale(row.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '下架成功'
        })
        this.getSkuList()
      }
    },
    // 获取sku详情按钮的回调
    async getSkuInfo(sku) {
      this.skuInfo = {}
      const result = await this.$api.sku.reqGetSkuById(sku.id)
      console.log(result)
      if (result.code === 200) {
        this.skuInfo = result.data
        this.drawer = true
      }
    }
  }
}
</script>

<style scoped>
.el-row .el-col-5{
  font-size: 18px;
  text-align: right;
}
.el-col{
  margin: 10px;
}
/* 使用深度选择器影响到子组件 */
/* >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 66%;
  } */
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 66%;
  }
</style>
