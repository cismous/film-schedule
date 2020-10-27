/* eslint-disable react/jsx-no-undef */
declare let Mtime: any
declare let $: any

interface TimeRange {
  startTime: string
  endTime: string
}

interface ShowTimeCommonSubItem {
  code: string
  name: string
  selected: boolean
}

interface ShowTimeCommonItem {
  items: ShowTimeCommonSubItem[]
  text: string
  value: string
}

interface DetailFilm {
  '3D': boolean
  category: ShowTimeCommonSubItem
  device: ShowTimeCommonItem
  duration: number
  effect: ShowTimeCommonItem
  filmCode: string
  filmId: number
  filmName: string
  filmNo: number
  guidence: null
  guidenceType: number
  language: ShowTimeCommonItem
  price: string
  ranges: TimeRange[]
  rate: null
  settings: DetailFilmSetting[]
  showCount: number
  supportHallFormats: string[]
  version: ShowTimeCommonSubItem
}

interface ShowTimeFilm extends DetailFilm, TimeRange {
  color?: string
  selected: boolean
  standardPrice: number
  advertTime: number
}

interface Hall {
  available: boolean
  cinemaId: null
  formatCodes: string[]
  formats: ShowTimeCommonSubItem[]
  hallId: number
  hallName: string
  hallNo: string
  hallType: ShowTimeCommonSubItem
  hallTypeCode: null
  imax: boolean
  reald: boolean
  showtimes: SaveShowTime[]
  totalSeatCount: number
}

interface DetailFilmSetting {
  advertTime: number
  cinemaId: string
  cityId: number
  filmCode: string
  hallType: string
  id: number
  price: number
  regionId: string
}

interface Detail {
  approvalable: boolean
  billType2Id: number
  billTypeId: number
  cinemaId: string
  cinemaName: string
  cityId: number
  date: string
  editable: boolean
  effectMap: { SC: 'SC'; MX: 'MX'; FD: 'FD'; DC: 'DC,DO' }
  films: { [key: string]: DetailFilm[] }
  halls: Hall[]
  id: number
  lastDay: string
  nextDay: string
  publishable: boolean
  regionId: string
  saleCount: number
  satisfyGuidence: boolean
  saved: boolean
  status: number
  statusText: string
  throughable: boolean
  totalCount: number
  unapprovedCount: number
  unsaleCount: number
  version: number
}

interface SaveShowTime extends TimeRange {
  showtimeId?: number
  status: 'new' | 'old'
  hallId: number
  hallNo: string
  hallName: string
  filmName: string
  films: ShowTimeFilm[]
  duration: number
  left?: number
  width?: number
  adWidth: number
  color?: string
  editable: boolean
  through: boolean
  throughable: boolean
  lastHallId?: number
  lastLeft?: number
}

interface Save {
  halls: Hall[]
}

let saveData: Save = null
let detailUrl: string = null
let detail: Detail = null

/**
 * 格式化时间
 * @param startTime 开始时间
 * @param duration 电影放映时间
 */
function formatTime(time: number | string): string {
  if (!time) return null

  const date = new Date(time)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()) + ' '
  const h = (date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()) + ':'
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  return Y + M + D + h + m
}

/**
 * 计算结束时间
 * @param startTime 开始时间
 * @param duration 电影放映时间
 */
function getEndTime(startTime: string, duration: number) {
  return formatTime(new Date(startTime).getTime() + duration * 60 * 1000)
}

function smartMinutes(minutes: number, increase = 10) {
  if (increase > 10 && ['0', '5'].includes(String(minutes)[1])) {
    return increase
  }
  const interval = 1
  minutes = minutes + interval
  increase = increase + interval
  return smartMinutes(minutes, increase)
}

/**
 * 智能计算排片时间
 * @param list 已生成的时间列表
 * @param duration 电影放映时间
 * @param startTime 当前场次开始时间
 */
function generateShowTime(list: TimeRange[], duration: number): TimeRange[] {
  let startTime = '2020-10-31 08:05'
  if (list.length) {
    const temp = new Date(list.slice(-1)[0].endTime)
    if (temp.getHours() >= 23 || temp.getHours() <= 1) return list
    startTime = formatTime(temp.getTime() + smartMinutes(temp.getMinutes()) * 60 * 1000)
  }

  const endTime = getEndTime(startTime, duration)
  return generateShowTime([...list, { startTime, endTime }], duration)
}

