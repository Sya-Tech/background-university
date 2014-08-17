void function ($) {
  var chart = c3.generate({
    bindto: '#chart',
    size: { height: 480 },
    data: {
      x : 'x',
      rows: []
    },
    axis: {
      x: { type: 'category' }
    }
  })

  var demoTimeout = -1

  var $title = $('#title')
  var $chartList = $('.chart-list')

  d3.json('data.json', function (err, json) {
    if (err)
      return $title.text(err.statusText)
    $title.text('数据处理中……')

    var majors = {}
    var backgrounds = {
      universities: {
        paper: [],
        intern: [],
        project: []
      },
      majors: {
        paper: [],
        intern: [],
        project: []
      }
    }

    function construct$chart(text, chart) {
      return $('<a>', {
        href: '#',
        text: text,
        data: { chart: chart }
      }).addClass('list-group-item')
    }

    var $charts = $()
    for ( var u in json ) {
      var rows = [['x', 'paper', 'intern', 'project']]

      for (var m in json[u]) {
        rows.push([ m,
          json[u][m].paper || 0,
          json[u][m].intern || 0,
          json[u][m].project || 0
        ])

        if (majors[m] == null) {
          majors[m] = [['x', 'paper', 'intern', 'project']]
        }

        majors[m].push([ u,
          json[u][m].paper || 0,
          json[u][m].intern || 0,
          json[u][m].project || 0
        ])

        backgrounds.universities.paper.push([u, json[u][m].paper])
        backgrounds.majors.paper.push([m, json[u][m].paper])
        backgrounds.universities.intern.push([u, json[u][m].intern])
        backgrounds.majors.intern.push([m, json[u][m].intern])
        backgrounds.universities.project.push([u, json[u][m].project])
        backgrounds.majors.project.push([m, json[u][m].project])
      }

      $charts = $charts.add(construct$chart(u, { rows: rows, type: 'bar' }))
    }
    $('#university-chart-list').append($charts)

    $charts = $()
    for (var m in majors) {
      $charts = $charts.add(construct$chart(m, { rows: majors[m], type: 'bar' }))
    }
    $('#major-chart-list').append($charts)

    $charts = $()
    for (var b in backgrounds.universities) {
      $('#' + b + '-chart-list').append(
        construct$chart(b + ' 按院校', { columns: backgrounds.universities[b], type: 'pie' }))
    }
    for (var b in backgrounds.majors) {
      $('#' + b + '-chart-list').append(
        construct$chart(b + ' 按专业', { columns: backgrounds.majors[b], type: 'pie' }))
    }

    $title.text('')

    demoInterval = setInterval(function () {
      var $active = $chartList.find('.active')
      var $next = $active.next()
      if ($next.length === 0) {
        $next = $active.parent().next().children().first()
      }
      if ($next.length === 0) {
        $next = $chartList.children().first()
      }
      $next.trigger('click', true)
    }, 2000)
    $chartList.children().first().trigger('click', true)
  })

  var currentType = null

  $chartList.on('click', '.list-group-item', function (event, automatic) {
    var $this = $(this)
    if (!automatic) {
      clearInterval(demoInterval)
      demoInterval = -1
    }
    $title.text($this.text())
    
    var data = $this.data('chart')
    if (currentType !== data.type) {
      currentType = data.type
      chart.load($.extend(data, { unload: true }))
    } else {
      chart.load(data)
    }
    
    $chartList.find('.list-group-item').removeClass('active')
    $this.addClass('active')
  })
} (jQuery)