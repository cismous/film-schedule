// 在页面上插入js文件
function insertJS(jsPath) {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL(jsPath))
  document.documentElement.appendChild(script)
}

// 在页面上插入css文件
function insertCSS(cssPath) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', chrome.extension.getURL(cssPath))
  const dom = document.querySelectorAll('meta')[0]
  dom.parentNode.insertBefore(link, dom)
}

const jsList = [
  'lib/utils.js',
  'lib/react.production.min.js',
  'lib/react-dom.production.min.js',
  'lib/antd.min.js',
  'lib/page.js',
  'lib/proxy-ajax.js',
]
const cssList = ['lib/antd.min.css']

function init() {
  const dom = document.getElementById('schedule-form')
  if (dom) {
    cssList.map(insertCSS)
    return void jsList.map(insertJS)
  }
  setTimeout(init, 5)
}
init()
