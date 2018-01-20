var clockEl;
var clockInterval;

const TAG_DEFAULT  = "default";
const TAG_404      = "404";

var imgSrcs = {
    "default": "https://media1.tenor.com/images/da022946b861558e0f5ed59baca155d4/tenor.gif",
    "coffee": "https://media1.tenor.com/images/19a66ceae49113f2d82b0bf227503d99/tenor.gif",
    "bathroom": "https://media1.tenor.com/images/2e75b3cb88349c3fcd118c0e0abc35b3/tenor.gif",
    "meeting": "https://media.giphy.com/media/TPXLTNiQLBwxW/giphy.gif",
    "lunch": "https://media1.tenor.com/images/8a01457a623ccd7582c6331b04194bf3/tenor.gif",
    "copier": "http://gifs.benlk.com/serious-hardware-copier-fax.gif",
    "smoke": "https://media1.tenor.com/images/1ba6092ef6c2ae0b4f61b8036d88dda5/tenor.gif",
    "404": "https://i.imgur.com/j51uHm1.gif"
}

var imgTexts = {
    "default": "Be right back!",
    "coffee": "Grabbing some coffee!",
    "bathroom": "Defacation Nation. That is all.",
    "meeting": "In a meeting.",
    "lunch": "Grabbing a bite. Be back soon!",
    "copier": "Making copies. Back in a minute!",
    "smoke": "Out for a quick toke!",
    "404": "404, page (and person) not found."
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function updateClock() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    h = checkTime(h);
    m = checkTime(m);
    clockEl.innerHTML = h + ":" + m;
}

function getImgTag() {
    var urlToks = window.location.href.split("?");
    if (urlToks.length < 2 || urlToks[1].split("=").length < 2 ||
        urlToks[1].split("=")[0] != "tag")
        return TAG_DEFAULT;
    if (!imgSrcs[urlToks[1].split("=")[1]])
        return TAG_404;
    return urlToks[1].split("=")[1];
}

function initImage() {
    var imgTag = getImgTag();

    document.title = "brb.me | " + imgTag;
    document.getElementById("brbImg").src = imgSrcs[imgTag];
    document.getElementById("brbText").innerHTML = imgTexts[imgTag];
}

function autosize() {
    setTimeout(function(){
        var el = document.getElementById("brbText");
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
}

function initTextArea() {
    document.getElementById('brbText')
        .addEventListener('keydown', autosize);
}

function initGrain() {
    var gCanv = document.getElementById("grainCanv");
    var gCtx = gCanv.getContext("2d");
    gCanv.width  = window.innerWidth  * 2;
    gCanv.height = window.innerHeight * 2;
    gCtx.clearRect(0,0,gCanv.width,gCanv.width);
    var imgData = gCtx.createImageData(gCanv.width,gCanv.height);
    for (var i = 0; i < imgData.data.length; i+=4) {
        imgData.data[i]   = chance.integer({min: 0, max: 200});
        imgData.data[i+1] = chance.integer({min: 0, max: 200});
        imgData.data[i+2] = chance.integer({min: 0, max: 200});
        imgData.data[i+3] = chance.integer({min: 0, max: 25});
    }
    gCtx.putImageData(imgData, 0, 0);
    console.log("grain done");
}

function initClock() {
    clockEl = document.getElementById("time");
    clockInterval = setInterval(updateClock, 500);
}

function init() {
    initGrain();
    initClock();
    initImage();
    initTextArea();
    autosize();
}

window.onload = init;
