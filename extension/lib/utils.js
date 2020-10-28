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
var _this = this;
/**
 * 睡眠时间
 */
var sleep = function (ts) {
    if (ts === void 0) { ts = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ts); });
};
/**
 * 检查当前是否加载完成
 */
var spinnerLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sleep(50)];
            case 1:
                _a.sent();
                return [2 /*return*/, new Promise(function (resolve) {
                        var check = function () {
                            setTimeout(function () {
                                var list = document.querySelectorAll('body > .spinner');
                                if (list.length === 0)
                                    resolve();
                                else
                                    check();
                            }, 200);
                        };
                        check();
                    })];
        }
    });
}); };
/**
 * 获取url里指定的query参数状态
 * 返回数据支持 string | number | boolean
 *
 * 使用方式
 * 1. getQuery('category') 获取的数据为string类型
 * 2. getQuery<number>('status', 'number') 获取的数据为自动格式化为number类型
 * 3. getQuery<boolean>('status', 'boolean') 获取的数据为boolean
 *
 * @param key 需要获取的query key
 * @param type 参数数据类型
 * @param search 默认 window.location.search
 */
function getQuery(key, type, search) {
    if (type === void 0) { type = 'string'; }
    if (search === void 0) { search = window.location.search; }
    var searchParams = new URLSearchParams(search);
    var val = searchParams.has(key) ? searchParams.get(key) : '';
    if (type === 'boolean')
        return Boolean(val);
    if (type === 'number') {
        if (!val)
            return undefined;
        var _val = Number(val);
        if (Number.isNaN(_val))
            return undefined;
        return _val;
    }
    return val;
}
/**
 * 更新url中的query信息状态
 *
 * 使用方式
 * 1. 默认会使用替换模式更新url页面，浏览器不会记录上一个页面，不支持访问到上一个页面
 * 2. 可以通过指定action为push，浏览器会记录上一个页面，可使用返回按钮访问到上一个页面
 * 3. 删除一个query参数时可使用 ` updateQuery({ type: null }) `
 *
 * @param params
 * @param action
 */
function updateQuery(params, action) {
    if (action === void 0) { action = 'replace'; }
    var searchParams = new URLSearchParams(window.location.search);
    var updateSearchParams = function (key, value) {
        if (!params[key] && params[key] !== 0)
            searchParams["delete"](key);
        else if (searchParams.has(key))
            searchParams.set(key, value.toString());
        else
            searchParams.append(key, value.toString());
    };
    var keys = Object.keys(params);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        updateSearchParams(key, params[key]);
    }
    var search = searchParams.toString();
    search = search ? "?" + search : '';
    if (window.history.pushState) {
        var _a = window.location, protocol = _a.protocol, pathname = _a.pathname, host = _a.host;
        var path = protocol + "//" + host + pathname + decodeURIComponent(search);
        if (action === 'replace')
            window.history.replaceState({ path: path }, '', path);
        else
            window.history.pushState({ path: path }, '', path);
    }
}
/**
 * 异步轮训获取dom列表
 * @param selector 选择器
 */
function queryDomsAsync(selector) {
    return __awaiter(this, void 0, void 0, function () {
        function init() {
            return __awaiter(this, void 0, void 0, function () {
                var dom;
                var _this = this;
                return __generator(this, function (_a) {
                    if (times >= 1000)
                        return [2 /*return*/, []];
                    times++;
                    dom = document.querySelectorAll(selector);
                    if (dom === null || dom === void 0 ? void 0 : dom.length)
                        return [2 /*return*/, Array.from(dom)];
                    return [2 /*return*/, new Promise(function (resolve) { return setTimeout(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = resolve;
                                    return [4 /*yield*/, init()];
                                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                            }
                        }); }); }, 15); })];
                });
            });
        }
        var times;
        return __generator(this, function (_a) {
            times = 0;
            return [2 /*return*/, init()];
        });
    });
}
/**
 * 异步轮训获取dom
 * @param selector 选择器
 */
function queryDomAsync(selector) {
    return __awaiter(this, void 0, void 0, function () {
        function init() {
            return __awaiter(this, void 0, void 0, function () {
                var dom;
                var _this = this;
                return __generator(this, function (_a) {
                    if (times >= 1000)
                        return [2 /*return*/, null];
                    times++;
                    dom = document.querySelector(selector);
                    if (dom)
                        return [2 /*return*/, dom];
                    return [2 /*return*/, new Promise(function (resolve) { return setTimeout(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = resolve;
                                    return [4 /*yield*/, init()];
                                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                            }
                        }); }); }, 15); })];
                });
            });
        }
        var times;
        return __generator(this, function (_a) {
            times = 0;
            return [2 /*return*/, init()];
        });
    });
}
/**
 * 异步等待dom消失
 * @param selector 选择器
 */
