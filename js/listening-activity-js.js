let _this, audioPlayer;
const Main = {
    data() {
        return {
            submitTitle: '测试',
            submitTitleBody: '0个词汇',
            wordList: [],
            nowListeningWordPosition: 0
        };
    },
    methods: {
        btnCloseWindow() {
            // 关闭当前窗口
            let searchUrl = encodeURI("VideoListActivity.html");
            window.location.href = encodeURI(searchUrl);
        },
        startChooseActivity() {
            let searchUrl = encodeURI("ChooseBookActivity.html");
            window.location.href = encodeURI(searchUrl);
        },
        handlerPaperListening() {
            localStorage.setItem("listeningWordsType", "p");
            localStorage.setItem("comingType", 'back');
            window.location.href = encodeURI("ListeningStudyActivity.html");
        },
        handlerCompleteListening() {
            localStorage.setItem("listeningWordsType", "c");
            localStorage.setItem("comingType", 'back');
            window.location.href = encodeURI("ListeningStudyActivity.html");
        },
        handlerTouchingItem(position) {
            if (_this.wordList[_this.nowListeningWordPosition]["touching"] === "1"){
                return;
            }
            _this.nowListeningWordPosition = position - 1;
            _this.wordList[_this.nowListeningWordPosition]["touching"] = "1";
            audioPlayer.src = _this.wordList[_this.nowListeningWordPosition].voiceUrl;
            if (_this.nowListeningWordPosition !== 0 &&
                _this.wordList[_this.nowListeningWordPosition].voiceUrl
                === _this.wordList[_this.nowListeningWordPosition - 1].voiceUrl) {
                audioPlayer.currentTime = parseFloat(_this.wordList[_this.nowListeningWordPosition].time);
                audioPlayer.play();
            } else {
                audioPlayer.play();
            }
        }
    },
    mounted() {
        _this = this;
        GetRequest();

    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

function GetRequest() {
    let words = localStorage.getItem("menuData");
    _this.wordList = JSON.parse(words);
    _this.submitTitle = _this.wordList[0].subtitle;
    _this.submitTitleBody = _this.wordList.length + "个词汇";
    console.log(_this.wordList);
    audioPlayer = document.getElementById("audio_player");
    audioPlayer.addEventListener("ended", function () {
        _this.wordList[_this.nowListeningWordPosition]["touching"] = "0";
    });
    audioPlayer.addEventListener("timeupdate", function () {
        if (_this.nowListeningWordPosition !== _this.wordList.length &&
            audioPlayer.currentTime >= parseFloat(_this.wordList[_this.nowListeningWordPosition + 1].time)) {
            if (audioPlayer.currentTime > parseFloat(_this.wordList[_this.nowListeningWordPosition].time)) {
                audioPlayer.pause();
                _this.wordList[_this.nowListeningWordPosition]["touching"] = "0";
            }
        }
    });
}