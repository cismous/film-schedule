const keep2 = (value: number) => ('0' + value).slice(-2)

function FileSchedule() {
  const list = [
    { cinemaId: '375', label: '经开' },
    { cinemaId: '010', label: '群星城' },
    { cinemaId: '373', label: '春树里' },
    { cinemaId: '321', label: '江汉路悦芸' },
  ]

  const start = new Date(Date.now() - 30 * 86400 * 1000)
  const startTime = `${start.getFullYear()}-${keep2(start.getMonth() + 1)}-${keep2(start.getDate())} 23:59`
  const end = new Date(Date.now() + 86400 * 1000)
  const endTime = `${end.getFullYear()}-${keep2(end.getMonth() + 1)}-${keep2(end.getDate())} 23:59`

  return (
    <div className='app'>
      <div className='list'>
        <div className='label'>常用影院列表: </div>

        {list.map((item) => (
          <a
            key={item.cinemaId}
            href={`http://showtime-prd-cmc.wandafilm.com/schedule/list?cinemaId=${item.cinemaId}&dayOffset=1`}
            target='_blank'
            rel='noreferrer'
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className='list'>
        <div className='label'>常用链接: </div>

        <a
          href={`http://order-admin-prd-tc.wandafilm.com/order/list?startTime=${startTime}&endTime=${endTime}`}
          target='_blank'
          rel='noreferrer'
        >
          退票网站
        </a>
      </div>
    </div>
  )
}

ReactDOM.render(<FileSchedule />, document.getElementById('root'))
