let _this;
/** 短信重复发送倒计时 **/
let myVar = null;
/** 短信重新发送时间限制 **/
let countDownTime = 60;
/** 倒计时文字颜色 **/
let gayColor = "#a8a8a8";
/** 发送信息文字颜色 **/
let blueColor = "#00a2fe";
/** 账号输入框 **/
let accountEdit;
/** 发送验证码按钮 **/
let sendMessageBtn;
/** 登陆类型 **/
let loginType = 1;
/** 微信ID **/
let uid = '';
const Main = {
    data() {
        return {
            activeName: 'phone_login',
            // 用户输入手机号
            phone: '',
            // 得到验证码的手机号
            confirmPhone: '',
            // 验证码
            yzm: '',
            inputYzmFocus: false,
            //用户输入验证码
            inputYzm: '',
            // 倒计时状态
            countdownStatus: false,
            // 是否刚刚购买完成的状态
            buyJustNowStatus: false,
            // 刚刚购买完成的订单号
            buyJustNowOrderNum: '',
            // 刚刚完成恢复购买登录
            recoverLoginJustNow: false,
            interval: null
        }
    },
    methods: {
        handleClickTabs() {
            if (_this.activeName === 'phone_login') {
                accountEdit.placeholder = "请输入手机号";
                accountEdit.maxLength = 11;
                loginType = 1;
            } else {
                accountEdit.placeholder = "请输入邮箱";
                accountEdit.maxLength = 30;
                loginType = 3;
            }
            _this.phone = '';
        },
        getMessageCode() { // 获取验证码
            if (!_this.countdownStatus) {
                if (_this.activeName === 'phone_login') {
                    if (!isPhoneNumber(_this.phone)) {
                        this.$message.error('请输入正确的手机号');
                    } else {
                        createFileInOss(_this.phone);
                        _this.countdownStatus = true;
                        myVar = setInterval(function () {
                            myTimer();
                        }, 1000);
                    }
                } else {
                    if (!isEmail(_this.phone)) {
                        this.$message.error('请输入正确的邮箱');
                    } else {
                        sendEmailCode(_this.phone);
                        _this.countdownStatus = true;
                        myVar = setInterval(function () {
                            myTimer();
                        }, 1000);
                    }
                }
            }
        },
        login() {

        }, btnCloseWindow() {
            // 关闭当前窗口
            myStopFunction();
            window.history.go(-1);
        },loginAccount(){
            loginAccount(this,_this.phone,_this.yzm,loginType,uid);
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        sendMessageBtn = document.getElementById("btn_message");
        accountEdit = document.getElementById("account_input");
        accountEdit.style.borderTopWidth = "0";
        accountEdit.style.borderRightWidth = "0";
        accountEdit.style.borderLeftWidth = "0";
        let codeBtn = document.getElementById("code_input");
        codeBtn.style.borderTopWidth = "0";
        codeBtn.style.borderRightWidth = "0";
        codeBtn.style.borderLeftWidth = "0";
        _this = this;
        loading.close();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

/** 倒计时 **/
function myTimer() {
    if (countDownTime > 1) {
        countDownTime--;
        sendMessageBtn.style.color = gayColor;
        sendMessageBtn.innerHTML = countDownTime + "秒后重发";
    } else {
        myStopFunction();
    }
}

/** 停止倒计时 **/
function myStopFunction() {
    if (myVar !== null) {
        clearInterval(myVar);
        myVar = null;
        sendMessageBtn.style.color = blueColor;
        sendMessageBtn.innerHTML = "重新发送";
        countDownTime = 60;
        _this.countdownStatus = false;
    }
}