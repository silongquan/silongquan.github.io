document.addEventListener("DOMContentLoaded", function () {
  const MAX_LINES = 19;         // 折叠时显示的行数
  const DEFAULT_OPEN_LINES = 30; // 少于该行数直接展开且隐藏触发器

  function initCollapsibles() {
    const contents = document.querySelectorAll('.collapsible-content');
    contents.forEach(content => {
      // 找 trigger：优先在同一容器内寻找，再尝试下一个兄弟节点
      let container = content.closest('.collapsible-container') || content.parentElement;
      let trigger = container ? container.querySelector('.collapsible-trigger') : null;
      if (!trigger) {
        const next = content.nextElementSibling;
        if (next && next.classList && next.classList.contains('collapsible-trigger')) {
          trigger = next;
        }
      }
      if (!trigger) {
        // 没有触发器就跳过，避免抛错
        return;
      }

      // 计算有效行数（去掉空白行）
      const lines = content.textContent.split('\n').filter(l => l.trim() !== '').length;

      // Ensure content has overflow hidden when collapsed
      content.style.overflow = content.style.overflow || 'hidden';

      if (lines <= DEFAULT_OPEN_LINES) {
        trigger.style.display = 'none';
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        // 初始为折叠状态：限制高度为 MAX_LINES*lineHeight（尝试读取 line-height）
        const cs = window.getComputedStyle(content);
        let lineHeight = parseFloat(cs.lineHeight);
        if (!lineHeight || isNaN(lineHeight)) {
          // 取一个合理默认值
          lineHeight = 18;
        }
        content.style.maxHeight = (lineHeight * MAX_LINES) + 'px';

        // 设置 trigger 初始文字（如果没有）
        if (!trigger.textContent.trim()) trigger.textContent = '展开';

        trigger.addEventListener('click', function () {
          const isExpanded = this.classList.contains('active') || !!content.style.maxHeight && content.style.maxHeight !== (lineHeight * MAX_LINES) + 'px' && content.style.maxHeight !== '';
          if (isExpanded) {
            // 收起
            this.textContent = '展开';
            this.classList.remove('active');
            content.style.maxHeight = (lineHeight * MAX_LINES) + 'px';
            // 平滑滚动到 trigger（可选）
            content.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // 展开
            this.textContent = '收起';
            this.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      }
    });
  }

  initCollapsibles();

  // 如果你使用了 PJAX / Turbo / partial load，可以在页面局部替换后再次调用 initCollapsibles()
  // 例如：document.addEventListener('pjax:complete', initCollapsibles);
});
