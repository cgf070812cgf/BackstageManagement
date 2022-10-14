<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        {{ spuObject.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称" size="normal">
        <el-input v-model="skuObject.skuName" placeholder="SKU名称" size="normal" />
      </el-form-item>
      <el-form-item label="价格(元)" size="normal">
        <el-input v-model="skuObject.price" placeholder="价格(元)" size="normal" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)" size="normal">
        <el-input v-model="skuObject.weight" placeholder="重量(千克)" size="normal" type="number" />
      </el-form-item>
      <el-form-item label="规格描述" size="normal">
        <el-input v-model="skuObject.skuDesc" placeholder="规格描述" size="normal" type="textarea" :rows="4" />
      </el-form-item>

      <el-form-item label="平台属性" size="normal">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item v-for="attrInfo in attrInfoList" :key="attrInfo.id" :label="attrInfo.attrName">
            <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择" clearable filterable>
              <el-option v-for="attrValue in attrInfo.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性" size="normal">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id" :label="spuSaleAttr.saleAttrName">
            <el-select v-model="spuSaleAttr.saleAttrIdAndValueId" placeholder="请选择" clearable filterable>
              <el-option v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList" :key="spuSaleAttrValue.id" :label="spuSaleAttrValue.saleAttrValueName" :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" size="normal">
        <el-table :data="spuImageList" style="width: 100%;" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" align="center" />
          <el-table-column prop="imgUrl" label="图片" width="width" align="center">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" align="center" />
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault===0" type="primary" size="mini" @click="setDefault(row)">设置默认</el-button>
              <el-button v-else type="success" size="mini">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSkuForm">保存</el-button>
        <el-button @click="cancelAdd">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 储存图片的信息
      spuImageList: [],
      // 储存销售属性的信息
      spuSaleAttrList: [],
      // 储存平台属性的数据
      attrInfoList: [],
      // spu的数据
      spuObject: {},
      // 收集sku数据的字段
      skuObject: {
        // 第一类收集的数据：父组件给的
        category3Id: 0,
        tmId: 0,
        spuId: 0,

        // 第二类收集的数据：通过v-model
        skuName: '',
        price: undefined,
        weight: '',
        skuDesc: '',

        // 第三类收集的数据：自己编写代码收集
        // 默认图片
        skuDefaultImg: '',
        // 图片列表
        skuImageList: [
          // {
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   spuImgId: 0
          // }
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   skuId: 0,
          //   valueId: 0,
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // }
        ]
      },
      // 收集图片的列表
      imageList: []
    }
  },
  methods: {
    // 初始化skuForm
    async initSkuForm(categoryListID, spu) {
      this.spuObject = spu
      this.skuObject.category3Id = categoryListID.category3ListID
      this.skuObject.tmId = spu.tmId
      this.skuObject.spuId = spu.id

      const spuImageListResult = await this.$api.spu.reqGetSpuImageList(spu.id)
      // console.log(spuImageListResult)
      if (spuImageListResult.code === 200) {
        spuImageListResult.data.forEach(item => { item.isDefault = 0 })
        this.spuImageList = spuImageListResult.data
      }

      const spuSaleAttrListResult = await this.$api.spu.reqGetSpuSaleAttrList(spu.id)
      // console.log(spuSaleAttrListResult)
      if (spuSaleAttrListResult.code === 200) {
        this.spuSaleAttrList = spuSaleAttrListResult.data
      }

      const attrInfoListResult = await this.$api.spu.reqGetAttrInfoList(categoryListID)
      // console.log(attrInfoListResult)
      if (attrInfoListResult.code === 200) {
        this.attrInfoList = attrInfoListResult.data
      }
    },
    // 设置默认按钮的回调
    setDefault(row) {
      this.spuImageList.forEach(item => { item.isDefault = 0 })
      row.isDefault = 1
      this.skuObject.skuDefaultImg = row.imgUrl
    },
    // table表格复选框按钮的事件
    handleSelectionChange(params) {
      this.imageList = params
    },
    // 取消事件的回调
    cancelAdd() {
      this.$emit('changeScenes', { scene: 0 })
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的回调
    async  saveSkuForm() {
      // skuSaleAttrValueList的数据处理
      this.skuObject.skuSaleAttrValueList = this.spuSaleAttrList.reduce((previousValue, currentValue) => {
        if (currentValue.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = currentValue.saleAttrIdAndValueId.split(':')
          previousValue.push({ saleAttrId, saleAttrValueId })
        }
        return previousValue
      }
      , [])

      // skuAttrValueList的数据处理
      this.skuObject.skuAttrValueList = this.attrInfoList.reduce((previousValue, currentValue) => {
        if (currentValue.attrIdAndValueId) {
          const [attrId, valueId] = currentValue.attrIdAndValueId.split(':')
          previousValue.push({ attrId, valueId })
        }
        return previousValue
      }
      , [])

      // skuImageList的数据处理
      this.skuObject.skuImageList = this.imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      const result = await this.$api.spu.reqPostSaveSkuInfo(this.skuObject)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功！' })
        this.$emit('changeScenes', { scene: 0 })
        Object.assign(this._data, this.$options.data())
      }
    }
  }
}
</script>

<style scoped>

</style>
