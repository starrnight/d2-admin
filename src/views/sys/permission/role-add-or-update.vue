<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '更新'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="dataForm.name" placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item prop="roleGroup" clearable label="角色组">
        <el-select type="number" v-model="dataForm.roleGroup" placeholder="请选择角色组">
          <el-option
            v-for="item in roleGroupArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="roleType" clearable label="角色类型">
        <el-select type="number" v-model="dataForm.roleType" placeholder="请选择角色类型">
          <el-option
            v-for="item in roleTypeArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="siteIdList" clearable label="站点">
        <el-select type="number" multiple v-model="dataForm.siteIdList" placeholder="请选择站点">
          <el-option
            v-for="item in siteList"
            :key="item.siteId"
            :label="item.siteName"
            :value="item.siteId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col>
          <el-form-item prop="permissionIdList" label="权限" :error="menuError">
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <el-tree
              class="filter-tree"
              :data="menuList"
              :props="{ label: 'title', value: 'permissionId' }"
              node-key="permissionId"
              default-expand-all
              :filter-node-method="filterNode"
              ref="menuListTree"
              check-on-click-node
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
      roleTypeArr: [
        { value: 1, label: '超级管理员（跳过所有功能权限校验）' },
        { value: 2, label: '普通管理员（管理各个项目角色，service_id不能有值）' },
        { value: 3, label: '服务管理员（针对服务，service_id须有值，可操作服务下的角色）' },
        { value: 4, label: '内置角色 （1 和 2 有操作权限）' },
        { value: 5, label: '普通角色 （只能更改自己创建的角色）' }
      ],
      roleGroupArr: [
        { value: 1, label: '权限组' },
        { value: 2, label: '业务组' }
      ],
      siteList: [],
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
          permissionIdList: [],
          roleType: null,
          siteIdList: null,
          roleGroup: null,
          remark: ''
        }
      }
      this.$nextTick(() => {
        this.getPermissions()
        this.getSiteList()
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    getSiteList () {
      sysRoleService.getSiteList().then(res => {
        this.siteList = res.list
      })
    },
    // 获取权限节点列表
    getPermissions () {
      sysRoleService.myMenu().then(res => {
        this.menuList = this.filterArray(res.permissionList, '')
        const checkArr = []
        for (const i in this.dataForm.permissionList) {
          checkArr.push(this.dataForm.permissionList[i].permissionId)
        }
        this.$refs.menuListTree.setCheckedKeys(checkArr)
      })
    },
    filterArray (data, parent) {
      data = data || []
      var tree = []
      var temp
      for (var i = 0; i < data.length; i++) {
        if (data[i].type === 4) {
          continue
        }
        if (data[i].apiInfo != null && data[i].apiInfo.authority !== 'r') {
          // continue
        }
        if (data[i].parentId === parent) {
          var obj = data[i]
          temp = this.filterArray(data, data[i].permissionId)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.dataForm.permissionIdList = [
        ...this.$refs.menuListTree.getHalfCheckedKeys(),
        ...this.$refs.menuListTree.getCheckedKeys()
      ]
      console.log(this.dataForm.permissionIdList)
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.dataForm.roleType === '1' || this.dataForm.permissionIdList.length > 0) {
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
