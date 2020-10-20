let commonUrl = "http://127.0.0.1:24/search/common";
let _this;
const Main = {
    data() {
        return {
            courseList:[]
        };
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            window.location.href = encodeURI("SettingActivity.html");
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        _this = this;
        loading.close();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');