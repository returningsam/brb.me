const TAG_DEFAULT  = "default";
const TAG_GRID     = "grid";
const TAG_404      = "404";
const TAG_CUSTOM   = "custom";

var imgSrcs = {
    "default": "https://media1.tenor.com/images/da022946b861558e0f5ed59baca155d4/tenor.gif",
    "coffee": "https://media1.tenor.com/images/19a66ceae49113f2d82b0bf227503d99/tenor.gif",
    "bathroom": "https://media1.tenor.com/images/2e75b3cb88349c3fcd118c0e0abc35b3/tenor.gif",
    "meeting": "https://media.giphy.com/media/TPXLTNiQLBwxW/giphy.gif",
    "lunch": "https://media1.tenor.com/images/8a01457a623ccd7582c6331b04194bf3/tenor.gif",
    "copier": "http://gifs.benlk.com/serious-hardware-copier-fax.gif",
    "smoke": "https://media1.tenor.com/images/1ba6092ef6c2ae0b4f61b8036d88dda5/tenor.gif",
    "meditate": "https://media.giphy.com/media/xUA7bcRTZMxdjGGUms/giphy.gif",
    "404": "https://i.imgur.com/j51uHm1.gif",
    "rendering": "https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif"
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
    "404": "404, page (and person) not found.",
    "rendering": "Rendering something."
}

var curPageTag;

function getPageTag() {
    var urlToks = window.location.href.split("?");
    if (urlToks.length < 2 || urlToks[1].split("=").length < 2 ||
        urlToks[1].split("=")[0] != "tag")
        return TAG_GRID;
    var tag = urlToks[1].split("=")[1];

    // special tag catchers
    if (tag == TAG_GRID || tag == TAG_CUSTOM) return tag;

    if (!imgSrcs[urlToks[1].split("=")[1]])
        tag = TAG_404;

    return tag;
}

function validURL(str) {
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(str);
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

function hideBrbSection() {
    document.getElementById("mainCont").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("mainCont").style.display = null;
    }, 500);
}

function showBrbSection() {
    document.getElementById("main").className = null;
    document.getElementById("mainCont").style.display = "flex";
    setTimeout(function () {
        document.getElementById("mainCont").style.opacity = 1;
    }, 10);
    showBackButton();
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

function initImage() {
    document.getElementById("brbImg").src = imgSrcs[curPageTag];
}

function initTextArea() {
    document.getElementById("brbText").value = imgTexts[curPageTag];
    document.getElementById("brbText").addEventListener("keydown", autosize);
}

function initBrb() {
    initImage();
    initTextArea();
    autosize();
    showBrbSection();
}

/******************************************************************************/
/**************************** CUSTOM PAGE STUFF *******************************/
/******************************************************************************/

const VALID_ICON   = "&#x1F44C;";
const INVALID_ICON = "&#x1F44E;";

var urlValid = false;
var tagValid = false;
var msgValid = false;

var urlValue;
var tagValue;
var msgValue;

function hideCustomSection() {
    document.getElementById("customCont").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("customCont").style.display = null;
        document.getElementById("main").className = null;
    }, 500);
}

function showCustomSection() {
    document.getElementById("customCont").style.display = "flex";
    document.getElementById("main").className = "mainCustom";
    setTimeout(function () {
        document.getElementById("customCont").style.opacity = 1;
    }, 10);
}

function checkCustomInputUrl() {
    var checkVal = document.getElementById("customUrlInput").value;
    if (checkVal.length > 0 && validURL(checkVal) && checkVal.endsWith(".gif") && checkVal.indexOf("giphy.com") > -1) {
        urlValid = true;
        urlValue = checkVal;
        document.getElementById("customUrlValid").innerHTML = VALID_ICON;
    }
    else {
        urlValid = false;
        urlValue = null;
        document.getElementById("customUrlValid").innerHTML = INVALID_ICON;
    }
}

function checkCustomInputTag() {
    var checkVal = document.getElementById("customTagInput").value;
    if (checkVal.length > 0 && !imgSrcs[checkVal]) {
        tagValid = true;
        tagValue = checkVal;
        document.getElementById("customTagValid").innerHTML = VALID_ICON;
    }
    else {
        tagValid = false;
        tagValue = null;
        document.getElementById("customTagValid").innerHTML = INVALID_ICON;
    }
}

function checkCustomInputMsg() {
    var checkVal = document.getElementById("customMsgInput").value;
    if (checkVal.length > 0) {
        msgValid = true;
        msgValue = checkVal;
        document.getElementById("customMsgValid").innerHTML = VALID_ICON;
    }
    else {
        msgValid = false;
        msgValue = null;
        document.getElementById("customMsgValid").innerHTML = INVALID_ICON;
    }
}

function handleCustomInputTypeEvent(ev) {
    var inputType = ev.target.id;
    switch (inputType) {
        case "customUrlInput":
            checkCustomInputUrl();
            break;
        case "customTagInput":
            checkCustomInputTag();
            break;
        case "customMsgInput":
            checkCustomInputMsg();
            break;
    }
}

