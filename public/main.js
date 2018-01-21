const TAG_DEFAULT  = "default";
const TAG_GRID     = "grid";
const TAG_404      = "404";

var imgSrcs = {
    "default": "https://media1.tenor.com/images/da022946b861558e0f5ed59baca155d4/tenor.gif",
    "coffee": "https://media1.tenor.com/images/19a66ceae49113f2d82b0bf227503d99/tenor.gif",
    "bathroom": "https://media1.tenor.com/images/2e75b3cb88349c3fcd118c0e0abc35b3/tenor.gif",
    "meeting": "https://media.giphy.com/media/TPXLTNiQLBwxW/giphy.gif",
    "lunch": "https://media1.tenor.com/images/8a01457a623ccd7582c6331b04194bf3/tenor.gif",
    "copier": "http://gifs.benlk.com/serious-hardware-copier-fax.gif",
    "smoke": "https://media1.tenor.com/images/1ba6092ef6c2ae0b4f61b8036d88dda5/tenor.gif",
    "meditate": "https://media.giphy.com/media/xUA7bcRTZMxdjGGUms/giphy.gif",
    "404": "https://i.imgur.com/j51uHm1.gif"
}

var imgTexts = {
    "default": "Be right back!",
    "coffee": "Grabbing some coffee!",
    "bathroom": "Defacation Nation.",
    "meeting": "In a meeting.",
    "lunch": "Grabbing a bite. Be back soon!",
    "copier": "Making copies. Back in a minute!",
    "smoke": "Out for a quick toke!",
    "meditate": "Approaching enlightenment.",
    "404": "404, page (and person) not found."
}

var curPageTag;

function getPageTag() {
    var urlToks = window.location.href.split("?");
    if (urlToks.length < 2 || urlToks[1].split("=").length < 2 ||
        urlToks[1].split("=")[0] != "tag")
        return TAG_GRID;
    var tag = urlToks[1].split("=")[1];

    // special tag catchers
    if (tag == TAG_GRID) return tag;

    if (!imgSrcs[urlToks[1].split("=")[1]])
        tag = TAG_404;

    return tag;
}

/******************************************************************************/
/**************************** CLOCK STUFF *************************************/
/******************************************************************************/

var clockEl;
var clockInterval;

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

function initClock() {
    clockEl = document.getElementById("time");
    clockInterval = setInterval(updateClock, 500);
}

/******************************************************************************/
/**************************** BRB PAGE STUFF **********************************/
/******************************************************************************/

function autosize() {
    setTimeout(function(){
        var el = document.getElementById("brbText");
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
}

function initImage() {
    document.title = "brb.me | " + curPageTag;
    document.getElementById("brbImg").src = imgSrcs[curPageTag];
}

function initTextArea() {
    document.getElementById("brbText").value = imgTexts[curPageTag];
    console.log(document.getElementById("brbText").value);
    document.getElementById("brbText").addEventListener("keydown", autosize);
}

function initBrb() {
    document.getElementById("main").className = null;;
    document.getElementById("gridCont").style.display= "none";
    document.getElementById("mainCont").style.display = "flex";
    document.getElementById("backButton").addEventListener("click",openGrid);
    initImage();
    initTextArea();
    autosize();
    console.log("brb loaded");
    setTimeout(function () {
        document.getElementById("mainCont").style.opacity = 1;
    }, 500);
}

/******************************************************************************/
/**************************** GRID PAGE STUFF *********************************/
/******************************************************************************/

var gridInited = false;
var gridEl;

function getParent(el,parentClass) {
    while (el.className.indexOf(parentClass) < 0)
        el = el.parentNode;
    return el;
}

function openCustomBrb() {
    console.log("custom");
}

function openOption(ev) {
    var el = getParent(ev.target, "gridItem");
    curPageTag = el.id.split("_")[1];
    window.history.pushState(null,"", "/?tag=" + curPageTag);
    document.getElementById("gridCont").style.opacity = null;
    setTimeout(function () {
        initBrb();
    }, 500);
}

function addOption(tag, src) {
    var gridItem = document.createElement("div");
    gridItem.className = "gridItem";
    gridItem.id = "gridItem_" + tag;
    gridItem.style.backgroundImage = "url(" + src + ")";
    gridItem.addEventListener("click",openOption);

    var gridItemTextEl = document.createElement("p");
    gridItemTextEl.innerHTML = tag;

    gridItem.appendChild(gridItemTextEl);

    gridEl.appendChild(gridItem);
}

function openGrid() {
    window.history.pushState(null,"", "/");
    document.getElementById("mainCont").style.opacity = null;
    setTimeout(initGrid, 500);
}

function initGrid() {
    document.getElementById("main").className = "mainGrid";
    document.getElementById("gridItem_custom").addEventListener("click",openCustomBrb);
    document.getElementById("mainCont").style.display = null;
    document.getElementById("gridCont").style.display = null;
    gridEl = document.getElementById("grid");
    if (!gridInited) {
        gridInited = true;
        var imgTags = Object.keys(imgSrcs);
        for (var i = 0; i < imgTags.length; i++)
            if (imgSrcs[imgTags[i]]) addOption(imgTags[i], imgSrcs[imgTags[i]]);
    }
    setTimeout(function () {
        document.getElementById("gridCont").style.opacity = 1;
    }, 100);
}

/******************************************************************************/
/**************************** INITIALIZATION **********************************/
/******************************************************************************/

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

function init() {
    initGrain();
    initClock();
    curPageTag = getPageTag();
    if (curPageTag == TAG_GRID) {
        initGrid();
    }
    else {
        initBrb();
    }
}

window.onload = init;
