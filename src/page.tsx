/* eslint-disable prefer-rest-params */
declare const antd: any

const dom = document.createElement('div')
dom.classList.add('clearfix')

const i18nDay = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
}

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

async function autoMax() {
  await spinnerLoaded()
  await sleep(2000)
  const list = document.querySelectorAll('.slice-timing.info-border button')
  for (let item, i = 0; (item = list[i]); i++) {
    if (item.textContent.includes('最大化')) item.click()
  }
}

/**
 * 编辑某天的影片
 * @param dayOffset 距离当天时间天数的偏移值
 */
async function edit(dayOffset = 0) {
  await sleep(500)
  await spinnerLoaded()
  const calendarList = Array.from(document.querySelectorAll('#calendar .calendar-date li'))
  const index = calendarList.findIndex((item) => {
    const curMonthDay = new Date().getDate()
    return item.querySelector('.date')?.textContent === String(curMonthDay)
  })
  const btn = calendarList[index + dayOffset]?.querySelectorAll('button')
  if (btn?.length > 1) {
    btn[1].click()
    await autoMax()
  }
}

function APP() {
  const [editDay, setEditDay] = React.useState(undefined)
  const [cinemaId, setCinemaId] = React.useState(() => {
    const search = new URLSearchParams(location.search.slice(1))
    return search.get('cinemaId')
  })

  const curWeekDay = new Date().getDay()
  const curMonthDay = new Date().getDate()
  const curMonthLastDay = new Date(new Date().getFullYear(), 1, 0).getDate()

  async function updateCinema(cinemaId: string) {
    return new Promise(async (resolve) => {
      await spinnerLoaded()

      let times = 0
      const execute = () => {
        setTimeout(async () => {
          times++
          if (times > 100) return void resolve()

          const dom = document.getElementById('cinemaId') as HTMLSelectElement
          if (dom.options.length === 0) return void execute()
          for (let opt, i = 0; (opt = dom.options[i]); i++) {
            if (opt.value === cinemaId) {
              dom.selectedIndex = i
              document.getElementById('select2-cinemaId-container').textContent = opt.textContent
              document.getElementById('search-schedule').click()
              await edit()
              setEditDay(0)
              autoMax()
              resolve()
              break
            }
          }
        }, 50)
      }
      execute()
    })
  }

  React.useEffect(() => {
    const main = async () => {
      const search = new URLSearchParams(location.search.slice(1))
      const cinemaId = search.get('cinemaId')
      await sleep(1000)
      if (cinemaId) await updateCinema(cinemaId)
    }
    main()
  }, [])

  return (
    <>
      <div style={{ paddingTop: '10px' }}>
        <antd.Radio.Group
          value={cinemaId}
          size='small'
          onChange={(event) => {
            updateCinema(event.target.value)
            setCinemaId(event.target.value)
          }}
        >
          <antd.Radio.Button value='375'>经开</antd.Radio.Button>
          <antd.Radio.Button value='010'>群星城</antd.Radio.Button>
          <antd.Radio.Button value='373'>春树里</antd.Radio.Button>
          <antd.Radio.Button value='321'>江汉路悦芸</antd.Radio.Button>
        </antd.Radio.Group>
      </div>

      <antd.Radio.Group
        value={editDay}
        size='small'
        onChange={async (event) => {
          await edit(event.target.value)
          setEditDay(event.target.value)
        }}
        style={{ paddingTop: '10px' }}
      >
        {[
          { value: 0, weekDay: i18nDay[curWeekDay], disabled: false, label: '今天' },
          {
            value: 1,
            weekDay: i18nDay[(curWeekDay + 1) % 7],
            disabled: (curMonthDay + 1) % curMonthLastDay <= curMonthDay,
            label: '明天',
          },
          {
            value: 2,
            weekDay: i18nDay[(curWeekDay + 2) % 7],
            disabled: (curMonthDay + 2) % curMonthLastDay <= curMonthDay,
            label: '后天',
          },
        ]
          .filter((item) => !item.disabled)
          .map((item) => (
            <antd.Radio.Button key={item.value} value={item.value}>
              编辑({curMonthDay + item.value}号-{item.weekDay}-{item.label})
            </antd.Radio.Button>
          ))}
      </antd.Radio.Group>
    </>
  )
}

ReactDOM.render(<APP />, dom)

document.querySelector('#schedule-form .p10').appendChild(dom)