function submitCustomBrb() {
    if (urlValid && tagValid && msgValid) {
        imgSrcs[tagValue] = urlValue;
        imgTexts[tagValue] = msgValue;
        curPageTag = tagValue;
        hideCustomSection();
        setTimeout(openOption, 500);
        fillGrid();
    }
    else {
        document.getElementById("customSaveButton").style.backgroundColor = "red";
        setTimeout(function () {
            document.getElementById("customSaveButton").style.backgroundColor = null;
        }, 300);
    }
}

function initCustomInputs() {
    urlValid = false;
    tagValid = false;
    msgValid = false;
    urlValue = null;
    tagValue = null;
    msgValue = null;
    var inputs = document.getElementById("customCont")
                    .getElementsByTagName("textarea");
    for (var i = 0; i < inputs.length; i++)
        inputs[i].value = "";
    for (var i = 0; i < inputs.length; i++)
        inputs[i].addEventListener("keyup", handleCustomInputTypeEvent);
}

function openCustomBrb() {
    window.history.pushState(null,"","/?tag=custom");
    document.title = "brb.me | custom";
    hideGridSection();
    initCustomInputs();
    showBackButton();
    setTimeout(showCustomSection, 500);
}

/******************************************************************************/
/**************************** GRID PAGE STUFF *********************************/
/******************************************************************************/

var gridInited = false;
var gridEl;

function hideBackButton() {
    document.getElementById("backButtonCont").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("backButtonCont").style.display = null;
    }, 500);
}

function showBackButton() {
    document.getElementById("backButtonCont").style.display = "block";
    setTimeout(function () {
        document.getElementById("backButtonCont").style.opacity = 1;
    }, 10);
}

function hideGridSection() {
    document.getElementById("gridCont").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("main").className = null;
        document.getElementById("gridCont").style.display = "none";
    }, 500);
}

function showGridSection() {
    document.getElementById("main").className = "mainGrid";
    document.getElementById("gridCont").style.display = null;
    setTimeout(function () {
        document.getElementById("gridCont").style.opacity = 1;
    }, 10);
}

function getParent(el,parentClass) {
    while (el.className.indexOf(parentClass) < 0)
        el = el.parentNode;
    return el;
}

function handleOptionClick(ev) {
    var el = getParent(ev.target, "gridItem");
    curPageTag = el.id.split("_")[1];
    openOption();
}

function openOption() {
    document.title = "brb.me | " + curPageTag;
    window.history.pushState(null,"", "/?tag=" + curPageTag);
    document.getElementById("gridCont").style.opacity = null;
    hideGridSection();
    setTimeout(initBrb, 500);
}

function addOption(tag, src) {
    var gridItem = document.createElement("div");
    gridItem.className = "gridItem";
    gridItem.id = "gridItem_" + tag;
    gridItem.style.backgroundImage = "url(" + src + ")";
    gridItem.addEventListener("click",handleOptionClick);

    var gridItemTextEl = document.createElement("p");
    gridItemTextEl.innerHTML = tag;

    gridItem.appendChild(gridItemTextEl);

    gridEl.appendChild(gridItem);
}

function openGrid() {
    window.history.pushState(null,"", "/");
    document.title = "brb.me";
    hideCustomSection();
    hideBackButton();
    hideBrbSection();
    setTimeout(showGridSection, 500);
}

function fixGridElSize() {
    if (curPageTag == TAG_GRID) {
        var pageTags = Object.keys(imgTexts);
        var curMaxWidth = document.getElementById("gridItem_custom").clientWidth;
        for (var i = 0; i < pageTags.length; i++) {
            var tempGridEl = document.getElementById("gridItem_" + pageTags[i]);
            tempGridEl.style.maxWidth = curMaxWidth + "px";
        }
    }
}

function fillGrid() {
    gridEl = document.getElementById("grid");
    var imgTags = Object.keys(imgSrcs);
    for (var i = 0; i < imgTags.length; i++)
        if (imgSrcs[imgTags[i]] && !document.getElementById("gridItem_" + imgTags[i]))
            addOption(imgTags[i], imgSrcs[imgTags[i]]);
    fixGridElSize();
}

function initGrid() {
    gridEl = document.getElementById("grid");
    if (!gridInited) {
        gridInited = true;
        fillGrid();
    }

    document.getElementById("gridItem_custom").addEventListener("click",openCustomBrb);
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

function resize() {
    fixGridElSize();
}

function init() {
    // init back button
    document.getElementById("backButton").addEventListener("click",openGrid);
    // init custom save button
    document.getElementById("customSaveButton").addEventListener("click",submitCustomBrb);

    curPageTag = getPageTag();
    initGrain();
    initClock();
    initGrid();

    if (curPageTag == TAG_GRID) {
        showGridSection();
    }
    else if (curPageTag == TAG_CUSTOM) {
        openCustomBrb();
    }
    else {
        initBrb();
    }
}

window.onload = init;
window.onresize = resize;
