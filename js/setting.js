let commonUrl = "http://127.0.0.1:24/search/common";
let loginInfo;
let _this;
let postData;
const Main = {
    data() {
        return {
            userName: '未登录',
            customServiceHead: '',
            customServiceMsg: '',
            titleBg:'',
            // 登陆状态
            loginStatus:false,
            loginBtn:'',
            loginHead:''
        }
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            window.history.go(-1);
        },
        btnLogin(){
            if (_this.loginStatus){
                // 退出登陆
                delCookie("loginInfo");
                delCookie("phone_login");
                delCookie("loginId");
                _this.loginStatus = false;
                _this.titleBg = "images-video/setting_title_bg2.png";
                _this.loginBtn = "images-video/login_in.png";
                _this.loginHead = "images-video/img_head2.png";
                document.getElementById("vip_frame").style.display = 'none';
                _this.userName = '未登录';
            }else {
                // 跳转登陆页面
                window.location.href = encodeURI("LoginActivity.html");
            }
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        _this = this;
        settingUserInfo();
        getCustomServiceInfo();
        loading.close();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

/** 用户信息处理**/
function settingUserInfo() {
    /** 获取用户信息 **/
    loginInfo = getCookie(document.cookie,"loginInfo");
    _this.userName = getCookie(document.cookie,"account");
    if (loginInfo !== ''){
        // 用户已登陆
        _this.loginStatus = true;
        _this.titleBg = "images-video/setting_title_bg.png";
        _this.loginBtn = "images-video/login_exit.png";
        _this.loginHead = "images-video/img_head1.png";
        document.getElementById("vip_frame").style.display = '';
    }else {
        _this.loginStatus = false;
        _this.titleBg = "images-video/setting_title_bg2.png";
        _this.loginBtn = "images-video/login_in.png";
        _this.loginHead = "images-video/img_head2.png";
        document.getElementById("vip_frame").style.display = 'none';
        _this.userName = '未登录';
    }
}
/** 获取客服信息**/
function getCustomServiceInfo() {
    postData = {url: "/pay_ret/appKefu"};
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            response.data.msg = response.data.msg.replace(/(^\s*)|(\s*$)/g, "")
            let data = JSON.parse(response.data.msg);
            _this.customServiceHead = data.kfdata[0].img;
            _this.customServiceMsg = data.kfdata[0].msg;
        })
        .catch(function (error) {
            console.log(error);
        });
}