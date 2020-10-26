// 在页面上插入代码
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.extension.getURL('lib/ajax.js'))
document.documentElement.appendChild(script)
