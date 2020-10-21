let commonUrl = "http://127.0.0.1:24/search/common";
let userInfo;
let myPlayer;
let videoHint;
let videoType;
let networkType;
const Main = {
    data() {
        return {
            videoInfo: '',
            videoData: '',
            teacherInfo: ''
        }
    },
    methods: {
        backHistoryPager() {
            if (videoType === "basic") {
                // window.location.replace('VideoBasicListActivity.html');
                window.history.go(-1);
            } else {
                // window.location.replace('VideoListActivity.html');
                window.history.go(-1);
            }
        },
        btnVideoHint() {
            $(window).off();
            videoHint.style.display = 'none';
            myPlayer.play();
        }
    },
    mounted() {
        networkType = getNetworkType();
        videoHint = document.getElementById("mobile_warn");
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading'
        });
        let _this = this;
        let urlParams = GetRequest();
        videoType = urlParams.type;
        if (videoType === "basic") {
            document.getElementById('teacher_info').style.display = 'none';
        }
        document.getElementById('text_title').innerHTML = urlParams.title;
        // Video设置
        myPlayer = videojs('video_view', {
            "controls": true,
            "autoplay": false,
            "techOrder": ["html5"],
            "loop": false,
            "muted": false,
            "preload": 'metadata',
            controlBar: {
                'remainingTimeDisplay': false
            }
        });
        let postData;
        // 通过nid获取视频信息
        postData = {url: "/feiyiweb/getscs_tp", 'nid': urlParams.id, 'stpid': 6};
        axios.post(commonUrl, Qs.stringify(postData))
            .then(function (response) {
                _this.videoInfo = JSON.parse(response.data.msg);
                if (_this.videoInfo.data.length > 0) {
                    _this.videoInfo = _this.videoInfo.data[0];
                    // 是否是Vip用户
                    if (judgeVipUser()) {
                        let uid = getCookie(document.cookie, "loginId");
                        let postData = {url: "/api_tool/return_sqid", phonetp: 'FRD-DL00', cz: '8.0.0', uid: uid};
                        axios.post(commonUrl, Qs.stringify(postData))
                            .then(function (response) {
                                let data = JSON.parse(response.data.msg);
                                if (data.status === 200) {
                                    postData = {
                                        url: '/pay_ret/check_play',
                                        vid: _this.videoInfo.id,
                                        vkname: _this.videoInfo.vkname,
                                        uid: userInfo,
                                        sqid: data.retid
                                    };
                                    console.log(postData);
                                    axios.post(commonUrl, Qs.stringify(postData))
                                        .then(function (response) {
                                            _this.videoData = JSON.parse(response.data.msg);
                                            myPlayer.ready(function () {
                                                const myPlayer = this;
                                                console.log(_this.videoData.source +"播放地址");
                                                myPlayer.src(_this.videoData.source); /*动态设置video.js播放的地址。*/
                                                myPlayer.autoplay();
                                                if (networkType !== 'other') {
                                                    let videoTrueHeight = myPlayer.currentHeight();
                                                    videoHint.style.height = String(videoTrueHeight) + "px";
                                                    videoHint.style.display = 'block';
                                                    $(window).resize(function () {
                                                        videoTrueHeight = myPlayer.currentHeight();
                                                        videoHint.style.height = String(videoTrueHeight) + "px";
                                                    });
                                                } else {
                                                    console.log("networkType = " + networkType);
                                                }
                                            });
                                            postData = {url: "/API_quick1/getTeacher", 'teacherId': _this.videoInfo.teacher_id};
                                            axios.post(commonUrl, Qs.stringify(postData))
                                                .then(function (response) {
                                                    let data = JSON.parse(response.data.msg);
                                                    _this.teacherInfo = data.result;
                                                });
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    } else {
                        postData = {url: "/freevideo/getFreeVideoByVid", 'vid': _this.videoInfo.id};
                        axios.post(commonUrl, Qs.stringify(postData))
                            .then(function (response) {
                                _this.videoData = JSON.parse(response.data.msg);
                                if (_this.videoData.status !== 200) {
                                    myPlayer.ready(function () {
                                        const myPlayer = this;
                                        console.log(_this.videoData.source);
                                        myPlayer.src(_this.videoData.source); /*动态设置video.js播放的地址。*/
                                        myPlayer.autoplay();
                                        if (networkType !== 'other') {
                                            let videoTrueHeight = myPlayer.currentHeight();
                                            videoHint.style.height = String(videoTrueHeight) + "px";
                                            videoHint.style.display = 'block';
                                            $(window).resize(function () {
                                                videoTrueHeight = myPlayer.currentHeight();
                                                videoHint.style.height = String(videoTrueHeight) + "px";
                                            });
                                        } else {
                                            console.log("networkType = " + networkType);
                                        }
                                    });
                                    postData = {url: "/API_quick1/getTeacher", 'teacherId': _this.videoInfo.teacher_id};
                                    axios.post(commonUrl, Qs.stringify(postData))
                                        .then(function (response) {
                                            let data = JSON.parse(response.data.msg);
                                            _this.teacherInfo = data.result;
                                        });
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                }
            })
            .catch(function (error) {
                console.log(error);
            });
        loading.close();
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

//获取url中"?"符后的字串
function GetRequest() {
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
    userInfo = getCookie(document.cookie, "loginInfo")
    return theRequest;
}

// 判断是否是vip用户
function judgeVipUser() {
    // let postData = {'vid': _this.videoInfo.id};
    // axios.post("http://127.0.0.1:24/search/getFreeVideoData", JSON.stringify(postData))
    //     .then(function (response) {
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    return false;
}

// 获取网络类型
function getNetworkType() {
    const ua = navigator.userAgent;
    console.log("navigator.userAgent = " + ua);
    let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
    console.log("navigator.userAgent = " + networkStr);
    networkStr = networkStr.toLowerCase().replace('nettype/', '');
    let networkType;
    switch (networkStr) {
        case '4g':
            networkType = '4g';
            break;
        case '3g':
            networkType = '3g';
            break;
        case '3gnet':
            networkType = '3g';
            break;
        case '2g':
            networkType = '2g';
            break;
        default:
            networkType = 'other';
    }
    return networkType;
}