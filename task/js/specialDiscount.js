/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var flowInst = str.getQuery("flowInst");
var userID = str.getQuery("userID");
var postID = str.getQuery("postID");
var URL = str.getQuery("url");
setUrl(URL);

// flowInst = "51747269-23d4-4723-ad74-c53fe77c5a17";
// userID="000899b9-0000-0000-0000-00005bba16c2"; // 审批人ID
// postID = "0006e9f8-0000-0000-0000-0000a92ce370";
// var URL = "http://hellodj.eicp.net:13872/API_wk/App/jkgl/BusinessUnit/MerchantInterface/";
// setUrl(URL);

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
            special_approval_check(this);
        },
        data: {
            stateStr: "",
            flowInfo: {},
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
                    special_approval_undo(_this);
                });
            },
            remind:function () {
                var tel = "";
                this.flowInfo.flowList.map(function (item) {
                    if(item.ideaCode == 0){
                        tel = item.userTel;
                    }
                });
                console.log("tel", tel);

                var setContents = '请选择提醒方式';
                var setButton = '["短信","电话"]';
                var _this = this;
                $(".cancel").openWindow("",setContents,setButton, function () {
                    window.dsBridge.call(CALL_FROM_JS, {telephone: tel}, function (responseData) {
                    })
                });
                $(".cancel-button").click(function () {
                    window.dsBridge.call(SHORT_MSG_FROM_JS, {telephone: tel}, function (responseData) {
                    })
                });
                // window.location.href="./specialDiscountRemind.html";
            },
            yes:function () {
                window.location.href="./YesOrNo.html?type=1&flowInst=" + flowInst + "&url="+ URL + "&userID="+ userID + "&postID="+ postID;
            },
            no:function () {
                window.location.href="./YesOrNo.html?type=2&flowInst=" + flowInst + "&url="+ URL + "&userID="+ userID + "&postID="+ postID;
            },
            repairDetail: function () {
                window.location.href="./repairOrderDetial.html?appointID=" + this.flowInfo.appointID + "&specialID="+this.flowInfo.specialID + "&url="+ URL;
            }
        },
    });
});

/**
 * 特批优惠-撤销
 */
function special_approval_undo(vueObj) {
    showLoading("撤销中...");

    var obj = {};
    obj.flowInst = flowInst;
    obj.userID = userID;
    obj.reason = "";

    $.ajax({
        url:RepairManage + "special_approval_undo",
        type:"POST",
        data: obj,
        timeout:1000*60,
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

/**
 * 特批优惠-查看
 */
function special_approval_check(vueObj) {
    showLoading();
    var obj = {};
    obj.flowInst = flowInst;
    obj.userID = userID;
    obj.postID = postID;

    $.ajax({
        url:RepairManage + "special_approval_check",
        type:"POST",
        data: obj,
        timeout:1000*60*3,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(data);
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log("special_approval_check", JSON.stringify(data));
                vueObj.flowInfo = data.flowInfo;
                // 审核状态(1:审核中,2:审核通过,3:审核拒绝,4:撤回)
                if(data.flowInfo.flowState == 1){
                    vueObj.stateStr = "审批中";
                }else if(data.flowInfo.flowState == 2){
                    vueObj.stateStr = "审批通过";
                }else if(data.flowInfo.flowState == 3){
                    vueObj.stateStr = "审批拒绝";
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
