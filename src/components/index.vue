<script setup>
import bot from "./bot.vue"
import my from "./my.vue"
</script>

<script >

// import Greet from "./components/Greet.vue";
import axios from 'axios'
export default {
    data() {
        return {
            keyDiaLog: {
                show: false,
                message: ''
            },
            waitSymbol: '.', // 等待符号
            message: '', // 发送的消息
            messageStatus: false, // 隐藏或显示 提问输入框
            nowApiKey: '',  // 自己的chatGPT 秘钥
            cacheApiKeyItem: 'cache_api_key',
            answerList: [], // 提问以及回答的结果列表
            giveList: [
                '我在街上被陌生人殴打，我并不认识对方，我现在身体并没有太大伤害，但是我要让他受到法律惩罚,请帮我查找对应的法律条文',
                '请帮我查找 寻衅滋事 对应的法律条文',
                '频繁手淫会造成肾炎吗',
                '哪些不良习惯会增加肺癌几率',
                '入室抢劫 量刑标准'
            ]
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
            const cacheApiKey = localStorage.getItem(this.cacheApiKeyItem)
            if (cacheApiKey === null || cacheApiKey === undefined) {
                // 内置api key
                const apiKey = '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'
                // 设置缓存
                localStorage.setItem(this.cacheApiKeyItem, apiKey)
                this.nowApiKey = apiKey
            } else {
                this.nowApiKey = cacheApiKey
            }
        },
        // 发送消息
        sendMessage() {
            if (this.message.length === 0) {
                return
            }
            // 隐藏输入框，显示 等待文字
            this.messageStatus = true
            const _message = this.message
            // 添加一条提问内容
            let content = { type: 1, content: _message }
            this.answerList.push(content)

            // 创建一个不停断运行的延时器, 改变等待符号，直到 请求返回结果
            const waitText = setInterval(() => {
                this.waitSymbol = this.waitSymbol + '.'
                if (this.waitSymbol.length === 6) {
                    this.$notify({
                        title: '提示',
                        message: '免费版秘钥 请求时间较长，请稍等! 或者升级为付费版的秘钥',
                        type: 'info',
                    })
                }
            }, 1000);

            // 开启一个 loading加载 
            //api 文档: https://platform.openai.com/docs/api-reference/chat/create
            axios({
                // 请求的服务器 URL
                url: 'https://api.openai.com/v1/chat/completions',

                // 创建请求时使用的方法
                method: 'POST', // 默认是 get

                // 自定义请求头
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.nowApiKey },

                // 与请求一起发送的 URL 参数
                data: {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "user",
                            "content": _message
                        }
                    ],
                    "temperature": 0.7
                }
            }).then((res) => {
                // 添加一条机器人回答内容
                // api返回格式
                /*
                    {
                        "id": "chatcmpl-705pmIC1y7kXe7wa5x2cNxmuT6u5v",
                        "object": "chat.completion",
                        "created": 1680256782,
                        "model": "gpt-3.5-turbo-0301",
                        "usage": {
                            "prompt_tokens": 13,
                            "completion_tokens": 18,
                            "total_tokens": 31
                        },
                        "choices": [
                            {
                                "message": {
                                    "role": "assistant",
                                    "content": "你好！有什么我可以帮助你的吗？"
                                },
                                "finish_reason": "stop",
                                "index": 0
                            }
                        ]
                    }
                */
                console.info('请求结果', res)
                let content = { type: 2, content: res.data.choices[0].message.content }
                this.answerList.push(content)
                this.message = ''
                setTimeout(() => {
                    this.messageStatus = false
                    this.waitSymbol = '.'
                    clearInterval(waitText)
                }, 100);

            }).catch((res) => {
                this.message = ''
                console.info(res)
                this.$message.error({
                    showClose: true,
                    message: res.response.data.error.message,
                    duration: 3000
                })
                setTimeout(() => {
                    this.messageStatus = false
                    this.waitSymbol = '.'
                    clearInterval(waitText)
                }, 100);
            })
        },
        // 清空消息
        clearDiaLog() {
            this.message = ''
            this.answerList = []
        },
        // 打开更改APi 秘钥对话框
        changeKey() {
            this.keyDiaLog.message = this.nowApiKey
            this.keyDiaLog.show = true
        },
        // 确认更改对话框
        confirmChangKey() {
            if (this.keyDiaLog.message.length !== 0) {
                this.message = this.keyDiaLog.message
                // 设置缓存
                localStorage.setItem(this.cacheApiKeyItem, this.keyDiaLog.message)
            }
            this.keyDiaLog.show = false

        },
        // 重置key
        reset() {
            this.keyDiaLog.show = false
            // 删除缓存
            localStorage.removeItem(this.cacheApiKeyItem)
            this.init()
        },
        // 右侧快速提问
        fastSearch(item) {
            this.message = item
            this.sendMessage()
        }

    }
}
</script>

