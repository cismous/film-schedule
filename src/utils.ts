/**
 * 睡眠时间
 */
const sleep = (ts = 0) => new Promise((resolve) => setTimeout(resolve, ts))

/**
 * 检查当前是否加载完成
 */
const spinnerLoaded = async () => {
  await sleep(50)
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

/**
 * 异步轮训获取dom列表
 * @param selector 选择器
 */
async function queryDomsAsync(selector: string): Promise<HTMLDivElement[]> {
  let times = 0
  async function init(): Promise<HTMLDivElement[]> {
    if (times >= 1000) return []
    times++

    const dom = document.querySelectorAll<HTMLDivElement>(selector)
    if (dom?.length) return Array.from(dom)
    return new Promise((resolve) => setTimeout(async () => resolve(await init()), 15))
  }
  return init()
}

/**
 * 异步轮训获取dom
 * @param selector 选择器
 */
async function queryDomAsync(selector: string): Promise<Element> {
  let times = 0
  async function init(): Promise<Element> {
    if (times >= 1000) return null
    times++

    const dom = document.querySelector(selector)
    if (dom) return dom
    return new Promise((resolve) => setTimeout(async () => resolve(await init()), 15))
  }
  return init()
}

/**
 * 异步等待dom消失
 * @param selector 选择器
 */
async function waitDomDisappear(selector: string, interval = 15, limitTimes = 1000): Promise<Element> {
  let times = 0
  async function init(): Promise<Element> {
    if (limitTimes && times >= limitTimes) return
    times++

    const dom = document.querySelector(selector)
    if (dom) return new Promise((resolve) => setTimeout(async () => resolve(await init()), interval))
    return
  }
  return init()
}

/**
 * 选择排片月份
 * @param month 月份
 */
async function selectMonth(month: string) {
  const dom = (await queryDomsAsync('#schedule-form .input-group.date .input-group-addon')) as HTMLDivElement[]
  dom[0].click()
  const monthDomList = await queryDomsAsync('#schedule-form .bootstrap-datetimepicker-widget .month')
  if (monthDomList.length) {
    for (const item of Array.from(monthDomList)) {
      if (item.textContent === `${month}月`) {
        ;(item as HTMLDivElement).click()
        const dom = document.querySelector('#schedule-form #search-schedule') as HTMLDivElement
        dom?.click()
        await spinnerLoaded()
        document.body.focus()
        break
      }
    }
  }
}

/**
 * 选择每个影厅
 * @param cinemaId 影厅id
 */
async function selectCinema(cinemaId?: string) {
  if (!cinemaId) cinemaId = getQuery<string>('cinemaId')
  if (!cinemaId) return

  await spinnerLoaded()

  return new Promise(async (resolve) => {
    let times = 0
    const execute = () => {
      setTimeout(async () => {
        times++
        if (times > 1000) return void resolve()

        const dom: any = (await queryDomsAsync('#cinemaId'))[0]
        if (dom.options.length === 0) return void execute()
        for (let i = 0; i < dom.options.length; i++) {
          const opt = dom.options[i]
          if (opt.value === cinemaId) {
            dom.selectedIndex = i
            document.getElementById('select2-cinemaId-container').textContent = opt.textContent
            document.getElementById('search-schedule').click()
            resolve()
            break
          }
        }
      }, 20)
    }
    execute()
  })
}

/**
 * 编辑某天的影片
 * @param date 距离当天时间天数的偏移值
 */
async function editSomeDay(_date?: string) {
  const preDate = moment(getQuery<string>('smartDate'))
  const editDate = moment(_date || preDate)
  if (editDate.format('M') !== preDate.format('M')) await selectMonth(editDate.format('M'))

  const calendarList = await queryDomsAsync('#calendar .calendar-date li')
  for (const item of calendarList) {
    if (item.querySelector('.date')?.textContent === editDate.format('D')) {
      const btnList = Array.from(item.querySelectorAll('button'))
      const editBtn = btnList.find((item) => item.textContent === '编辑')
      const viewBtn = btnList.find((item) => item.textContent === '查看')
      const addBtn = btnList.find((item) => item.textContent === '添加')
      const btn = editBtn || viewBtn || addBtn
      btn?.click()
      updateQuery({ smartDate: editDate.format('YYYY-MM-DD') })
    }
  }
}
