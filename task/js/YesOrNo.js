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
var inspectID = str.getQuery("inspectID");


$(document).ready(function() {
    var reason = new Vue({
        el: '#reason',

        mounted: function () {
            // showMessage('查无此人');
            // showLoading();
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
                if(this.stringIsBlank(this.reasonTxt)){
                    showMessage('说点什么吧...');
                    return;
                }
                // 走总检
                if(type>1){
                    service_inspect_check();
                }else {

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





