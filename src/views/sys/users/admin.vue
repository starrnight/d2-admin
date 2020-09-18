<template>
  <d2-container>
    <el-form :inline="true" size="small" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input placeholder="请输入对应搜索类型" v-model="dataForm.keywords" class="input-with-select">
          <el-select v-model="dataForm.searchType" slot="prepend" style="width: 100px" placeholder="请选择">
            <el-option label="账户名" value="0"></el-option>
            <el-option label="姓名" value="1"></el-option>
            <el-option label="邮箱" value="2"></el-option>
            <el-option label="电话" value="3"></el-option>
            <el-option label="唯一码" value="4"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
            size="mini"
            v-loading="dataListLoading"
            :data="dataList"
            border
            @selection-change="dataListSelectionChangeHandle"
            @sort-change="dataListSortChangeHandle"
            style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="最后登录IP">
              <span>{{ props.row.last_ip }}</span>
            </el-form-item>
            <el-form-item label="唯一码 ">
              <span>{{ props.row.uuid }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.add_tm }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账户名"/>
      <el-table-column prop="real_name" label="姓名"/>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="mer_code" label="商户">
        <template slot-scope="scope">
          <span>{{dataConfig.merchant[scope.row.mer_code] ? dataConfig.merchant[scope.row.mer_code]['name'] : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role_id" label="角色">
        <template slot-scope="scope">
          <span>{{dataConfig.roles[scope.row.role_id] ? dataConfig.roles[scope.row.role_id]['name'] : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="last_tm" label="最后登录"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="updateStatus(scope.row.id, $event)"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="repeatPassword(scope.row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    <!-- 分页 -->
    <el-pagination
            slot="footer"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="limit"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle">
    </el-pagination>
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './admin-add-or-update'
import request from '@/api/service'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/admin/admin_user/index',
        getConfigURL: '/admin/admin_user/config',
        updateStatusURL: '/admin/admin_user/status',
        getDataListIsPage: true
      },
      dataConfig: {
        type: [],
        status: ['', '']
      },
      dataForm: {
        keywords: '',
        typeSearch: '0'
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    repeatPassword (id) {
      this.$confirm('您确定要重置此账户密码吗？重置后账户密码为：' + this.dataConfig.password, '重置密码', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/admin/admin_user/resetPassword',
          method: 'put',
          data: {
            id
          }
        }
        ).then(res => {
          this.$message({
            message: '重置密码成功',
            type: 'success',
            duration: 500
          })
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
