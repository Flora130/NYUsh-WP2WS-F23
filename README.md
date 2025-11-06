# Project C - 交互式 3D 音视频体验

一个基于 **three.js**、**p5.js** 和 **socket.io** 的沉浸式交互式 3D 应用，支持 WebXR（VR/AR）、实时音频可视化和多人协作体验。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

---

## ✨ 项目特性

### 🎨 3D 可视化
- 基于 **three.js** 的实时 3D 渲染
- 动态几何体（立方体、球体、环形结构）
- 实时阴影和光照效果
- 材质和纹理映射

### 🎵 音频交互
- **p5.js** 音频分析和处理
- 实时音量检测和可视化
- 音高检测和频率分析
- 多轨道音频播放系统
- 音频驱动的 3D 动画效果

### 🥽 WebXR 支持
- 原生 WebXR API 集成
- VR/AR 设备兼容性
- 手柄交互和射线选择
- 沉浸式虚拟环境

### 🌐 实时协作
- **socket.io** 实时双向通信
- 多用户同步体验
- 事件广播和接收
- 低延迟数据传输

### 🎭 视觉效果
- 粒子系统（花瓣动画）
- 动态环形变形
- 材质发光效果
- 背景纹理映射

---

## 🛠️ 技术栈

- **前端框架**: vanilla JavaScript
- **3D 引擎**: three.js (v0.156.1)
- **音频处理**: p5.js + p5.sound
- **实时通信**: socket.io (v4.7.2)
- **后端**: Node.js + Express
- **WebXR**: 原生 WebXR API
- **SSL/TLS**: HTTPS 服务器

---

## 📦 项目结构

```
Project C/
├── server.js                 # 主服务器文件（Express + HTTPS）
├── package.json              # 依赖和脚本配置
├── cert.pem                  # SSL 证书
├── key.pem                   # SSL 私钥
├── README.md                 # 项目文档
└── public/                   # 静态资源目录
    ├── index.html            # 主页面
    ├── css/
    │   └── style.css         # 样式文件
    ├── js/                   # JavaScript 模块
    │   ├── main.js           # 主控制器和 Three.js 场景
    │   ├── script-three.js   # Three.js 初始化
    │   ├── script-webxr.js   # WebXR 功能
    │   ├── script-p5.js      # p5.js 音频处理
    │   └── script-socket.js  # Socket.io 通信
    └── assets/               # 媒体资源
        ├── bg.mp3            # 背景音乐
        ├── Drum.mp3          # 鼓点音频
        ├── H1.mp3 ~ H12.mp3  # 交互音效
        ├── Bell.mp3          # 铃铛音效
        ├── ORC1.mp3 ~ ORC8.mp3 # 管弦乐音效
        ├── petal.obj         # 花瓣 3D 模型
        └── background/       # 纹理文件
            ├── brick.png
            ├── ceiling.png
            └── floor.jpeg
```

---

## 🚀 快速开始

### 前置要求

- **Node.js** >= 14.0.0
- **npm** 或 **yarn**
- 现代浏览器（Chrome 80+、Firefox 75+、Safari 13.1+）
- 推荐使用 Chrome 以获得最佳 WebXR 支持

### 安装步骤

1. **克隆或下载项目**
```bash
cd "/Users/minimax/Downloads/Project C"
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
npm start
```

4. **访问应用**

服务器启动后，打开浏览器访问控制台输出的地址，格式如：
```
https://YOUR_IP_ADDRESS:3000
```

例如：
```
https://192.168.1.100:3000
```

---

## 🎮 使用说明

### 基本操作

| 按键/操作 | 功能 |
|-----------|------|
| 空格键 `Space` | 生成新的花瓣粒子 |
| `S` 键 | 播放/停止背景音乐 |
| `0-8` 数字键 | 触发不同的音效 |
| 鼠标拖拽 | 旋转相机视角 |
| 滚轮 | 缩放视图 |

### VR/AR 模式

1. 点击页面上的 **"ENTER VR"** 按钮
2. 佩戴 VR 头显设备
3. 使用控制器瞄准并触发交互
4. 射线指示器会显示交互点

### 音频交互

