/**
 * 睡眠时间
 */
const sleep = (ts = 0) => new Promise((resolve) => setTimeout(resolve, ts))

/**
 * 检查当前是否加载完成
 */
const spinnerLoaded = () => {
  return new Promise((resolve) => {
    const check = () => {
      setTimeout(() => {
        const list = document.querySelectorAll('body > .spinner')
        if (list.length === 0) resolve()
        else check()
      }, 200)
    }
    check()
  })
}

/**
 * 获取url里指定的query参数状态
 * 返回数据支持 string | number | boolean
 *
 * 使用方式
 * 1. getQuery('category') 获取的数据为string类型
 * 2. getQuery<number>('status', 'number') 获取的数据为自动格式化为number类型
 * 3. getQuery<boolean>('status', 'boolean') 获取的数据为boolean
 *
 * @param key 需要获取的query key
 * @param type 参数数据类型
 * @param search 默认 window.location.search
 */
function getQuery<T extends string | number | boolean = string>(
  key: string,
  type: 'string' | 'number' | 'boolean' = 'string',
  search = window.location.search,
): T {
  const searchParams = new URLSearchParams(search)
  const val = searchParams.has(key) ? searchParams.get(key) : ''

  if (type === 'boolean') return Boolean(val) as T

  if (type === 'number') {
    if (!val) return undefined
    const _val = Number(val)
    if (Number.isNaN(_val)) return undefined
    return _val as T
  }

  return val as T
}

/**
 * 更新url中的query信息状态
 *
 * 使用方式
 * 1. 默认会使用替换模式更新url页面，浏览器不会记录上一个页面，不支持访问到上一个页面
 * 2. 可以通过指定action为push，浏览器会记录上一个页面，可使用返回按钮访问到上一个页面
 * 3. 删除一个query参数时可使用 ` updateQuery({ type: null }) `
 *
 * @param params
 * @param action
 */
function updateQuery<T extends { [key: string]: any }>(params: T, action: 'replace' | 'push' = 'replace') {
  const searchParams = new URLSearchParams(window.location.search)

  const updateSearchParams = (key: string, value: any): void => {
    if (!params[key] && params[key] !== 0) searchParams.delete(key)
    else if (searchParams.has(key)) searchParams.set(key, value.toString())
    else searchParams.append(key, value.toString())
  }

  const keys = Object.keys(params)
  for (const key of keys) updateSearchParams(key, params[key])

  let search = searchParams.toString()
  search = search ? `?${search}` : ''

  if (window.history.pushState) {
    const { protocol, pathname, host } = window.location
    const path = `${protocol}//${host}${pathname}${decodeURIComponent(search)}`
    if (action === 'replace') window.history.replaceState({ path }, '', path)
    else window.history.pushState({ path }, '', path)
  }
}
