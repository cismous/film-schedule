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
/* eslint-disable react/jsx-no-undef */
var dom = document.createElement('div');
dom.classList.add('clearfix');
var i18nDay = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六'
};
function autoMax() {
    return __awaiter(this, void 0, void 0, function () {
        var list, item, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, spinnerLoaded()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sleep(2000)];
                case 2:
                    _a.sent();
                    list = document.querySelectorAll('.slice-timing.info-border button');
                    for (item = void 0, i = 0; (item = list[i]); i++) {
                        if (item.textContent.includes('最大化'))
                            item.click();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 编辑某天的影片
 * @param dayOffset 距离当天时间天数的偏移值
 */
function edit(dayOffset) {
    var _a;
    if (dayOffset === void 0) { dayOffset = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var calendarList, index, btn;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sleep(200)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, spinnerLoaded()];
                case 2:
                    _b.sent();
                    calendarList = Array.from(document.querySelectorAll('#calendar .calendar-date li'));
                    index = calendarList.findIndex(function (item) {
                        var _a;
                        var curMonthDay = new Date().getDate();
                        return ((_a = item.querySelector('.date')) === null || _a === void 0 ? void 0 : _a.textContent) === String(curMonthDay);
                    });
                    btn = (_a = calendarList[index + dayOffset]) === null || _a === void 0 ? void 0 : _a.querySelectorAll('button');
                    updateQuery({ dayOffset: dayOffset });
                    if (!((btn === null || btn === void 0 ? void 0 : btn.length) > 1)) return [3 /*break*/, 4];
                    btn[1].click();
                    return [4 /*yield*/, autoMax()];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function APP() {
    var _this = this;
    var _a = React.useState(getQuery('dayOffset', 'number') || 1), editDay = _a[0], setEditDay = _a[1];
    var _b = React.useState(function () {
        var search = new URLSearchParams(location.search.slice(1));
        return search.get('cinemaId');
    }), cinemaId = _b[0], setCinemaId = _b[1];
    var curWeekDay = new Date().getDay();
    var curMonthDay = new Date().getDate();
    var curMonthLastDay = new Date(new Date().getFullYear(), 1, 0).getDate();
    function updateCinema(cinemaId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var times, execute;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, spinnerLoaded()];
                                case 1:
                                    _a.sent();
                                    times = 0;
                                    execute = function () {
                                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var dom, opt, i, dayOffset;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        times++;
                                                        if (times > 100)
                                                            return [2 /*return*/, void resolve()];
                                                        dom = document.getElementById('cinemaId');
                                                        if (dom.options.length === 0)
                                                            return [2 /*return*/, void execute()];
                                                        opt = void 0, i = 0;
                                                        _a.label = 1;
                                                    case 1:
                                                        if (!(opt = dom.options[i])) return [3 /*break*/, 4];
                                                        if (!(opt.value === cinemaId)) return [3 /*break*/, 3];
                                                        dom.selectedIndex = i;
                                                        document.getElementById('select2-cinemaId-container').textContent = opt.textContent;
                                                        document.getElementById('search-schedule').click();
                                                        dayOffset = getQuery('dayOffset', 'number') || 1;
                                                        return [4 /*yield*/, edit(dayOffset)];
                                                    case 2:
                                                        _a.sent();
                                                        setEditDay(dayOffset);
                                                        autoMax();
                                                        resolve();
                                                        return [3 /*break*/, 4];
                                                    case 3:
                                                        i++;
                                                        return [3 /*break*/, 1];
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        }); }, 50);
                                    };
                                    execute();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    }
    React.useEffect(function () {
        var main = function () { return __awaiter(_this, void 0, void 0, function () {
            var search, cinemaId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        search = new URLSearchParams(location.search.slice(1));
                        cinemaId = search.get('cinemaId');
                        return [4 /*yield*/, sleep(1000)];
                    case 1:
                        _a.sent();
                        if (!cinemaId) return [3 /*break*/, 3];
                        return [4 /*yield*/, updateCinema(cinemaId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        main();
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { paddingTop: '10px' } },
            React.createElement(antd.Radio.Group, { value: cinemaId, size: 'small', onChange: function (event) {
                    updateCinema(event.target.value);
                    setCinemaId(event.target.value);
                } },
                React.createElement(antd.Radio.Button, { value: '375' }, "\u7ECF\u5F00"),
                React.createElement(antd.Radio.Button, { value: '010' }, "\u7FA4\u661F\u57CE"),
                React.createElement(antd.Radio.Button, { value: '373' }, "\u6625\u6811\u91CC"),
                React.createElement(antd.Radio.Button, { value: '321' }, "\u6C5F\u6C49\u8DEF\u60A6\u82B8"))),
        React.createElement(antd.Radio.Group, { value: editDay, size: 'small', onChange: function (event) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, edit(event.target.value)];
                        case 1:
                            _a.sent();
                            setEditDay(event.target.value);
                            return [2 /*return*/];
                    }
                });
            }); }, style: { paddingTop: '10px' } }, [
            { value: 0, weekDay: i18nDay[curWeekDay], disabled: false, label: '今天' },
            {
                value: 1,
                weekDay: i18nDay[(curWeekDay + 1) % 7],
                disabled: curMonthDay + 1 > curMonthLastDay,
                label: '明天'
            },
            {
                value: 2,
                weekDay: i18nDay[(curWeekDay + 2) % 7],
                disabled: curMonthDay + 2 > curMonthLastDay,
                label: '后天'
            },
            {
                value: 3,
                weekDay: i18nDay[(curWeekDay + 3) % 7],
                disabled: curMonthDay + 3 > curMonthLastDay,
                label: '大后天'
            },
            {
                value: 4,
                weekDay: i18nDay[(curWeekDay + 4) % 7],
                disabled: curMonthDay + 4 > curMonthLastDay,
                label: '再往后'
            },
            {
                value: 5,
                weekDay: i18nDay[(curWeekDay + 5) % 7],
                disabled: curMonthDay + 5 > curMonthLastDay,
                label: '再再往后'
            },
        ]
            .filter(function (item) { return !item.disabled; })
            .map(function (item) { return (React.createElement(antd.Radio.Button, { key: item.value, value: item.value },
            "\u7F16\u8F91(",
            curMonthDay + item.value,
            "\u53F7-",
            item.weekDay,
            "-",
            item.label,
            ")")); }))));
}
ReactDOM.render(React.createElement(APP, null), dom);
document.querySelector('#schedule-form .p10').appendChild(dom);
