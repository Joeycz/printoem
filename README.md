# Printoem

一个Chrome浏览器扩展，允许用户选择网页上的任何元素并将其打印出来。

```bash
print-element-extension/
├── manifest.json         (插件的配置文件，最重要)
├── popup.html            (点击插件图标后看到的弹出窗口)
├── popup.js              (处理弹出窗口的逻辑)
├── content.js            (注入到网页中，用来处理元素选择和打印的脚本)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png         (插件的图标，可选但建议有)
```