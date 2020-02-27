/**
 * Created by Administrator on 2017/6/26 0026.
 */

// type 0:通讯录 1:多选（抄送人） 2:多选（派工） 3:单选（出库人） 4:单选 获取通讯录列表(本部门客户代表)  5.介绍员工 6.IM加人员
var str =location.search;
var type = str.getQuery("type");
var serviceUserID = str.getQuery("serviceUserID");
var organizeOID = str.getQuery("organizeOID");
var departID = str.getQuery("departID");
setUrl(str.getQuery("url"));

var type = 0;
var serviceUserID = "001038b9-0000-0000-0000-0000add4f9ca";
var organizeOID = "000bef06-0000-0003-0000-0000a0547eef";
// var departID = "0006c839-0000-0003-0000-00000a870718";
setUrl("http://syclhxf.zhyinfo.cn/hxfwebsh_demo/App/jkgl/BusinessUnit/MerchantInterface/", "http://syclhxf.zhyinfo.cn/hxfwebsh_demo");




if(stringIsBlank(type)){
    type = 0;
}


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
            this.personsShow = this.personsAll.clone();

            // get_organize_name(this);

            if(type == 0){
                // service_mail_list(this);
                this.personsAll = [
                    {serviceUserName:"张三"},{serviceUserName:"李四"},
                    {serviceUserName:"王五"},{serviceUserName:"网六"},
                    {serviceUserName:"第三个感受到"},{serviceUserName:"版本"},
                    {serviceUserName:"第三个感受到"},{serviceUserName:"正在"},
                    {serviceUserName:"第三个感受到"},{serviceUserName:"吧v"},
                    {serviceUserName:"感受到"},{serviceUserName:"预约"},
                    {serviceUserName:"三个感受到"},{serviceUserName:"看看"},
                    {serviceUserName:"个感受到"},{serviceUserName:"都是"},
                    {serviceUserName:"感受到"},{serviceUserName:"什么"},
                    {serviceUserName:"呵呵"},{serviceUserName:"shemale"},
                    ];
                this.personsShow = this.personsAll.clone();

                console.log(this.personsAll.length)
                $(function() {
                    initials();
                    getSpiner();
                });
            }
            else if(type == 1){
                service_admin_cc_list(this);
                $("footer").show();
            }
            else if(type == 2){
                service_user_list(this);
                $("footer").show();
            }
            else if(type == 3){
                service_recently_list(this);
            }
            else if(type == 4){
                service_depart_list(this);
            }
            else if(type == 5){
                introduce_person_list(this);
            }
            else if(type == 6){
                service_mail_list(this);
                $("footer").show();
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
            recentPersonsAll:[], // 最近联系人
            organizeName:"",
        },
        methods:{
            back:function () {
                window.history.back();
                // if(type == 0 || type == 2 || type == 3 || type == 4 || type == 5){
                if(type != 1){
                    window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                    })
                }
            },
            itemClick: function (item) {
                console.log("点击了"+item.serviceUserName);

                if(type == 0){
                    window.dsBridge.call(LOOK_ADDRESS_DETAIL_FROM_JS, {serviceUserInfo: JSON.stringify(item)}, function (responseData) {
                    })
                }else if(type == 3){
                    window.dsBridge.call(GET_PICK_PERSON_FROM_JS, {pickPerson: JSON.stringify(item)}, function (responseData) {
                    })
                }
                // else if(type == 1){
                //     saveSinglePerson(item);
                //     window.history.back();
                // }
                else if(type == 4){
                    window.dsBridge.call(GET_REPRESENTATIVE_PERSON_FROM_JS, {representativePerson: JSON.stringify(item)}, function (responseData) {
                    })
                }else if(type == 5){
                    window.dsBridge.call(GET_INTRODUCE_PERSON_FROM_JS, {introducePerson: JSON.stringify(item)}, function (responseData) {
                    })
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
            /**
             * 完成派工
             */
            completeDispatch : function () {
                var _this = this;
                if(type == 2){
                    if(this.selectedPersons.length == 0){
                        showMessage("请选择派工人员");
                        return;
                    }
                    window.dsBridge.call(GET_DISPATCH_PERSONS_FROM_JS, {dispatchPersons: JSON.stringify(_this.selectedPersons)}, function (responseData) {
                    })
                }else if(type == 6){
                    if(this.selectedPersons.length == 0){
                        showMessage("请选择人员");
                        return;
                    }
                    window.dsBridge.call(GET_IM_PERSONS_FROM_JS, {imPersons: JSON.stringify(_this.selectedPersons)}, function (responseData) {
                    })
                }
                // 抄送
                else if(type == 1){
                    if(this.selectedPersons.length == 0){
                        showMessage("请选择抄送人员");
                        return;
                    }
                    saveCCPerson(_this.selectedPersons);
                    window.history.back();
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
    obj.serviceUserID = serviceUserID;
    obj.organizeOID = organizeOID;
    obj.name = "";
    obj.page = 1;
    obj.rows = 10000;

    $.ajax({
        url: PublicManage + "service_mail_list",
        type:"POST",
        data: obj,
        timeout:2000*10,
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
    obj.organizeOID = organizeOID;

    console.log("service_admin_cc_list", JSON.stringify(obj));

    $.ajax({
        url: RepairManage + "service_admin_cc_list",
        type:"POST",
        data: obj,
        timeout:2000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                if(data.serviceUserList && data.serviceUserList.length > 0){
                    console.log(vueObj.recentPersonsAll.length);
                    console.log(data.serviceUserList.length)
                    vueObj.personsAll = vueObj.recentPersonsAll.concat(data.serviceUserList);
                    // vueObj.personsAll = data.serviceUserList;
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
    obj.organizeOID = organizeOID;

    $.ajax({
        url: RepairManage + "service_user_list",
        type:"POST",
        data: obj,
        timeout:2000*10,
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
 * 最近联系人
 */
function service_recently_list(vueObj) {
    showLoading();

    var obj = {};
    obj.serviceUserID = serviceUserID;

    $.ajax({
        url: RepairManage + "service_recently_list",
        type:"POST",
        data: obj,
        timeout:2000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                if(data.serviceUserList && data.serviceUserList.length > 0){
                    vueObj.recentPersonsAll = data.serviceUserList;
                    console.log(vueObj.recentPersonsAll.length);

                    for (var i =0;i < vueObj.recentPersonsAll.length;i++) {//插入到对应的首字母后面
                        vueObj.recentPersonsAll[i].recent = true;
                        console.log(vueObj.recentPersonsAll[i].recent);
                    }
                }
            }else {
                showMessage(data.info);
            }

            service_admin_cc_list(vueObj);
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
 * 获取通讯录列表(本部门客户代表)
 */
function service_depart_list(vueObj) {
    showLoading();

    var obj = {};
    obj.name = "";
    obj.page = 1;
    obj.rows = 10000;
    obj.organizeOID = organizeOID;

    $.ajax({
        url:BASE_URL + "service_depart_list",
        type:"POST",
        data: obj,
        timeout:2000*10,
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
 * 介绍员工
 */
function introduce_person_list(vueObj) {
    showLoading();

    var obj = {};
    obj.organizeID = organizeOID;
    obj.departID = departID;

    $.ajax({
        url: SaleManage + "introduce_person_list",
        type:"POST",
        data: obj,
        timeout:2000*10,
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
 * 获取机构名称
 */
function get_organize_name(vueObj) {
    var obj = {};
    obj.organizeOID = organizeOID;

    $.ajax({
        url: SaleManage + "get_organize_name",
        type:"POST",
        data: obj,
        timeout:2000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                vueObj.organizeName = data.organizeName;
            }else {
                showMessage(data.info);
            }
        },
        error:function (xhr,textStatus) {
            showMessage(NET_ERROR);
            console.log("错误信息如下====================");
            console.log(xhr);
            console.log(textStatus);
        },
    });
}
