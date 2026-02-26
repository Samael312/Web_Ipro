var domain = ""
//var domain = "http://192.168.0.170"
var cgi_bin = domain + "/cgi-bin/";
var defaults;
var enums;


String.prototype.escapeHTML = function () {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};


function escapice(s) {
    return s.replace(/\"/g, "&quot;");
}

/* Test function */
function loadDefaults(t, r) {
    $.ajax({
        url: t,
        dataType: "json",
        success: function (t) {
            for (var e = t.defaults, a = 0; a < e.length; a++) {
                defaults[e[a].name] = e[a];
            }
            enums = t.enums;
        }
    })
    return;
}

/************************/
/* Page initializations */
/************************/

function dixe_only_login(username, password) {
    var pass_response;
    var pass, i, ok;
    var ret = false;

    pass = username + ":" + password;
    $.ajax({
        url: cgi_bin + "session.cgi",
        data: $.param({
            'action': 'login',
            'username': encodeURIComponent(username),
            'password': encodeURIComponent(password)
        }),
        async: false,
        cache: false,
        dataType: 'json',
        type: 'POST',
    }).fail(function () {

    }).done(function (data) {
        if (data.status === 'ok') {
            createCookie("dixe_pass", pass, 0);
            createCookie("magcheck_pass", password, 0);
            createCookie("magcheck_user", username, 0);
            ret = true;
        }
    });

    return ret;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) {
            var pl = c.substring(nameEQ.length, c.length);
            var first = pl.charAt(0);

            if (!isNaN(first))
                return parseInt(pl, 10).toString();
            if (first == '"' || first == "'")
                continue;
            return pl;
        }
    }
    return null;
}
function dixe_setup_access() {
    var response;
    var pass = readCookie("dixe_pass");

    if (pass == null)
        pass = "NONE:NONE";

    $.ajax({
        url: cgi_bin + "access.cgi",
        data: $.param({
            'level': -10,
            'dixe_pass': pass
        }),

        async: false,
        cache: false,
        dataType: 'json',
        type: 'POST',

        success: function (transport) {
            response = transport || null;
        }
    });

    if (response === null)
        return;

    $.each(response, function (i, e) {
        var ok = (e === "OK") ? "1" : "0";
        createCookie("dixe_access_" + (i + 1), ok, 0);
    });
}
function dixe_forget() {
    var i;

    eraseCookie("dixe_pass");
    for (i = 1; i < 10; i++) {
        eraseCookie("dixe_access_" + i);
    }
    eraseCookie("magcheck_user");
    eraseCookie("magcheck_pass");
}

function validate_user_pass(pass2validate, pass) {
    if ((pass2validate == null) || (pass2validate == ""))
        return -1;

    if (pass2validate.length > 20)
        return -2;

    if (pass) {
        if (/(\")/.test(pass2validate))
            return -4;
    }
    else {
        if (!/^([A-Za-z0-9-_\.]+)$/.test(pass2validate))
            return -3;
    }

    return 0;
}




