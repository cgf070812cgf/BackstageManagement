<template>
  <div>
    <!-- inline:代表行内表单，一行内可放多个表单元素 -->
    <el-form :inline="true" :model="categoryListID" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="categoryListID.category1ListID" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option
            v-for="c1 in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryListID.category2ListID" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option
            v-for="c2 in list2"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryListID.category3ListID" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option
            v-for="c3 in list3"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      categoryListID: {
        category1ListID: '',
        category2ListID: '',
        category3ListID: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const result = await this.$api.attr.reqGetCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    async getCategory2List() {
      const result = await this.$api.attr.reqGetCategory2List(this.categoryListID.category1ListID)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    async getCategory3List() {
      const result = await this.$api.attr.reqGetCategory3List(this.categoryListID.category2ListID)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    handler1() {
      this.getCategory2List()
      this.list2 = []
      this.list3 = []
      this.categoryListID.category2ListID = ''
      this.categoryListID.category3ListID = ''
    },
    handler2() {
      this.getCategory3List()
      this.list3 = []
      this.categoryListID.category3ListID = ''
    },
    handler3() {
      this.$emit('getCategoryListID', this.categoryListID)
    }
  }
}
</script>

<style scoped>

</style>
