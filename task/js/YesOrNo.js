/**
 * Created by Administrator on 2017/6/26 0026.
 */
// type 0:特批优惠-同意
// type 1:特批优惠-拒绝
// type 2:总检申请-通过
// type 3:总检申请-返工
var str =location.search;
var type = str.getQuery("type");
var serviceUserID = str.getQuery("serviceUserID");
var specialID = str.getQuery("specialID");
var inspectID = str.getQuery("inspectID");

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            reason.back();
        });
    }catch (err){
    }

    var reason = new Vue({
        el: '#reason',

        mounted: function () {
        },

        computed: {
        },
        data: {
            reasonTxt: "",
        },
        methods:{
            back:function () {
                window.history.back();
            },
            send:function () {
                // if(this.stringIsBlank(this.reasonTxt)){
                //     showMessage('说点什么吧...');
                //     return;
                // }
                // 走总检
                if(type>1){
                    service_inspect_check(this);
                }else {
                    service_review_check(this);
                }
                console.log(this.reasonTxt);
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

/**
 * 特批优惠-同意/拒绝/撤回
 */
function service_review_check(vueObj) {
    showLoading();

    var obj = {};
    obj.reviewID = specialID;

    // type 0:特批优惠-同意  type 1:特批优惠-拒绝
    if(type == 0)
        obj.doOperate = 2;   //2:同意;3:拒绝;4:撤回
    else
        obj.doOperate = 3;   //2:同意;3:拒绝;4:撤回

    console.log("djy 特批优惠-同意/拒绝/撤回--->" + JSON.stringify(obj));

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
               window.history.back();
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
* 总检申请-同意/拒绝
*/
function service_inspect_check() {
    showLoading("发送中...");

    var obj = {};
    obj.serviceUserID = serviceUserID;
    obj.inspectID = inspectID;
    obj.doOperate = type == 2 ? 0: 1;
    obj.note = this.reasonTxt;


    $.ajax({
        url:BASE_URL + "service_inspect_check",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                window.history.back();
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





