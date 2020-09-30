<template>
    <d2-container>
        <el-form :inline="true" size="small" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
              <el-input placeholder="请输入title" v-model="dataForm.title" class="input-with-select"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <div>
          <el-table
            size="mini"
            v-loading="dataListLoading"
            :data="filterArray(dataList.permissionList, '')"
            row-key="permissionId"
            border
            @selection-change="dataListSelectionChangeHandle"
            @sort-change="dataListSortChangeHandle"
            style="width: 100%;"
            :tree-props="{children: 'children'}">
            <el-table-column prop="apiId" label="api唯一标识"/>
            <el-table-column prop="permissionId" label="permissionId"/>
            <el-table-column prop="parentId" label="parentId"/>
            <el-table-column prop="serviceId" label="serviceId"/>
            <el-table-column prop="title" label="title"/>
            <el-table-column prop="path" label="节点路由"/>
            <el-table-column prop="permissionCode" label="授权标识"/>
            <el-table-column prop="component" label="组件"/>
            <el-table-column prop="icon" label="图标"/>
            <el-table-column prop="isHide" label="是否隐藏"/>
            <el-table-column prop="redirectUrl" label="重定向url"/>
            <el-table-column prop="sort" label="排序值"/>
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <el-tag
                  :type="typeTag[scope.row.type] ? typeTag[scope.row.type] : 'primary'"
                  disable-transitions>{{scope.row.type}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    </d2-container>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './node-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/user-center/v1/user/my-info',
        getDataListIsPage: false,
        deleteURL: '',
        deleteIsBatch: false
      },
      typeTag: [
        'primary',
        'success',
        'info',
        'danger',
        'warning'
      ],
      dataConfig: {},
      dataForm: {
        title: '',
        permissionCode: ''
      },
      filterArray (data, parent) {
        data = data || []
        var tree = []
        var temp
        for (var i = 0; i < data.length; i++) {
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
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