function waitDomDisappear(selector, interval, limitTimes) {
    if (interval === void 0) { interval = 15; }
    if (limitTimes === void 0) { limitTimes = 1000; }
    return __awaiter(this, void 0, void 0, function () {
        function init() {
            return __awaiter(this, void 0, void 0, function () {
                var dom;
                var _this = this;
                return __generator(this, function (_a) {
                    if (limitTimes && times >= limitTimes)
                        return [2 /*return*/];
                    times++;
                    dom = document.querySelector(selector);
                    if (dom)
                        return [2 /*return*/, new Promise(function (resolve) { return setTimeout(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = resolve;
                                        return [4 /*yield*/, init()];
                                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                                }
                            }); }); }, interval); })];
                    return [2 /*return*/];
                });
            });
        }
        var times;
        return __generator(this, function (_a) {
            times = 0;
            return [2 /*return*/, init()];
        });
    });
}
/**
 * 选择排片月份
 * @param month 月份
 */
function selectMonth(month) {
    return __awaiter(this, void 0, void 0, function () {
        var dom, monthDomList, _i, _a, item, dom_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, queryDomsAsync('#schedule-form .input-group.date .input-group-addon')];
                case 1:
                    dom = (_b.sent());
                    dom[0].click();
                    return [4 /*yield*/, queryDomsAsync('#schedule-form .bootstrap-datetimepicker-widget .month')];
                case 2:
                    monthDomList = _b.sent();
                    if (!monthDomList.length) return [3 /*break*/, 6];
                    _i = 0, _a = Array.from(monthDomList);
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    item = _a[_i];
                    if (!(item.textContent === month + "\u6708")) return [3 /*break*/, 5];
                    ;
                    item.click();
                    dom_1 = document.querySelector('#schedule-form #search-schedule');
                    dom_1 === null || dom_1 === void 0 ? void 0 : dom_1.click();
                    return [4 /*yield*/, spinnerLoaded()];
                case 4:
                    _b.sent();
                    document.body.focus();
                    return [3 /*break*/, 6];
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * 选择每个影厅
 * @param cinemaId 影厅id
 */
function selectCinema(cinemaId) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cinemaId)
                        cinemaId = getQuery('cinemaId');
                    if (!cinemaId)
                        return [2 /*return*/];
                    return [4 /*yield*/, spinnerLoaded()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            var times, execute;
                            var _this = this;
                            return __generator(this, function (_a) {
                                times = 0;
                                execute = function () {
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var dom, i, opt;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    times++;
                                                    if (times > 1000)
                                                        return [2 /*return*/, void resolve()];
                                                    return [4 /*yield*/, queryDomsAsync('#cinemaId')];
                                                case 1:
                                                    dom = (_a.sent())[0];
                                                    if (dom.options.length === 0)
                                                        return [2 /*return*/, void execute()];
                                                    for (i = 0; i < dom.options.length; i++) {
                                                        opt = dom.options[i];
                                                        if (opt.value === cinemaId) {
                                                            dom.selectedIndex = i;
                                                            document.getElementById('select2-cinemaId-container').textContent = opt.textContent;
                                                            document.getElementById('search-schedule').click();
                                                            resolve();
                                                            break;
                                                        }
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 20);
                                };
                                execute();
                                return [2 /*return*/];
                            });
                        }); })];
            }
        });
    });
}
/**
 * 编辑某天的影片
 * @param date 距离当天时间天数的偏移值
 */
function editSomeDay(_date) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var preDate, editDate, calendarList, _i, calendarList_1, item, btnList, editBtn, viewBtn, addBtn, btn;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    preDate = moment(getQuery('smartDate'));
                    editDate = moment(_date || preDate);
                    if (!(editDate.format('M') !== preDate.format('M'))) return [3 /*break*/, 2];
                    return [4 /*yield*/, selectMonth(editDate.format('M'))];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, queryDomsAsync('#calendar .calendar-date li')];
                case 3:
                    calendarList = _b.sent();
                    for (_i = 0, calendarList_1 = calendarList; _i < calendarList_1.length; _i++) {
                        item = calendarList_1[_i];
                        if (((_a = item.querySelector('.date')) === null || _a === void 0 ? void 0 : _a.textContent) === editDate.format('D')) {
                            btnList = Array.from(item.querySelectorAll('button'));
                            editBtn = btnList.find(function (item) { return item.textContent === '编辑'; });
                            viewBtn = btnList.find(function (item) { return item.textContent === '查看'; });
                            addBtn = btnList.find(function (item) { return item.textContent === '添加'; });
                            btn = editBtn || viewBtn || addBtn;
                            btn === null || btn === void 0 ? void 0 : btn.click();
                            updateQuery({ smartDate: editDate.format('YYYY-MM-DD') });
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
