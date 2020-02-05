let hyppighedstabel = []

function cleanTable() {
  $('tbody')[0].innerHTML = ''
}

function tonumber(str) {
  return parseFloat(str.replace(',', '.'))
}

function tostring(num) {
  return num.toFixed(2).toString().replace('.', ',').replace(',00', '')
}

function keySum(key) {
  return hyppighedstabel.map(v => v[key]).reduce((a,b) => a + b, 0)
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

  hyppighedstabel.push({
    x: 'I alt:',
    h: keySum('h'),
    f: tostring(keySum('f')),
    H: '',
    F: '',
    xh: tostring(keySum('xh'))
  })

  hyppighedstabel.forEach(v => {
    
  })

  console.table(hyppighedstabel)
}

document.addEventListener('keyup', updateTable)