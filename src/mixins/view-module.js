import { request } from '@/api/service'

export default {
  data () {
    /* eslint-disable */
        return {
            // 设置属性
            mixinViewModuleOptions: {
                activatedIsNeed: true,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
                getDataListURL: '',       // 数据列表接口，API地址
                getDataListIsPage: false, // 数据列表接口，是否需要分页？
                deleteURL: '',            // 删除接口，API地址
                deleteIsBatch: false,     // 删除接口，是否需要批量？
                deleteIsBatchKey: 'id',   // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
                exportURL: '',            // 导出接口，API地址
                getConfigURL: '',         // 获取前置配置接口，API地址
                updateStatusURL: '',      // 状态开关接口，API地址
            },
            // 默认属性
            loading: false,             // ajax异步加载中提示
            dataForm: {},               // 查询条件
            dataConfig: {},             // 前置配置数据
            dataList: [],               // 数据列表
            order: '',                  // 排序，asc／desc
            orderField: '',             // 排序，字段
            pageNum: 1,                    // 当前页码
            pageSize: 10,                  // 每页数
            total: 0,                   // 总条数
            dataListLoading: false,     // 数据列表，loading状态
            dataListSelections: [],     // 数据列表，多选项
            addOrUpdateVisible: false   // 新增／更新，弹窗visible状态
        }
        /* eslint-enable */
  },
  activated () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getConfig()
      this.getDataList()
    }
  },
  created () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getConfig()
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      request({
        method: 'get',
        url: this.mixinViewModuleOptions.getDataListURL,
        params: {
          order: this.order,
          orderField: this.orderField,
          pageNum: this.mixinViewModuleOptions.getDataListIsPage ? this.pageNum : null,
          pageSize: this.mixinViewModuleOptions.getDataListIsPage ? this.pageSize : null,
          ...this.dataForm
        }
      }).then(res => {
        this.dataListLoading = false
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.list : res
        this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.total : 0
      }).catch(() => {
        this.dataList = []
        this.total = 0
        this.dataListLoading = false
      })
    },
    // 获取前置数据配置
    async getConfig () {
      if (!this.mixinViewModuleOptions.getConfigURL) {
        return false
      }
      await request({
        method: 'get',
        url: this.mixinViewModuleOptions.getConfigURL
      }).then(res => {
        this.dataConfig = res
      }).catch(() => {
      })
    },
    // 状态开关接口
    updateStatus (id, status, refresh) {
      if (!this.mixinViewModuleOptions.updateStatusURL) {
        return false
      }
      request({
        method: 'put',
        url: this.mixinViewModuleOptions.updateStatusURL,
        data: {
          id,
          status
        }
      }).then(res => {
        this.$message({
          message: '更新状态成功',
          type: 'success',
          duration: 500
        })
        if (refresh) {
          this.getDataList()
        }
      }).catch(() => {
        this.getDataList()
      })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle (data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getDataList()
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.pageNum = 1
      this.pageSize = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.pageNum = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (obj) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataConfig = this.dataConfig
        this.$refs.addOrUpdate.dataForm = obj
        this.$refs.addOrUpdate.init()
      })
    },
    // 删除
    deleteHandle (id) {
      if (this.mixinViewModuleOptions.deleteIsBatch && !id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: '请选择删除项',
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm('确定删除选中的数据吗?', '提示', {
        closeOnPressEscape: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          method: 'delete',
          url: `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          data: this.mixinViewModuleOptions.deleteIsBatch ? {
            data: id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
          } : {}
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    }
  }
}
