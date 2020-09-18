import { request } from '@/api/service'
export default {
  data () {
    return {
      limitCount: 1,
      hideUpload: false
    }
  },
  methods: {
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleChange (file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    handleRemove (file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    axiosUpload (option) {
      const formData = new FormData()
      if (option.data) {
        Object.keys(option.data).forEach(key => {
          formData.append(key, option.data[key])
        })
      }
      formData.append(option.filename, option.file, option.file.name)
      return request.request({
        method: 'post',
        url: option.action,
        data: formData,
        headers: option.headers || {},
        onUploadProgress: e => {
          if (e.total > 0) {
            e.percent = e.loaded / e.total * 100
          }
          option.onProgress(e)
        }
      })
    }
  }
}