function smartSchedule(hall: Hall, filmNo?: number) {
  hall = JSON.parse(JSON.stringify(hall))
  let detailFilm: DetailFilm = null
  if (filmNo) {
    detailFilm = [...detail.films.A, ...detail.films.B, ...detail.films.C].find((item) => item.filmNo === filmNo)
  } else {
    detailFilm = [...detail.films.A, ...detail.films.B, ...detail.films.C].find((item) => {
      for (const supportHallFormat of item.supportHallFormats) {
        if (hall.formatCodes.includes(supportHallFormat)) return true
      }
      return false
    })
  }
  const { duration } = detailFilm
  const lastSetting = detailFilm.settings.slice(-1)[0]
  const showTimeLit = generateShowTime([], duration)
  hall.showtimes = showTimeLit.map((item) => ({
    status: 'new',
    hallId: hall.hallId,
    hallNo: hall.hallNo,
    hallName: hall.hallNo,
    filmName: detailFilm.filmName,
    duration,
    adWidth: 0,
    ...item,
    editable: true,
    through: false,
    throughable: false,
    films: [
      {
        ...detailFilm,
        selected: false,
        standardPrice: lastSetting.price,
        advertTime: lastSetting.advertTime,
        ...item,
      },
    ],
  }))
  return hall
}

function submitSave(saveData: Save) {
  return new Promise((resolve, reject) => {
    Mtime.Net.Ajax.post('/showtime/save', saveData).json(function (d) {
      if (!d.success) {
        reject(d.error)
      } else {
        //如果发现有缺失网购票的场次
        if (d.value.missingPriceErrors) {
          reject(d.value.missingPriceErrors)
        } else {
          resolve()
        }
      }
    })
  })
}

async function clickSave() {
  const list = document.querySelectorAll('.slice-timing.info-border button')
  for (let item, i = 0; (item = list[i]); i++) {
    if (item.textContent.includes('保存')) item.click()
  }
  await sleep(100)
  await spinnerLoaded()
  await sleep(20)
}

function smartSave() {
  saveData.halls = []

  for (let i = 0; i < detail.halls.length; i++) {
    saveData.halls[i] = smartSchedule(detail.halls[i])
  }

  submitSave(saveData)
}

const mountDom = []

