var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var saveData = null;
var detailUrl = null;
var detail = null;
/**
 * 格式化时间
 * @param startTime 开始时间
 * @param duration 电影放映时间
 */
function formatTime(time) {
    if (!time)
        return null;
    var date = new Date(time);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':';
    var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return Y + M + D + h + m;
}
/**
 * 计算结束时间
 * @param startTime 开始时间
 * @param duration 电影放映时间
 */
function getEndTime(startTime, duration) {
    return formatTime(new Date(startTime).getTime() + duration * 60 * 1000);
}
function smartMinutes(minutes, increase) {
    if (increase === void 0) { increase = 10; }
    if (increase > 10 && ['0', '5'].includes(String(minutes)[1])) {
        return increase;
    }
    var interval = 1;
    minutes = minutes + interval;
    increase = increase + interval;
    return smartMinutes(minutes, increase);
}
/**
 * 智能计算排片时间
 * @param list 已生成的时间列表
 * @param duration 电影放映时间
 * @param initStartTime 当前场次开始时间
 */
function generateShowTime(list, duration, initStartTime) {
    if (list.length) {
        var temp = new Date(list.slice(-1)[0].endTime);
        if (temp.getHours() >= 23 || temp.getHours() <= 1)
            return list;
        initStartTime = formatTime(temp.getTime() + smartMinutes(temp.getMinutes()) * 60 * 1000);
    }
    var endTime = getEndTime(initStartTime, duration);
    return generateShowTime(__spreadArrays(list, [{ startTime: initStartTime, endTime: endTime }]), duration, initStartTime);
}
function smartSchedule(hall, filmNo, initStartTime) {
    hall = JSON.parse(JSON.stringify(hall));
    var detailFilm = null;
    if (filmNo) {
        detailFilm = __spreadArrays(detail.films.A, detail.films.B, detail.films.C).find(function (item) { return item.filmNo === filmNo; });
    }
    else {
        detailFilm = __spreadArrays(detail.films.A, detail.films.B, detail.films.C).find(function (item) {
            for (var _i = 0, _a = item.supportHallFormats; _i < _a.length; _i++) {
                var supportHallFormat = _a[_i];
                if (hall.formatCodes.includes(supportHallFormat))
                    return true;
            }
            return false;
        });
    }
    var duration = detailFilm.duration;
    var lastSetting = detailFilm.settings.slice(-1)[0];
    var showTimeLit = generateShowTime([], duration, initStartTime);
    hall.showtimes = showTimeLit.map(function (item) { return (__assign(__assign({ status: 'new', hallId: hall.hallId, hallNo: hall.hallNo, hallName: hall.hallNo, filmName: detailFilm.filmName, duration: duration, adWidth: 0 }, item), { editable: true, through: false, throughable: false, films: [
            __assign(__assign(__assign({}, detailFilm), { selected: false, standardPrice: lastSetting.price, advertTime: lastSetting.advertTime }), item),
        ] })); });
    return hall;
}
function submitSave(saveData) {
    return new Promise(function (resolve, reject) {
        Mtime.Net.Ajax.post('/showtime/save', saveData).json(function (d) {
            if (!d.success) {
                reject(d.error);
            }
            else {
                //如果发现有缺失网购票的场次
                if (d.value.missingPriceErrors) {
                    reject(d.value.missingPriceErrors);
                }
                else {
                    resolve();
                }
            }
        });
    });
}
function clickSave() {
    return __awaiter(this, void 0, void 0, function () {
        var list, i, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    list = document.querySelectorAll('.slice-timing.info-border button');
                    for (i = 0; i < list.length; i++) {
                        item = list[i];
                        if (item.textContent.includes('保存'))
                            item.click();
                    }
                    return [4 /*yield*/, sleep(100)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, spinnerLoaded()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sleep(20)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var mountDom = [];
function init() {
    var initDone = false;
    var initTimes = 0;
    function setup() {
        if (initDone || initTimes > 5000)
            return;
        setTimeout(function () {
            try {
                $.ajaxSetup({
                    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                    beforeSend: function (XMLHttpRequest, req) {
                        if (req.url === '/showtime/save') {
                            saveData = JSON.parse(req.data);
                        }
                    },
                    complete: function (XMLHttpRequest) {
                        return __awaiter(this, void 0, void 0, function () {
                            var res, jsonData, i, FilmCom_1, _loop_1, i, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        res = XMLHttpRequest.responseText;
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        jsonData = JSON.parse(res);
                                        detailUrl = this.url;
                                        if (!(this.url.startsWith('/schedule/detail') && !this.url.includes('usage=view'))) return [3 /*break*/, 3];
                                        detail = jsonData.value;
                                        return [4 /*yield*/, sleep(1000)];
                                    case 2:
                                        _a.sent();
                                        if (!mountDom.length) {
                                            for (i = 0; i < detail.halls.length; i++) {
                                                Array.from(document.querySelectorAll('#time_lineboard .hallbox')).map(function (item) {
                                                    var dom = document.createElement('div');
                                                    mountDom.push(dom);
                                                    item.appendChild(dom);
                                                });
                                            }
                                        }
                                        FilmCom_1 = function (_a) {
                                            var film = _a.film, selected = _a.selected, onClick = _a.onClick;
                                            var startTime = film.ranges[0].startTime;
                                            startTime = startTime.split(' ')[1].slice(0, 5);
                                            var endTime = film.ranges[0].endTime;
                                            endTime = endTime.split(' ')[1].slice(0, 5);
                                            return (React.createElement("div", { key: film.filmNo, style: {
                                                    margin: '5px',
                                                    padding: '5px',
                                                    border: "1px solid " + (selected ? 'red' : '#e1e1e1'),
                                                    minWidth: '158px',
                                                    cursor: 'pointer'
                                                }, onClick: function () { return onClick(film); } },
                                                React.createElement("div", { style: { fontWeight: 700 } }, film.filmName),
                                                React.createElement("div", { style: { color: 'gray', fontSize: '12px', paddingTop: '4px' } },
                                                    "\u7247\u957F:",
                                                    film.duration,
                                                    "\u5206\u949F [",
                                                    film.price,
                                                    "]\u5143"),
                                                React.createElement("div", { style: { color: 'gray', fontSize: '12px' } },
                                                    "\u65F6\u6BB5:[",
                                                    startTime,
                                                    "-",
                                                    endTime,
                                                    "]")));
                                        };
                                        _loop_1 = function (i) {
                                            var dom_1 = mountDom[i];
                                            var hall = detail.halls[i];
                                            var App = function (props) {
                                                var _this = this;
                                                var hall = props.hall, detail = props.detail;
                                                // 当面选择的排片电影
                                                var _a = React.useState(null), selectedFilm = _a[0], setSelectedFilm = _a[1];
                                                // 排片时间
                                                var _b = React.useState(moment('08:05', 'HH:mm')), startTime = _b[0], setStartTime = _b[1];
                                                var _c = React.useState(false), loading = _c[0], setLoading = _c[1];
                                                var _d = React.useState(function () {
                                                    var result = getQuery('smartHallIndex', 'number') === i;
                                                    if (result)
                                                        updateQuery({ smartHallIndex: null });
                                                    return result;
                                                }), visible = _d[0], setVisible = _d[1];
                                                var a = detail.films.A.filter(function (film) {
                                                    return Boolean(film.supportHallFormats.find(function (format) { return hall.formatCodes.includes(format); }));
                                                });
                                                var b = detail.films.B.filter(function (film) {
                                                    return Boolean(film.supportHallFormats.find(function (format) { return hall.formatCodes.includes(format); }));
                                                });
                                                var c = detail.films.C.filter(function (film) {
                                                    return Boolean(film.supportHallFormats.find(function (format) { return hall.formatCodes.includes(format); }));
                                                });
                                                var s = detail.films.S.filter(function (film) {
                                                    return Boolean(film.supportHallFormats.find(function (format) { return hall.formatCodes.includes(format); }));
                                                });
                                                return (React.createElement("div", { style: { display: 'flex', marginTop: '8px' } },
                                                    React.createElement(antd.Button, { disabled: !hall.showtimes.length, style: { marginLeft: 'auto' }, size: 'small', danger: true, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var selector, list, i_1, item, dom, i_2, opt, bntList, i_3, item;
                                                            var _this = this;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        selector = '#schedule-detail .info-border button';
                                                                        list = document.querySelectorAll(selector);
                                                                        for (i_1 = 0; i_1 < list.length; i_1++) {
                                                                            item = list[i_1];
                                                                            if (item.textContent.includes('批量删除')) {
                                                                                item.click();
                                                                                break;
                                                                            }
                                                                        }
                                                                        return [4 /*yield*/, sleep(500)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [4 /*yield*/, queryDomAsync('#batch-del select[name="hallId"]')];
                                                                    case 2:
                                                                        dom = (_a.sent());
                                                                        for (i_2 = 0; i_2 < dom.options.length; i_2++) {
                                                                            opt = dom.options[i_2];
                                                                            if (Number(opt.value) === hall.hallId) {
                                                                                dom.selectedIndex = i_2;
                                                                                break;
                                                                            }
                                                                        }
                                                                        bntList = document.querySelectorAll('#dialog-1603879900956 .modal-footer button');
                                                                        for (i_3 = 0; i_3 < bntList.length; i_3++) {
                                                                            item = bntList[i_3];
                                                                            if (item.textContent === '确定') {
                                                                                item.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                                                                                    return __generator(this, function (_a) {
                                                                                        switch (_a.label) {
                                                                                            case 0: return [4 /*yield*/, clickSave()];
                                                                                            case 1:
                                                                                                _a.sent();
                                                                                                return [2 /*return*/];
                                                                                        }
                                                                                    });
                                                                                }); });
                                                                            }
                                                                        }
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); } }, "\u6E05\u7A7A\u6392\u7247"),
                                                    React.createElement(antd.Button, { disabled: Boolean(hall.showtimes.length), size: 'small', type: 'primary', style: { marginLeft: '12px' }, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        updateQuery({ smartHallIndex: i });
                                                                        return [4 /*yield*/, clickSave()];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); } }, "\u667A\u80FD\u6392\u7247"),
                                                    React.createElement(antd.Modal, { title: '\u667A\u80FD\u6392\u7247', visible: visible, width: '68%', okButtonProps: { loading: loading, disabled: !selectedFilm }, cancelButtonProps: { disabled: loading }, onCancel: function () { return setVisible(false); }, bodyStyle: { padding: '12px 24px 19px' }, onOk: function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var smartDate, initStartTime, _a;
                                                            return __generator(this, function (_b) {
                                                                switch (_b.label) {
                                                                    case 0:
                                                                        setLoading(true);
                                                                        smartDate = getQuery('smartDate', 'string');
                                                                        initStartTime = smartDate + " " + startTime.format('HH:mm');
                                                                        saveData.halls = detail.halls;
                                                                        saveData.halls[i] = smartSchedule(detail.halls[i], selectedFilm === null || selectedFilm === void 0 ? void 0 : selectedFilm.filmNo, initStartTime);
                                                                        _b.label = 1;
                                                                    case 1:
                                                                        _b.trys.push([1, 3, , 4]);
                                                                        return [4 /*yield*/, submitSave(saveData)];
                                                                    case 2:
                                                                        _b.sent();
                                                                        location.reload();
                                                                        return [3 /*break*/, 4];
                                                                    case 3:
                                                                        _a = _b.sent();
                                                                        antd.message.warn('智能排片失败，请刷新页面再尝试');
                                                                        return [3 /*break*/, 4];
                                                                    case 4:
                                                                        setLoading(false);
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); } },
                                                        React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                                                            React.createElement("div", { style: { paddingRight: '8px' } }, "\u6392\u7247\u5F00\u59CB\u65F6\u95F4:"),
                                                            React.createElement(antd.TimePicker, { value: startTime, format: 'HH:mm', onChange: function (date) { return setStartTime(date); } })),
                                                        React.createElement(antd.Tabs, { defaultActiveKey: '1' },
                                                            React.createElement(antd.Tabs.TabPane, { tab: "A\u7C7B\u5F71\u7247(" + a.length + ")", key: 'a' },
                                                                React.createElement("div", { style: {
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                        paddingRight: '10px',
                                                                        marginLeft: '-5px'
                                                                    } }, a.map(function (item) { return (React.createElement(FilmCom_1, { key: item.filmNo, film: item, selected: item.filmNo === (selectedFilm === null || selectedFilm === void 0 ? void 0 : selectedFilm.filmNo), onClick: setSelectedFilm })); }))),
                                                            React.createElement(antd.Tabs.TabPane, { tab: "B\u7C7B\u5F71\u7247(" + b.length + ")", key: 'b' },
                                                                React.createElement("div", { style: {
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                        paddingRight: '10px',
                                                                        marginLeft: '-5px'
                                                                    } }, b.map(function (item) { return (React.createElement(FilmCom_1, { key: item.filmNo, film: item, selected: item.filmNo === (selectedFilm === null || selectedFilm === void 0 ? void 0 : selectedFilm.filmNo), onClick: setSelectedFilm })); }))),
                                                            React.createElement(antd.Tabs.TabPane, { tab: "C\u7C7B\u5F71\u7247(" + c.length + ")", key: 'c' },
                                                                React.createElement("div", { style: {
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                        paddingRight: '10px',
                                                                        marginLeft: '-5px'
                                                                    } }, c.map(function (item) { return (React.createElement(FilmCom_1, { key: item.filmNo, film: item, selected: item.filmNo === (selectedFilm === null || selectedFilm === void 0 ? void 0 : selectedFilm.filmNo), onClick: setSelectedFilm })); }))),
                                                            React.createElement(antd.Tabs.TabPane, { tab: "S\u7C7B\u5F71\u7247(" + s.length + ")", key: 's' },
                                                                React.createElement("div", { style: {
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                        paddingRight: '10px'
                                                                    } }, s.map(function (item) { return (React.createElement(FilmCom_1, { key: item.filmNo, film: item, selected: item.filmNo === (selectedFilm === null || selectedFilm === void 0 ? void 0 : selectedFilm.filmNo), onClick: setSelectedFilm })); })))))));
                                            };
                                            ReactDOM.render(React.createElement(App, { hall: hall, detail: detail }), dom_1);
                                        };
                                        for (i = 0; i < detail.halls.length; i++) {
                                            _loop_1(i);
                                        }
                                        _a.label = 3;
                                    case 3: return [3 /*break*/, 5];
                                    case 4:
                                        err_1 = _a.sent();
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        });
                    }
                });
                initDone = true;
                initTimes++;
            }
            catch (err) {
                setup();
            }
        }, 20);
    }
    setup();
}
init();
