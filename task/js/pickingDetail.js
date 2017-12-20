/**
 * Created by Administrator on 2017/6/26 0026.
 */
$(document).ready(function() {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            pickingDetail.back();
        });
    }catch (err){}

    var pickingDetail = new Vue({
        el: '#pickingDetail',

        mounted: function () {
            technician_picking_info(this);
        },

        computed: {
        },
        data: {
            pickingInfo: {
                productList:[],
            },
        },
        methods:{
            back:function () {
                window.history.back();
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
});

/**
 * 查看领料记录详情
 */
function technician_picking_info(vueObj) {
    showLoading();

    var obj = {};
    obj.serviceUserID = "0011810F-0000-0000-0000-0000629CA25D";
    obj.pickingID = "e1c42689-202a-451e-bb5b-2fa325d8c3a8";

    $.ajax({
        url:BASE_URL + "technician_picking_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                vueObj.pickingInfo = data.pickingInfo;
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




