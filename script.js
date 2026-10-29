// Switch between sections.
const items = document.querySelectorAll('[data-section]');
const sections = document.querySelectorAll('.section');

function showSection(item) {
  sections.forEach(section => {
    section.hidden = section.id !== item.dataset.section;
  });
  items.forEach(link => {
    link.classList.toggle('active', link === item);
    link.setAttribute('aria-pressed', String(link === item));
  });
}

items.forEach(item => {
  item.addEventListener('click', () => showSection(item));
  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showSection(item);
    }
  });
});

// Show a temporary notification; repeated clicks restart its timer.
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('status');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 1800);
}

// Copy the text from the matching card field.
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const field = document.getElementById(button.dataset.copy);
    const text = field.value ?? field.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const buffer = document.createElement('textarea');
        buffer.value = text;
        buffer.style.cssText = 'position:fixed;left:-9999px';
        document.body.append(buffer);
        try {
          buffer.select();
          if (!document.execCommand('copy')) throw new Error();
        } finally {
          buffer.remove();
          button.focus();
        }
      }
      showToast(field.classList.contains('code-box') ? 'HTML code copied!' : 'Link copied!');
    } catch {
      showToast('Copy failed. Select the text and press Ctrl+C.');
    }
  });
});
