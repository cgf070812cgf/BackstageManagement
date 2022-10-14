<template>
  <div>
    <el-form label-width="80px" :model="spuObject">
      <el-form-item label="SPU名称">
        <el-input v-model="spuObject.spuName" placeholder="SPU名称" />
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuObject.tmId" placeholder="请选择品牌">
          <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spuObject.description" type="textarea" rows="4" placeholder="描述" />
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- 上传图片：
          action图片上传的地址
          list-type：文件列表的类型
          on-preview：图片预览的时候会触发
          on-remove：图片删除的时候会触发
          file-list：图片展示的数组，数组里面务必要有name和url属性
          on-success：图片上传成功
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImgList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`" value="" style="margin: 0px 20px 0px 0px;">
          <el-option v-for="unSlect in unSelectSaleAttr" :key="unSlect.id" :label="unSlect.name" :value="`${unSlect.id}:${unSlect.name}`" />
        </el-select>
        <el-button type="primary" size="default" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>

        <el-table style="width: 100%; margin: 20px 0px;" :data="spuObject.spuSaleAttrList" border>
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" align="center" />
          <el-table-column prop="" label="属性名称列表" width="width">
            <template slot-scope="{row}">
              <!-- el-tag：已有的属性值列表 -->
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row,index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>

              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />

              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>

          </el-table-column>
          <el-table-column prop="" label="操作" width="width">
            <template slot-scope="{$index}">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteSpuSaleAttr($index)" />

            </template>
          </el-table-column>
        </el-table>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdaeSupList">保存</el-button>
        <el-button @click="cancalChange">取消</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spuObject: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 平台的id
        tmId: '',
        // spu图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],
        // 平台属性的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       aleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
        id: 0
      },
      tradeMarkList: [],
      spuImgList: [],
      baseSaleAttrList: [],
      attrIdAndAttrName: ''
    }
  },
  computed: {
    // 计算还未选择的销售属性
    unSelectSaleAttr() {
      return this.baseSaleAttrList.filter(item => {
        return this.spuObject.spuSaleAttrList.every(item1 => {
          return item1.saleAttrName !== item.name
        })
      })
    }
  },
  methods: {
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 初始化SpuForm数据
    async initSpuForm(spu) {
      const getSpuResult = await this.$api.spu.reqGetSpu(spu.id)
      // console.log(getSpuResult)
      if (getSpuResult.code === 200) {
        this.spuObject = getSpuResult.data
      }

      const getTradeMarkListResult = await this.$api.spu.reqGetTradeMarkList()
      // console.log(getTradeMarkListResult)
      if (getTradeMarkListResult.code === 200) {
        this.tradeMarkList = getTradeMarkListResult.data
      }

      const getSpuImgListResult = await this.$api.spu.reqGetSpuImgList(spu.id)
      // console.log(getSpuImgListResult)
      if (getSpuImgListResult.code === 200) {
      // getSpuImgListResult.data.forEach(item => {
      //   item.name = item.imgName
      //   item.url = item.imgUrl
      // })
        getSpuImgListResult.data = JSON.parse(JSON.stringify(getSpuImgListResult.data).replace(/imgName/g, 'name'))
        getSpuImgListResult.data = JSON.parse(JSON.stringify(getSpuImgListResult.data).replace(/imgUrl/g, 'url'))
        this.spuImgList = getSpuImgListResult.data
      }

      const getBaseSaleAttrListResult = await this.$api.spu.reqGetBaseSaleAttrList()
      // console.log(getBaseSaleAttrListResult)
      if (getBaseSaleAttrListResult.code === 200) {
        this.baseSaleAttrList = getBaseSaleAttrListResult.data
      }
    },
    // 照片墙删除图片的回调
    // file:删除的图片
    // fileList：删除后剩下来 的图片
    handleRemove(file, fileList) {
      this.spuImgList = fileList
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImgList = fileList
    },
    // 添加属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      const newSpuSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuObject.spuSaleAttrList.push(newSpuSaleAttr)
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true)
      this.$nextTick(() => this.$refs.saveTagInput.focus())
      this.$set(row, 'inputValue', '')
    },
    // el-input失去焦点的回调
    handleInputConfirm(row) {
      row.inputVisible = false

      const { inputValue, baseSaleAttrId } = row
      if (inputValue.trim() === '') {
        this.$message({
          type: 'warning',
          message: '属性值不能为空'
        })

        return
      }

      if (!row.spuSaleAttrValueList.every(item => inputValue.trim() !== item.saleAttrValueName)) {
        this.$message({
          type: 'warning',
          message: '属性值不能相同'
        })
        return
      }
      row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName: inputValue })
    },
    // tag删除的回调
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 删除售卖属性的回调
    deleteSpuSaleAttr(index) {
      this.spuObject.spuSaleAttrList.splice(index, 1)
    },
    // 保存按钮的回调
    async addOrUpdaeSupList() {
      if (this.spuObject.spuName.trim() === '') {
        this.$message({
          type: 'warning',
          message: 'SPU名称不能为空'
        })
        return
      }
      this.spuObject.spuImageList = this.spuImgList.map(item => {
        return {
          imgName: item.name,
          imageUrl: (item.response && item.response.data) || item.url
        }
      })
      const result = await this.$api.spu.reqPostAddOrUpdateSpuInfo(this.spuObject)
      // console.log(result)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('changeScene', { scene: 0, flag: this.spuObject.id ? 'update' : 'add' })
        Object.assign(this._data, this.$options.data())
      }
    },
    // 添加spu发请求
    async addspuObjectData(category3ListID) {
      this.spuObject.category3Id = category3ListID
      const getTradeMarkListResult = await this.$api.spu.reqGetTradeMarkList()
      // console.log(getTradeMarkListResult)
      if (getTradeMarkListResult.code === 200) {
        this.tradeMarkList = getTradeMarkListResult.data
      }
      const getBaseSaleAttrListResult = await this.$api.spu.reqGetBaseSaleAttrList()
      // console.log(getBaseSaleAttrListResult)
      if (getBaseSaleAttrListResult.code === 200) {
        this.baseSaleAttrList = getBaseSaleAttrListResult.data
      }
    },
    // 取消按钮的回调
    cancalChange() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

