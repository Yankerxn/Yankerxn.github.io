let commonUrl = "http://127.0.0.1:24/search/orc_test";
let _this;
const Main = {
    data() {
        return {
            subtitle_text: '0',
            countWord: 0,
            correct: "0",
            error: "0",
            time: "00'00",
            title: "",
            wordList: [],
            subjectId: 0
        };
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            // let searchUrl = encodeURI("ListeningActivity.html?grade=" + grade + "&term=" + term + "&subjectId=" + subjectId);
            // window.location.href = encodeURI(searchUrl);
            window.history.go(-1);
        }
    },
    mounted() {
        _this = this;
        getUrlData();
        initData();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

function initData() {
    // 判断是语文还是英语
    _this.subjectId = parseInt(getCookie(document.cookie, "subjectId"));
    // 省略oss数据操作
    let response = localStorage.getItem("menuData");
    _this.wordList = JSON.parse(response);
    _this.title = _this.wordList[0].subtitle;
    _this.countWord = _this.wordList.length;
    let timeMinute = parseInt(_this.wordList[0].duration / 1000 / 60);
    if (timeMinute < 10) {
        timeMinute = "0" + timeMinute.toString();
    }
    let timeSecond = parseInt(_this.wordList[0].duration / 1000 % 60);
    if (timeSecond < 10) {
        timeSecond = "0" + timeSecond.toString();
    }
    _this.time = timeMinute + "'" + timeSecond;
    distinguishImage();
}

/**
 * 文字识别
 */
function distinguishImage() {
    if (_this.wordList[0].allData !== '') {
        // 有拍照数据
        let postData = {cSrc: _this.wordList[0].allData};
        dataHandler(postData);
    } else {
        // 合并多图
        let newCanvas = document.createElement("canvas");
        newCanvas.width = 800;
        newCanvas.height = (parseInt(_this.wordList.length / 8) + 1) * 100;
        let newContext = newCanvas.getContext("2d");
        for (let i = 0, j = 0; i < _this.wordList.length; i++) {
            if (((i + 1) % 8) === 0) {
                j++;
            }
            let img = new Image();
            img.crossOrigin = '';
            img.src = _this.wordList[i].cSrc;
            img.onload = () => {
                newContext.drawImage(img, (i - j * 8) * 100, j * 100, 100, 100);
                if (i === _this.wordList.length - 1) {
                    let string = newCanvas.toDataURL("image/png");
                    let postData = {cSrc: string};
                    dataHandler(postData);
                }
            }
        }
    }
}

function dataHandler(postData) {
    axios.post(commonUrl, Qs.stringify(postData))
        .then(function (response) {
            let msg = JSON.parse(response.data.msg);
            msg = msg.data.block;
            let string = '';
            for (let i = 0; i < msg.length; i++) {
                let lineData = msg[i].line;
                for (let j = 0; j < lineData.length; j++) {
                    let words = lineData[j].word;
                    for (let k = 0; k < words.length; k++) {
                        string += words[k].content;
                    }
                }
            }
            string = string.replace(",", "");
            let error = _this.countWord;
            for (let i = 0; i < _this.wordList.length; i++) {
                if (string.indexOf(_this.wordList[i].kw) !== -1) {
                    _this.wordList[i]["correct"] = true;
                    error--;
                } else {
                    _this.wordList[i]["correct"] = false;
                }
            }
            _this.error = error;
            _this.correct = _this.countWord - error;
            _this.subtitle_text = parseInt( _this.correct / _this.countWord * 100);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getUrlData() {
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
}