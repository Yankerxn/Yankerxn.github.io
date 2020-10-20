let commonUrl = "http://127.0.0.1:24/search/common";
let loginInfo;
let _this;
let postData;
const Main = {
    data() {
        return {
            activeName: 'first',
            input: '',
            buyTime: '',
            courseName: '',
            buyMoney: ''
        }
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            // window.history.go(-1);
            window.location.href = encodeURI("SettingActivity.html");
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleSearch() {
            // 查询
            if (_this.input === '') {
                this.$message({
                    message: '订单号不能为空',
                    type: 'warning'
                });
            } else {
                queryBuyInfo();
            }
        },
        handleBindBuyInfo(){
            recoverBuyInfo();
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

function queryBuyInfo() {
    postData = {url: "/APP_/getuserbuy", ordern: _this.input};
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            response.data.msg = response.data.msg.replace(/(^\s*)|(\s*$)/g, "")
            let data = JSON.parse(response.data.msg);
            if (data.status === 200) {
                document.getElementById("getOrderView").style.display = "none";
                document.getElementById("bindOrderView").style.display = "";
                _this.buyTime = data.data.time;
                _this.courseName = data.data.classname;
                _this.buyMoney = data.data.price;
            }else {
                _this.$message({
                    message: '未查询到关联订单号',
                    type: 'warning'
                });
            }
        })
        .catch(function (error) {
            console.log(error);
            _this.$message({
                message: '网络异常',
                type: 'warning'
            });
        })
}

// 通过订单号绑定付费信息
function recoverBuyInfo() {
    let loginInfo = getCookie(document.cookie,"loginId");
    if (loginInfo === ''){
        showMessage();
    }else {
        postData = {url: "/Pay_ret/banguserbuy_ordern_v2", uid: loginInfo, ordern: _this.input};
        axios.post(commonUrl, Qs.stringify(postData))
            .then(function (response) {
                response.data.msg = response.data.msg.replace(/(^\s*)|(\s*$)/g, "");
                let data = JSON.parse(response.data.msg);
                if (data.status === 200){
                    _this.$message({
                        message: '绑定成功',
                        type: 'success'
                    });
                    window.location.href = encodeURI("SettingActivity.html");
                }else {
                    _this.$message({
                        message: '绑定失败',
                        type: 'warning'
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
                _this.$message({
                    message: '网络异常',
                    type: 'warning'
                });
            });
    }
}

// 消息弹窗
function showMessage() {
    const h = _this.$createElement;
    _this.$msgbox({
        title: '未登录',
        message: h('p', null, [
            h('span', null, '首先登陆，才能绑定已购买的课程！ '),
            h('i', {style: 'color: teal'}, '')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                done();
            } else {
                done();
            }
        }
    }).then(action => {
        if (action === 'confirm') {
            window.location.href = encodeURI("LoginActivity.html");
        }
    }).catch(function (error) {
        console.log(error);
    });
}
