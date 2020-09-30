<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.permissionId ? '新增' : '更新'" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" top="5em">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="type" label="类型">
        <el-select v-model="dataForm.type" placeholder="请选择节点类型">
          <el-option
                  v-for="(item, i) in typeArr"
                  :key="i + item"
                  :label="item"
                  :value="i">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="apiId" label="apiId">
        <el-select v-model="dataForm.apiId" filterable placeholder="请选择权限父节点名称">
          <el-option
            v-for="item in apiList"
            :key="item.apiId"
            :label="item.name"
            :value="item.apiId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="parentId" label="父节点">
        <el-input v-model="dataForm.parentId" placeholder="请输入权限父节点名称"/>
      </el-form-item>
      <el-form-item prop="serviceId" label="serviceId">
        <el-input v-model="dataForm.serviceId" placeholder="请输入权限父节点名称"/>
      </el-form-item>
      <el-form-item prop="title" label="title">
        <el-input v-model="dataForm.title" placeholder="请输入权限节点title"/>
      </el-form-item>
      <el-form-item prop="path" label="节点路由">
        <el-input v-model="dataForm.path" placeholder=""/>
      </el-form-item>
      <el-form-item prop="permissionCode" label="授权标识">
        <el-input v-model="dataForm.permissionCode" placeholder=""/>
      </el-form-item>
      <el-form-item prop="icon" label="图标">
        <el-input v-model="dataForm.icon" placeholder=""/>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input v-model="dataForm.sort" placeholder="排序值越大则排序越靠后"/>
      </el-form-item>
      <el-form-item prop="isHide" label="是否隐藏">
        <el-radio v-model="dataForm.isHide" label="0">否</el-radio>
        <el-radio v-model="dataForm.isHide" label="1">是</el-radio>
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
import { sysMenuService } from '@/api/admin'
export default {
  data () {
    return {
      loading: false,
      visible: false,
      typeArr: [
        '导航目录',
        '左侧菜单',
        '链接',
        '按钮',
        '交互'
      ],
      apiList: [],
      dataForm: {}
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '请填写节点名称', trigger: 'blur' }
        ],
        // module: [
        //   { required: true, message: '请填写模块名称', trigger: 'blur' }
        // ],
        // controller: [
        //   { required: true, message: '请填写控制器名称', trigger: 'blur' }
        // ],
        // action: [
        //   { required: true, message: '请填写行为名称', trigger: 'blur' }
        // ],
        type: [
          { required: true, message: '请选择节点类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      if (this.dataForm === undefined) {
        this.dataForm = {
          apiId: '',
          parentId: 'b2d2c379-f668-11ea-a9c0-cbea55fa5318',
          permissionId: '',
          serviceId: '65a1e7ec-bee3-457a-9ad8-1bdb29102c58',
          title: 'Etekcity',
          path: '',
          permissionCode: '',
          icon: '',
          type: 0,
          isHide: 0,
          sort: 0
        }
      }
      this.$nextTick(() => {
        this.getConfig()
      })
    },
    // 获取前置配置信息
    getConfig () {
      sysMenuService.getApiList().then(res => {
        this.apiList = res.list
        this.apiList.filter((item) => {
          return item.type === 0 && item.status === 1
        })
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        sysMenuService.savePermission(this.dataForm).then(res => {
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
