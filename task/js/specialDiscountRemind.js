/**
 * Created by Administrator on 2017/6/26 0026.
 */
$(document).ready(function() {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    try{
        window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
            remind.back();
        });
    }catch (err){}

    var remind = new Vue({
        el: '#remind',

        mounted: function () {
            // showMessage('查无此人');
            // showLoading();
        },

        computed: {
        },
        data: {
            remindTxt: "",
        },
        methods:{
            back:function () {
                window.history.back();
            },
            send:function () {
                if(this.remindTxt.length == 0){
                    showMessage('说点什么吧...');
                    return;
                }
                showLoading("发送中...");
                console.log(this.remindTxt);
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


