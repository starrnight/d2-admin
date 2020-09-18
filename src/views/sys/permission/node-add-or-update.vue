<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '更新'" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" top="5em">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" label="节点名称">
        <el-input v-model="dataForm.name" placeholder="请输入权限节点名称"/>
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-select v-model="dataForm.type" placeholder="请选择节点类型">
          <el-option
                  v-for="(item, i) in dataConfig.type"
                  :key="i"
                  :label="item"
                  :value="i">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="pid" label="父节点">
        <el-cascader
                v-model="dataForm.pid"
                :options="dataConfig.level"
                :props="{ checkStrictly: true, emitPath: false, expandTrigger: 'hover', value: 'id', label: 'name' }"
                clearable
                placeholder="作为一级目录节点"
                ></el-cascader>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input v-model="dataForm.sort" placeholder="排序值越大则排序越靠后"/>
      </el-form-item>
      <el-form-item prop="url" label="节点路由">
        <el-input v-model="dataForm.url" placeholder=""/>
      </el-form-item>
      <el-form-item prop="perms" label="授权标识">
        <el-input v-model="dataForm.perms" placeholder=""/>
      </el-form-item>
      <el-form-item prop="icon" label="图标">
        <el-input v-model="dataForm.icon" placeholder=""/>
      </el-form-item>
      <el-form-item prop="module" label="模块">
        <el-input v-model="dataForm.module" placeholder="请输入节点路由"/>
      </el-form-item>
      <el-form-item prop="controller" label="控制器">
        <el-input v-model="dataForm.controller" placeholder=""/>
      </el-form-item>
      <el-form-item prop="action" label="行为">
        <el-input v-model="dataForm.action" placeholder=""/>
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
      dataConfig: {
        level: [],
        type: []
      },
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
          id: 0,
          pid: 0,
          name: '',
          url: '',
          perms: '',
          icon: '',
          module: 'admin',
          controller: '',
          action: '',
          type: 0,
          sort: 0
        }
      }
      this.$nextTick(() => {
        this.getConfig()
      })
    },
    // 获取前置配置信息
    getConfig () {
      sysMenuService.getConf().then(res => {
        this.dataConfig = res
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
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
