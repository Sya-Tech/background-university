void function () {
  var data = {}
  var status = {}
  var chart = c3.generate({
    bindto: '#chart',
    size: { height: 500 },
    data: {
      type: 'pie',
      json: {},
      onclick: function (d) {
        if (status.university === true || typeof status.background === 'string')
          return university(d.id)
        if (status.background === true || typeof status.university === 'string')
          return background(d.id)
      }
    }
  })

  var apply = function (title, json) {
    document.getElementById('title').innerText = title
    chart.load({
      json: json,
      unload: true
    })
  }

  var university = function (name) {
    var json = {}
    var title = name ? name + '大学与背景的关系' : '大学占比'
    if (name) {
      json = data[name]
    } else {
      for (var u in data) {
        json[u] = 0
        for (var b in data[u]) {
          json[u] += data[u][b]
        }
      }
    }
    status = { university: name || true }
    apply(title, json)
  }

  var background = function (name) {
    var json = {}
    var title = name ? name + '背景与大学的关系' : '背景占比'
    if (name) {
      for (var u in data) {
        json[u] = data[u][name]
      }
    } else {
      for (var u in data) {
        for (var b in data[u]) {
          json[b] = (json[b] || 0) + data[u][b]
        }
      }
    }
    status = { background: name || true }
    apply(title, json)
  }

  d3.json('data.json', function (err, json) {
    if (err) return alert(err.statusText)
    data = json

    document.getElementById('background')
      .addEventListener('click', function () {
        background()
      }, false)
    document.getElementById('university')
      .addEventListener('click', function () {
        university()
      }, false)

    background()
  })
} ()