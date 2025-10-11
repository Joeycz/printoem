// 获取按钮元素
const selectBtn = document.getElementById('selectBtn');

// 当按钮被点击时
selectBtn.addEventListener('click', async () => {
    // 获取当前活动的标签页
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 在该标签页上执行脚本
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });

    // 关闭popup窗口
    window.close();
});