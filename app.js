void function ($) {
  var chart = c3.generate({
    bindto: '#chart',
    size: { height: 480 },
    data: {
      type: 'bar',
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
      }

      $charts = $charts.add(construct$chart(u, { rows: rows }))
    }
    $('#university-chart-list').append($charts)

    $charts = $()
    for (var m in majors) {
      $charts = $charts.add(construct$chart(m, { rows: majors[m] }))
    }
    $('#major-chart-list').append($charts)

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

  $chartList.on('click', '.list-group-item', function (event, automatic) {
    var $this = $(this)
    if (!automatic) {
      clearInterval(demoInterval)
    }
    $title.text($this.text())
    chart.load($this.data('chart'))
    $chartList.find('.list-group-item').removeClass('active')
    $this.addClass('active')
  })
} (jQuery)