let commonUrl = "http://127.0.0.1:24/search/common";
let _this;
let oldSelectedBookIndexId;
const Main = {
    data() {
        return {
            subjectId: 11,
            title_text: '',
            title_bg: '',
            title_color: '',
            gradeListDirBooksSelect: [],
            selectedIndex: 0,
            gradeListDirBooks: {}
        };
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            window.history.go(-1);
        },
        selectedTypeIndex(index, id) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading'
            });
            _this.selectedIndex = index;
            oldSelectedBookIndexId = id;
            GetBooksData(_this);
            loading.close();
        }, selectVideo(item) {
            // 跳转到视频播放页面并携带参数标题&视频id
            window.location.href = encodeURI("VideoPlayActivity.html?title=" + item.name + "&id=" + item.nid + "&type=basic");
        }
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        _this = this;
        GetRequest(_this);
        GetBook(_this, 'Preloading');
        checkVip();
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
    _this.subjectId = parseInt(theRequest.subjectId);
    _this.title_bg = "images-video/banner" + _this.subjectId + ".png";
    let colors = ["#48843e", "#f5b620", "#f4dea6", "#d4f3ff", "#caeaff", "#f6f6f6", "#103572", "#c5e5f7", "#ffffff", "#fcf5dc", "#00659a", "#72c6dd"];
    let titles = ["奥数", "作文", "国学", "唐诗", "安全", "礼仪", "科学", "英语", "单词", "汉字", "儿歌", "故事"];
    _this.title_color = colors[_this.subjectId - 11];
    _this.title_text = titles[_this.subjectId - 11];
}

function GetBook(_this, type) {
    const postData = {url: '/feiyiweb/getbooks_group_nj', xl: 0, km: _this.subjectId, from: 400};
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            let msg = JSON.parse(response.data.msg);
            let content = msg.books;
            for (let i = 0; i < content.length; i++) {
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < content[i][j].length; k++) {
                        _this.gradeListDirBooksSelect.push(content[i][j][k]);
                    }
                }
            }
            if (type === 'Preloading') {
                if (_this.gradeListDirBooksSelect.length !== 0) {
                    oldSelectedBookIndexId = _this.gradeListDirBooksSelect[0].bid;
                }
                GetBooksData(_this, type);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 获取书册列表的详情（视频）
function GetBooksData(_this, type) {
    if (type === 'Preloading') {
        _this.selectedIndex = 0;
    }
    let postData = {url: '/feiyiweb/getnavdata', bid: oldSelectedBookIndexId, ntp: 0};
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            let msg = JSON.parse(response.data.msg);
            _this.gradeListDirBooks = msg.navdata;
            for (let i = 0; i < msg.navdata.length; i++) {
                if (msg.navdata[i].videocover.length > 0) {
                    msg.navdata[i].videocover = msg.navdata[i].videocover[0];
                } else {
                    msg.navdata[i].videocover = '';
                }
            }
            console.log(msg);
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