let baseUrl = 'http://cp.feiyien.com/';
let htmlType = '0'; // 0英语 1中文 2数学
let chooseBook;
let chooseBookBgTrue;
let chooseBookBgFalse;
let bookVerValue;// 数据版本判别
let subjectId = '1'; // 当前课程编号
const Main = {
    data() {
        return {
            title_bg: '',
            title_text: '三年级下册',
            subtitle_text: '人教版',
            gradeIndex: '1',
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
            dialogVisible: false
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
        },
        checkGrade(id) { // 选中年级和书册
            let _this = this;
            _this.gradeIndex = id;
            if (subjectId == 1 || subjectId == 0) {
                bookVerValue = 2;
            } else {
                bookVerValue = '';
            }
            const postData = "{ \"xl\":0,\"km\":\"" + subjectId + "\",\"bookver\":" + bookVerValue + "\",\"from\":400 }";

            axios.post(baseUrl+'feiyiweb/getbooks_group_nj', postData)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, getSelectBookList() {

        }
    },
    mounted() {
        // 选课文的按钮
        chooseBook = document.getElementById("choose_book_img");
        chooseBook.src = "images-video/chinese_choose_book1.png";
        const url = location.search;
        console.log(url);
        htmlType = '0';
        if (htmlType === '0') {
            chooseBookBgTrue = "images-video/chinese_choose_book1.png";
            chooseBookBgFalse = "images-video/chinese_choose_book2.png";
        } else if (htmlType === '1') {
            chooseBookBgTrue = "images-video/english_choose_book1.png";
            chooseBookBgFalse = "images-video/english_choose_book2.png";
        } else {
            chooseBookBgTrue = "images-video/math_choose_book1.png";
            chooseBookBgFalse = "images-video/math_choose_book2.png";
        }
        //--------------------
        document.getElementById("title").innerHTML = this.title_text;
        document.getElementById("subtitle").innerHTML = this.subtitle_text;
    },
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');