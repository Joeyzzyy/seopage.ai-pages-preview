/**
 * 元素高亮脚本 - 用于预览页面
 * 
 * 使用方法：
 * 1. 将此脚本添加到预览页面项目的 public 目录
 * 2. 在预览页面的 HTML 模板中引入：
 *    <script src="/element-highlighter-script.js"></script>
 * 
 * 或者直接在预览页面的 HTML 中添加以下代码：
 */

(function() {
  'use strict';

  let highlightBox = null;
  let isActive = false;

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
      const rect = result.element.getBoundingClientRect();
      box.style.left = rect.left + 'px';
      box.style.top = rect.top + 'px';
      box.style.width = rect.width + 'px';
      box.style.height = rect.height + 'px';

      // 发送消息到父窗口
      if (window.parent && window.parent !== window) {
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

  function initElementHighlighter() {
    if (isActive) return; // 已经初始化

    isActive = true;
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // 通知父窗口脚本已激活
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'scriptInjected',
        success: true
      }, '*');
    }

    console.log('Element highlighter activated');
  }

  function deactivateElementHighlighter() {
    if (!isActive) return;

    isActive = false;
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('mouseleave', handleMouseLeave, true);
    removeHighlightBox();
    console.log('Element highlighter deactivated');
  }

  // 检查URL参数
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('editMode') === 'true' || urlParams.get('highlightElements') === 'true') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initElementHighlighter);
    } else {
      initElementHighlighter();
    }
  }

  // 监听来自父窗口的消息
  window.addEventListener('message', function(event) {
    // 验证消息来源（可选，但建议添加）
    // if (event.origin !== 'http://localhost:3000') return;

    if (event.data?.type === 'initElementHighlighter' || event.data?.type === 'toggleEditMode') {
      if (event.data.isActive !== false) {
        initElementHighlighter();
      } else {
        deactivateElementHighlighter();
      }
    } else if (event.data?.type === 'getElementAtPoint') {
      const result = getElementAtPoint(event.data.x, event.data.y);
      if (result && window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'elementAtPoint',
          x: result.x,
          y: result.y,
          width: result.width,
          height: result.height,
          tagName: result.tagName
        }, '*');
      }
    }
  });
})();

