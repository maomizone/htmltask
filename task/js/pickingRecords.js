/**
 * Created by Administrator on 2017/6/26 0026.
 */
const RECORDS_KEY = "RECORDS_KEY";

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
            technician_picking_list();
            if(this.getRecords()){
                console.log("已有数据，无需刷新");
            }else {
                console.log("没有数据，需要刷新");
            }
        },

        computed: {
        },
        data: {
            allNum: 0,
            pickingList: [
                {id:'1', time:'2017-11-12\n1232', code:'123456', name:"金美孚1号 0W-40", num:5},
                {id:'2', time:'2017-11-22\n1232', code:'123456', name:"金美孚2号 0W-40", num:3},
                {id:'3', time:'2017-11-22\n1232', code:'123456', name:"金美孚2号 0W-40", num:3},
                {id:'4', time:'2017-11-22\n1232', code:'123456', name:"金美孚2号 0W-40", num:3},
                {id:'5', time:'2017-11-22\n1232', code:'123456', name:"金美孚2号 0W-40", num:3},
                {id:'6', time:'2017-11-22\n1232', code:'123456', name:"金美孚2号 0W-40", num:3},
            ],
        },
        methods:{
            back:function () {
                window.history.back();
            },
            itemClick: function (item) {
                this.saveRecords();
                window.location.href="./pickingDetail.html?id="+item.id;
            },
            stringIsBlank:function (str) {
                if (str == null || str == undefined || str == "") {
                    return true;
                }else {
                    return false;
                }
            },
            saveRecords: function () {
                var objStr = JSON.stringify(this.records);
                sessionStorage.setItem(RECORDS_KEY,objStr);
            },
            getRecords: function () {
                var records =  eval('(' + sessionStorage.getItem(RECORDS_KEY) + ')');
                if(records){
                    this.records = records;
                    return true;
                }else {
                    return false;
                }
            },
        },
    });
})

/**
 * 查看领料记录列表
 */
function technician_picking_list() {
    showLoading();

    var obj = {};
    obj.serviceUserID = "0011810F-0000-0000-0000-0000629CA25D";
    obj.repairID = "00118D53-0000-0000-0000-0000172A11EF";

    $.ajax({
        url:BASE_URL + "technician_picking_list",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
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


