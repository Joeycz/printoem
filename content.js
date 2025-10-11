(function() {
    // 防止脚本被重复注入
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    let lastHighlightedElement = null;

    // 鼠标悬停事件处理
    function handleMouseOver(event) {
        const target = event.target;
        
        // 移除上一个高亮元素的样式
        if (lastHighlightedElement) {
            lastHighlightedElement.style.outline = '';
        }

        // 高亮当前元素
        target.style.outline = '2px solid red';
        lastHighlightedElement = target;
    }

    // 鼠标点击事件处理
    function handleClick(event) {
        // 阻止默认行为（例如，如果点击的是一个链接，阻止它跳转）
        event.preventDefault();
        event.stopPropagation();

        const selectedElement = event.target;
        
        // 清理工作：移除事件监听和高亮
        cleanup();
        
        // 调用打印函数
        printElement(selectedElement);
    }
    
    // 清理函数
    function cleanup() {
        if (lastHighlightedElement) {
            lastHighlightedElement.style.outline = '';
        }
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('click', handleClick, true); // 使用捕获阶段
        document.body.style.cursor = 'default'; // 恢复鼠标样式
    }

    // 打印函数 (我们之前版本的功能)
    function printElement(element) {
        // 1. 收集所有样式
        let allStyles = "";
        const styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
        styleSheets.forEach(sheet => {
            allStyles += sheet.outerHTML;
        });

        // 2. 获取被选元素的外部HTML
        const printContents = element.outerHTML;

        // 3. 构建包含样式的新页面内容
        const printPageHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print</title>
                ${allStyles}
            </head>
            <body>
                ${printContents}
            </body>
            </html>`;
        
        // 4. 打开一个新窗口并写入内容
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printPageHTML);
        printWindow.document.close();
        
        // 5. 调用新窗口的打印功能
        // 使用setTimeout确保内容完全加载后再打印
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
    
    // --- 脚本主入口 ---
    document.body.style.cursor = 'crosshair'; // 改变鼠标样式提示用户选择
    document.addEventListener('mouseover', handleMouseOver);
    // 在捕获阶段监听点击事件，确保我们能最先处理它
    document.addEventListener('click', handleClick, true); 

})();