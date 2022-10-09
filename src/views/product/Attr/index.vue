<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect @getCategoryListID="getCategoryListID($event)" />
    </el-card>
    <el-card>

      <div v-show="isShowTable">
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          style="margin: 10px 0px;"
          :disabled="!categoryListID.category3ListID"
          @click="addAttr"
        >添加属性</el-button>
        <el-table :data="attrInfoList" border>
          <el-table-column type="index" label="序号" :width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" :width="150" align="center" />
          <el-table-column prop="" label="属性值列表" width="width">
            <template slot-scope="{row}">
              <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0px 8px;" type="success">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" :width="150" align="center">
            <template slot-scope="{row}">
              <el-button type="warning" size="mini" icon="el-icon-edit" style="margin: 0px 8px;" @click="updateAttr(row)" />
              <el-popconfirm :title="`确定删除${row.attrName}吗？`" @onConfirm="deleteAttr(row.id)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或修改属性 -->
      <div v-show="!isShowTable">
        <el-form label-width="80px" :inline="true" size="normal" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName || isAddAttrInfo"
          @click="addAttrInfo"
        >请添加属性值</el-button>
        <!-- <el-button size="default">取消</el-button> -->

        <el-table style="margin: 20px 0px; width: 100%;" :data="attrInfo.attrValueList" border>
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input
                v-show="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性名"
                size="mini"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              />
              <span v-show="!row.flag" style="display: block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrInfo($index)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" size="default" @click="addOrUpdateAttr">保存</el-button>
        <el-button size="default" @click="isShowTable=true">取消</el-button>

      </div>

    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      isShowTable: true,
      categoryListID: {},
      attrInfoList: [],
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [ // 属性值，有多个属性所以使用数组
          // {
          //   attrId: undefined, // 对应属性名的id
          //   valueName: ''
          // }
        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 0 // 标注为几级分类
      },
      isAddAttrInfo: false
    }
  },
  methods: {

    async getAttrInfoList() {
      const result = await this.$api.attr.reqGetAttrInfoList(this.categoryListID)
      if (result.code === 200) {
        this.attrInfoList = result.data
      }
    },

    getCategoryListID(categoryListID) {
      this.isShowTable = true
      this.categoryListID = categoryListID
      if (categoryListID.category3ListID) {
        this.getAttrInfoList()
      }
    },

    addAttrInfo() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },

    addAttr() {
      this.isShowTable = false
      this.attrInfo = {
        attrName: '',
        attrValueList: [
        ],
        categoryId: this.categoryListID.category3ListID,
        categoryLevel: 3
      }
    },

    updateAttr(row) {
      this.isShowTable = false
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        // 这样设置flag不为响应式数组
        this.$set(item, 'flag', false)
      })
    },

    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message('请你输入一个正常的属性值')
        this.isAddAttrInfo = true
        return
      }
      const isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return item.valueName === row.valueName
        }
      })
      if (isRepat) {
        this.$message({
          type: 'warning',
          message: '属性已经存在，请重新输入！'
        })
        row.valueName = ''
        this.isAddAttrInfo = true
        return
      }
      this.isAddAttrInfo = false
      row.flag = false
    },

    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    deleteAttrInfo(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },

    async addOrUpdateAttr() {
      const attrValueListLength = this.attrInfo.attrValueList.length
      if (attrValueListLength !== 0) {
        this.attrInfo.attrValueList = this.attrInfo.attrValueList[attrValueListLength - 1].valueName === '' ? this.attrInfo.attrValueList.slice(0, attrValueListLength - 1) : this.attrInfo.attrValueList
        this.attrInfo.attrValueList.forEach(item => delete item.flag)
        if (!this.isAddAttrInfo) {
          const result = await this.$api.attr.reqAddOrUpdateAttr(this.attrInfo)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            this.isShowTable = true
            this.getAttrInfoList()
          } else {
            this.$message.error('保存失败！')
          }
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请输入有效属性！'
        })
      }
      this.isAddAttrInfo = false
    },
    async deleteAttr(attrId) {
      const result = await this.$api.attr.reqDeleteAttr(attrId)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        this.getAttrInfoList()
      } else {
        this.$message({
          type: 'warning',
          message: '删除失败！'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
