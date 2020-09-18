<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '更新'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="dataForm.name" placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item prop="roleType" label="角色类型">
        <el-input type="number" v-model="dataForm.roleType" placeholder="请输入角色类型"/>
      </el-form-item>
      <el-row>
        <el-col>
          <el-form-item prop="permission" label="权限" :error="menuError">
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <el-tree
              class="filter-tree"
              :data="menuList"
              :props="{ label: 'name', value: 'permissionId' }"
              node-key="id"
              default-expand-all
              :filter-node-method="filterNode"
              ref="menuListTree"
              accordion
              check-strictly
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="loading" type="primary" @click="dataFormSubmitHandle()">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash'
import { sysRoleService } from '@/api/admin'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      menuError: '',
      filterText: '',
      menuList: [],
      dataForm: {}
    }
  },
  watch: {
    filterText (val) {
      this.$refs.menuListTree.filter(val)
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.menuError = ''
      this.filterText = ''
      if (this.dataForm === undefined) {
        this.dataForm = {
          roleId: null,
          name: '',
          permission: [],
          roleType: null,
          remark: ''
        }
      }
      this.$nextTick(() => {
        this.getPermissions()
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取权限节点列表
    getPermissions () {
      sysRoleService.myMenu().then(res => {
        this.menuList = res
        this.$refs.menuListTree.setCheckedKeys(this.dataForm.permission)
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.dataForm.permission = [
        ...this.$refs.menuListTree.getHalfCheckedKeys(),
        ...this.$refs.menuListTree.getCheckedKeys()
      ]
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        console.log(this.dataForm.roleType)
        if (this.dataForm.roleType === '1' || this.dataForm.permission.length > 0) {
          this.menuError = ''
        } else {
          this.menuError = '请勾选角色权限'
          return false
        }
        this.loading = true
        sysRoleService.saveRole(this.dataForm).then(res => {
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
    }, 1000, { leading: true, trailing: false })
  }
}
</script>
