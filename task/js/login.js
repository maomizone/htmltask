/**
 * Created by Administrator on 2017/6/26 0026.
 */

var str =location.search;
var gateID = str.getQuery("gateID");

/**
 * 结算单详情
 */
function repair_pay_info(vueObj) {
    showLoading();

    var obj = {};
    obj.appointID = appointID;
    // obj.appointID = "000f882d-0000-0000-0000-000085e483a0";

    $.ajax({
        url:BASE_URL + "repair_pay_info",
        type:"POST",
        data: obj,
        timeout:1000*10,
        dataType:"json",

        success:function (data,textStatus,jqXHR) {
            hideLoading();
            // 返回结果状态值,值为0或1.(0表示请求失败；1表示请求成功)
            if(data.status == 1){
                console.log(data);
                vueObj.appointInfo = data.cardList;
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


