var domain = ""
//var domain = "http://192.168.0.170"

$(document).ready(function () {
  var user = magcheck_user();
  var modal_login = document.getElementById('login-modal');
  var i = 0;
  var error = false;
  var log_file = "";
  var data_AI = [], data_DI = [], data_DO = [], data_AO = [], data_ST = [];
  var tags_AI = [], tags_DI = [], tags_DO = [], tags_AO = [], tags_ST = [];
  var file_list = ["AI_LOG", "DI_LOG", "DO_LOG", "AO_LOG", "ST_LOG"];

  if (!user) {
    const autoLogged = autoLoginReadOnly();

    if (!autoLogged) {
      document.getElementById('main-load').style.display = "none";
    }

    return;
  }

  getLog().then(function () { updateGraphs() });

  function getLog() {
    if (i == 5) {
      return $.Deferred().resolve().promise();
    } else {
      log_file = file_list[i];
      return $.ajax({
        type: "GET",
        url: domain + "/cgi-bin/getfile.cgi?log=" + log_file + "&what=log&disp=inline",
        timeout: 60000,
        cache: false
      })
        .done(function (objLog) {
          /*
          if (i == 0) {
            tags_AI = (String(objLog.split("\n")[0])).split(",");
            tags_AI.splice(-1);
            data_AI = objLog.split("\n");
            data_AI.splice(-2);
            data_AI.splice(0, 1);
            try {
              let error = JSON.parse(objLog)
              if (error.status === "error") { tags_AI = []; data_AI = null }
            } catch { }
          }
          if (i == 1) {
            tags_DI = (String(objLog.split("\n")[0])).split(",");
            tags_DI.splice(-1);
            data_DI = objLog.split("\n");
            data_DI.splice(-2);
            data_DI.splice(0, 1);
            try {
              let error = JSON.parse(objLog)
              if (error.status === "error") { tags_DI = []; data_DI = null }
            } catch { }
          }
          if (i == 2) {
            tags_DO = (String(objLog.split("\n")[0])).split(",");
            tags_DO.splice(-1);
            data_DO = objLog.split("\n");
            data_DO.splice(-2);
            data_DO.splice(0, 1);
            try {
              let error = JSON.parse(objLog)
              if (error.status === "error") { tags_DO = []; data_DO = null }
            } catch { }
          }
          if (i == 3) {
            tags_AO = (String(objLog.split("\n")[0])).split(",");
            tags_AO.splice(-1);
            data_AO = objLog.split("\n");
            data_AO.splice(-2);
            data_AO.splice(0, 1);
            try {
              let error = JSON.parse(objLog)
              if (error.status === "error") { tags_AO = []; data_AO = null }
            } catch { }
          }
          */
          if (i == 4) {
            tags_ST = (String(objLog.split("\n")[0])).split(",");
            tags_ST.splice(-1);
            data_ST = objLog.split("\n");
            data_ST.splice(-2);
            data_ST.splice(0, 1);
            try {
              let error = JSON.parse(objLog)
              if (error.status === "error") { tags_ST = []; data_ST = null }
            } catch { }
          }
        })
        .fail(function () { alert('fallo!'); })
        .then(function () { i++; return getLog(); });
    }
  }

  function updateGraphs() {
    if ((tags_AI.length == 0) && (tags_AO.length == 0) && (tags_DI.length == 0) && (tags_DO.length == 0) && (tags_ST.length == 0)) {
      alert("No enough data, please enable all I/O data logging");
    } else {
      /*
      var data_AI_ind = [], trace_AI = [];
      var data_DO_ind = [], trace_DO = [];
      var data_DI_ind = [], trace_DI = [];
      var data_AO_ind = [], trace_AO = [];
      */
      var data_ST_ind = [], trace_ST = []; trace_ST_calor = []; trace_ST_frio = [];
      var yValues_DO = [], yValues_DI = [];
      var tagValues_DO = [], tagValues_DI = [];
      var count = 0
      var fechaHora;
      
      /*------------------------------------------ANALOG INPUTS------------------------------------------*/
      /*
      var mm = 0;
      var hh = tags_AI.length - 1;
      while (hh--) {
        trace_AI.push({ x: [], y: [], mode: 'lines', name: '' });
        trace_AI[mm].name = tags_AI[mm + 1]; mm++;
      }

      $.each(data_AI, function (index, value) {
        data_AI_ind[index] = String(value).split(',');
        data_AI_ind[index].splice(-1);
        fechaHora = calcFechaHora(data_AI_ind[index][0]);
        for (var j = 1; j < data_AI_ind[index].length; j++) {
          try {
            trace_AI[j - 1].y.push(parseFloat(data_AI_ind[index][j]));
            trace_AI[j - 1].x.push(fechaHora);
          } catch { error = true }
        }
      })
        */

      /*------------------------------------------ANALOG OUTPUTS------------------------------------------*/
      /*
      var NoAOdata = false;
      if (tags_AO.length === 0) { NoAOdata = true; }
      else {
        var hh = tags_AO.length - 1;
        mm = 0;
        while (hh--) {
          trace_AO.push({ x: [], y: [], mode: 'lines', name: '' });
          trace_AO[mm].name = tags_AO[mm + 1]; mm++;
        }

        $.each(data_AO, function (index, value) {
          data_AO_ind[index] = String(value).split(',');
          data_AO_ind[index].splice(-1);
          fechaHora = calcFechaHora(data_AO_ind[index][0]);
          for (var j = 1; j < data_AO_ind[index].length; j++) {
            try {
              trace_AO[j - 1].y.push(parseFloat(data_AO_ind[index][j]));
              trace_AO[j - 1].x.push(fechaHora);
            } catch { error = true }
          }
        })
      }
      */
      /*------------------------------------------DIGITAL OUTPUTS------------------------------------------*/
      /*
      var hh = tags_DO.length - 1; mm = 0; count = 0
      while (hh--) {
        trace_DO.push({ x: [], y: [], mode: 'lines', name: '' });
        trace_DO[mm].name = tags_DO[mm + 1]; mm++;
      }

      for (var i = 0; i < tags_DO.length - 1; i++) {
        yValues_DO.push(count); tagValues_DO.push('OFF');
        yValues_DO.push(count + 1); tagValues_DO.push('ON');
        count += 2
      }

      $.each(data_DO, function (index, value) {
        data_DO_ind[index] = String(value).split(',');
        data_DO_ind[index].splice(-1);
        fechaHora = calcFechaHora(data_DO_ind[index][0]);
        for (var j = 1; j < data_DO_ind[index].length; j++) {
          try {
            if (data_DO_ind[index][j] == 1) {
              try { trace_DO[j - 1].y.push(parseFloat(yValues_DO[j * 2 - 1])); }
              catch { error = true }
            } else {
              try { trace_DO[j - 1].y.push(parseFloat(yValues_DO[j * 2 - 2])); }
              catch { error = true }
            }
            trace_DO[j - 1].x.push(fechaHora);
          } catch { error = true }
        }
      })
      */
      /*------------------------------------------DIGITAL INPUTS------------------------------------------*/
      /*
      var hh = tags_DI.length - 1; mm = 0; count = 0;
      while (hh--) {
        trace_DI.push({ x: [], y: [], mode: 'lines', name: '' });
        trace_DI[mm].name = tags_DI[mm + 1]; mm++;
      }

      for (var i = 0; i < tags_DI.length - 1; i++) {
        yValues_DI.push(count); tagValues_DI.push('OFF');
        yValues_DI.push(count + 1); tagValues_DI.push('ON');
        count += 2
      }

      $.each(data_DI, function (index, value) {
        data_DI_ind[index] = String(value).split(',');
        data_DI_ind[index].splice(-1);
        fechaHora = calcFechaHora(data_DI_ind[index][0]);
        for (var j = 1; j < data_DI_ind[index].length; j++) {
          try {
            if (data_DI_ind[index][j] == 1) {
              try { trace_DI[j - 1].y.push(parseFloat(yValues_DI[j * 2 - 1])); }
              catch { error = true }
            }
            else {
              try { trace_DI[j - 1].y.push(parseFloat(yValues_DI[j * 2 - 2])); }
              catch { error = true }
            }
            trace_DI[j - 1].x.push(fechaHora);
          } catch { error = true }
        }
      })
      */

      /*------------------------------------------STATUS------------------------------------------*/
      
      var mm = 0;
      var hh = tags_ST.length - 1;
      while (hh--) {
        trace_ST.push({ x: [], y: [], mode: 'lines', name: '', desc: '' });
        trace_ST[mm].name = tags_ST[mm + 1]; mm++;
      }

      $.each(data_ST, function (index, value) {
        data_ST_ind[index] = String(value).split(',');
        data_ST_ind[index].splice(-1);
        fechaHora = calcFechaHora(data_ST_ind[index][0]);
        for (var j = 1; j < data_ST_ind[index].length; j++) {
          try {
            trace_ST[j - 1].y.push(parseFloat(data_ST_ind[index][j]));
            trace_ST[j - 1].x.push(fechaHora);
          } catch { error = true }
        }

      });

      trace_ST.forEach(function (trace) {
        switch (trace.name) {
          case 'MEDIA_IMP_CALOR':
            trace.desc = 'Media impulsión calor';
            trace_ST_calor.push(trace);
            break;
          case 'LIM_CALOR_MIN':
            trace.desc = 'Límite calor mínimo';
            trace_ST_calor.push(trace);
            break;
          case 'LIM_CALOR_MAX':
            trace.desc = 'Límite calor máximo';
            trace_ST_calor.push(trace);
            break;
          case 'MEDIA_IMP_FRIO':
            trace.desc = 'Media impulsión frío';
            trace_ST_frio.push(trace);
            break;
          case 'LIM_FRIO_MIN':
            trace.desc = 'Límite frío mínimo';
            trace_ST_frio.push(trace);
            break;
          case 'LIM_FRIO_MAX':
            trace.desc = 'Límite frío máximo';
            trace_ST_frio.push(trace);
            break;
        }
      });

      if (error) alert("The data does not agree with the variables. Delete the ipro data.")
      document.getElementById('main-load').style.display = "none";
      /*
      // ANALOG INPUTS
      var chart_ai = new ApexCharts(document.querySelector("#graph-ai"), getOptionsAnalog(trace_AI, 'ANALOG INPUTS'));
      chart_ai.render();
      // ANALOG OUTPUTS
      if (!NoAOdata) {
        var chart_ao = new ApexCharts(document.querySelector("#graph-ao"), getOptionsAnalog(trace_AO, 'ANALOG OUTPUTS'));
        chart_ao.render();
      }
      // DIGITAL INPUTS
      var chart_di = new ApexCharts(document.querySelector("#graph-di"), getOptionsDigital(trace_DI, yValues_DI, tagValues_DI, 'DIGITAL INPUTS'));
      chart_di.render();
      // DIGITAL OUTPUTS
      var chart_do = new ApexCharts(document.querySelector("#graph-do"), getOptionsDigital(trace_DO, yValues_DO, tagValues_DO, 'DIGITAL OUTPUTS'));
      chart_do.render();
      */
      // STATUS
      var chart_st_calor = new ApexCharts(
        document.querySelector("#graph-st-calor"), 
        getOptionsAnalog(trace_ST_calor, 'Estado circuito de calor')
      );
      chart_st_calor.render();

      
      var chart_st_frio = new ApexCharts(
        document.querySelector("#graph-st-frio"), 
        getOptionsAnalog(trace_ST_frio, 'Estado circuito de frío')
      );
      chart_st_frio.render();


      // GRÁFICAS REALIZADAS CON PLOTY (ANTIGUAS)
      // ANALOG INPUTS
      // var layout_ai = { title: 'ANALOG INPUTS', autosize: true, height: 400, hovermode: 'x', }
      // Plotly.newPlot('graph-ai', trace_AI, layout_ai, config);
      // ANALOG OUTPUTS
      // var layout_ao = { title: 'ANALOG OUTPUTS', autosize: true, height: 400, hovermode: 'x', }
      // Plotly.newPlot('graph-ao', trace_AO, layout_ao, config);
      // DIGITAL INPUTS
      // var layout_di = { title: 'DIGITAL INPUTS', autosize: true, height: 400, hovermode: 'x', yaxis: { tickvals: yValues_DI, ticktext: tagValues_DI } }
      // Plotly.newPlot('graph-di', trace_DI, layout_di, config);
      // DIGITAL OUTPUTS
      // var layout_do = { title: 'DIGITAL OUTPUTS', autosize: true, height: 400, hovermode: 'x', yaxis: { tickvals: yValues_DO, ticktext: tagValues_DO } }
      // Plotly.newPlot('graph-do', trace_DO, layout_do, config);
    }
  }

  function calcFechaHora(cadena) {
    var yer = '20' + cadena.substring(0, 2);
    var mon = cadena.substring(2, 4);
    var day = cadena.substring(4, 6);
    var hur = cadena.substring(6, 8);
    var min = cadena.substring(8, 10);
    var sec = cadena.substring(10, 12);
    return yer + '-' + mon + '-' + day + 'T' + hur + ':' + min + ':' + sec;
  }

  function getOptionsAnalog(values, title) {
    let series = []
    values.forEach(element => {
      let data = { name: element.desc || element.name, data: null }
      let points = []
      for (let i = 0; i < element.x.length; i++) { points.push([new Date(element.x[i]).getTime(), element.y[i]]) }
      data.data = points
      series.push(data)
    });
    var options = {
      series: series,
      chart: {
        id: title,
        group: 'graphs',
        height: 400,
        type: "line",
        animations: { enabled: false },
        toolbar: {
          show: true,
          tools: {
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          export: {
            csv: {
              headerCategory: 'Variables',
              dateFormatter(timestamp) {
                let date = new Date(timestamp);
                date = date.getFullYear() + '-' +
                  ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
                  ('00' + date.getDate()).slice(-2) + ' ' +
                  ('00' + date.getHours()).slice(-2) + ':' +
                  ('00' + date.getMinutes()).slice(-2) + ':' +
                  ('00' + date.getSeconds()).slice(-2);
                return date
              }
            }
          },
          autoSelected: 'zoom'
        },
      },
      title: {
        text: title,
        align: 'center',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          format: 'dd-MM HH:mm'
        },
        axisBorder: {
          show: true,
          color: "#c0c8cc"
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
          color: "#c0c8cc"
        },
        labels: {
          show: true,
          minWidth: 60,
          formatter: function (val) {
            return val.toFixed(0)
          }
        }
      },
      tooltip: {
        inverseOrder: true,
        style: {
          fontSize: '13px',
        },
        x: {
          format: "dd-MM-yy HH:mm:ss"
        },
        y: {
          formatter: function (value) {
            if (value !== null) {
              return value
            }
          }
        },
      },
      stroke: {
        show: true,
        width: 2,
        curve: 'straight',
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '16px',
      },
    }
    return options
  }

  function getOptionsDigital(values, yValues, tags, title) {
    let series = []
    values.forEach(element => {
      let data = { name: element.name, data: null }
      let points = []
      for (let i = 0; i < element.x.length; i++) {
        points.push([new Date(element.x[i]).getTime(), element.y[i]])
      }
      data.data = points
      series.push(data)
    });
    var options = {
      series: series,
      chart: {
        id: title,
        group: 'graphs',
        height: 400,
        type: "line",
        animations: { enabled: false },
        toolbar: {
          show: true,
          tools: {
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          export: {
            csv: {
              headerCategory: 'Variables',
              dateFormatter(timestamp) {
                let date = new Date(timestamp);
                date = date.getFullYear() + '-' +
                  ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
                  ('00' + date.getDate()).slice(-2) + ' ' +
                  ('00' + date.getHours()).slice(-2) + ':' +
                  ('00' + date.getMinutes()).slice(-2) + ':' +
                  ('00' + date.getSeconds()).slice(-2);
                return date
              }
            }
          },
          autoSelected: 'zoom'
        },
      },
      title: {
        text: title,
        align: 'center',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false
        },
        axisBorder: {
          show: true,
          color: "#c0c8cc"
        },
        axisTicks: {
          show: true,
          color: "#c0c8cc",
          height: 6
        }
      },
      yaxis: {
        tickAmount: yValues.length - 1,
        min: 0,
        max: yValues.length - 1,
        axisBorder: {
          show: true,
          color: "#c0c8cc"
        },
        labels: {
          show: true,
          minWidth: 60,
          formatter: function (value) {
            if (value !== null) {
              for (let i = 0; i < yValues.length; i++) { if (yValues[i] === value) { return tags[i] } }
            }
          }
        }
      },
      tooltip: {
        inverseOrder: true,
        style: {
          fontSize: '13px',
        },
        x: {
          format: "dd-MM-yy HH:mm:ss"
        },
        y: {
          formatter: function (value) {
            if (value !== null) {
              for (let i = 0; i < yValues.length; i++) { if (yValues[i] === value) { return tags[i] } }
            }
          }
        },
      },
      stroke: {
        show: true,
        width: 2,
        curve: 'stepline',
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '16px',
        onItemClick: {
          toggleDataSeries: false
        },
      },
    }
    return options
  }
});