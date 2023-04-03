import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
// 引入 element-plus 组件 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入 axios
import axios from 'axios'
const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

