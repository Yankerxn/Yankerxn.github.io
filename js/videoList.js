let commonUrl = "http://127.0.0.1:24/search/common";
let chooseBook;//选课文按钮
let chooseBookBgTrue;
let chooseBookBgFalse;
let bookVerValue;// 数据版本判别
let oldGrade = 0;
let oldTerm = 0;
let oldSelectedBookIndexId = 0;
let _this;
const Main = {
    data() {
        return {
            title_bg: '',
            title_text: '三年级下册',
            subtitle_text: '人教版',
            gradeIndex: '1',
            grade: 3,
            term: 2,
            selectedBookIndexId: 0,
            subjectId: 1,// 当前课程编号
            gradeListDirSelect: [{
                name: '一年级',
                terms: [{
                    id: '1',
                    name: "上册",
                    grade: 1,
                    term: 1,
                    status: false
                }, {
                    id: '2',
                    name: "下册",
                    grade: 1,
                    term: 2,
                    status: false
                }]
            }, {
                name: '二年级',
                terms: [{
                    id: '3',
                    name: "上册",
                    grade: 2,
                    term: 1,
                    status: false
                }, {
                    id: '4',
                    name: "下册",
                    grade: 2,
                    term: 2,
                    status: false
                }]
            }, {
                name: '三年级',
                terms: [{
                    id: '5',
                    name: "上册",
                    grade: 3,
                    term: 1,
                    status: false
                }, {
                    id: '6',
                    name: "下册",
                    grade: 3,
                    term: 2,
                    status: false
                }]
            }, {
                name: '四年级',
                terms: [{
                    id: '7',
                    name: "上册",
                    grade: 4,
                    term: 1,
                    status: false
                }, {
                    id: '8',
                    name: "下册",
                    grade: 4,
                    term: 2,
                    status: false
                }]
            }, {
                name: '五年级',
                terms: [{
                    id: '9',
                    name: "上册",
                    grade: 5,
                    term: 1,
                    status: false
                }, {
                    id: '10',
                    name: "下册",
                    grade: 5,
                    term: 2,
                    status: false
                }]
            }, {
                name: '六年级',
                terms: [{
                    id: '11',
                    name: "上册",
                    grade: 6,
                    term: 1,
                    status: false
                }, {
                    id: '12',
                    name: "下册",
                    grade: 6,
                    term: 2,
                    status: false
                }]
            }],
            dialogVisible: false,
            gradeListDirBooksSelect: "",
            versionList: "",
            gradeListDirBooks: {},
        };
    },
    methods: {
        // 选课文按下的点击事件
        onKeyDownChooseBook() {
            chooseBook.src = chooseBookBgFalse;
        },
        // 选课文抬起的点击事件
        onKeyUpChooseBook() {
            chooseBook.src = chooseBookBgTrue;
        },
        // 移出对象事件
        onKeyOverChooseBook() {
            chooseBook.src = chooseBookBgTrue;
        }, openGradeBookList() { // 打开书本选择弹窗
            _this = this;
            oldGrade = _this.grade;
            oldTerm = _this.term;
            _this.gradeIndex = String((((_this.grade - 1) * 2) + _this.term));
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading'
            });
            judgeVersion(_this);
            GetBook(_this, '');
            loading.close();
        }, cancelGradeBookList() { // 关闭书本选择弹窗
            _this = this;
            _this.dialogVisible = false;
            _this.grade = oldGrade;
            _this.term = oldTerm;
            _this.gradeIndex = String((((_this.grade - 1) * 2) + _this.term));
            _this.selectedBookIndexId = oldSelectedBookIndexId;
        }, submitGradeBookList() { // 提交书本选择
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading'
            });
            _this = this;
            _this.dialogVisible = false;
            oldGrade = _this.grade;
            oldTerm = _this.term;
            oldSelectedBookIndexId = _this.selectedBookIndexId;
            _this.gradeIndex = String((((_this.grade - 1) * 2) + _this.term));
            judgeVersion(_this);
            GetBooksData(_this, '');
            loading.close();
        }, selectSheet(id, grade, term) { // 选择书册
            _this = this;
            _this.gradeIndex = id;
            _this.grade = grade;
            _this.term = term;
            let list = _this.gradeListDirBooksSelect[_this.grade - 1][_this.term - 1];
            if (list.length > 0) {
                _this.selectedBookIndexId = list[0].bid;
                _this.subtitle_text = list[0].ename;
            }
            _this.versionList = list;
        }, selectBook(id, name) { // 选择书本
            _this = this;
            _this.selectedBookIndexId = id;
            _this.subtitle_text = name;
        }, selectVideo(item) {
            // 跳转到视频播放页面并携带参数标题&视频id
            const searchUrl = encodeURI("VideoPlayActivity.html?title=" + item.name + "&id=" + item.nid);
            // window.location.replace(searchUrl);
            window.location.href = searchUrl;
        }, btnCloseWindow() {
            // 关闭当前窗口
            window.history.go(-1);
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        _this = this;
        // 获取url数据
        GetRequest(_this);
        // 初始化视频列表
        judgeVersion(_this);
        GetBook(_this, 'Preloading');
        loading.close();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

function GetRequest(_this) {
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
    oldGrade = _this.grade;
    oldTerm = _this.term;
    _this.subjectId = parseInt(theRequest.subjectId);// 0英语 1语文 2数学
    // 选课文的按钮
    chooseBook = document.getElementById("choose_book_img");
    if (_this.subjectId === 0) {
        chooseBookBgTrue = "images-video/english_choose_book1.png";
        chooseBookBgFalse = "images-video/english_choose_book2.png";
        document.getElementById("title_bg").src = 'images-video/english_title_bg.png';
    } else if (_this.subjectId === 1) {
        chooseBookBgTrue = "images-video/chinese_choose_book1.png";
        chooseBookBgFalse = "images-video/chinese_choose_book2.png";
        document.getElementById("title_bg").src = 'images-video/chinese_title_bg.png';
    } else {
        chooseBookBgTrue = "images-video/math_choose_book1.png";
        chooseBookBgFalse = "images-video/math_choose_book2.png";
        document.getElementById("title_bg").src = 'images-video/math_title_bg.png';
    }
    chooseBook.src = chooseBookBgTrue;
}

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['qu'] = 'quick';
// axios.defaults.headers.post['ver'] = '1.3.5';
// axios.defaults.headers.post['baoid'] = 'com.feiyi.middlequick';
// 获取书册列表
function GetBook(_this, type) {
    const postData = {url: '/feiyiweb/getbooks_group_nj', xl: 0, km: _this.subjectId, bookver: bookVerValue, from: 400};
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            let msg = JSON.parse(response.data.msg);
            _this.gradeListDirBooksSelect = msg.books;
            let list = _this.gradeListDirBooksSelect[_this.grade - 1][_this.term - 1];
            if (list.length > 0 && _this.selectedBookIndexId === 0) {
                _this.selectedBookIndexId = list[0].bid;
                oldSelectedBookIndexId = list[0].bid;
                _this.subtitle_text = list[0].ename;
            }
            _this.versionList = list;
            if (type === 'Preloading') {
                GetBooksData(_this, type);
            }
            return true;
        })
        .catch(function (error) {
            console.log(error);
            return false;
        });
}

