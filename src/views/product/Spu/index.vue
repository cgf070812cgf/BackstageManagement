<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <!-- 三级联动 :show="scene!==0" -->
      <CategorySelect :show="scene!==0" @getCategoryListID="getCategoryListID($event)" />
    </el-card>

    <el-card>

      <!-- 添加｜修改sku -->
      <SkuForm v-show="scene===-1" ref="SkuForm" @changeScenes="changeScenes($event)" />

      <!-- 展示sku列表 -->
      <div v-show="scene===0">
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          style="margin: 20px 0px;"
          :disabled="!categoryListID.category3ListID"
          @click="addSpuList"
        >添加SPU</el-button>
        <el-table :data="records" border stripe>
          <el-table-column type="index" label="序号" :width="80" align="center" />
          <el-table-column prop="spuName" label="spu名称" width="width" />
          <el-table-column prop="description" label="spu描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <HintButton type="success" size="mini" icon="el-icon-plus" title="添加sku" @click="addSku(row)" />
              <HintButton type="warning" size="mini" icon="el-icon-edit" title="修改spu" @click="updateSpuList(row)" />
              <HintButton type="info" size="mini" icon="el-icon-info" title="查看当前spu全部sku列表" @click="handler(row)" />
              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center;"
          :current-page="currentPage"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          background
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </div>

      <!-- 添加sku -->
      <SpuForm v-show="scene===1" ref="SpuForm" @changeScene="changeScene($event)" />
    </el-card>

    <el-dialog :title="`${spuObject.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeDialog">
      <el-table v-loading="loading" :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="width" />
        <el-table-column prop="price" label="价格" width="width" />
        <el-table-column prop="weight" label="重量" width="width" />
        <el-table-column label="地址" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'

export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      categoryListID: {},
      currentPage: 1,
      limit: 3,
      total: 0,
      records: [],
      scene: 0, // -1:添加sku  0:展示sku列表  1:添加｜修改sku
      dialogTableVisible: false,
      spuObject: {},
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 获取spu列表的方法
    async getSpuList() {
      this.records = []
      const result = await this.$api.spu.reqGetSpuList(this.currentPage, this.limit, this.categoryListID.category3ListID)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 获取三级ID的列表
    getCategoryListID(categoryListID) {
      this.scene = 0
      this.categoryListID = categoryListID
      if (categoryListID.category3ListID) {
        this.getSpuList()
      }
    },
    // 分页器页数改变
    currentChange(page) {
      this.currentPage = page
      this.getSpuList()
    },
    // 分页器每页展示数量改变
    sizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu
    addSpuList() {
      this.scene = 1
      this.$refs.SpuForm.addspuObjectData(this.categoryListID.category3ListID)
    },
    // 修改spu
    updateSpuList(row) {
      this.scene = 1
      this.$refs.SpuForm.initSpuForm(row)
    },
    // 切换场景(spuForm)
    changeScene(event) {
      this.scene = event.scene
      if (event.flag === 'add') this.currentPage = 1
      this.getSpuList()
    },
    // 删除spu
    async deleteSpu(row) {
      const result = await this.$api.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        console.log(this.records.length)
        this.records.length <= 1 ? this.currentPage -= 1 : ''
        this.currentPage <= 0 ? this.currentPage = 1 : ''
        this.getSpuList()
      }
    },
    // 添加sku
    addSku(row) {
      this.scene = -1
      this.$refs.SkuForm.initSkuForm(this.categoryListID, row)
    },
    // 切换场景(skuForm)
    changeScenes(event) {
      this.scene = event.scene
    },
    // 查看sku按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true
      this.spuObject = spu
      const result = await this.$api.spu.reqGetSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // dialog关闭的回调
    closeDialog(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>

<style scoped>
</style>
