/* eslint-disable react/jsx-no-undef */
const dom = document.createElement('div')
dom.classList.add('clearfix')

const i18nDay = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
}

async function autoMax() {
  await spinnerLoaded()
  const list = await queryDomsAsync('.slice-timing.info-border button')
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.textContent.includes('最大化')) (item as HTMLDivElement).click()
  }
}

function APP() {
  const [smartDate, setSmartDat] = React.useState(getQuery<string>('smartDate'))
  const [cinemaId, setCinemaId] = React.useState(getQuery('cinemaId'))

  return (
    <>
      <div style={{ paddingTop: '10px', display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingRight: '4px' }}>影城：</div>
        <antd.Radio.Group
          value={cinemaId}
          size='small'
          onChange={async (event) => {
            const cinemaId = event.target.value
            setCinemaId(cinemaId)
            updateQuery({ cinemaId })
            await selectCinema(cinemaId)
            await editSomeDay()
          }}
        >
          <antd.Radio.Button value='375'>经开</antd.Radio.Button>
          <antd.Radio.Button value='010'>群星城</antd.Radio.Button>
          <antd.Radio.Button value='373'>春树里</antd.Radio.Button>
          <antd.Radio.Button value='321'>江汉路悦芸</antd.Radio.Button>
        </antd.Radio.Group>
      </div>

      <div style={{ paddingTop: '10px', display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingRight: '4px' }}>日期：</div>
        <antd.Radio.Group
          value={smartDate}
          size='small'
          onChange={async (event) => {
            const smartDate = event.target.value
            await editSomeDay(smartDate)
            setSmartDat(smartDate)
          }}
        >
          {[
            { value: moment(), label: '-今天' },
            { value: moment().add(1, 'days'), label: '-明天' },
            { value: moment().add(2, 'days') },
            { value: moment().add(3, 'days') },
            { value: moment().add(4, 'days') },
            { value: moment().add(5, 'days') },
            { value: moment().add(6, 'days') },
            { value: moment().add(7, 'days') },
          ].map((item, i) => (
            <antd.Radio.Button key={i} value={item.value.format('YYYY-MM-DD')}>
              {`${item.value.format('M月D号')} ${i18nDay[item.value.format('E')]}${item.label ?? ''}`}
            </antd.Radio.Button>
          ))}
        </antd.Radio.Group>
      </div>
    </>
  )
}

let times = 0
async function pageInit() {
  if (times > 2000) return
  times++

  try {
    if (!antd || !moment || !React || !ReactDOM) return void pageInit()
  } catch {
    return setTimeout(pageInit, 20)
  }

  await selectCinema()

  let smartDate = moment().add(1, 'days')
  if (getQuery<string>('smartDate')) smartDate = moment(getQuery<string>('smartDate'))
  if (smartDate.format('M') !== moment().format('M')) await selectMonth(smartDate.format('M'))
  updateQuery({ smartDate: smartDate.format('YYYY-MM-DD') })

  await editSomeDay()
  await autoMax()

  ReactDOM.render(<APP />, dom)
  document.querySelector('#schedule-form .p10').appendChild(dom)

  updateQuery({ refreshTimes: null })
}

pageInit()

$(window).error(function (e) {
  if (e.originalEvent?.message?.includes(`Cannot set property 'available' of undefined`)) {
    let refreshTimes = getQuery<number>('refreshTimes', 'number') ?? 0
    if (refreshTimes > 10) return
    updateQuery({ refreshTimes: refreshTimes > 0 ? refreshTimes : null })
    window.location.reload()
  }
})
