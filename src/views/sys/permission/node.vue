<template>
    <d2-container>
        <el-form :inline="true" size="small" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input placeholder="请输入对应搜索类型" v-model="dataForm.keywords" class="input-with-select">
                    <el-select v-model="dataForm.searchType" slot="prepend" style="width: 100px" placeholder="请选择">
                        <el-option label="名称" value="0"></el-option>
                        <el-option label="模块" value="1"></el-option>
                        <el-option label="控制器" value="2"></el-option>
                        <el-option label="行为" value="3"></el-option>
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
                row-key="id"
                border
                @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle"
                style="width: 100%;"
                :tree-props="{children: 'children'}">
            <el-table-column prop="name" label="名称"/>
            <el-table-column prop="url" label="节点路由"/>
            <el-table-column prop="perms" label="授权标识"/>
            <el-table-column prop="module" label="模块"/>
            <el-table-column prop="controller" label="控制器"/>
            <el-table-column prop="action" label="行为"/>
            <el-table-column prop="type" label="类型">
                <template slot-scope="scope">
                    <el-tag
                            :type="typeTag[scope.row.type] ? typeTag[scope.row.type] : 'primary'"
                            disable-transitions>{{scope.row.type_name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序"/>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
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
        getDataListURL: '/user-center/permission/page',
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
      dataForm: {
        keywords: '',
        searchType: '0'
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
