function pageClick(k) {
    $(k).parent().find("div").removeClass("active");
    $(k).addClass("active");
    $("#flTitle").text($(k).text());
    if ($(k).text() === "生成页面") {
        window.location.href = 'makeListActivity.html'
    }
    if ($(k).text() === "类别管理") {
        window.location.href = 'mainActivity.html'
    }
}

let nameID = "";
let baseUrl = 'https://192.168.0.76:24/search/';
var Main = {
    data() {
        return {
            options: [{
                "value": "zhinan",
                "label": "指南",
                "children": "[]"
            }, {
                "value": "ziyuan",
                "label": "资源",
                "children": "[{value: 'axure',label: 'Axure Components'}, {value: 'sketch',label: 'Sketch Templates'}, {value: 'jiaohu',label: '组件交互文档'}]"
            }]
        };
    }, methods: {

    },
    mounted() {
        let _this = this;
        axios.get(baseUrl + 'completeItemList')
            .then(function (response) {
                console.log(response.data.msg);
                // _this.options = JSON.parse(response.data.msg);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')