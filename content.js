(function() {
    // 防止脚本被重复注入和执行
    if (window.myPrintExtension) {
        return;
    }

    let lastHighlightedElement = null;

    // --- 核心功能函数 ---

    // 1. 进入选择模式
    function startSelectionMode() {
        console.log("Entering selection mode...");
        document.body.style.cursor = 'crosshair';
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('click', handleElementClick, true);
        
        // 提示用户正在选择
        const startButton = document.getElementById('my-print-ext-start-btn');
        if(startButton) {
            startButton.textContent = '...选择中...';
            startButton.disabled = true;
        }
    }

    // 2. 退出选择模式 (不销毁插件)
    function stopSelectionMode() {
        console.log("Exiting selection mode...");
        document.body.style.cursor = 'default';
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('click', handleElementClick, true);

        if (lastHighlightedElement) {
            lastHighlightedElement.style.outline = '';
        }

        const startButton = document.getElementById('my-print-ext-start-btn');
        if(startButton) {
            startButton.textContent = '再次选择元素';
            startButton.disabled = false;
        }
    }
    
    // 3. 打印选定的元素
    function printElement(element) {
        console.log("Printing element:", element);
        let allStyles = "";
        const styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
        styleSheets.forEach(sheet => {
            allStyles += sheet.outerHTML;
        });

        const printContents = element.outerHTML;
        const printPageHTML = `
            <!DOCTYPE html><html><head><title>Print</title>${allStyles}</head>
            <body>${printContents}</body></html>`;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printPageHTML);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
    
    // 4. 彻底关闭和清理插件
    function destroy() {
        console.log("Destroying extension instance.");
        stopSelectionMode(); // 确保监听器被移除
        const controlBar = document.getElementById('my-print-ext-bar');
        if (controlBar) {
            controlBar.remove();
        }
        // 重置标志位，以便插件可以再次被注入
        delete window.myPrintExtension;
    }

    // --- 事件处理器 ---

    function handleMouseOver(event) {
        if (lastHighlightedElement) {
            lastHighlightedElement.style.outline = '';
        }
        lastHighlightedElement = event.target;
        lastHighlightedElement.style.outline = '2px solid #007bff';
    }

    function handleElementClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const selectedElement = event.target;
        
        // 关键：打印完成后，只退出选择模式，而不是销毁整个插件
        stopSelectionMode();
        printElement(selectedElement);
    }

    // --- UI 创建 ---

    function createControlBar() {
        const bar = document.createElement('div');
        bar.id = 'my-print-ext-bar';
        bar.innerHTML = `
            <span style="font-size: 14px; color: white; margin-right: 20px;">打印助手已激活</span>
            <button id="my-print-ext-start-btn">选择元素进行打印</button>
            <button id="my-print-ext-close-btn" title="关闭打印助手">×</button>
        `;
        
        // 为控制条添加样式 (CSS-in-JS)
        Object.assign(bar.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            zIndex: '99999999',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontFamily: 'sans-serif',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
        });
        
        document.body.appendChild(bar);

        // 为按钮添加样式和事件
        const startButton = document.getElementById('my-print-ext-start-btn');
        const closeButton = document.getElementById('my-print-ext-close-btn');
        
        Object.assign(startButton.style, {
            padding: '5px 10px', cursor: 'pointer', border: '1px solid white', 
            backgroundColor: '#007bff', color: 'white', borderRadius: '4px'
        });
        Object.assign(closeButton.style, {
            padding: '0', width: '24px', height: '24px', cursor: 'pointer', 
            border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', 
            borderRadius: '50%', fontWeight: 'bold', fontSize: '16px', lineHeight: '24px'
        });

        startButton.addEventListener('click', startSelectionMode);
        closeButton.addEventListener('click', destroy);
    }

    // --- 插件初始化 ---

    // 定义一个全局标志位来跟踪插件状态
    window.myPrintExtension = {
        start: startSelectionMode,
        stop: stopSelectionMode,
        destroy: destroy
    };

    createControlBar();

})();