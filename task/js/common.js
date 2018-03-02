var common = {
    init: function () {
        this.setViewport();
    },
    setViewport: function(){
        var viewport = document.querySelector("meta[name=viewport]");
        var winWidths=$(window).width();
        var densityDpi=750/winWidths;
        densityDpi= densityDpi>1?300*750*densityDpi/750:densityDpi;
        if(isWeixin()){
            viewport.setAttribute('content', 'width=750, target-densityDpi='+densityDpi);
        }else{
            viewport.setAttribute('content', 'width=750, user-scalable=no');
            window.setTimeout(function(){
                viewport.setAttribute('content', 'width=750, user-scalable=yes');
            },1000);
        }

        function isWeixin(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        }
    },
    searchHover: function (){
        $('#searchInput').on('keyup',function() {
            var len = document.getElementById('searchInput').value;
            if(len == ''){
                $('#search_label').show();
            }else{
                $('#search_label').hide();
            }
        });
    },
    switchClick:function(){
        var openDot=document.getElementById("switchDot");
        var openBox=document.getElementById("switchBox");
        openDot.onclick=function(){
            openBox.className=(openBox.className=="close1")?"open1":"close1";
            openDot.className=(openDot.className=="close2")?"open2":"close2";
        }
    },
    setDefault:function(){
        $(".manageCar_set_btn button").click(function(){
            if(!$(this).hasClass('default')){
                $('.manageCar_set_btn button').removeClass('default').html('设为默认');
                $(this).addClass('default').html('当前默认');

            }
        })
    }
}
$(function () {
    common.init();
})

