/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var repairID = str.getQuery("repairID");
setUrl(str.getQuery("url"), str.getQuery("imgUrl"));

/////////////////////////////////////////////////////////////////////
// repairID = "f611b6bf-f9b9-4306-baff-78ffcd01222c";
// url="http://222.185.244.186:8401/App/jkgl/BusinessUnit/MerchantInterface/";
// imgUrl="http://222.185.244.186:8401";
// setUrl(url, imgUrl);

$(document).ready(function() {
    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try {
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            repair.back();
        });
    }catch (err){}

    var repairOnline = new Vue({
        el: '#repairOnline',

        mounted: function () {
            repair_history_info_online(this);
        },

        computed: {
        },
        data: {
            payInfo:{},
            onlineService:null,
            offlineService:null,
        },
        methods:{
            back: function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                })
            },
            // 查看维修记录
            lookRepairRecords: function () {
                window.dsBridge.call(LOOK_REPAIR_RECORDS_FROM_JS, {repairID: repairID}, function (responseData) {
                })
            },
        },
    });
});


/**
 * 历史维修详情
 */
function repair_history_info_online(vueObj) {
    showLoading();

    var obj = {};
    obj.appointID = repairID;

    $.ajax({
        url:RepairManage + "repair_history_info_online",
        type:"POST",
        data: obj,
        timeout:2000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            console.log(JSON.stringify(data));
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                vueObj.payInfo = data.payInfo;
                vueObj.onlineService = data.onlineService;
                vueObj.offlineService = data.offlineService;
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


