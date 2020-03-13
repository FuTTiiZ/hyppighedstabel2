const table = $('tbody')[0]

let hyppighedstabel = []

const cleanHTML = table.innerHTML
const cleanStats = $('#stats').html()
function resetTable() {
  table.innerHTML = cleanHTML
  $('#stats').html(cleanStats)
}

function cleanTable() {
  table.innerHTML = ''
}

function tonumber(str) {
  return parseFloat(str.replace(',', '.'))
}

function tostring(num) {
  if (num === '') return num
  return num.toFixed(2).toString().replace('.', ',').replace(/,?0+$/g, '')
}

function keySum(key) {
  return hyppighedstabel.map(v => v[key]).reduce((a,b) => a + b, 0)
}

function h(val, arr) {
  let occs = 0
  arr.forEach(v => v === val ? occs++ : 0)
  return occs
}

function arrString(arr) {
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

function updateTable() {
  cleanTable()

  const field = $('#obsInput').val($('#obsInput').val().replace(/  +/g, ' ').replace(/\./g, ',').replace(/[^0-9, ]/g, ''))
  const rawObs = field.val()
    .split(' ')
    .sort((a, b) => tonumber(a) - tonumber(b))
    .filter(v => !isNaN(tonumber(v)) && v.match(/\d|[,.]/g).length === v.length)
    .map(v => tonumber(v))
  
  hyppighedstabel = []
  let totalH = 0

  const uniqueObs = [...new Set(rawObs)]
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

    if (row.F >= kvartilState * 25) {
      kvartilArr.push(row.x)
      kvartilState++
    }
    if (row.F >= kvartilState * 25) {
      kvartilArr.push(row.x)
      kvartilState++
    }
    if (row.F >= kvartilState * 25) {
      kvartilArr.push(row.x)
      kvartilState++
    }
  }

  kvartilArr = kvartilArr.slice(0, 3)

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

document.addEventListener('keyup', e => {
  if (!($('#obsInput').is(':focus') || $('#intInput').is(':focus'))) return
  updateTable()
})