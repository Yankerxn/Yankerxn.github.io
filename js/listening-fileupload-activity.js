let _this;
const Main = {
    data() {
        return {
        }
    },
    methods: {},
    mounted() {
        _this = this;
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

function fileSelected() {
    // 转换成可读文件实例
    const reader = new FileReader();
    const file = document.getElementById('fileToUpload').files[0];
    reader.readAsDataURL(file);
    reader.onload = function () {
        let response = localStorage.getItem("menuData");
        let wordList = JSON.parse(response);
        wordList[0]["allData"] = reader.result;
        localStorage.setItem("menuData", JSON.stringify(wordList));
        window.location.href = encodeURI("ListeningCompleteActivity.html");
    };
}