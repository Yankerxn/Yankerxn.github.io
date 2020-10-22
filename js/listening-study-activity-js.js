let commonUrl = "http://127.0.0.1:24/search/common";
let _this;
let canvas = document.getElementById('canvas');
let context = canvas.getContext("2d");
let isDraw = false; //定义变量控制画笔是否可用
let movePos;         //定义变量存放初始画笔开始位置
// 播放器
let audioPlayer;
// 听写类型
let typeMark = "eng";
// 是否二次进入
let twiceAdd = true;
// 单段播放次数
let numberOfTimes = 2;
let nid = "1107";
let scrollView, listeningCTypeView, listeningPTypeView, settingWindowView;
const Main = {
    data() {
        return {
            subtitle_text: '',
            wordList: [],
            nowListeningWordPosition: 1,
            isPlaying: false,
            listeningTypeText: "我想写在纸上",
            listeningType: "p",
            autoPlayMode: false,
            languageMode: true,
            orderMode: false,
            switchWidth: 50,
            autoPlayTimesText: "播放次数",
            speckingCount: 2
        };
    },
    methods: {
        btnCloseWindow() {
            localStorage.setItem("menuData", JSON.stringify(_this.wordList));
            window.location.href = encodeURI("ListeningActivity.html");
        },
        checkItem(item) {
            // clearDraw();
            // _this.nowListeningWordPosition = item.position;
        },
        controlClick(type) {
            mediaPlayerNext(type);
        },
        listeningTypeChange() {
            showListeningTypeChangeWindow();
        }, handlerAutoPlayModeChange(status) {
            // 限时听写
            _this.autoPlayMode = status;
        }, handlerLanguageModeChange(status) {
            _this.languageMode = status;
        }, handlerOrderModeChange(status) {
            _this.orderMode = status;
        }, handlerAutoTimes(progress) {
            _this.speckingCount = progress;
            _this.autoPlayTimesText = "播放次数(" + progress + ")";
        }, handlerCloseSettingWindow() {
            settingWindowView.style.display = "none";
            _this.autoPlayMode = localStorage.getItem("autoPlayMode") === "true";
            _this.speckingCount = parseInt(localStorage.getItem("speckingCount"));
        }, handlerPositiveSettingWindow() {
            settingWindowView.style.display = "none";
            localStorage.setItem("autoPlayMode", _this.autoPlayMode);
            localStorage.setItem("speckingCount", _this.speckingCount);
        }, handlerShowSettingWindow() {
            settingWindowView.style.display = "block";
        }
    },
    mounted() {
        _this = this;
        initData();
        setInitData();
        draw();
        showListeningTypeWindow();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

/**
 * 初始化单词数据
 */
function initData() {
    scrollView = document.getElementById("noticeListBox");
    listeningCTypeView = document.getElementById("listening_c");
    listeningPTypeView = document.getElementById("listening_p");
    settingWindowView = document.getElementById("setting_window");
    let comingType = localStorage.getItem("comingType");
    let words = localStorage.getItem("menuData");
    let temporary;
    if (comingType === '') {
        words = JSON.parse(words);
        let strings = "[";
        let string = '';
        let subStartPosition = 0;
        for (let i = 0; i < words.length; i++) {
            if (words[i].checkedCi === true || words[i].checkedZi === true) {
                if (words[i].checkedCi === true) {
                    if (string !== '') {
                        subStartPosition = 1;
                    } else {
                        subStartPosition = 0;
                    }
                    string += JSON.stringify(words[i].chineseData).substring(subStartPosition, JSON.stringify(words[i].chineseData).length - 1) + ",";
                }
                if (words[i].checkedZi === true) {
                    if (string !== '') {
                        subStartPosition = 1;
                    } else {
                        subStartPosition = 0;
                    }
                    string += JSON.stringify(words[i].wordData).substring(subStartPosition, JSON.stringify(words[i].wordData).length - 1) + ",";
                }
                strings += string.substring(1, string.length - 1);
                strings += ",";
                if (_this.subtitle_text === '' || _this.subtitle_text === null) {
                    _this.subtitle_text = words[i].name;
                }
            }
        }
        strings = strings.substring(0, strings.length - 1);
        strings += "]";
        temporary = JSON.parse(strings);
    } else {
        temporary = JSON.parse(words);
        if (_this.subtitle_text === '' || _this.subtitle_text === null) {
            _this.subtitle_text = temporary[0].subtitle;
        }
    }
    for (let i = 0; i < temporary.length; i++) {
        temporary[i]["position"] = i + 1;
        temporary[i]["cSrc"] = "";
        temporary[i]["touching"] = "0";
        if (temporary[i]["kw"].length > 1) {
            if (comingType === '') {
                temporary[i]["voiceUrl"] = "resource/" + temporary[i]["voiceUrl"];
            }
        }
    }
    _this.wordList = temporary;
    _this.wordList[0]["subtitle"] = _this.subtitle_text;
    _this.wordList[0]["duration"] = '';
    _this.wordList[0]["allData"] = '';
    console.log(_this.wordList);
    // 初始化播放
    audioPlayer = document.getElementById("audio_player");
    audioPlayer.addEventListener("ended", function () {   //当播放完一首歌曲时也会触发
        console.log("event ended: " + (new Date()).getTime());
    });
    audioPlayer.addEventListener("timeupdate", function () {
        if (_this.isPlaying) {
            if (_this.nowListeningWordPosition !== _this.wordList.length &&
                audioPlayer.currentTime >= parseFloat(_this.wordList[_this.nowListeningWordPosition].time)) {
                if (_this.nowListeningWordPosition < _this.wordList.length) {
                    audioPlayer.pause();
                    // 需要跳转到下一曲
                    twiceAdd = true;
                    if (numberOfTimes > 1) {
                        numberOfTimes--;
                        audioPlayer.currentTime = parseFloat(_this.wordList[_this.nowListeningWordPosition - 1].time);
                        audioPlayer.play();
                    } else {
                        setTimeout(function () {
                            if (twiceAdd) {
                                twiceAdd = false;
                                numberOfTimes = _this.speckingCount;
                                if (_this.autoPlayMode) {
                                    _this.nowListeningWordPosition++;
                                    saveToList();
                                    audioPlayer.play();
                                }
                            }
                        }, 1000);
                    }
                }
            }
        }
    });
    if (typeMark === "eng") {
        if (_this.wordList != null) {
            if (audioPlayer.src !== _this.wordList[_this.nowListeningWordPosition].voiceUrl) {
                audioPlayer.src = _this.wordList[_this.nowListeningWordPosition].voiceUrl;
            } else {
                audioPlayer.currentTime = parseFloat(_this.wordList[_this.nowListeningWordPosition].time);
            }
        }
    }
}

/**
 * 初始化画布
 */
function draw() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 300;
    context.strokeStyle = "#7878ff";
    context.lineWidth = 10;
    context.beginPath();
    // context.strokeRect(0, 0, 300, 300);
    //设置画笔颜色，宽度
    context.strokeStyle = "#7878ff";
    context.lineWidth = 1;
    //使线段连续，圆滑
    context.lineCap = "round";
    context.lineJoin = "round";
    // drawDashedLine(context, 0, 0, 500, 500);
    // drawDashedLine(context, 0, 500, 500, 0);
    // drawDashedLine(context, 0, 150, 300, 150);
    // drawDashedLine(context, 150, 0, 150, 300);
    // drawLine(context, 0, 250, 500, 250);
    // drawLine(context, 250, 0, 250, 500);

    //鼠标点下
    canvas.onmousedown = function (e) {
        isDraw = true;
        movePos = getPos(e.clientX, e.clientY);
        drawing(e);
    };
    //鼠标移动
    canvas.onmousemove = function (e) {
        drawing(e);
    };
    //鼠标松开
    canvas.onmouseup = function (e) {
        isDraw = false;
    };
    //鼠标离开
    canvas.onmouseout = function (e) {
        isDraw = false;
    };
}

//画虚线（参照网上大神）
function drawDashedLine(context, x1, y1, x2, y2, dashLength) {
    dashLength = dashLength === undefined ? 5 : dashLength;
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
    for (let i = 0; i < numDashes; ++i) {
        context[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);
    }
    context.stroke();
}

//画直线
function drawLine(context, x1, y1, x2, y2) {
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

//获取鼠标相对与canvas位置
function getPos(x, y) {
    const box = canvas.getBoundingClientRect();
    return {x: x - box.left, y: y - box.top};
}

//画笔
function drawing(e) {
    if (isDraw) {
        const position = getPos(e.clientX, e.clientY);
        context.strokeStyle = '#333';
        context.lineWidth = 10;
        context.save();
        context.beginPath();
        context.moveTo(movePos.x, movePos.y);
        context.lineTo(position.x, position.y);
        context.stroke();
        movePos = position;
        context.restore();
    }
}

//清除
function clearDraw() {
    context.clearRect(0, 0, 500, 500);
    draw();
}

function saveToList() {
    const image = canvas.toDataURL("image/png");
    clearDraw();
    _this.wordList[_this.nowListeningWordPosition - 2]["cSrc"] = image.toString();
}

function mediaPlayerNext(type) {
    switch (type) {
        case 0:
            if (!_this.isPlaying) {
                return;
            }
            scrollView.scrollBy(-120, 0);
            // 上一个音频
            if (_this.nowListeningWordPosition > 1) {
                _this.nowListeningWordPosition--;
                if (_this.nowListeningWordPosition !== _this.wordList.length - 1 && _this.wordList[_this.nowListeningWordPosition + 1].voiceUrl !== _this.wordList[_this.nowListeningWordPosition].voiceUrl) {
                    audioPlayer.src = _this.wordList[_this.nowListeningWordPosition].voiceUrl;
                } else {
                    audioPlayer.currentTime = parseFloat(_this.wordList[_this.nowListeningWordPosition - 1].time);
                    if (_this.isPlaying) {
                        audioPlayer.play();
                    }
                }
                clearDraw();
            }
            break;
        case 1:
            if (!_this.isPlaying) {
                _this.isPlaying = true;
                if (_this.wordList[0].duration === '' || _this.wordList[0].duration === null) {
                    _this.wordList[0].duration = new Date().getTime();
                }
                audioPlayer.play();
                audioPlayer.currentTime = parseFloat(_this.wordList[_this.nowListeningWordPosition - 1].time);
            } else {
                _this.isPlaying = false;
                audioPlayer.pause();
            }
            break;
        case 2:
            if (!_this.isPlaying) {
                return;
            }
            if (_this.nowListeningWordPosition % 4 === 0) {
                scrollView.scrollTo(_this.nowListeningWordPosition * 120, 0);
            }
            // 下一个音频
            if (_this.nowListeningWordPosition < _this.wordList.length) {
                _this.nowListeningWordPosition++;
                if (_this.nowListeningWordPosition !== _this.wordList.length && _this.wordList[_this.nowListeningWordPosition - 1].voiceUrl !== _this.wordList[_this.nowListeningWordPosition].voiceUrl) {
                    audioPlayer.src = _this.wordList[_this.nowListeningWordPosition].voiceUrl;
                } else if (_this.nowListeningWordPosition === _this.wordList.length) {
                    // 结束并跳转至统计页面
                } else {
                    audioPlayer.currentTime = parseFloat(_this.wordList[_this.nowListeningWordPosition - 1].time);
                    if (_this.isPlaying) {
                        audioPlayer.play();
                    }
                }
                saveToList();
            }
            break;
        case 3:
            // 结束
            _this.wordList[0].duration = new Date().getTime() - parseInt(_this.wordList[0].duration);
            _this.nowListeningWordPosition++;
            saveToList();
            localStorage.setItem("menuData", JSON.stringify(_this.wordList));
            localStorage.setItem("comingType", 'back');
            window.location.href = encodeURI("ListeningCompleteActivity.html");
            break;
        case 4:
            // 跳转到文件上传页
            _this.wordList[0].duration = new Date().getTime() - parseInt(_this.wordList[0].duration);
            _this.nowListeningWordPosition++;
            saveToList();
            localStorage.setItem("comingType", 'back');
            localStorage.setItem("menuData", JSON.stringify(_this.wordList));
            window.location.href = encodeURI("ListeningUpLoadFileActivity.html");
            break;
    }
}

/**
 * 切换模式弹窗
 */
function showListeningTypeChangeWindow() {
    const h = _this.$createElement;
    _this.$msgbox({
        title: '提示',
        message: h('p', null, [
            h('span', null, '是否切换听写方式 ')
        ]),
        showCancelButton: true,
        confirmButtonText: '重新开始',
        cancelButtonText: '继续听写',
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                changeListeningType();
            }
            done();
        }
    }).then(action => {
    }, () => {
        // 继续听写
    });
}

