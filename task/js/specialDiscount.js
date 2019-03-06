/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var specialID = str.getQuery("specialID");
var serviceUserID = str.getQuery("serviceUserID");

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            sepcialDiscount.back();
        });
    }catch (err){}


    var sepcialDiscount = new Vue({
        el: '#sepcialDiscount',

        mounted: function () {
            appoint_discount_apply_info(this);
        },
        data: {
            type: -1,  // type 0:提交 1:审批
            stateStr: "",
            specialInfo: {},
        },
        methods:{
            back:function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            stringIsBlank:function (str) {
                if (str == null || str == undefined || str == "") {
                    return true;
                }else {
                    return false;
                }
            },
            cancel:function () {
                var setContents = '是否确认撤销本次申请';
                var setButton = '["否","是"]';
                var _this = this;
                $(".cancel").openWindow("",setContents,setButton, function () {
                    service_review_check(_this);
                });
            },
            remind:function () {
                var setContents = '请选择提醒方式';
                var setButton = '["短信","电话"]';
                var _this = this;
                $(".cancel").openWindow("",setContents,setButton, function () {
                    window.dsBridge.call(CALL_FROM_JS, {telephone: _this.specialInfo.telephone}, function (responseData) {
                    })
                });
                $(".cancel-button").click(function () {
                    window.dsBridge.call(SHORT_MSG_FROM_JS, {telephone: _this.specialInfo.telephone}, function (responseData) {
                    })
                });
                // window.location.href="./specialDiscountRemind.html";
            },
            yes:function () {
                window.location.href="./YesOrNo.html?type=0&specialID="+specialID;
            },
            no:function () {
                window.location.href="./YesOrNo.html?type=1&specialID="+specialID;
            },
            repairDetail: function () {
                window.location.href="./repairOrderDetial.html?appointID=" + this.specialInfo.appointID + "&specialID="+specialID;
            }
        },
    });
});

/**
 * 特批优惠详情
 */
function appoint_discount_apply_info(vueObj) {
    showLoading();
    var obj = {};
    obj.specialID = specialID;
    // obj.specialID = "9def8f81-054b-4d15-ab8c-f5619cfe3a20";

    $.ajax({
        url:BASE_URL + "appoint_discount_apply_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(data);
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                vueObj.specialInfo = data.specialInfo;
                vueObj.stateStr = "审核中";
                // 审核状态(1:审核中,2:审核通过,3:审核拒绝,4:撤回)
                if(data.specialInfo.state == 1){

                    if(serviceUserID == data.specialInfo.serviceUserID){
                        vueObj.type = 0;
                    } else if(serviceUserID == data.specialInfo.reviewUserID){
                        vueObj.type = 1;
                    }

                    console.log("vueObj.type "+vueObj.type );

                }else if(data.specialInfo.state == 2){
                    vueObj.stateStr = "审核通过";
                }else if(data.specialInfo.state == 3){
                    vueObj.stateStr = "审核拒绝";
                } else {
                    vueObj.stateStr = "撤回";
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
 * 特批优惠-同意/拒绝/撤回
 */
function service_review_check(vueObj) {
    showLoading("撤销中...");

    var obj = {};
    obj.reviewID = specialID;
    obj.doOperate = 4;   //2:同意;3:拒绝;4:撤回
    // obj.reviewID = "9def8f81-054b-4d15-ab8c-f5619cfe3a20";

    $.ajax({
        url:BASE_URL + "service_review_check",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(data);
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                showMessage("撤销成功！");
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
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
