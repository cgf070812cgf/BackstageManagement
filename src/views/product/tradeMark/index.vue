<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px;" size="default" @click="showDiaLog">添加</el-button>
    <!--
      表单组件
      data:表格将来需要展示的数据(Array)
      border:是否带有纵向边框
      column:属性
      lable:展示标题
      width:对应列的宽度
      align:对齐方式
    -->
    <el-table style="width: 100%;" border :data="records">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width: 88px;height: 88px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateDiaLog(row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDiaLog(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
      current-page:当前第几页
      total:数据总条数
      page-size:每页展示的条数
      page-sizes:可以设置每页展示数据的条数
      pager-count:按钮的数量
      连续页码数默认为5
      layout:可以设置分页器的布局
      prop:对应列内容的字段名，也可以使用property属性
    -->
    <el-pagination
      style="margin: 20px;textAlign:center"
      :current-page="currentPage"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="limit"
      :pager-count="9"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!--
      对话框
      :visible.sync:控制对话框显示与隐藏
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!--
        form表单
        :model:把表单数据收集到哪个对象上，之后表单验证也需要用到
        Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
      -->
      <el-form ref="rulerForm" style="width: 80%;" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <!-- 这里可用v-model进行绑定 -->
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据不能用v-model,因为不是表单元素 -->
          <!--
            action为设置图片上传到的地址
            before-upload:图片上传之前
            on-success:图片上传成功执行
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 自定义校验规则
    const validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌的名称需要2-10位'))
      } else {
        callback()
      }
    }

    return {
      currentPage: 1,
      limit: 3,
      total: 0,
      records: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      // imageUrl: '',
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      // required:必须要验证的字段，与前面的星星有关
      // message:提示信息
      // trigger:用户的行为设置（blur:失焦，change:输入改变
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌Logo的验证规则
        logoUrl: [
          { required: true, message: '请选择品牌的图片' }
        ]
      }
    }
  },
  mounted() {
    this.getBaseTrademark()
  },
  methods: {
    async getBaseTrademark() {
      const result = await this.$api.tradeMark.reqGetBaseTrademark(this.currentPage, this.limit)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    sizeChange(size) {
      this.limit = size
      this.getBaseTrademark()
    },
    currentChange(page) {
      this.currentPage = page
      this.getBaseTrademark()
    },
    // 添加品牌
    showDiaLog() {
      this.dialogFormVisible = true
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    // 修改品牌
    updateDiaLog(row) {
      // row：当前品牌的信息
      this.dialogFormVisible = true
      // 将品牌的信息进行展示
      this.tmForm = { ...row }
    },
    deleteDiaLog(row) {
      this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const result = await this.$api.tradeMark.reqDeleteTradeMark(row.id)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.currentPage = this.records.length > 1 ? this.currentPage : this.currentPage - 1
            this.getBaseTrademark()
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res:上传成功后返回的数据
      // file:上传成功后服务器返回的数据
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮(添加｜修改品牌)
    addOrUpdateTradeMark() {
      // 全部验证通过再处理业务
      this.$refs.rulerForm.validate(async(success) => {
        if (success) {
          this.dialogFormVisible = false
          const result = await this.$api.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            // 弹出信息：添加品牌成功｜修改品牌成功
            this.$message({
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
              type: 'success'
            })
            // if (!this.tmForm.id) {
            //   this.currentPage = 1
            // }
            this.currentPage = this.tmForm.id ? this.currentPage : 1
            this.getBaseTrademark()
          } else {
            console.log('error submit!!')
            return false
          }
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