/**
 * 第一次选择听写方式
 */
function showListeningTypeWindow() {
    let listeningWordsType = localStorage.getItem("listeningWordsType");
    console.log("data" + listeningWordsType);
    localStorage.setItem("listeningWordsType", null);
    if (listeningWordsType === null) {
        _this.autoPlayTimesText = "播放次数(" + _this.speckingCount + ")";
        _this.$confirm('请选择听写模式', '提示', {
            confirmButtonText: '写在电脑上',
            cancelButtonText: '写在纸上',
            center: true
        }).then(() => {

        }).catch(() => {
            _this.listeningType = 'p';
            changeListeningType();
        });
    } else {
        if (listeningWordsType === 'c') {
            _this.listeningType = 'p';
            changeListeningType();
        }
    }
}

/**
 * 改变听写模式
 */
function changeListeningType() {
    if (_this.listeningType === 'c') {
        _this.listeningType = 'p';
        listeningCTypeView.style.display = 'block';
        listeningPTypeView.style.display = 'none';
        _this.listeningTypeText = "我想写在纸上";
    } else {
        _this.listeningType = 'c';
        listeningCTypeView.style.display = 'none';
        listeningPTypeView.style.display = 'block';
        _this.listeningTypeText = "我想写在电脑上";
    }
}

/** 设置基础数据 **/
function setInitData() {
    if (localStorage.getItem("autoPlayMode") === null) {
        localStorage.setItem("autoPlayMode", "false");
    }
    if (localStorage.getItem("speckingCount") === null) {
        localStorage.setItem("speckingCount", "2");
    }
    _this.autoPlayMode = localStorage.getItem("autoPlayMode") === "true";
    _this.speckingCount = parseInt(localStorage.getItem("speckingCount"));
}