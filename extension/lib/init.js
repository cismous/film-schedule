// 在页面上插入代码
function insertJS(jsPath) {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL(jsPath))
  document.documentElement.appendChild(script)
}

const list = [
  'lib/utils.js',
  'lib/react.production.min.js',
  'lib/react-dom.production.min.js',
  'lib/antd.min.js',
  'lib/proxy-ajax.js',
]
list.map(insertJS)
