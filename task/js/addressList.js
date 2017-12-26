/**
 * Created by Administrator on 2017/6/26 0026.
 */

// type 0:通讯录 1:单选（抄送人） 2:多选（派工）
var str =location.search;
var type = str.getQuery("type");
var serviceUserID = str.getQuery("serviceUserID");

if (type == null || type == undefined || type == "")
    type = 0;
console.log("type--->" + type);


var tongXunLun;

$(function() {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            tongXunLun.back();
        });
    }catch (err){}

    tongXunLun = new Vue({
        el: '#tongXunLun',

        mounted: function () {

            switch (type){
                case 0:
                    service_mail_list(this);
                    break;
                case 1:
                    service_admin_cc_list(this);
                    break;
                case 2:
                    $("footer").show();
                    service_user_list(this);
                    break;
            }
        },

        computed: {

        },
        data: {
            personsAll:[],
            personsShow: [],
            personsFilter: [],
            selectedPersons:[],    // 选中的item
            searchName:"",
            type: type,
            showPop: false,
        },
        methods:{
            back:function () {
                window.history.back();
                if(type == 0){
                    window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                    })
                }
            },
            itemClick: function (item) {
                console.log("点击了"+item.serviceUserName);

                if(type == 0){
                    window.dsBridge.call(LOOK_ADDRESS_DETAIL_FROM_JS, {serviceUserID: "123456"}, function (responseData) {
                    })
                }else if(type == 1){
                    console.log(111)
                    saveSinglePerson(item);
                    window.history.back();
                }
            },
            checkClick: function (item) {
                item.checked = !item.checked;
                this.personsAll.map(function (person) {
                    if(person === item){
                        person.checked = item.checked;
                    }
                });

                this.getSelectedPerson();
            },
            getSelectedPerson: function () {
                var _this = this;
                var str = "选中了";
                _this.selectedPersons = [];
                _this.personsAll.map(function (person) {
                    if(person.checked){
                        str += person.serviceUserName+",";
                        _this.selectedPersons.push(person);
                    }
                });
                console.log(str);
            },
            search: function () {
                console.log(this.searchName);
                var _this = this;
                var searchName = _this.searchName;
                if(_this.stringIsBlank(searchName)){
                    console.log(_this.personsAll.length);
                    _this.personsShow = _this.personsAll.clone();
                    console.log(_this.personsShow.length);
                    $(function() {initials()});

                }else {
                    _this.personsFilter = [];
                    _this.personsAll.map(function (item) {
                        if(item.serviceUserName.indexOf(searchName) != -1){
                            _this.personsFilter.push(item);
                        }
                    });
                    _this.personsShow = _this.personsFilter.clone();
                    $(function() {
                        initials()
                        getSpiner();
                    });
                }
            },
            stringIsBlank: function (str) {
                if (str == null || str == undefined || str == "") {
                    return true;
                }else {
                    return false;
                }
            },
            togglePop : function () {
                if(this.selectedPersons.length > 0){
                    this.showPop = !this.showPop;
                }else
                    this.showPop = false;
            },
            clearAll: function () {
                this.personsAll.map(function (person) {
                    person.checked = false
                });
                this.personsShow.map(function (person) {
                    person.checked = false
                });
                this.selectedPersons = [];
                this.showPop = false;
            },
            clearOne: function (person) {
                this.checkClick(person)
                if(this.selectedPersons.length == 0){
                    this.showPop = false;
                }
            },
        },
    });
})

function getSpiner() {
    var ic = [];
    var listgt = $(".spiner div").eq(0).height();
    $(".spiner div").each(

        function(r) {
            ic.push($(".spiner div").eq(r).offset().top - $(window).scrollTop())
        }
    )
    $(".spiner").on("touchstart", function(event) {

        ff(event)
        // $(".biaoqian").show();
    })
    $(".spiner").on("touchend", function() {
        $("html, body").animate({
            scrollTop: ($(".sort_letter").eq(icae).offset().top-143) + "px"
        }, {
            duration: 500,
            easing: "swing"
        });
        // $(".biaoqian").hide();
        return false;
    })
    $(".spiner").on("touchmove", function(event) {
        event.preventDefault();
        ff(event)

    })
    function ff(event) {
        var dheight = event.changedTouches[0].clientY;
        $(ic).each(
            function(ri) {
                if(dheight < ic[0]) {
                    overfun(0);
                    return false;
                }
                if(dheight > ic[ic.length - 1]) {
                    overfun(ic.length - 1);
                    return false;
                }
                if(ic[ri] < dheight && dheight < ic[ri] + listgt) {
                    overfun(ri);
                    return false;
                }
            }
        )
    }
    var icae = 0;
    function overfun(aic) {
        icae = aic;
        // $(".biaoqian").html($(".spiner div").eq(aic).html());
        $("html, body").stop(true);

        return false;
    }
}


/**
 * 通讯录列表
 */
function service_mail_list(vueObj) {
    showLoading();

    var obj = {};
    obj.serviceUserID = "000b34b9-0000-0000-0000-000028e4a3af";
    obj.name = "";
    obj.page = 1;
    obj.rows = 10000;

    $.ajax({
        url:BASE_URL + "service_mail_list",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                if(data.serviceUserList && data.serviceUserList.length > 0){
                    vueObj.personsAll = data.serviceUserList;
                    vueObj.personsShow = vueObj.personsAll.clone();

                    console.log(vueObj.personsAll.length)
                    $(function() {
                        initials();
                        getSpiner();
                    });
                }
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            hideLoading();
            showMessage(NET_ERROR);
            console.log("错误信息如下====================");
            console.log(xhr);
            console.log(textStatus);
        },
    });
}
/**
 * 获取通讯录列表(抄送人)
 */
function service_admin_cc_list(vueObj) {
    showLoading();

    var obj = {};
    obj.name = "";
    obj.page = 1;
    obj.rows = 10000;

    $.ajax({
        url:BASE_URL + "service_admin_cc_list",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                if(data.serviceUserList && data.serviceUserList.length > 0){
                    vueObj.personsAll = data.serviceUserList;
                    vueObj.personsShow = vueObj.personsAll.clone();

                    console.log(vueObj.personsAll.length)
                    $(function() {
                        initials();
                        getSpiner();
                    });
                }
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            hideLoading();
            showMessage(NET_ERROR);
            console.log("错误信息如下====================");
            console.log(xhr);
            console.log(textStatus);
        },
    });
}
/**
 * 获取维修人员列表
 */
function service_user_list(vueObj) {
    showLoading();

    var obj = {};
    obj.name = "";
    obj.page = 1;
    obj.rows = 10000;

    $.ajax({
        url:BASE_URL + "service_user_list",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                if(data.serviceUserList && data.serviceUserList.length > 0){
                    vueObj.personsAll = data.serviceUserList;
                    vueObj.personsShow = vueObj.personsAll.clone();

                    console.log(vueObj.personsAll.length)
                    $(function() {
                        initials();
                        getSpiner();
                    });
                }
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            hideLoading();
            showMessage(NET_ERROR);
            console.log("错误信息如下====================");
            console.log(xhr);
            console.log(textStatus);
        },
    });
}

