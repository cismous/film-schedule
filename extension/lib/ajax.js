var getDataDone = false
var saveData = null
var detail = null

function smartSave() {
  // console.log(films)
  // console.log(saveData)
  const films = detail.films

  for (const hall of saveData.halls) {
    const film = films.A.find((item) => {
      item.supportHallFormats
      for (const supportHallFormat of item.supportHallFormats) {
        if (hall.formatCodes.includes(supportHallFormat)) return true
      }
      return false
    })
    console.log(film)
  }

  Mtime.Net.Ajax.post('/showtime/save', saveData).json(function (d) {
    if (!d.success) {
      console.log(d.error)
    } else {
      //如果发现有缺失网购票的场次
      if (d.value.missingPriceErrors) {
        console.log(d.value.missingPriceErrors)
      } else {
        console.log(d)
      }
    }
  })
}

function init() {
  var autoSaveDone = false
  var autoSaveTimes = 0

  function autoSave() {
    if (autoSaveDone || autoSaveTimes > 5000) {
      return void smartSave()
    }
    autoSaveTimes++
    setTimeout(autoSave, 10)
  }

  var initDone = false
  var initTimes = 0

  function setup() {
    if (initDone || initTimes > 5000) return
    setTimeout(function () {
      try {
        $.ajaxSetup({
          contentType: 'application/x-www-form-urlencoded;charset=utf-8',

          beforeSend: function (XMLHttpRequest, req) {
            if (req.url === '/showtime/save' && !autoSaveDone) {
              saveData = JSON.parse(req.data)
              autoSaveDone = Boolean(saveData && detail)
              autoSave()
            }
          },

          complete: function (XMLHttpRequest) {
            //通过XMLHttpRequest取得响应结果
            var res = XMLHttpRequest.responseText
            try {
              var jsonData = JSON.parse(res)
              if (this.url.startsWith('/schedule/detail') && !autoSaveDone) {
                detail = jsonData.value
                autoSaveDone = Boolean(saveData && detail)
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
