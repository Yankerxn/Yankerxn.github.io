let logged = false;
const Main = {
    data() {
        return {}
    },
    methods: {
        startTarget(target) {
            let searchUrl;
            switch (target) {
                case "chinese":
                    setCookie2("grade1",4);
                    setCookie2("term1",2);
                    setCookie2("subjectId",1);
                    searchUrl = encodeURI("VideoListActivity.html");
                    window.location.href = searchUrl;
                    break;
                case "math":
                    setCookie2("grade2",4);
                    setCookie2("term2",2);
                    setCookie2("subjectId",2);
                    searchUrl = encodeURI("VideoListActivity.html");
                    window.location.href = searchUrl;
                    break;
                case "english":
                    setCookie2("grade0",4);
                    setCookie2("term0",2);
                    setCookie2("subjectId",0);
                    searchUrl = encodeURI("VideoListActivity.html");
                    window.location.href = searchUrl;
                    break;
                case "as":
                    searchUrl = encodeURI("VideoBasicListActivity.html?subjectId=" + 11);
                    window.location.href = searchUrl;
                    break;
                case "story":
                    searchUrl = encodeURI("VideoBasicListActivity.html?subjectId=" + 22);
                    window.location.href = searchUrl;
                    break;
                case "login":
                    if (logged){
                        searchUrl = encodeURI("SettingActivity.html");
                    }else {
                        searchUrl = encodeURI("LoginActivity.html");
                    }
                    window.location.href = searchUrl;
                    break;
                case "setting":
                    searchUrl = encodeURI("SettingActivity.html");
                    window.location.href = searchUrl;
                    break;
                default:
                    searchUrl = encodeURI("VideoBasicListActivity.html?subjectId=" + target);
                    window.location.href = searchUrl;
                    break
            }
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        settingUserInfo();
        loading.close();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

/** 用户信息处理**/
function settingUserInfo() {
    /** 获取用户信息 **/
    let loginInfo = getCookie(document.cookie,"loginInfo");
    if (loginInfo !== ''){
        // 用户已登陆
        logged = true;
    }
}