- **音量感应**: 环境音量会影响 3D 对象的缩放
- **音高感应**: 音高会影响环形结构的变形
- **触发音效**: 点击 3D 对象会播放对应音效

### 多人协作

- 多个客户端可同时连接同一服务器
- 任何客户端的交互都会广播给其他用户
- 实时同步花瓣生成和音频播放

---

## ⚙️ 配置选项

### server.js 配置

```javascript
// 修改端口
const port = 3000;  // 改为您需要的端口

// 修改 CORS 设置
cors: {
  origin: "*",              // 允许的来源
  methods: ["GET", "POST"],
  credentials: true
}

// 使用 HTTP 替代 HTTPS（仅开发环境）
// const server = http.createServer(app);
```

### main.js 配置

```javascript
// 世界尺寸
let WORLD_HALF = 10;  // 影响场景规模

// 花瓣数量
for (let i = 0; i < 30; i++) {  // 修改生成的花瓣数量
  // ...
}
```

---

## 🐛 故障排除

### 常见问题

**Q: 浏览器显示"不安全连接"警告？**
> A: 由于使用自签名证书，这是正常现象。点击"高级" → "继续访问"即可。

**Q: VR 模式无法启动？**
> A: 确保使用支持 WebXR 的浏览器和设备。Chrome 推荐。在 HTTPS 环境下测试。

**Q: 音频无法播放？**
> A: 现代浏览器需要用户交互后才能播放音频。点击页面任意位置激活音频。

**Q: Socket.io 连接失败？**
> A: 检查防火墙设置，确保 3000 端口开放。验证服务器控制台无错误信息。

**Q: 3D 模型或纹理加载失败？**
> A: 确保 `public/assets/` 目录下的所有文件存在且路径正确。

### 调试模式

启用详细日志：
```javascript
// 在 server.js 中
io.on("connection", newConnection);
function newConnection(sck) {
  console.log("✓ New connection:", sck.id);
  sck.on("connection_name", (data) => {
    console.log("📨 Received:", data);
    sck.broadcast.emit("connection_name", data);
  });
}
```

---

## 🔧 开发指南

### 添加新功能

1. **新的 3D 对象**
```javascript
// 在 main.js 中添加函数
function getCustomObject() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
```

2. **新的音效**
```javascript
// 在 script-p5.js 中添加
let soundFilenames = [
  "your-sound.mp3",  // 添加新音效文件
  // ...
];

// 预加载
sounds.push(loadSound("assets/your-sound.mp3"));
```

3. **新的 Socket 事件**
```javascript
// 服务器端 (server.js)
io.on("connection", (socket) => {
  socket.on("custom_event", (data) => {
    // 处理事件
    socket.broadcast.emit("custom_event", data);
  });
});

// 客户端 (script-socket.js)
function sendCustom(data) {
  socket.emit("custom_event", data);
}
```

---

## 📊 性能优化建议

1. **降低渲染质量**（移动设备）
```javascript
// 在 script-three.js 中
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```

2. **减少粒子数量**
```javascript
// 在 main.js 中
for (let i = 0; i < 10; i++) {  // 从 30 减到 10
  // ...
}
```

3. **优化阴影**
```javascript
renderer.shadowMap.enabled = false;  // 禁用阴影（显著提升性能）
```

---

## 📄 许可证

本项目使用 [ISC License](https://opensource.org/licenses/ISC) 开源。

---

## 🙏 致谢

- [three.js](https://threejs.org/) - 3D 图形库
- [p5.js](https://p5js.org/) - 创意编程库
- [socket.io](https://socket.io/) - 实时通信库
- [Express](https://expressjs.com/) - Web 框架

---

## 📞 支持

如有问题或建议，请通过以下方式联系：
- 创建 [GitHub Issue](../../issues)
- 发送邮件至项目维护者

---

## 📝 更新日志

### v1.0.0 (2023-12-08)
- ✨ 初始版本发布
- 🎨 完整的 3D 场景渲染
- 🎵 音频交互功能
- 🥽 WebXR 支持
- 🌐 实时多人协作
- 🔐 HTTPS 安全连接
- 🐛 错误修复和代码优化

---

**享受您的沉浸式 3D 交互体验！** 🚀✨
