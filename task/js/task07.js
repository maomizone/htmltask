/**
 * Created by admin on 2017/1/5.
 */
function changeTxt(num) //定义函数
{
    var titleNum = document.getElementById("title_num");
    var content = document.getElementById("p_content");
    switch(num){
        case 1:
            titleNum.innerHTML="01";
            content.innerHTML="新世界，新世界，新世界，新世界，新世界，新世界，新世界，新世界，新世界，新世界，新世界";
            break;
        case 2:
            titleNum.innerHTML="02";
            content.innerHTML="新世界。新世界。新世界。新世界。新世界。新世界。新世界。新世界。新世界。新世界。新世界";
            break;
        case 3:
            titleNum.innerHTML="03";
            content.innerHTML="新世界！新世界！新世界！新世界！新世界！新世界！新世界！新世界！新世界！新世界！新世界";
            break;
    }
}
