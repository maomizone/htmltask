/**
 * Created by Administrator on 2017/6/26 0026.
 */
$(document).ready(function() {

    // 处理ios不刷新问题
    refreshIOS();
    // 处理android回退按键
    window.dsBridge.register(ANDROID_BACK_FROM_NATIVE,function(){
        addressDetail.back();
    });

    var addressDetail = new Vue({
        el: '#addressDetail',

        mounted: function () {
            // showMessage('查无此人');
            // showLoading();
        },

        computed: {
        },
        data: {
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
})


