const cleanHTML_table = $('table')[0].innerHTML
const cleanHTML_stats = $('#deskriptorer').html()

$('table')[0].innerHTML += `
  <tr>
    <td>I Alt: </td>
    <td>0</td>
    <td>0%</td>
    <td></td>
    <td></td>
    <td>0</td>
  </tr>
`

let hyppighedstabel = []

function cleanTable() {
  $('table')[0].innerHTML = cleanHTML_table
  $('#stats').html(cleanHTML_stats)
}

function tonumber(str) {
  return parseFloat(str.replace(',', '.'))
}

function tostring(num) {
  return num.toString().replace('.', ',')
}

function h(val, arr) {
  let occs = 0
  arr.forEach(v => v === val ? occs++ : 0)
  return occs
}

function f(val, arr) {
  let occs = 0
  arr.forEach(v => v === val ? occs++ : 0)
  return occs
}

function updateTable() {
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
  }

  console.table(hyppighedstabel);
}

document.addEventListener('keyup', updateTable);