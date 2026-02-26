var domain = ""
//var domain = "http://192.168.0.170"

var dixell_js_version = "1.3",
  get_cgi = domain + "/cgi-bin/jgetvar.cgi",
  set_cgi = domain + "/cgi-bin/jsetvar.cgi";

function convert(d, b, e, j) {
  var h = "" + (parseFloat(d) / parseFloat(b) + parseFloat(e)),
    g = h.indexOf(".", 0),
    l = h.length,
    k = parseInt(j, 10),
    f;
  if (j != 0) {
    if (g == -1) {
      h = h + ".";
      for (f = 0; f < k; f++) { h = h + "0"; }
    } else {
      if (l - g > k) {
        var a = 1 + g + k;
        return h.substring(0, a);
      } else {
        if (l - g <= k) {
          var c = k - (l - g) + 1;
          for (f = 0; f < c; f++) { h = h + "0"; }
        }
      }
    }
  } else { if (g != -1) { return h.substring(0, g); } }
  return h;
}

function deconvert(b, c, a) { return (b - a) * c; }

function UpdateSuccess(l, n) {
  if (!n || n.length == 0) {
    l[0].innerHTML = "";
    l.text("Var not found!");
    return;
  }
  var c = $(n)[0].value,
    f;
  switch (l.data("vartype")) {
    case "bool":
      l[0].innerHTML = "";
      if (c) { l.html(l.data("truestring")); }
      else { l.html(l.data("falsestring")); }
      l.data("value", c);
      break;
    case "boolform":
      l.attr("checked", c);
      break;
    case "dint":
      l[0].innerHTML = "";
      if (c == 32767) { l.html('<span class="dixell_error">Err</span>'); }
      else { l.text(c); }
      break;
    case "dintmod":
      l.find("input").val(c);
      break;
    case "dintform":
      l.val(c);
      break;
    case "decimal":
      l[0].innerHTML = "";
      if (c == 32767) {
        l.html('<span class="dixell_error">Err</span>');
      } else {
        var h = convert(
          c,
          l.data("vardiv"),
          l.data("varoffset"),
          l.data("vardecimals")
        );
        l.text(h);
      }
      break;
    case "decimalmod":
      var h = convert(
        c,
        l.data("vardiv"),
        l.data("varoffset"),
        l.data("vardecimals")
      );
      l.find("input").val(h);
      break;
    case "decimalform":
      var h = convert(
        c,
        l.data("vardiv"),
        l.data("varoffset"),
        l.data("vardecimals")
      );
      l.val(h);
      break;
    case "desc":
      var e = c,
        a = l.data("values"),
        k = a.length,
        g;
      for (f = 0; f < k; f += 2) {
        g = a[f + 1];
        if (a[f] == e) { break; }
      }
      l[0].innerHTML = "";
      l.html(g);
      break;
    case "descmod":
      var m = $(l).find("select");
      $(m).val(c);
      if ($(m).val() != c) { $(m).find("option:last").attr("selected", "selected"); }
      break;
    case "descform":
      l.val(c);
      if (l.val() != c) { l.find("option:last").attr("selected", "selected"); }
      break;
    case "string":
      l[0].innerHTML = "";
      l.html(c);
      break;
    case "stringmod":
      l.find("input").val(c);
      break;
    case "stringform":
      l.val(c);
      break;
    case "show":
      var b = l.data("value"),
        d = l.data("operator"),
        j = false;
      switch (d) {
        case "=":
          j = c == b;
          break;
        case "<":
          j = c < b;
          break;
        case ">":
          j = c > b;
          break;
        case "<=":
          j = c <= b;
          break;
        case ">=":
          j = c >= b;
          break;
        case "<>":
          j = c != b;
          break;
      }
      if (j) { l.show(); }
      else { l.hide(); }
      break;
  }
}

jQuery.fn.ajaxUpdater = function (c, f) {
  var b = this,
    a = f.timeout * 1000,
    e = c,
    d = "?";
  for (x in f.parameters) {
    e += d + x + "=" + f.parameters[x];
    d = "&";
  }
  function g(h) {
    $.ajax({
      url: h,
      cache: false,
      dataType: "json",
      success: function (i) {
        UpdateSuccess(b, i);
        if (a) { setTimeout(function () { g(h); }, a); }
      },
    });
  }
  g(e);
};

