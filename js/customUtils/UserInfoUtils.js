let postData;
let commonUrl = "http://127.0.0.1:24/search/common";
let code;

/** oss创建文件 **/
function createFileInOss(phoneNumber) {
    let randomNum = 0;
    for (let i = 0; i < 10; i++) {
        randomNum = randomNum + Math.random() * 100000;
    }
    randomNum = parseInt(randomNum);
    postData = {url: "/API_quick1_20200107/setYzmFile", filename: randomNum};
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            console.log(response);
            postData = {url: "/APP_/sendcode", phone: phoneNumber, checkcode: randomNum};
            axios.post(commonUrl, Qs.stringify(postData))
                .then(function (response) {
                    console.log(response);
                    response.data.msg = response.data.msg.replace(/(^\s*)|(\s*$)/g, "")
                    let msg = JSON.parse(response.data.msg)
                    if (msg.status === 200) {
                        code = msg.data;
                    } else if (msg.status === 400) {
                        _this.$message.warning(msg.data);
                    } else {
                        _this.$message.warning(msg.data);
                    }
                })
                .catch(function (error) {
                });
        })
        .catch(function (error) {
            console.log(error);
        });
}

/** 发送邮箱验证码 **/
function sendEmailCode(email) {
    postData = {url: "/APP_/sendemail", email: email};
    axios.post("http://127.0.0.1:24/search/common", Qs.stringify(postData))
        .then(function (response) {
            response.data.msg = response.data.msg.replace(/(^\s*)|(\s*$)/g, "")
            let data = JSON.parse(response.data.msg);
            code = data.data.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

/** 账号验证
 * @param ufrom 账号来源(0英语还是1小学产品 ps:如果没发送这个参数默认就当英语的产品) 0：英语 1小学
 * @param loginType 账号类型(1:手机号 2:微信openid 3:邮箱账号 4:华为登陆)
 * @param wechatID 微信id
 * **/
function loginAccount(_this, account, yzm, loginType, wechatID) {
    const loading = _this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading'
    });
    if (code !== yzm) {
        _this.$message.error('请输入正确的验证码');
        loading.close();
        return;
    }
    postData = {url: "/user_/doulogin", account: account, unid: wechatID, logtp: loginType, ufrom: "1"};
    axios.post("http://127.0.0.1:24/search/common", Qs.stringify(postData))
        .then(function (response) {
            console.log(response);
            response.data.msg = response.data.msg.replace(/(^\s*)|(\s*$)/g, "")
            let data = JSON.parse(response.data.msg);
            setCookie("account", account, 30);
            setCookie("loginInfo", data.data, 30);
            let substring = data.intime;
            substring = substring.substring(substring.length - 1, substring.length);
            let decode;
            if (substring.length > 0) {
                let i = parseInt(substring);
                let substring1 = data.data.substring(0, i);
                let substring2 = data.data.substring(i + 1, data.data.length);
                decode =  window.atob(substring1 + substring2);
            }
            setCookie("loginId", decode, 30);
            let searchUrl = encodeURI("MenuActivity.html");
            window.location.replace(searchUrl);
        })
        .catch(function (error) {
            console.log(error);
        });
    loading.close();
}

/**判断是否是手机号**/
function isPhoneNumber(tel) {
    const reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
    return reg.test(tel);
}

/**判断是否是邮箱**/
function isEmail(email) {
    const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    return reg.test(email);
}

/**设置cookie**/
function setCookie(name, value, day) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
}

//获取cookie
function getCookie(cookieString, name) {
    const reg = RegExp(name + '=([^;]+)');
    const arr = cookieString.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
}

//删除cookie
function delCookie(name) {
    setCookie(name, null, -1);
}