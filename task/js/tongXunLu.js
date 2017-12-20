/**
 * Created by Administrator on 2017/6/26 0026.
 */
$(document).ready(function() {

    var repair = new Vue({
        el: '#tongXunLun',

        mounted: function () {
        },

        computed: {

        },
        data: {
            title: '通讯录',
            data:[
                {parent: '财务室', parentId:'p1',
                    childs:[
                        {name:"张三", checked:false},
                        {name:"李四", checked:true},
                        {name:"王五", checked:false},
                    ]
                },
                {parent: '软件', parentId:'p2',
                    childs:[
                        {name:"马六", checked:false},
                        {name:"车太贤", checked:false},
                        {name:"李准基", checked:false},
                    ]
                },
            ],
            selectedItem:undefined,    // 选中的item
            serviceNum:1,
            allMoney:530,
            gongshiMoney:40,
            searchName:"",
        },
        methods:{
            itemClick: function (child) {
                console.log("点击了"+child.name);
            },
            checkClick: function (child) {
                child.checked = !child.checked;

                var str = "选中了";
                this.data.map(function (item) {
                    if(item.childs){
                        item.childs.map(function (child) {
                            if(child.checked){
                                str += item.parent + "的" + child.name+",";
                            }
                        });
                    }
                });
                console.log(str);
            },
            search: function () {
                var find = false;
                var searchItem;
                var searchName = this.searchName;
                if(this.stringIsBlank(searchName)){
                    // 不做筛选
                    $('#files').tree({
                        expanded: ''
                    });
                }else {
                    this.data.map(function (item) {
                        if(item.childs){
                            item.childs.map(function (child) {
                                if(child.name == searchName){
                                    find = true;
                                    searchItem = item;
                                }else {
                                    // todo
                                }
                            });
                        }
                    });

                    if(find){
                        $('#files').tree({
                            expanded: '#'+searchItem.parentId
                        });
                    }else {
                        showMessage('查无此人');
                    }
                }
            },
            stringIsBlank:function (str) {
                if (str == null || str == undefined || str == "") {
                    return true;
                }else {
                    return false;
                }
            }
        },
    });



})


