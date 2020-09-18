<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '更新'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" label="商户名称">
        <el-input v-model="dataForm.name" placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item prop="company" label="公司名称">
        <el-input v-model="dataForm.company" placeholder="请输入公司名称"/>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="dataFormSubmitHandle()">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash'
import { merchantService } from '@/api/save-or-update'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      dataForm: {}
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '请填写商户名称', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      if (this.dataForm === undefined) {
        this.dataForm = {
          name: '',
          company: ''
        }
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        merchantService(this.dataForm).then(res => {
          this.loading = false
          this.visible = false
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => { this.loading = false })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
