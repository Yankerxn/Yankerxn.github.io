let commonUrl = "http://127.0.0.1:24/search/common";
let _this;
let bookVerValue;// 数据版本判别
let oldGrade, oldTerm, oldSelectedBookIndexId;
const Main = {
    data() {
        return {
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
            versionList: "",
        };
    },
    methods: {
        cancelGradeBookList() { // 关闭书本选择弹窗
            setCookie2("grade" + _this.subjectId, oldGrade);
            setCookie2("term" + _this.subjectId, oldTerm);
            setCookie2("selectedBookIndexId" + _this.subjectId, oldSelectedBookIndexId);
            // 关闭当前窗口
            window.history.go(-1);
        }, submitGradeBookList() { // 提交书本选择
            setCookie2("grade" + _this.subjectId, _this.grade);
            setCookie2("term" + _this.subjectId, _this.term);
            setCookie2("selectedBookIndexId" + _this.subjectId, _this.selectedBookIndexId);
            // 关闭当前窗口
            window.history.go(-1);
        }, selectSheet(id, grade, term) { // 选择书册
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
            _this.selectedBookIndexId = id;
            _this.subtitle_text = name;
        }
    },
    mounted() {
        _this = this;
        _this.subjectId = parseInt(getCookie(document.cookie, "subjectId"));
        // 初始化数据
        _this.grade = parseInt(getCookie(document.cookie, "grade" + _this.subjectId));
        _this.term = parseInt(getCookie(document.cookie, "term" + _this.subjectId));
        _this.selectedBookIndexId = getCookie(document.cookie, "selectedBookIndexId" + _this.subjectId);
        console.log(_this.selectedBookIndexId);
        oldSelectedBookIndexId = _this.selectedBookIndexId;
        judgeVersion(_this);
        oldGrade = _this.grade;
        oldTerm = _this.term;
        _this.gradeIndex = String((((_this.grade - 1) * 2) + _this.term));
        GetBook(_this);
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

// 获取书册列表
function GetBook(_this) {
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
            return true;
        })
        .catch(function (error) {
            console.log(error);
            return false;
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