function split_complex(g, c) {
  var e = [];
  while (g.search("\n") != -1) { g = g.replace("\n", " "); }
  g = g.trim();
  if (g === "") { return []; }
  if (c == false) {
    e = g.split(" ");
  } else {
    var k = "",
      j = false,
      b = false,
      f = false,
      h = g.length,
      d;
    for (d = 0; d < h; d++) {
      var a = g.charAt(d);
      switch (a) {
        case '"':
          if (!j) {
            if (!b) {
              b = true;
            } else {
              b = false;
              e.push(k);
              k = "";
            }
          } else {
            k += a;
          }
          break;
        case "<":
          if (!j) {
            j = true;
            k += a;
          } else {
            f = true;
          }
          break;
        case ">":
          if (j) {
            j = false;
            k += a;
          } else {
            f = true;
          }
          break;
        case " ":
          if (!j && !b) {
            if (k != "") {
              e.push(k);
              k = "";
            }
          } else {
            k += a;
          }
          break;
        case "=":
          if (!j && !b) {
            if (k != "") {
              e.push(k);
              k = "";
            }
          } else {
            k += a;
          }
          break;
        default:
          k += a;
          break;
      }
      if (f) {
        return [];
      }
    }
    if (j || b) {
      return [];
    }
    if (k != "") {
      e.push(k);
    }
  }
  for (var d = e.length - 1; d >= 0; d--) {
    if (e[d] == "") {
      e.splice(d, 1);
    }
  }
  e[0] = e[0].toUpperCase();
  return e;
}

