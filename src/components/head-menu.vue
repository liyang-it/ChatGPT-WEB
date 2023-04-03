<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
</script>
<script>
export default {
  data() {
    return {
      cacheKeyItem: 'cache_other_char_GPT_web',
      otherchatGPTWeb: [], // 第三方 chatGPT
      DiaLog: {
        show: false,
        message: ''
      },
    }
  },
  created() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化的一些内容
    init() {
      // 优先从 本地缓存获取
      const cacheKeyItem = localStorage.getItem(this.cacheKeyItem)

      if (cacheKeyItem === null || cacheKeyItem === undefined) {
        // 内置 第三方gpt
        const otherchatGPTWeb_ = [
          { isUrl: true, url: 'https://openprompt.co/chatGPT' },
          { isUrl: true, url: 'https://ai.bo-e.com/' },
          { isUrl: true, url: 'http://w.tdchat6.com/' },
          { isUrl: false, url: '添加第三方GPT' }
        ]
        const json = JSON.stringify(otherchatGPTWeb_)
        // 设置缓存
        localStorage.setItem(this.cacheKeyItem, json)

        this.otherchatGPTWeb = otherchatGPTWeb_
      } else {
        this.otherchatGPTWeb = JSON.parse(cacheKeyItem)
      }
    },
    // 打开url链接
    openWebUrl(item) {
      // 判断是否为url
      if (item.isUrl) {
        window.open(item.url)
      } else {
        // 点击事件
        this.DiaLog.show = true
      }
    },
    // 确认添加第三方GPT链接
    confirmAdd() {
      if (this.DiaLog.message.length !== 0) {
        // 将元素插入到数组倒数第二个位置
        let nweArray = this.otherchatGPTWeb.slice(0, this.otherchatGPTWeb.length - 1)
        nweArray.push({ isUrl: true, url: this.DiaLog.message })
        nweArray.push({ isUrl: false, url: '添加第三方GPT' })
        this.otherchatGPTWeb = nweArray
        setTimeout(() => {
          // 重新设置缓存
          localStorage.removeItem(this.cacheKeyItem)
          const json = JSON.stringify(this.otherchatGPTWeb)
          // 设置缓存
          localStorage.setItem(this.cacheKeyItem, json)
        }, 10);
        this.DiaLog.message = ''
        this.DiaLog.show = false
      }
    },
    // 删除第三方gpt
    delWebUrl(item, index) {
      ElMessageBox.confirm(
        '是否确认删除?',
        '删除第三方GPT',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          // 判断是否为url
          if (item.isUrl) {
            // 删除当前下标的值
            let nweArray1 = this.otherchatGPTWeb.slice(0, index)
            let nweArray2 = this.otherchatGPTWeb.slice(index + 1)
            this.otherchatGPTWeb = nweArray1.concat(nweArray2)
            setTimeout(() => {
              // 重新设置缓存
              localStorage.removeItem(this.cacheKeyItem)
              const json = JSON.stringify(this.otherchatGPTWeb)
              // 设置缓存
              localStorage.setItem(this.cacheKeyItem, json)
            }, 10);
          }
        })
        .catch(() => {
        })

    },
  }
}
</script>

<template>
  <div class="head-menu-main">
    <!-- PC端桌面应用环境才显示 -->

    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        第三方chatGPT
      </span>
      <template #dropdown>
        <el-dropdown-item v-for="(item, index) in otherchatGPTWeb">
          <div @click.native="openWebUrl(item)">{{ item.url }}</div>
          <div v-show="item.isUrl" style="margin-left: 40px;" @click="delWebUrl(item, index)">
            <svg t="1680490122869" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="3862" width="35" height="35">
              <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#FDEBED" p-id="3863"></path>
              <path
                d="M729.6 384H294.4c-7.68 0-12.8-5.12-12.8-12.8v-25.6c0-7.68 5.12-12.8 12.8-12.8h115.2v-25.6c0-14.08 11.52-25.6 25.6-25.6h153.6c14.08 0 25.6 11.52 25.6 25.6v25.6h115.2c7.68 0 12.8 5.12 12.8 12.8v25.6c0 7.68-5.12 12.8-12.8 12.8z m-371.2 38.4h307.2c28.16 0 51.2 23.04 51.2 51.2v217.6c0 28.16-23.04 51.2-51.2 51.2H358.4c-28.16 0-51.2-23.04-51.2-51.2V473.6c0-28.16 23.04-51.2 51.2-51.2z m192 243.2c0 7.68 5.12 12.8 12.8 12.8s12.8-5.12 12.8-12.8V537.6c0-7.68-5.12-12.8-12.8-12.8s-12.8 5.12-12.8 12.8v128z m-102.4 0c0 7.68 5.12 12.8 12.8 12.8s12.8-5.12 12.8-12.8V537.6c0-7.68-5.12-12.8-12.8-12.8s-12.8 5.12-12.8 12.8v128z"
                fill="#EC3A4E" p-id="3864"></path>
            </svg>
          </div>
        </el-dropdown-item>
      </template>
    </el-dropdown>


    <!-- 添加第三方GPT 对话框 -->
    <el-dialog v-model="DiaLog.show" title="Tips" width="40%">
      <el-form :model="DiaLog">
        <el-form-item label="第三方GPT链接" label-width="120px">
          <el-input v-model="DiaLog.message" autocomplete="off" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="DiaLog.show = false">关闭</el-button>
          <el-button type="primary" @click="confirmAdd">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.head-menu-main {

  width: 100%;
  height: 23px;
  position: fixed;
  z-index: 999998;


  background-image: linear-gradient(to right, #171921, #b2cad1, #52409b);
  padding: 0px 0px 0px 5px;
}

.el-dropdown-link {
  cursor: pointer;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif !important;
  font-weight: 500;
  font-size: 12px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

/** 覆盖 样式 */
:deep(.el-dropdown) {
  color: #fff;
  display: inline-block;
  position: relative;
  font-size: 14px;
  margin-right: 10px;
  line-height: 23px;
}

:deep(input, button) {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: none;
}
</style>
