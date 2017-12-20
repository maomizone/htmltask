/**
 * Created by Administrator on 2017/6/26 0026.
 */
// type 0:提交 1:审批
var str =location.search;
var type = str.getQuery("type");
console.log("type--->" + type);
if (type == null || type == undefined || type == "")
    type = 0;
console.log("type--->" + type);

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
            // showMessage('查无此人');
            // showLoading();
        },

        computed: {
        },
        data: {
            type: type,  // type 0:提交 1:审批
        },
        methods:{
            back:function () {
                console.log(history.length);
                if(type == 0){
                    // 提交结算未申请时，申请未通过，撤销申请，
                    // 都要经过申请页面才到提交成功界面，返回时需要跳过申请界面
                    if(history.length > 2){
                        saveRefreshSpecialDiscount(); // 提醒提交结算页面刷新
                        window.history.go(-2);
                    }
                    // 提交结算申请中，直接跳转到此界面
                    else
                        window.history.go(-1);
                } else if(type == 1){
                    window.dsBridge.call(CLOSE_PAGE_FROM_JS, {}, function (responseData) {
                    })
                }
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
                $(".cancel").openWindow("",setContents,setButton, function () {
                    showLoading("撤销中");
                });
            },
            remind:function () {
                window.location.href="./specialDiscountRemind.html";
            },
        },
    });
})


