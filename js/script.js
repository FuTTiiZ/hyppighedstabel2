const table = $('tbody')[0]

let hyppighedstabel = []

const cleanHTML = table.innerHTML
const cleanStats = $('#stats').html()
const resetTable = () => {
  table.innerHTML = cleanHTML
  $('#stats').html(cleanStats)
}

const urlParams = new URLSearchParams(window.location.search)
let urlObsData, urlIntervalData
try {
  urlObsData = urlParams.get('o') ? atob(urlParams.get('o')) : ''
  urlIntervalData = urlParams.get('i') || 1
} catch {
  urlObsData = ''
  urlIntervalData = 1
}

let grouped = false
let interval = parseFloat($('#intInput').val())
const updateGrouped = () => {
  interval = parseFloat($('#intInput').val())
  grouped = interval > 1
}

const cleanTable = () => {
  table.innerHTML = ''
}

const tonumber = str => {
  return parseFloat(str.replace(',', '.'))
}

const tostring = num => {
  if (num === '') return num
  return num.toFixed(2).toString().replace('.', ',').replace(/,?0+$/g, '')
}

const keySum = key => {
  return hyppighedstabel.map(v => v[key]).reduce((a,b) => a + b, 0)
}

const h = (val, arr) => {
  let occs = 0
  arr.forEach(v => v === val ? occs++ : 0)
  return occs
}

const arrString = arr => {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i]
    if (i === arr.length - 2) {
      str += `${v} og `
    } else if (i === arr.length - 1) {
      str += v
    } else {
      str += `${v}, `
    }
  }
  return str
}

const arrBetween = (low, high) => {
  let arr = []
  for (let i = low; i < high + 1; i++) {
    arr.push(i)
  }
  return arr
}

const updateTable = field => {
  cleanTable()

  const rawObs = field
    .split(' ')
    .sort((a, b) => tonumber(a) - tonumber(b))
    .filter(v => !isNaN(tonumber(v)) && v.match(/\d|[,-.]/g).length === v.length)
    .map(v => tonumber(v))
  
  let uniqueObs = [...new Set(rawObs)]
  if ($('#fill').is(':checked') && interval === 1) {
    let temp = arrBetween(uniqueObs[0], uniqueObs[uniqueObs.length - 1])
    uniqueObs.forEach(v => temp.push(v))

    temp = temp.sort((a, b) => a - b)
    temp = [...new Set(temp)]
    temp.slice().reverse().forEach((v, i) => {
      v === uniqueObs[uniqueObs.length - 1] ? uniqueObs = temp.slice(0, temp.length - i) : 0
    })
  }

  hyppighedstabel = []

  let totalH = 0

  uniqueObs.forEach(v => {
    totalH += h(v, rawObs)
    hyppighedstabel.push({
      _num: v,
      x: tostring(v),
      h: h(v, rawObs)
    })
  })

  hyppighedstabel.forEach(v => {
    v.f = v.h / totalH * 100
  })

  for (let i = 0; i < hyppighedstabel.length; i++) {
    const v = hyppighedstabel[i]

    v.H = i === 0 ? v.h : hyppighedstabel[i - 1].H + v.h
    v.F = i === 0 ? v.f : hyppighedstabel[i - 1].F + v.f

    v.xh = v.h * v._num
  }

  if (hyppighedstabel.length === 0) return resetTable()

  let typetalCap = 0
  let typetalArr = []

  let kvartilState = 1
  let kvartilArr = []
  for (row of hyppighedstabel) {
    if (row.h === typetalCap) {
      typetalArr.push(row.x)
    } else if (row.h > typetalCap) {
      typetalArr = [row.x]
      typetalCap = row.h
    }

    for (let i = 0; i < 3; i++) if (row.F >= kvartilState * 25) {
      kvartilArr.push(row.x)
      kvartilState++
    }
  }

  kvartilArr = kvartilArr.slice(0, 3)

  if (grouped) {
    const groupedObs = []
    for (let i = uniqueObs[0] - uniqueObs[0] % 3; i <= uniqueObs[uniqueObs.length - 1]; i += interval) {
      groupedObs.push({_nums:[i, i + interval], x: `${i === uniqueObs[0] && i === uniqueObs[0] - uniqueObs[0] % 3 ? '[' : ']'}${i};${i + interval}]`, count: 0})
    }

    console.log(groupedObs)
    console.log(hyppighedstabel)

    groupedObs.forEach(group => {
      hyppighedstabel.forEach(row => {
        row._num > group._nums[0] && row._num <= group._nums[1] ? group.count += row.h : 0
      })
    })

    

  } else {
    hyppighedstabel.push({
      x: 'I alt:',
      h: keySum('h'),
      f: keySum('f'),
      H: '',
      F: '',
      xh: keySum('xh')
    })

    hyppighedstabel.forEach(v => {
      table.innerHTML += `
        <tr>
          <td>${v.x}</td>
          <td>${v.h}</td>
          <td>${tostring(v.f)}%</td>
          <td>${v.H}</td>
          <td>${tostring(v.F)}${v.x === 'I alt:' ? '' : '%'}</td>
          <td>${tostring(v.xh)}</td>
        </tr>
      `
    })

    const first = hyppighedstabel[0]
    const last = hyppighedstabel[hyppighedstabel.length - 2]

    $('#mindsteværdi').text(first.x)

    $('#størsteværdi').text(last.x)

    $('#variationsbredde').text(tostring(last._num - first._num))

    $('#middeltal').text(tostring(keySum('xh') / keySum('h')))

    $('#typetal').text(arrString(typetalArr))
    
    $('#kvartilsæt').text(arrString(kvartilArr))
  }
  history.pushState(null, null, `?o=${btoa(field)}&i=${interval}`)
}
updateTable(urlObsData)

$('#obsInput').val(urlObsData)
$('#intInput').val(urlIntervalData)


const eventHandler = e => {
  if (e.type === 'keyup' && !($('#obsInput').is(':focus') || $('#intInput').is(':focus'))) return
  updateGrouped()
  updateTable($('#obsInput').val($('#obsInput').val().replace(/  +/g, ' ').replace(/\./g, ',').replace(/[^0-9, -]/g, '')).val())
}

document.addEventListener('keyup', eventHandler)
$('#fill').click(eventHandler)