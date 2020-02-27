/**
 * Created by Administrator on 2017/6/26 0026.
 */
var str = location.search;
var serviceUserID = str.getQuery("serviceUserID");
var repairID = str.getQuery("repairID");
setUrl(str.getQuery("url"));

$(document).ready(function() {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            pickingRecords.back();
        });
    }catch (err){}

    var pickingRecords = new Vue({
        el: '#pickingRecords',

        mounted: function () {
            var obj = getPickingRecords();
            if(obj){
                console.log("已有数据，无需刷新");
                this.allNum = obj.allNum;
                this.pickingList = obj.pickingList;
            }else {
                console.log("没有数据，需要刷新");
                technician_picking_list(this);
            }
        },

        computed: {
        },
        data: {
            allNum: 0,
            pickingList: [],
        },
        methods:{
            back:function () {
                window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                });
            },
            itemClick: function (item) {
                var obj = {};
                obj.allNum = this.allNum;
                obj.pickingList = this.pickingList;
                savePickingRecords(obj);
                window.location.href="./pickingDetail.html?serviceUserID="+ serviceUserID
                    + "&pickingID=" + item.pickingID
                    + "&url=" + URL
                ;
            },
        },
    });
});

/**
 * 查看领料记录列表
 */
function technician_picking_list(vueObj) {
    showLoading();

    var obj = {};
    obj.serviceUserID = serviceUserID;
    obj.repairID = repairID;

    console.log("djy 查看领料记录列表-->" + JSON.stringify(obj));

    $.ajax({
        url:RepairManage + "technician_picking_list",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                vueObj.allNum = data.allNum;
                vueObj.pickingList = data.pickingList;
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


