let commonUrl = "http://127.0.0.1:24/search/common";
let _this;
const Main = {
    data() {
        return {
            title_bg: '',
            title_text: '三年级下册',
            subtitle_text: '人教版',
            listData: [],
            subjectId: 0,
            checkedMessage: "选择0课共0个词"
        };
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            window.history.go(-1);
        },
        // 选择生字生词
        clickCheckBox(item, position) {
            if (_this.listData !== null) {
                if (position === 2) {
                    _this.listData[item.position].checkedCi = !_this.listData[item.position].checkedCi;
                } else {
                    _this.listData[item.position].checkedZi = !_this.listData[item.position].checkedZi;
                }
                calculationNumber(_this);
            }
        },
        openGradeBookList() {
            let searchUrl = encodeURI("ChooseBookActivity.html");
            window.location.href = encodeURI(searchUrl);
        }, checkAll() {
            let isCheckedAll = true;
            for (let i = 0; i < _this.listData.length; i++) {
                if (_this.listData[i].checkedCi === false && _this.listData[i].chineseData != null
                    || _this.listData[i].checkedZi === false && _this.listData[i].wordData != null) {
                    isCheckedAll = false;
                    break;
                }
            }
            for (let i = 0; i < _this.listData.length; i++) {
                if (_this.listData[i].chineseData != null) {
                    _this.listData[i].checkedCi = !isCheckedAll;
                }
                if (_this.listData[i].wordData != null) {
                    _this.listData[i].checkedZi = !isCheckedAll;
                }
            }
            if (isCheckedAll) {
                _this.checkedMessage = "选择0课共0个词";
            } else {
                calculationNumber(_this);
            }
        }, startStudy() {
            let noCheckAnyWord = true;
            for (let i = 0; i < _this.listData.length; i++) {
                if (_this.listData[i].checkedCi === true || _this.listData[i].checkedZi === true) {
                    noCheckAnyWord = false;
                    break;
                }
            }
            if (!noCheckAnyWord) {
                localStorage.setItem("comingType", '');
                localStorage.setItem("menuData", JSON.stringify(_this.listData));
                window.location.href = encodeURI("ListeningStudyActivity.html");
            } else {
                this.$message.warning('请至少选择一课');
            }
        }
    },
    mounted() {
        _this = this;
        createOssClient();
        getMenuData(_this);
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

function getMenuData(_this) {
    // 判断是语文还是英语
    _this.subjectId = parseInt(getCookie(document.cookie, "subjectId"));
    // 省略oss数据操作
    let response = localStorage.getItem("menuData");
    let data = JSON.parse(response);
    for (let i = 0; i < data.length; i++) {
        data[i]["checkedCi"] = false;
        data[i]["checkedZi"] = false;
        data[i]["position"] = i;
    }
    _this.listData = data;
}

function calculationNumber(_this) {
    let number = 0;
    let checkNumber = 0;
    for (let i = 0; i < _this.listData.length; i++) {
        if (_this.listData[i].checkedCi === true && _this.listData[i].chineseData != null) {
            number += _this.listData[i].chineseData.length;
        }
        if (_this.listData[i].checkedZi === true && _this.listData[i].wordData != null) {
            number += _this.listData[i].wordData.length;
        }
        if (_this.listData[i].checkedCi === true || _this.listData[i].checkedZi === true) {
            checkNumber++;
        }
    }
    _this.checkedMessage = "选择" + checkNumber + "课共" + number + "个词";
}