$(document).ready(function () {
  var h = document.getElementsByTagName("*"),
    d,
    m,
    n;
  for (n = 0; n < h.length; n++) {
    d = h[n].className;
    if (!d || (d.length > 3 ? d.substring(0, 3) != "isa" : 1)) { continue; }
    if (!h[n].id) { $(h[n]).attr("id", "dixell" + n); }
    m = "#" + h[n].id;
    var f = h[n].style.cssText,
      a = new Object(),
      s = [],
      r = h[n].innerHTML,
      e = false,
      c = false,
      l = 0,
      b;
    if (d != "isaform_submit" && d != "isa_show") { h[n].innerHTML = ""; }
    switch (d) {
      case "isavar_bool":
        c = true;
      case "isamod_booltog":
        s = split_complex(r, true);
        if (s.length < 3 || s.length > 4) {
          $(m).text("Syntax error!");
          continue;
        }
        a = {
          vartype: "bool",
          varname: s[0],
          truestring: s[1],
          falsestring: s[2],
          value: 0,
        };
        b = s[0].toUpperCase();
        l = s[3];
        if (!c) {
          var o =
            "<button id='" +
            h[n].id +
            "' class='isamod_booltog' style='" +
            f +
            "'></button>";
          $(m).replaceWith($(o));
          $(m).click(function () {
            var j = $(this),
              t = j.data("value"),
              u = set_cgi + "?name=" + j.data("varname") + "&value=" + (1 - t);
            $.ajax({ url: u, cache: false });
            j.data("value", 1 - t);
            if (t) {
              j.html(j.data("falsestring"));
            } else {
              j.html(j.data("truestring"));
            }
          });
        }
        break;
      case "isamod_boolwrt":
        s = split_complex(r, true);
        if (s.length != 3) {
          $(m).text("Syntax error!");
          continue;
        }
        if (s[1].toLowerCase() == "true") {
          s[1] = 1;
        } else {
          if (s[1].toLowerCase() == "false") {
            s[1] = 0;
          }
        }
        if (s[1] != 0 && s[1] != 1) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { varname: s[0], value: s[1] };
        b = s[0].toUpperCase();
        var o =
          "<button id='" +
          h[n].id +
          "' class='isamod_boolwrt btn alarm-button' style='" +
          f +
          "'></button>";
        $(m).replaceWith($(o));
        $(m).html(s[2]);
        $(m).click(function () {
          var t = $(this),
            j = t.data("value"),
            u = set_cgi + "?name=" + t.data("varname") + "&value=" + j;
          $.ajax({ url: u, cache: false });
        });
        e = true;
        break;
      case "isaform_bool":
        s = split_complex(r, false);
        if (s.length < 1 || s.length > 2) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { vartype: "boolform" };
        b = s[0].toUpperCase();
        l = s[1];
        var o =
          "<input id='" +
          h[n].id +
          "' class='isaform_bool' type='checkbox' style='" +
          f +
          "' name='" +
          b +
          "' />";
        $(m).replaceWith($(o));
        break;
      case "isavar_dint":
        s = split_complex(r, false);
        if (s.length < 1 || s.length > 2) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { vartype: "dint" };
        b = s[0].toUpperCase();
        l = s[1];
        break;
      case "isamod_dint":
        s = split_complex(r, true);
        if (s.length < 2 || s.length > 3) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { vartype: "dintmod" };
        b = s[0].toUpperCase();
        l = s[2];
        $(m).html(
          "<input type='text' style='" +
          f +
          "' /><button style='" +
          f +
          "'>" +
          s[1] +
          "</button>"
        );
        $(m + " button").data("varname", b);
        $(m + " button").click(function () {
          var t = $(this),
            v = t.prev(),
            j = v.val(),
            u = set_cgi + "?name=" + t.data("varname") + "&value=" + j;
          $.ajax({ url: u, cache: false });
        });
        break;
      case "isaform_dint":
        s = split_complex(r, true);
        if (s.length < 1 || s.length > 2) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { vartype: "dintform" };
        b = s[0].toUpperCase();
        l = s[1];
        var o =
          "<input id='" +
          h[n].id +
          "' class='isaform_dint' type='text' style='" +
          f +
          "' name='" +
          b +
          "' />";
        $(m).replaceWith($(o));
        break;
      case "isamod_dintwrt":
        s = split_complex(r, true);
        if (s.length != 3) {
          $(m).text("Syntax error!");
          continue;
        }
        if (!/^([0-9]+)$/.test(s[1])) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { varname: s[0], value: s[1] };
        b = s[0].toUpperCase();
        var o =
          "<button id='" +
          h[n].id +
          "' class='isamod_dintwrt' style='" +
          f +
          "'></button>";
        $(m).replaceWith($(o));
        $(m).html(s[2]);
        $(m).click(function () {
          var t = $(this),
            j = t.data("value"),
            u = set_cgi + "?name=" + t.data("varname") + "&value=" + j;
          $.ajax({ url: u, cache: false });
        });
        e = true;
        break;
      case "isavar_decimal":
      case "isavar_real":
        s = split_complex(r, false);
        if (s.length < 4 || s.length > 5) {
          $(m).text("Syntax error!");
          continue;
        }
        if (d == "isavar_real" && (s[3] < 0 || s[3] > 6)) {
          $(m).text("Syntax error!");
          continue;
        }
        if (s[1] == 0) {
          $(m).text("Syntax error!");
          continue;
        }
        a = {
          vartype: "decimal",
          vardiv: s[1],
          varoffset: s[2],
          vardecimals: s[3],
        };
        b = s[0].toUpperCase();
        l = s[4];
        break;
      case "isamod_decimal":
      case "isamod_real":
        s = split_complex(r, true);
        if (s.length < 5 || s.length > 6) {
          $(m).text("Syntax error!");
          continue;
        }
        if (d == "isamod_real" && (s[3] < 0 || s[3] > 6)) {
          $(m).text("Syntax error!");
          continue;
        }
        if (s[1] == 0) {
          $(m).text("Syntax error!");
          continue;
        }
        a = {
          vartype: "decimalmod",
          vardiv: s[1],
          varoffset: s[2],
          vardecimals: s[3],
        };
        b = s[0].toUpperCase();
        l = s[5];
        $(m).html(
          "<input type='text' style='" +
          f +
          "' /><button style='" +
          f +
          "'>" +
          s[4] +
          "</button>"
        );
        $(m + " button").data("varname", b);
        $(m + " button").click(function () {
          var t = $(this),
            y = t.prev(),
            w = $(this).parent().data("vardiv"),
            v = $(this).parent().data("varoffset"),
            j = deconvert(y.val(), w, v),
            u = set_cgi + "?name=" + t.data("varname") + "&value=" + j;
          $.ajax({ url: u, cache: false });
        });
        break;
      case "isaform_decimal":
      case "isaform_real":
        s = split_complex(r, true);
        if (s.length < 4 || s.length > 5) {
          $(m).text("Syntax error!");
          continue;
        }
        if (d == "isaform_real" && (s[3] < 0 || s[3] > 6)) {
          $(m).text("Syntax error!");
          continue;
        }
        if (s[1] == 0) {
          $(m).text("Syntax error!");
          continue;
        }
        a = {
          vartype: "decimalform",
          vardiv: s[1],
          varoffset: s[2],
          vardecimals: s[3],
        };
        b = s[0].toUpperCase();
        l = s[4];
        var o =
          "<input id='" +
          h[n].id +
          "' class='" +
          d +
          "' type='text' style='" +
          f +
          "' name='" +
          b +
          "' />";
        $(m).replaceWith($(o));
        break;
      case "isavar_desc":
        s = split_complex(r, true);
        if (s.length < 3 || s.length > 202) {
          $(m).text("Syntax error!");
          continue;
        }
        b = s.shift();
        if (s.length % 2 == 1) {
          l = s.pop();
        }
        a = { vartype: "desc", values: s };
        break;
      case "isamod_desc":
        var g;
        s = split_complex(r, true);
        if (s.length < 4 || s.length > 203) {
          $(m).text("Syntax error!");
          continue;
        }
        b = s.shift();
        if (s.length % 2 == 0) {
          l = s.pop();
        }
        g = s.pop();
        a = { vartype: "descmod" };
        var k = s.length,
          p = "",
          q;
        for (q = 0; q < k; q += 2) {
          p += "<option value='" + s[q] + "'>" + s[q + 1] + "</option>";
        }
        $(m).html(
          "<select style='" +
          f +
          "'>" +
          p +
          "</select><button style='" +
          f +
          "'>" +
          g +
          "</button>"
        );
        $(m + " button").data("varname", b);
        $(m + " button").click(function () {
          var u = $(this),
            j = u.prev(),
            t = j.val(),
            v = set_cgi + "?name=" + u.data("varname") + "&value=" + t;
          $.ajax({ url: v, cache: false });
        });
        break;
      case "isaform_desc":
        s = split_complex(r, true);
        if (s.length < 3 || s.length > 202) {
          $(m).text("Syntax error!");
          continue;
        }
        b = s.shift();
        if (s.length % 2 == 1) {
          l = s.pop();
        }
        a = { vartype: "descform" };
        var k = s.length,
          p = "",
          q;
        for (q = 0; q < k; q += 2) {
          p += "<option value='" + s[q] + "'>" + s[q + 1] + "</option>";
        }
        var o =
          "<select id='" +
          h[n].id +
          "' class='" +
          d +
          "' type='text' style='" +
          f +
          "' name='" +
          b +
          "' >" +
          p +
          "</select>";
        $(m).replaceWith($(o));
        break;
      case "isavar_string":
        s = split_complex(r, false);
        if (s.length < 1 || s.length > 2) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { vartype: "string" };
        b = s[0].toUpperCase();
        l = s[1];
        break;
      case "isamod_string":
        s = split_complex(r, true);
        if (s.length < 2 || s.length > 3) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { vartype: "stringmod" };
        b = s[0].toUpperCase();
        l = s[2];
        $(m).html(
          "<input type='text' style='" +
          f +
          "' /><button style='" +
          f +
          "'>" +
          s[1] +
          "</button>"
        );
        $(m + " button").data("varname", b);
        $(m + " button").click(function () {
          var t = $(this),
            v = t.prev(),
            j = v.val(),
            u = set_cgi + "?name=" + t.data("varname") + "&value=" + j;
          $.ajax({ url: u, cache: false });
        });
        break;
      case "isaform_string":
        s = split_complex(r, true);
        if (s.length < 1 || s.length > 2) {
          $(m).text("Syntax error!");
          continue;
        }
        a = { vartype: "stringform" };
        b = s[0].toUpperCase();
        l = s[1];
        var o =
          "<input id='" +
          h[n].id +
          "' class='" +
          d +
          "' type='text' style='" +
          f +
          "' name='" +
          b +
          "' />";
        $(m).replaceWith($(o));
        break;
      case "isa_show":
        $(m).hide();
        s = split_complex(h[n].title, false);
        h[n].title = "";
        if (s.length < 3 || s.length > 4) {
          $(m).text("Syntax error!");
          continue;
        }
        if (s[2].toLowerCase() == "true") {
          s[2] = 1;
        } else {
          if (s[2].toLowerCase() == "false") {
            s[2] = 0;
          }
        }
        a = { vartype: "show", operator: s[1], value: s[2] };
        b = s[0].toUpperCase();
        l = s[3];
        break;
      case "isaform_submit":
        $(m).click(function () {
          var y = $(this).closest("form"),
            u = y.find("input, select"),
            t,
            w = "",
            j = u.length;
          let count = 0
          for (var v = 0; v < j; v++) {
            let valid = true
            t = $(u[v]).val();
            switch (u[v].className) {
              case "isaform_decimal":
              case "isaform_real":
                var A = parseFloat($(u[v]).data("vardiv")),
                  z = parseFloat($(u[v]).data("varoffset"));
                t = deconvert(t, A, z);
                break;
              case "isaform_bool":
                t = u[v].checked ? 1 : 0;
                break;
              case "isaform_dint":
                break;
              default:
                valid = false
                break;
            }
            if (valid) {
              count++
              w = set_cgi + "?name=" + u[v].name + "&value=" + t;
              $.ajax({ url: w, cache: false });
            }
          }
          return false;
        });
        e = true;
        break;
      default:
        continue;
    }
    for (var i in a) {
      $(m).data(i, a[i]);
    }
    if (!e) {
      $(m).ajaxUpdater(get_cgi, { parameters: { name: b }, timeout: l });
    }
  }
});