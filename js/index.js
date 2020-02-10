function pageClick(k) {
    $(k).parent().find("div").removeClass("active");
    $(k).addClass("active");
    $("#flTitle").text($(k).text());
    if ($(k).text() === "生成页面") {
        window.location.href = 'makeListActivity.html'
    }
    if ($(k).text() === "类别管理") {
        window.location.href = 'mainActivity.html'
    }
}

let nameID = "";
let baseUrl = 'https://192.168.0.76:24/search/';
const Main = {
    data() {
        return {
            editableTabsValue: '1',
            editableTabs: [],
            tabIndex: 1,
            input: '', // 输入框
            inputTypeName: '',
            inputRemark: '',
            tableData: []
        }
    },
    methods: {
        addTab(targetName) {
            // 判断类名是否为空&&是否存在重复的命名
            let tabs = this.editableTabs;
            if (this.input === "") {
                this.$alert('类名不能为空', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        // this.$message({
                        //     type: 'info',
                        //     message: `action: ${action}`
                        // });
                    }
                });
                return false;
            }
            let isExit = false;
            tabs.forEach((tab, index) => {
                if (tab.title === this.input) {
                    this.$alert('存在重复类名', '提示', {
                        confirmButtonText: '确定',
                    });
                    isExit = true;
                    return false;
                }
            });
            if (isExit) {
                return;
            }
            let newTabName = ++this.tabIndex + '';
            this.editableTabsValue = newTabName;
            const title = this.input;
            const content = "content";
            let _this = this;
            const postData = "{ \"title\":" + title + ",\"name\":\"" + _this.tabIndex + "\",\"content\":" + content + " }";
            axios.post(baseUrl + 'itemListAdd', postData)
                .then(function (response) {
                    _this.editableTabs.push({
                        title: title,
                        name: _this.tabIndex,
                        content: content
                    });
                    _this.editableTabs = JSON.parse(response.data.msg);
                    _this.tableData = [];
                    nameID = _this.tabIndex;
                    _this.input = '';
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            let _this = this;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        const postData = "{ \"name\":\"" + targetName + "\" }";
                        axios.post(baseUrl + 'itemListDelete', postData)
                            .then(function (response) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                }
                                _this.editableTabsValue = activeName;
                                _this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                });
            }
        },
        tabClick(tab) {
            let _this = this;
            nameID = tab.name;
            const postData = "{ \"name\":\"" + tab.name + "\" }";
            axios.post(baseUrl + 'typeItemList', postData)
                .then(function (response) {
                    _this.tableData = JSON.parse(response.data.msg);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, deleteRow(index, rows) {
            let _this = this;
            rows.splice(index, 1);
            const postData = "{ \"index\":\"" + index + "\",\"nameID\":\"" + nameID + "\"}";
            axios.post(baseUrl + 'typeItemListDelete', postData)
                .then(function (response) {
                    // _this.tableData = JSON.parse(response.data.msg);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, addRow() {
            let _this = this;
            if (_this.inputTypeName === "") {
                this.$alert('条目类名不能为空', '提示', {
                    confirmButtonText: '确定',
                });
                return false;
            }
            const date = new Date();
            const time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            const postData = "{ \"nameID\":\"" + nameID + "\",\"date\":\"" + time + "\",\"type\":\"" + _this.inputTypeName + "\",\"remark\":\"" + _this.inputRemark + "\" }";
            axios.post(baseUrl + 'typeItemListAdd', postData)
                .then(function (response) {
                    _this.tableData = JSON.parse(response.data.msg);
                    _this.inputTypeName = '';
                    _this.inputRemark = '';
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
    mounted() {
        let _this = this;
        axios.get(baseUrl + 'itemList')
            .then(function (response) {
                _this.tabIndex = response.data.size;
                const content = response.data;
                _this.editableTabs = JSON.parse(content.msg);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};
const Ctor = Vue.extend(Main);
new Ctor().$mount('#app');