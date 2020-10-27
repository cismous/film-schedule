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
var spinnerLoaded = function () {
    return new Promise(function (resolve) {
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
    });
};
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
