//设置cookie
function setCookie(name, value, day) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
}

//设置cookie
function setCookie2(name, value) {
    setCookie(name,value,365);
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