var domain = "";
//var domain = "http://172.17.123.250"

$(document).ready(function () {
  var user = magcheck_user();
  var modal_login = document.getElementById('login-modal');
  var i = 0;
  var error = false;
  var log_file = "";
  var data_AI = [], data_DI = [], data_DO = [], data_AO = [];
  var tags_AI = [], tags_DI = [], tags_DO = [], tags_AO = [];
  var file_list = ["AI_LOG", "DI_LOG", "DO_LOG", "AO_LOG"];

  if (user) {
    getLog().then(function () { updateGraphs(true); }).catch(function() {
      updateGraphs(false);
    });
  } else {
    document.getElementById('main-load').style.display = "none";
    modal_login.style.display = "block";
  }

  function getLog() {
    if (i == 4) {
      return $.Deferred().resolve().promise();
    } else {
      log_file = file_list[i];
      return $.ajax({
        type: "GET",
        url: domain + "/cgi-bin/getfile.cgi?log=" + log_file + "&what=log&disp=inline",
        timeout: 60000, // Timeout de 60 segundos
        cache: false
      })
        .done(function (objLog) {
          if (i == 0) {
            tags_AI = (String(objLog.split("\n")[0])).split(",");
            tags_AI.splice(-1);
            data_AI = objLog.split("\n");
            data_AI.splice(-2);
            data_AI.splice(0, 1);
            try {
              let error = JSON.parse(objLog);
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
              let error = JSON.parse(objLog);
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
              let error = JSON.parse(objLog);
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
              let error = JSON.parse(objLog);
              if (error.status === "error") { tags_AO = []; data_AO = null }
            } catch { }
          }
        })
        .fail(function () { alert('Fallo al obtener los logs'); })
        .then(function () { i++; return getLog(); });
    }
  }

  function updateGraphs(hasData) {
    if (!hasData || (tags_AI.length == 0 && tags_AO.length == 0 && tags_DI.length == 0 && tags_DO.length == 0)) {
      alert("No enough data, please enable all I/O data logging");
      document.getElementById('main-load').style.display = "none";
    } else {
      var data_AI_ind = [], trace_AI = [];
      var data_DO_ind = [], trace_DO = [];
      var data_DI_ind = [], trace_DI = [];
      var data_AO_ind = [], trace_AO = [];
      var yValues_DO = [], yValues_DI = [];
      var tagValues_DO = [], tagValues_DI = [];
      var count = 0;
      var fechaHora;

      // Analog Inputs
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
          } catch { error = true; }
        }
      });

      // Analog Outputs
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
            } catch { error = true; }
          }
        });
      }

      // Digital Outputs
      var hh = tags_DO.length - 1; mm = 0; count = 0;
      while (hh--) {
        trace_DO.push({ x: [], y: [], mode: 'lines', name: '' });
        trace_DO[mm].name = tags_DO[mm + 1]; mm++;
      }

      for (var i = 0; i < tags_DO.length - 1; i++) {
        yValues_DO.push(count); tagValues_DO.push('OFF');
        yValues_DO.push(count + 1); tagValues_DO.push('ON');
        count += 2;
      }

      $.each(data_DO, function (index, value) {
        data_DO_ind[index] = String(value).split(',');
        data_DO_ind[index].splice(-1);
        fechaHora = calcFechaHora(data_DO_ind[index][0]);
        for (var j = 1; j < data_DO_ind[index].length; j++) {
          try {
            if (data_DO_ind[index][j] == 1) {
              try { trace_DO[j - 1].y.push(parseFloat(yValues_DO[j * 2 - 1])); }
              catch { error = true; }
            } else {
              try { trace_DO[j - 1].y.push(parseFloat(yValues_DO[j * 2 - 2])); }
              catch { error = true; }
            }
            trace_DO[j - 1].x.push(fechaHora);
          } catch { error = true; }
        }
      });

      // Digital Inputs
      var hh = tags_DI.length - 1; mm = 0; count = 0;
      while (hh--) {
        trace_DI.push({ x: [], y: [], mode: 'lines', name: '' });
        trace_DI[mm].name = tags_DI[mm + 1]; mm++;
      }

      for (var i = 0; i < tags_DI.length - 1; i++) {
        yValues_DI.push(count); tagValues_DI.push('OFF');
        yValues_DI.push(count + 1); tagValues_DI.push('ON');
        count += 2;
      }

      $.each(data_DI, function (index, value) {
        data_DI_ind[index] = String(value).split(',');
        data_DI_ind[index].splice(-1);
        fechaHora = calcFechaHora(data_DI_ind[index][0]);
        for (var j = 1; j < data_DI_ind[index].length; j++) {
          try {
            if (data_DI_ind[index][j] == 1) {
              try { trace_DI[j - 1].y.push(parseFloat(yValues_DI[j * 2 - 1])); }
              catch { error = true; }
            }
            else {
              try { trace_DI[j - 1].y.push(parseFloat(yValues_DI[j * 2 - 2])); }
              catch { error = true; }
            }
            trace_DI[j - 1].x.push(fechaHora);
          } catch { error = true; }
        }
      });

      if (error) alert("The data does not agree with the variables. Delete the ipro data.");
      document.getElementById('main-load').style.display = "none";

      // Render the charts
      var chart_ai = new ApexCharts(document.querySelector("#graph-ai"), getOptionsAnalog(trace_AI, 'ANALOG INPUTS'));
      chart_ai.render();
      if (!NoAOdata) {
        var chart_ao = new ApexCharts(document.querySelector("#graph-ao"), getOptionsAnalog(trace_AO, 'ANALOG OUTPUTS'));
        chart_ao.render();
      }
      var chart_di = new ApexCharts(document.querySelector("#graph-di"), getOptionsDigital(trace_DI, yValues_DI, tagValues_DI, 'DIGITAL INPUTS'));
      chart_di.render();
      var chart_do = new ApexCharts(document.querySelector("#graph-do"), getOptionsDigital(trace_DO, yValues_DO, tagValues_DO, 'DIGITAL OUTPUTS'));
      chart_do.render();
    }
  }

  function calcFechaHora(cadena) {
    var yer = '20' + cadena.substring(0, 2);
    var mon = cadena.substring(2, 4);
    var day = cadena.substring(4, 6);
    var hur = cadena.substring(6, 8);
    var min = cadena.substring(8, 10);
    var sec = cadena.substring(10, 12);
    return yer + '-' + mon + '-' + day + ' ' + hur + ':' + min + ':' + sec;
  }
});