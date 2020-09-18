<template>
  <d2-container>
    <el-form :inline="true" size="small" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.keywords" placeholder="请输入商户名称搜索" clearable/>
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
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="company" label="公司"/>
      <el-table-column prop="mer_code" label="唯一码"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="updateStatus(scope.row.mer_code, $event)"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="add_tm" label="创建时间"/>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
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
import AddOrUpdate from './merchant-add-or-update'
export default {
  mixins: [ mixinViewModule ],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/admin/merchant/index',
        getConfigURL: '/admin/merchant/config',
        updateStatusURL: '/admin/merchant/status',
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
  }
}
</script>
