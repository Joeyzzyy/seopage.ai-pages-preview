/**
 * 元素高亮脚本
 * 在预览页面中引入此脚本，用于在编辑模式下高亮显示元素
 * 
 * 使用方法：
 * 1. 将此文件复制到预览页面项目的public目录
 * 2. 在预览页面的HTML中添加：
 *    <script src="/element-highlighter.js"></script>
 * 3. 或者通过URL参数自动加载：?editMode=true&highlightElements=true
 */

(function() {
  'use strict';

  // 检查是否需要启用高亮功能
  const urlParams = new URLSearchParams(window.location.search);
  const shouldEnable = urlParams.get('editMode') === 'true' || urlParams.get('highlightElements') === 'true';
  
  if (!shouldEnable) {
    // 监听来自父窗口的消息
    window.addEventListener('message', function(event) {
      if (event.data?.type === 'toggleEditMode' && event.data.isActive) {
        initElementHighlighter();
      }
    });
    return;
  }

  // 如果URL参数中有editMode，立即初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initElementHighlighter);
  } else {
    initElementHighlighter();
  }

  function initElementHighlighter() {
    let highlightBox = null;
    let isActive = true;
    
    function createHighlightBox() {
      if (!highlightBox) {
        highlightBox = document.createElement('div');
        highlightBox.id = 'element-highlighter-box';
        highlightBox.style.position = 'fixed';
        highlightBox.style.border = '2px solid red';
        highlightBox.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        highlightBox.style.pointerEvents = 'none';
        highlightBox.style.zIndex = '999999';
        highlightBox.style.boxSizing = 'border-box';
        highlightBox.style.transition = 'all 0.1s ease';
        document.body.appendChild(highlightBox);
      }
      return highlightBox;
    }
    
    function removeHighlightBox() {
      if (highlightBox && highlightBox.parentNode) {
        highlightBox.parentNode.removeChild(highlightBox);
        highlightBox = null;
      }
    }
    
    function getElementAtPoint(x, y) {
      const element = document.elementFromPoint(x, y);
      if (!element) return null;
      
      // 检查是否是目标元素类型
      const tagName = element.tagName?.toLowerCase();
      const targetTags = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'img', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'];
      
      if (targetTags.includes(tagName)) {
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          tagName: tagName,
          element: element
        };
      }
      
      // 向上查找父元素
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const parentTag = parent.tagName?.toLowerCase();
        if (targetTags.includes(parentTag)) {
          const rect = parent.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            tagName: parentTag,
            element: parent
          };
        }
        parent = parent.parentElement;
      }
      
      return null;
    }
    
    function handleMouseMove(e) {
      if (!isActive) return;
      
      const result = getElementAtPoint(e.clientX, e.clientY);
      if (result && result.element) {
        const box = createHighlightBox();
        // 直接使用元素的getBoundingClientRect，这是相对于iframe视口的坐标
        const rect = result.element.getBoundingClientRect();
        box.style.left = rect.left + 'px';
        box.style.top = rect.top + 'px';
        box.style.width = rect.width + 'px';
        box.style.height = rect.height + 'px';
        
        // 发送消息到父窗口
        if (window.parent) {
          window.parent.postMessage({
            type: 'elementAtPoint',
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            tagName: result.tagName
          }, '*');
        }
      } else {
        removeHighlightBox();
      }
    }
    
    function handleMouseLeave() {
      removeHighlightBox();
    }
    
    // 移除旧的监听器（如果存在）
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    
    // 添加新的监听器
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    
    // 监听来自父窗口的消息
    window.addEventListener('message', function(event) {
      if (event.data?.type === 'getElementAtPoint') {
        const result = getElementAtPoint(event.data.x, event.data.y);
        if (result && window.parent) {
          window.parent.postMessage({
            type: 'elementAtPoint',
            x: result.x,
            y: result.y,
            width: result.width,
            height: result.height,
            tagName: result.tagName
          }, '*');
        }
      } else if (event.data?.type === 'toggleEditMode') {
        isActive = event.data.isActive;
        if (!isActive) {
          removeHighlightBox();
        }
      }
    });
    
    // 通知父窗口脚本已注入
    if (window.parent) {
      window.parent.postMessage({
        type: 'scriptInjected',
        success: true
      }, '*');
    }
    
    console.log('Element highlighter initialized');
  }
})();

