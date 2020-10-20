let commonUrl = "http://127.0.0.1:24/search/common";
let _this;
let grade,term,subjectId;

const Main = {
    data() {
        return {
            submitTitle:'测试',
            submitTitleBody:'1个词汇',
            textContent:''
        };
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            let searchUrl = encodeURI("ListeningActivity.html?grade=" + grade + "&term=" + term + "&subjectId=" + subjectId);
            window.location.href = encodeURI(searchUrl);
        },
        startChooseActivity(){
            let searchUrl = encodeURI("ChooseBookActivity.html?grade=" + grade + "&term=" + term + "&subjectId=" + subjectId);
            window.location.href = encodeURI(searchUrl);
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        _this = this;
        GetRequest();
        loading.close();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

function GetRequest() {
    const url = location.search;
    const theRequest = {};
    let content;
    if (url.indexOf("?") !== -1) {
        const str = url.substr(1);
        content = str.split("&");
        for (let i = 0; i < content.length; i++) {
            theRequest[content[i].split("=")[0]] = decodeURI(content[i].split("=")[1]);
        }
    }
    // 初始化数据
    _this.grade = parseInt(theRequest.grade);
    _this.term = parseInt(theRequest.term);
    _this.subjectId = parseInt(theRequest.subjectId);
}