function init() {
  let initDone = false
  let initTimes = 0

  function setup() {
    if (initDone || initTimes > 5000) return
    setTimeout(function () {
      try {
        $.ajaxSetup({
          contentType: 'application/x-www-form-urlencoded;charset=utf-8',

          beforeSend: function (XMLHttpRequest, req) {
            if (req.url === '/showtime/save') {
              saveData = JSON.parse(req.data)
            }
          },

          complete: async function (XMLHttpRequest) {
            const res = XMLHttpRequest.responseText
            try {
              const jsonData = JSON.parse(res)
              detailUrl = this.url
              if (this.url.startsWith('/schedule/detail') && !this.url.includes('usage=view')) {
                detail = jsonData.value
                await sleep(1000)
                if (!mountDom.length) {
                  for (let i = 0; i < detail.halls.length; i++) {
                    Array.from(document.querySelectorAll('#time_lineboard .hallbox')).map((item) => {
                      const dom = document.createElement('div')
                      mountDom.push(dom)
                      item.appendChild(dom)
                    })
                  }
                }

                const FilmCom = ({
                  film,
                  selected,
                  onClick,
                }: {
                  film: DetailFilm
                  selected: boolean
                  onClick: (film: DetailFilm) => void
                }) => {
                  let startTime = film.ranges[0].startTime
                  startTime = startTime.split(' ')[1].slice(0, 5)
                  let endTime = film.ranges[0].endTime
                  endTime = endTime.split(' ')[1].slice(0, 5)

                  return (
                    <div
                      key={film.filmNo}
                      style={{
                        margin: '5px',
                        padding: '5px',
                        border: `1px solid ${selected ? 'red' : '#e1e1e1'}`,
                        minWidth: '158px',
                        cursor: 'pointer',
                      }}
                      onClick={() => onClick(film)}
                    >
                      <div style={{ fontWeight: 700 }}>{film.filmName}</div>
                      <div style={{ color: 'gray', fontSize: '12px', paddingTop: '4px' }}>
                        片长:{film.duration}分钟 [{film.price}]元
                      </div>
                      <div style={{ color: 'gray', fontSize: '12px' }}>
                        时段:[{startTime}-{endTime}]
                      </div>
                    </div>
                  )
                }

                for (let i = 0; i < detail.halls.length; i++) {
                  const dom = mountDom[i]
                  const hall = detail.halls[i]

                  const App = function (props: { hall: Hall; detail: Detail }) {
                    const { hall, detail } = props
                    const [selectedFilm, setSelectedFilm] = React.useState<DetailFilm>(null)
                    const [visible, setVisible] = React.useState(() => {
                      const result = getQuery<number>('smartHallIndex', 'number') === i
                      if (result) updateQuery({ smartHallIndex: null })
                      return result
                    })

                    const a = detail.films.A.filter((film) =>
                      Boolean(film.supportHallFormats.find((format) => hall.formatCodes.includes(format))),
                    )
                    const b = detail.films.B.filter((film) =>
                      Boolean(film.supportHallFormats.find((format) => hall.formatCodes.includes(format))),
                    )
                    const c = detail.films.C.filter((film) =>
                      Boolean(film.supportHallFormats.find((format) => hall.formatCodes.includes(format))),
                    )
                    const s = detail.films.S.filter((film) =>
                      Boolean(film.supportHallFormats.find((format) => hall.formatCodes.includes(format))),
                    )

                    return (
                      <div style={{ display: 'flex', marginTop: '8px' }}>
                        <antd.Button
                          disabled={!hall.showtimes.length}
                          style={{ marginLeft: 'auto' }}
                          size='small'
                          danger
                          onClick={async () => {
                            const list = document.querySelectorAll(
                              '#schedule-detail > .edit-slicetitle > .info-border button',
                            )
                            for (let item, i = 0; (item = list[i]); i++) {
                              if (item.textContent.includes('批量删除')) item.click()
                            }
                            await sleep(500)
                            const dom = document.querySelector('#batch-del select[name="hallId"]') as HTMLSelectElement
                            for (let opt, i = 0; (opt = dom.options[i]); i++) {
                              if (Number(opt.value) === hall.hallId) {
                                dom.selectedIndex = i
                                break
                              }
                            }
                          }}
                        >
                          清空排片
                        </antd.Button>

                        <antd.Button
                          disabled={Boolean(hall.showtimes.length)}
                          size='small'
                          type='primary'
                          style={{ marginLeft: '12px' }}
                          onClick={async () => {
                            updateQuery({ smartHallIndex: i })
                            await clickSave()
                          }}
                        >
                          智能排片
                        </antd.Button>

                        <antd.Modal
                          title='智能排片'
                          visible={visible}
                          width='70%'
                          okButtonProps={{ disabled: !selectedFilm }}
                          onCancel={() => setVisible(false)}
                          bodyStyle={{ padding: '12px 24px 19px' }}
                          onOk={async () => {
                            saveData.halls = detail.halls
                            saveData.halls[i] = smartSchedule(detail.halls[i], selectedFilm?.filmNo)
                            try {
                              await submitSave(saveData)
                              location.reload()
                            } catch {
                              antd.message.warn('智能排片失败，请刷新页面再尝试')
                            }
                          }}
                        >
                          <antd.Tabs defaultActiveKey='1'>
                            <antd.Tabs.TabPane tab={`A类影片(${a.length})`} key='a'>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  paddingRight: '10px',
                                  marginLeft: '-5px',
                                }}
                              >
                                {a.map((item) => (
                                  <FilmCom
                                    key={item.filmNo}
                                    film={item}
                                    selected={item.filmNo === selectedFilm?.filmNo}
                                    onClick={setSelectedFilm}
                                  />
                                ))}
                              </div>
                            </antd.Tabs.TabPane>

                            <antd.Tabs.TabPane tab={`B类影片(${b.length})`} key='b'>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  paddingRight: '10px',
                                  marginLeft: '-5px',
                                }}
                              >
                                {b.map((item) => (
                                  <FilmCom
                                    key={item.filmNo}
                                    film={item}
                                    selected={item.filmNo === selectedFilm?.filmNo}
                                    onClick={setSelectedFilm}
                                  />
                                ))}
                              </div>
                            </antd.Tabs.TabPane>

                            <antd.Tabs.TabPane tab={`C类影片(${c.length})`} key='c'>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  paddingRight: '10px',
                                  marginLeft: '-5px',
                                }}
                              >
                                {c.map((item) => (
                                  <FilmCom
                                    key={item.filmNo}
                                    film={item}
                                    selected={item.filmNo === selectedFilm?.filmNo}
                                    onClick={setSelectedFilm}
                                  />
                                ))}
                              </div>
                            </antd.Tabs.TabPane>

                            <antd.Tabs.TabPane tab={`S类影片(${s.length})`} key='s'>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  paddingRight: '10px',
                                }}
                              >
                                {s.map((item) => (
                                  <FilmCom
                                    key={item.filmNo}
                                    film={item}
                                    selected={item.filmNo === selectedFilm?.filmNo}
                                    onClick={setSelectedFilm}
                                  />
                                ))}
                              </div>
                            </antd.Tabs.TabPane>
                          </antd.Tabs>
                        </antd.Modal>
                      </div>
                    )
                  }
                  ReactDOM.render(<App hall={hall} detail={detail} />, dom)
                }
              }
            } catch (err) {}
          },
        })

        initDone = true
        initTimes++
      } catch (err) {
        setup()
      }
    }, 20)
  }

  setup()
}

init()
