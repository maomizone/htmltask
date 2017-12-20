/**
 * Created by Administrator on 2017/6/26 0026.
 */
Array.prototype.clone=function(){ return [].concat(this); } //或者 Array.prototype.clone=function(){ return this.concat(); }

String.prototype.getQuery = function(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = this.substr(this.indexOf("?")+1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

function refreshIOS() {
    var isPageHide = false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
            window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true;
    });
}

/**
 * 压缩 & base64编码
 * @param img  Dom对象（勿传jquery对象）
 * @param size  最大尺寸
 * @returns {string} base64编码后的字符串
 */
function getBase64Image(img, size) {
    var canvas = document.createElement("canvas");

    var square = size || 700;
    canvas.width = square;
    canvas.height = square;

    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, square, square);

    console.log('开始压缩图片');
    var imageWidth;
    var imageHeight;
    var offsetX = 0;
    var offsetY = 0;
    if(img.width < square && img.height < square){
        imageWidth = img.width;
        imageHeight = img.height;
    } else if (img.width > img.height) {
        imageWidth = Math.round(square * img.width / img.height);
        imageHeight = square;
        offsetX = - Math.round((imageWidth - square) / 2);
    } else {
        imageHeight = Math.round(square * img.height / img.width);
        imageWidth = square;
        offsetY = - Math.round((imageHeight - square) / 2);
    }
    ctx.drawImage(img, offsetX, offsetY, imageWidth, imageHeight);
    console.log('压缩图片成功');

    console.log('开始base64编码');
    try
    {
        var dataURL = canvas.toDataURL("image/png");
        console.log('base64编码成功');
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    catch (e)
    {
        alert(e.message);
        alert(e.description)
        alert(e.number)
        alert(e.name)
    }
}