<template>
    <div class="main">

        <!-- 头部内容 -->
        <div class="head">
            <bot style="height: 58px; width: 58px;" />

            <div class="title">
                <span class="title md">chatGPT</span>
                <span class="title md">Demo</span>
                <img src="https://img.shields.io/github/stars/liyang-it/ChatGPT?style=social" />
            </div>
            <p>
                技术选型
                👉
                <a border-b="" border-dashed="" hover:border-solid="" href="https://tauri.app/zh-cn/"
                    target="_blank"><b>Tarui + </b>
                </a>
                <a border-b="" border-dashed="" hover:border-solid="" href="https://cn.vuejs.org/" target="_blank"><b>Vue3 +
                    </b>
                </a>
                <a border-b="" border-dashed="" hover:border-solid="" href="https://element-plus.gitee.io/zh-CN/"
                    target="_blank"><b>Element-plus</b>
                </a>
            </p>
            <p>使用模型: gpt-3.5-turbo</p>

            <p>
                chatGPT账号注册教程、虚拟短信购买👉 <a border-b="" border-dashed="" hover:border-solid=""
                    href="https://sms-activate.org/cn/info/chatGPT" target="_blank"><b>注册chatGPT详细指南</b></a>
            </p>
            <p>
                chatGPT-OpenAi官网👉 <a border-b="" border-dashed="" hover:border-solid="" href="https://chat.openai.com/chat"
                    target="_blank"><b>openi</b></a>
            </p>
            <p>
                GitHub源码地址👉 <a border-b="" border-dashed="" hover:border-solid=""
                    href="https://github.com/liyang-it/ChatGPT" target="_blank"><b>liyang-it/ChatGPT</b></a>
            </p>
            <p>
                更改秘钥KEY👉 <el-link @click="changeKey"> <b>设置</b></el-link>
            </p>
            <!-- 更改秘钥key 对话框 -->
            <el-dialog v-model="keyDiaLog.show" title="Tips" width="30%">
                <el-form :model="keyDiaLog">
                    <el-form-item label="秘钥key" label-width="100px">
                        <el-input v-model="keyDiaLog.message" autocomplete="off" clearable>
                            <template #append>
                                <el-button icon="Refresh" @click="reset" />
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="keyDiaLog.show = false">关闭</el-button>
                        <el-button type="primary" @click="confirmChangKey">
                            确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>

            <!-- 返回结果 -->
            <div class="message-container">
                <div class="message-container-result" v-for="item in answerList">
                    <div class="ico">
                        <my v-show="item.type === 1" />
                        <bot v-show="item.type === 2" />
                    </div>
                    <div class="content">
                        {{ item.content }}
                    </div>
                </div>
            </div>

            <!-- 发送消息 -->
            <div class="send" v-show="messageStatus === false">
                <textarea v-model="message" placeholder="尽情提问吧" autocomplete="off" autofocus rows="1"
                    @keyup.enter.native="sendMessage">
                                                                                                                                                                                                                                    </textarea>
                <button title="Send" h-12="" px-4="" py-2="" bg-slate="" bg-op-15="" hover:bg-op-20="" text-slate=""
                    rounded-sm="" @click="sendMessage">
                    Send
                </button>
                <button title="Clear" @click="clearDiaLog">
                    <svg data-hk="s00-3-1-0" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M8 20v-5h2v5h9v-7H5v7h3zm-4-9h16V8h-6V4h-4v4H4v3zM3 21v-8H2V7a1 1 0 0 1 1-1h5V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3h5a1 1 0 0 1 1 1v6h-1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z">
                        </path>
                    </svg>
                </button>
            </div>
            <div class="excessive" v-show="messageStatus">
                正在等待chatGPT返回结果中! 请稍等 {{ waitSymbol }}
            </div>
        </div>
    </div>

    <!-- 右边固定内容 -->
    <div class="right_main">
        <li v-for="item in giveList" @click="fastSearch(item)">{{ item }}</li>
    </div>
</template>
<style scoped>
.main {
    width: 80ch;
    margin: 0 auto;
    padding: 6rem 2rem 4rem;

}

.head {
    padding: 20px;
    text-align: left;
    --un-text-opacity: 1;
    color: rgba(148, 163, 184, var(--un-text-opacity));
}

.head .title {
    font-weight: 800;
    font-size: 1.5rem;
    line-height: 2rem;

}

.title .md {
    margin-right: 0.50rem;
}

.send {
    display: inline-flex;
}

.send textarea {
    width: 400px;
    background: #353740;
    color: #c5c5d2;
    display: flex;
    border-radius: 2px;
    resize: none;
    font-size: 15px;
    /* height: 30px; */
    /* line-height: 30px; */
    /* margin-right: 10px; */
    font-family: system-ui, sans-serif;
    padding: 10px 10px 10px 10px;
    margin-right: 10px;
}


.send button {
    background: #353740;
    color: #c5c5d2;
    margin-right: 10px;
}

.message-container-result {
    padding: 10px 10px 10px 0px;
    margin: 10px 10px 10px 0px;

}

.message-container-result:hover {
    cursor: pointer;
    box-shadow: -1px -1px 10px 5px rgba(0, 0, 0, 0.5);
    transition-duration: 0.5s;
}

.message-container-result .ico {
    width: 30px;
    margin-right: 10px;
    float: left;
}

.message-container-result .content {
    margin-left: 40px;
    margin-top: 3px;
}

.el-link {
    margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
    vertical-align: text-bottom;
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

.right_main {
    height: 100vh;
    width: 400px;
    position: fixed;
    right: 0px;
    top: 140px;
}

.right_main li {
    margin-bottom: 10px;
    text-align: left;
}

.right_main li:hover {
    cursor: pointer;
    color: aquamarine;
}
</style>
