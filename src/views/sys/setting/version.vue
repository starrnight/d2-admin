<template>
    <d2-container>
        <el-form :model="versionForm" ref="versionForm" label-width="0px">
            <el-row
                    v-for="(item, index) in versionForm.data"
                    :key="index"
            >
                <el-col :span="4">
                    <el-form-item
                            :prop="'data.' + index + '.version'"
                            :rules="{ required: true, message: '请输入版本号', trigger: 'blur' }">
                        <el-input v-model="item.version" placeholder="版本号">{{item.version}}</el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                            :prop="'data.' + index + '.shop'"
                            :rules="{ required: true, message: '请输入商超版本地址', trigger: 'blur' }">
                        <el-input v-model="item.shop" placeholder="对应商超版本地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                            :prop="'data.' + index + '.system'"
                            :rules="{ required: true, message: '请输入对应颂小二版本地址', trigger: 'blur' }">
                        <el-input v-model="item.system" placeholder="对应颂小二版本地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button v-if="index===0" @click.prevent="add()">新增</el-button>
                    <el-button v-else @click.prevent="remove(index)">删除</el-button>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" @click="submitForm('versionForm')" :loading="loading" style="margin-left: 45%;">提交</el-button>
            </el-form-item>
        </el-form>
    </d2-container>
</template>
<script>
import { getVersion, setVersion } from '@/api/common'

export default {
  data () {
    return {
      loading: false,
      versionForm: {
        data: [{
          version: '',
          shop: '',
          system: ''
        }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      getVersion().then(res => {
        this.loading = false
        this.versionForm.data = res
      }).catch(() => {
        this.loading = false
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        setVersion(this.versionForm.data).then(res => {
          this.loading = false
          this.$message({
            message: '更新版本配置成功',
            type: 'success',
            duration: 500
          })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    remove (index) {
      try {
        this.versionForm.data.splice(index, 1)
      } catch (e) {
        // todo delete
        this.versionForm.data = [{
          version: '',
          shop: '',
          system: ''
        }]
      }
    },
    add () {
      this.versionForm.data.push({
        version: '',
        shop: '',
        system: ''
      })
    }
  }
}
</script>
