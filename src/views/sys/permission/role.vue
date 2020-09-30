<template>
  <d2-container>
    <el-form :inline="true" size="small" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.typeSearch" style="width: 120px">
          <el-option label="全部类型" value="0"></el-option>
          <el-option
                  v-for="(item, i) in dataConfig.type"
                  :key="i"
                  :label="item"
                  :value="i">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.keywords" placeholder="请输入角色名称搜索" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteHandle()">删除</el-button>
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
      <el-table-column type="selection" width="50"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="serviceId" label="所属服务"/>
      <el-table-column prop="roleType" label="角色类型">
        <template slot-scope="scope">
          {{roleGroupArr[scope.row.roleType]}}
        </template>
      </el-table-column>
      <el-table-column prop="roleGroup" label="角色组">
        <template slot-scope="scope">
          {{roleGroupArr[scope.row.roleGroup]}}
        </template>
      </el-table-column>
      <el-table-column prop="updateUserName" label="更新人"/>
      <el-table-column prop="createUserName" label="创建者"/>
      <el-table-column prop="updateTime" label="更新时间"/>
      <el-table-column prop="createTime" label="更新时间"/>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="deleteHandle(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    <!-- 分页 -->
    <el-pagination
            slot="footer"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChangeHandle"
            @current-change="pageCurrentChangeHandle">
    </el-pagination>
  </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './role-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      roleTypeArr: {
        1: '超级管理员（跳过所有功能权限校验）',
        2: '普通管理员（管理各个项目角色，service_id不能有值）',
        3: '服务管理员（针对服务，service_id须有值，可操作服务下的角色）',
        4: '内置角色 （1 和 2 有操作权限）',
        5: '普通角色 （只能更改自己创建的角色）'
      },
      roleGroupArr: {
        1: '权限组',
        2: '业务组'
      },
      mixinViewModuleOptions: {
        getDataListURL: '/user-center/v1/role/page',
        getConfigURL: '',
        updateStatusURL: '',
        getDataListIsPage: true,
        deleteURL: '',
        deleteIsBatch: true
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
