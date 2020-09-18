<template>
    <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '更新'" :close-on-click-modal="false"
               :close-on-press-escape="false">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
                 label-width="120px">
            <el-form-item prop="account" label="账户名">
                <el-input v-model="dataForm.account" placeholder="请输入账户名"/>
            </el-form-item>
            <el-form-item v-if="!dataForm.id" label="密码">
                <el-input v-model="dataConfig.password" disabled/>
            </el-form-item>
            <el-form-item prop="real_name" label="真实姓名">
                <el-input v-model="dataForm.real_name"/>
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
                <el-input v-model="dataForm.email"/>
            </el-form-item>
            <el-form-item prop="phone" label="电话">
                <el-input v-model="dataForm.phone"/>
            </el-form-item>
            <el-form-item prop="role_id" label="账户角色">
                <el-radio-group v-model="dataForm.role_id">
                    <el-radio-button
                        v-for="item in dataConfig.roles"
                        :key="item.id"
                        :label="item.id"
                        :disabled="item.status != 1">
                        {{item.name}}
                    </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="stores" label="关联店铺">
                <el-select v-model="dataForm.stores" filterable multiple clearable placeholder="请选择关联店铺" style="width: 100%">
                    <el-option
                            v-for="item in dataConfig.stores"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            :disabled="item.status != 1">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="mer_code" label="关联商户">
                <el-select v-model="dataForm.mer_code" filterable clearable placeholder="请选择关联商户">
                    <el-option
                            v-for="item in dataConfig.merchant"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            :disabled="item.status != 1">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="自定义权限">
                <el-switch
                        v-model="isPermission"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-row v-show="isPermission">
                <el-col>
                    <el-form-item prop="permission" label="权限" :error="menuError">
                        <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="filterText">
                        </el-input>
                        <el-tree
                                class="filter-tree"
                                :data="dataConfig.permission"
                                :props="{ label: 'name', value: 'id' }"
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
import { sysUserService } from '@/api/admin'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      isPermission: false, // 是否自定义权限
      menuError: '',
      dataConfig: {},
      filterText: '',
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
        account: [
          { required: true, message: '请填写账户名', trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '请选择账户角色', trigger: 'blur' }
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
          id: 0,
          account: '',
          real_name: '',
          email: '',
          phone: '',
          role_id: 0,
          mer_code: '',
          stores: [],
          permission: []
        }
      } else if (!this.dataForm.mer_code) {
        this.dataForm.mer_code = ''
      }
      if (this.dataForm.permission && this.dataForm.permission.length > 0) {
        this.isPermission = true
      } else {
        this.isPermission = false
      }
      this.$nextTick(() => {
        this.isPermission === true && this.$refs.menuListTree.setCheckedKeys(this.dataForm.permission)
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.dataForm.permission = [
        ...this.$refs.menuListTree.getHalfCheckedKeys(),
        ...this.$refs.menuListTree.getCheckedKeys()
      ]
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.isPermission) {
          this.dataForm.permission = []
        } else if (this.dataForm.permission.length > 0) {
          this.menuError = ''
        } else {
          this.menuError = '请勾选账户权限'
          return false
        }
        this.loading = true
        sysUserService.saveAdmin(this.dataForm).then(res => {
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
        }).catch(() => {
          this.loading = false
        })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