// 获取书册列表的详情（视频）
function GetBooksData(_this, type) {
    if (type === 'Preloading') {
        _this.selectedBookIndexId = 0;
    }
    let postData = {url: '/feiyiweb/getnavdata', bid: oldSelectedBookIndexId, ntp: 0};
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            let msg = JSON.parse(response.data.msg);
            _this.gradeListDirBooks = msg.navdata;
            _this.gradeIndex = String((((_this.grade - 1) * 2) + _this.term));
            let index = parseInt(_this.gradeIndex);
            _this.title_text = _this.gradeListDirSelect[Math.ceil(index / 2) - 1].name
                + _this.gradeListDirSelect[Math.ceil(index / 2) - 1].terms[parseInt(oldTerm) - 1].name;
            document.getElementById("title").innerHTML = _this.title_text;
            document.getElementById("subtitle").innerHTML = _this.subtitle_text;
            for (let i = 0; i < msg.navdata.length; i++) {
                // 存在多课时
                if (msg.navdata[i].children.length > 0) {
                    for (let j = 0; j < msg.navdata[i].children.length; j++) {
                        if (msg.navdata[i].children[j].videocover.length > 0) {
                            msg.navdata[i].children[j].videocover = msg.navdata[i].children[j].videocover[0];
                        } else if (msg.navdata[i].videocover.length > 0) {
                            msg.navdata[i].children[j].videocover = msg.navdata[i].videocover[0];
                        }
                    }
                } else {
                    if (msg.navdata[i].videocover.length > 0) {
                        msg.navdata[i].videocover = msg.navdata[i].videocover[0];
                    } else {
                        msg.navdata[i].videocover = '';
                    }
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 确认版本
function judgeVersion(_this) {
    if (_this.subjectId === 0) {
        bookVerValue = 2;
    } else if (_this.subjectId === 1) {
        bookVerValue = 2;
    } else if (_this.subjectId === 2) {
        bookVerValue = '';
    }
}