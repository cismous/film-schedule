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
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日'
};
function autoMax() {
    return __awaiter(this, void 0, void 0, function () {
        var list, i, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, spinnerLoaded()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, queryDomsAsync('.slice-timing.info-border button')];
                case 2:
                    list = _a.sent();
                    for (i = 0; i < list.length; i++) {
                        item = list[i];
                        if (item.textContent.includes('最大化'))
                            item.click();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function APP() {
    var _this = this;
    var _a = React.useState(getQuery('smartDate')), smartDate = _a[0], setSmartDat = _a[1];
    var _b = React.useState(getQuery('cinemaId')), cinemaId = _b[0], setCinemaId = _b[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { paddingTop: '10px', display: 'flex', alignItems: 'center' } },
            React.createElement("div", { style: { paddingRight: '4px' } }, "\u5F71\u57CE\uFF1A"),
            React.createElement(antd.Radio.Group, { value: cinemaId, size: 'small', onChange: function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var cinemaId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cinemaId = event.target.value;
                                setCinemaId(cinemaId);
                                updateQuery({ cinemaId: cinemaId });
                                return [4 /*yield*/, selectCinema(cinemaId)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, editSomeDay()];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); } },
                React.createElement(antd.Radio.Button, { value: '375' }, "\u7ECF\u5F00"),
                React.createElement(antd.Radio.Button, { value: '010' }, "\u7FA4\u661F\u57CE"),
                React.createElement(antd.Radio.Button, { value: '373' }, "\u6625\u6811\u91CC"),
                React.createElement(antd.Radio.Button, { value: '321' }, "\u6C5F\u6C49\u8DEF\u60A6\u82B8"))),
        React.createElement("div", { style: { paddingTop: '10px', display: 'flex', alignItems: 'center' } },
            React.createElement("div", { style: { paddingRight: '4px' } }, "\u65E5\u671F\uFF1A"),
            React.createElement(antd.Radio.Group, { value: smartDate, size: 'small', onChange: function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var smartDate;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                smartDate = event.target.value;
                                return [4 /*yield*/, editSomeDay(smartDate)];
                            case 1:
                                _a.sent();
                                setSmartDat(smartDate);
                                return [2 /*return*/];
                        }
                    });
                }); } }, [
                { value: moment(), label: '-今天' },
                { value: moment().add(1, 'days'), label: '-明天' },
                { value: moment().add(2, 'days') },
                { value: moment().add(3, 'days') },
                { value: moment().add(4, 'days') },
                { value: moment().add(5, 'days') },
                { value: moment().add(6, 'days') },
                { value: moment().add(7, 'days') },
            ].map(function (item, i) {
                var _a;
                return (React.createElement(antd.Radio.Button, { key: i, value: item.value.format('YYYY-MM-DD') }, item.value.format('M月D号') + " " + i18nDay[item.value.format('E')] + ((_a = item.label) !== null && _a !== void 0 ? _a : '')));
            })))));
}
var times = 0;
function pageInit() {
    return __awaiter(this, void 0, void 0, function () {
        var smartDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (times > 2000)
                        return [2 /*return*/];
                    times++;
                    try {
                        if (!antd || !moment || !React || !ReactDOM)
                            return [2 /*return*/, void pageInit()];
                    }
                    catch (_b) {
                        return [2 /*return*/, setTimeout(pageInit, 20)];
                    }
                    return [4 /*yield*/, selectCinema()];
                case 1:
                    _a.sent();
                    smartDate = moment().add(1, 'days');
                    if (getQuery('smartDate'))
                        smartDate = moment(getQuery('smartDate'));
                    if (!(smartDate.format('M') !== moment().format('M'))) return [3 /*break*/, 3];
                    return [4 /*yield*/, selectMonth(smartDate.format('M'))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    updateQuery({ smartDate: smartDate.format('YYYY-MM-DD') });
                    return [4 /*yield*/, editSomeDay()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, autoMax()];
                case 5:
                    _a.sent();
                    ReactDOM.render(React.createElement(APP, null), dom);
                    document.querySelector('#schedule-form .p10').appendChild(dom);
                    updateQuery({ refreshTimes: null });
                    return [2 /*return*/];
            }
        });
    });
}
pageInit();
$(window).error(function (e) {
    var _a, _b, _c;
    if ((_b = (_a = e.originalEvent) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.includes("Cannot set property 'available' of undefined")) {
        var refreshTimes = (_c = getQuery('refreshTimes', 'number')) !== null && _c !== void 0 ? _c : 0;
        if (refreshTimes > 10)
            return;
        updateQuery({ refreshTimes: refreshTimes > 0 ? refreshTimes : null });
        window.location.reload();
    }
});
