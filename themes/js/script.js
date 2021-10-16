let contact = new Array();
let ends = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
Number.prototype.format = function(n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};
(function() {
    function l(r) {
        return null === r ? "" : encodeURIComponent(String(r).trim())
    }

    function r(r, e) {
        var t, a, o, s, i = [],
            n = !(!e || !e.lowerCase) && !!e.lowerCase;
        if (null === r ? a = "" : "object" == typeof r ? (a = "", e = r) : a = r, e) {
            if (e.path && (a && "/" === a[a.length - 1] && (a = a.slice(0, -1)), o = String(e.path).trim(), n && (o = o.toLowerCase()), 0 === o.indexOf("/") ? a += o : a += "/" + o), e.queryParams) {
                for (t in e.queryParams) {
                    if (e.queryParams.hasOwnProperty(t) && void 0 !== e.queryParams[t])
                        if (e.disableCSV && Array.isArray(e.queryParams[t]) && e.queryParams[t].length)
                            for (var u = 0; u < e.queryParams[t].length; u++) s = e.queryParams[t][u], i.push(t + "=" + l(s));
                        else s = n ? e.queryParams[t].toLowerCase() : e.queryParams[t], i.push(t + "=" + l(s))
                }
                a += "?" + i.join("&")
            }
            e.hash && (a += n ? "#" + String(e.hash).trim().toLowerCase() : "#" + String(e.hash).trim())
        }
        return a
    }
    var e = this,
        t = e.buildUrl;
    r.noConflict = function() {
        return e.buildUrl = t, r
    }, "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = r), exports.buildUrl = r) : e.buildUrl = r
}).call(this);
let QuangApp = function() {
    initUrl = (queryParams) => {
        return buildUrl("", {
            path: "api.php",
            queryParams
        })
    }
    copyStringToClipboard = (str) => {
        var el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style = {
            position: 'absolute',
            left: '-9999px'
        };
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Đã sao chép số điện thoại này. Chúc bạn may mắn.');
    }
    number_format = (number) => {
        return parseInt(number).toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND'
        });
    }
    initAjax = (data_ajax) => {
        $.ajax(data_ajax);
    }
    getNum = (remove) => {
        let ends = [];
        for ($i = 0; $i < 10; $i++) {
            if (remove.indexOf($i) === -1) {
                ends.push($i);
            };
        }
        return ends;
    }
    loadMomo = () => {
        initAjax({
            url: initUrl({
                type: "momo"
            }),
            method: "POST",
            success: function(data) {
                if (data.status == true) {
                    let table_one = "";
                    let table_ten = "<tr>";
                    if (data.data_momo) {
                        let status_momo = {
                            0: `<span class="label label-info text-uppercase">Đang kết nối</span>`,
                            1: `<span class="label label-success text-uppercase">Hoạt động</span>`
                        };
                        let data_momos = data.data_momo;
                        for (let momo of data.data_momo) {
                            var settings = JSON.parse(momo.settings);
                            if (settings.transfers_today == undefined) {
                                settings.transfers_today = {
                                    times: 0,
                                    amount: 0
                                };
                            }
                            table_one += `<tr>`;
                            table_one += `<td>${momo.username} <span class="label label-success text-uppercase" onclick="QuangApp.coppy('${momo.username}')"><i class="fa fa-clipboard" aria-hidden="true"></i></span></td>`;
                            table_one += `<td>${status_momo[momo.status]}</td>`;
                            table_one += `<td><strong><span class="text-danger">${settings.transfers_today.times}</span> / ***</strong></td>`;
                            table_one += `<td><strong><span class="text-danger cash-format">${number_format(settings.transfers_today.amount)}</span> / 30.000.000 VND</strong></td>`;
                            table_one += "</tr>";
                            table_ten += "<tr>";
                            table_ten += `<td>${momo.username} <span class="label label-success text-uppercase" onclick="QuangApp.coppy('${momo.username}')"><i class="fa fa-clipboard" aria-hidden="true"></i></span></td>`;
                            table_ten += "</tr>";
                        }
                    }
                    if (data.game.active) {
                        for (let game of data.game.active) {
                            $(`button[data-game="${game}"]`).removeClass("hidden");
                        }
                        $("div.play-rules").html(data.game.html);
                        $(`button[data-game="${data.game.active[0]}"]`).click();
                    }
                    $("#momo-status").html(table_one);
                }
            }
        })
    }
    loadSettings = () => {
        initAjax({
            url: initUrl({
                type: "settings"
            }),
            method: "POST",
            success: function(data) {
                if (data.status == true) {
                    if (data.active == 1) {
                        $("#author").html(`<a href="${data.href}" target="_blank">${data.author}</a>`);
                        let html_contact = "";
                        for (let contact of data.contacts) {
                            html_contact += `<p><a class="text-white" href="${contact.href}" target="_blank"><span class="btn btn-success text-uppercase">${contact.name}</span></a></p>`;
                        }
                        $("#note").html(data.note);
                        $("#note_modal").html(data.note);
                        $("#noteModal").modal();
                        $("#contact").html(html_contact);
                        if (data.ads !== "" && data.ads !== undefined) {
                            $(".ads").removeClass("hidden").html(data.ads);
                        }
                        if (data.notifications !== "" && data.notifications !== undefined) {
                            $(".notifications").removeClass("hidden").html(data.notifications);
                        }
                        loadMomo();
                        if (data.history == "1") {
                            loadHistorys(data.only_win, data.limit);
                        }
                        if (data.hu == "1") {
                            $("#hu-left-display").removeClass("hidden");
                        }
                    }
                }
            }
        })
    };
    loadHistorys = (only_win, limit) => {
        initAjax({
            url: initUrl({
                type: "history",
                only_win,
                limit
            }),
            method: "POST",
            success: function(data) {
                if (data.status == true) {
                    if (data.history.status == true) {
                        let status_win = {
                            1: '<span class="label label-success text-uppercase">Thắng</span>',
                            "-1": '<span class="label label-secondary text-uppercase">Thua</span>'
                        }
                        let html_history = "";
                        for (let history of data.history.data) {
                            html_history += "<tr>";
                            html_history += `<td>${history.time_tran_date}</td>`;
                            html_history += `<td>${history.partnerId}</td>`;
                            html_history += `<td>${number_format(history.amount)}</td>`;
                            html_history += `<td><span class="fa-stack"><span class="fa fa-circle fa-stack-2x"></span><span class="fa-stack-1x text-white">${history.comment}</span></span></td>`;
                            html_history += `<td>${status_win[history.victory]}</td>`;
                            html_history += "</tr>";
                        }
                        $("#history").html(html_history);
                    }
                } else {}
            }
        });
    };
    checkTran = (tran_id) => {
        initAjax({
            url: initUrl({
                type: "check-tran",
                tran_id
            }),
            method: "POST",
            beforeSend: function() {
                $(".check-tran").attr("disabled", true).addClass("disabled");
            },
            success: function(data) {
                if (data.status == true) {
                    if (data.data.status == true) {
                        $("#result-check").attr("class", "").addClass("alert alert-success").html(data.data.message);
                    } else {
                        $("#result-check").attr("class", "").addClass("alert alert-danger").html(data.data.message);
                    }
                } else {
                    $("#result-check").attr("class", "").addClass("alert alert-danger").html(data.message);
                }
                $(".check-tran").attr("disabled", false).removeClass("disabled");
            }
        })
    };
    return {
        init: function() {
            loadSettings();
        },
        coppy: function(str) {
            copyStringToClipboard(str);
        },
        number_format: function(number) {
            number_format(number);
        },
        check_tranid: function() {
            $this = this;
            let tranid = $("input[name=tran_id]").val();
            checkTran(tranid);
        },
        hu_click: function() {
            $("#hu-info").modal("show");
        }
    }
}();
"undefined" != typeof module && "undefined" != typeof module.exports && (module.exports = QuangApp), $(document).ready(function() {
    QuangApp.init()
});