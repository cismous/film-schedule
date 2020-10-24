var keep2 = function (value) { return ('0' + value).slice(-2); };
function FileSchedule() {
    var list = [
        { cinemaId: '375', label: '经开' },
        { cinemaId: '010', label: '群星城' },
        { cinemaId: '373', label: '春树里' },
        { cinemaId: '321', label: '江汉路悦芸' },
    ];
    var start = new Date(Date.now() - 30 * 86400 * 1000);
    var startTime = start.getFullYear() + "-" + keep2(start.getMonth() + 1) + "-" + keep2(start.getDate()) + " 23:59";
    var end = new Date(Date.now() + 86400 * 1000);
    var endTime = end.getFullYear() + "-" + keep2(end.getMonth() + 1) + "-" + keep2(end.getDate()) + " 23:59";
    return (React.createElement("div", { className: 'app' },
        React.createElement("div", { className: 'list' },
            React.createElement("div", { className: 'label' }, "\u5E38\u7528\u5F71\u9662\u5217\u8868: "),
            list.map(function (item) { return (React.createElement("a", { key: item.cinemaId, href: "http://showtime-prd-cmc.wandafilm.com/schedule/list?cinemaId=" + item.cinemaId, target: '_blank', rel: 'noreferrer' }, item.label)); })),
        React.createElement("div", { className: 'list' },
            React.createElement("div", { className: 'label' }, "\u5E38\u7528\u94FE\u63A5: "),
            React.createElement("a", { href: "http://order-admin-prd-tc.wandafilm.com/order/list?startTime=" + startTime + "&endTime=" + endTime, target: '_blank', rel: 'noreferrer' }, "\u9000\u7968\u7F51\u7AD9"))));
}
ReactDOM.render(React.createElement(FileSchedule, null), document.getElementById('root'));
