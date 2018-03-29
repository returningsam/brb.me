const TAG_DEFAULT  = "default";
const TAG_GRID     = "grid";
const TAG_404      = "404";
const TAG_CUSTOM   = "custom";

var brbData = {
    "default": {
        imgSrc: "https://media.giphy.com/media/f9RFAoYbM6RK5YaWuw/giphy.gif",
        text: "Be right back!",
        isCustom: false,
        display: true
    },
    "coffee": {
        imgSrc: "https://media.giphy.com/media/g4LldYJB2U42DgVYvc/giphy.gif",
        text: "Grabbing some coffee!",
        isCustom: false,
        display: true
    },
    "bathroom": {
        imgSrc: "https://media.giphy.com/media/9S1IvyHJFG2y3XDccT/giphy.gif",
        text: "Defacation Nation.",
        isCustom: false,
        display: true
    },
    "meeting": {
        imgSrc: "https://media.giphy.com/media/vv1G4pcNeuTAXQvhkR/giphy.gif",
        text: "In a meeting.",
        isCustom: false,
        display: true
    },
    "lunch": {
        imgSrc: "https://media.giphy.com/media/4NbdTEnGpJxgP0PVXb/giphy.gif",
        text: "Grabbing a bite. Be back soon!",
        isCustom: false,
        display: true
    },
    "rendering": {
        imgSrc: "https://media.giphy.com/media/fxaZ5C5yiXWVC27cdq/giphy.gif",
        text: "Rendering something.",
        isCustom: false,
        display: true
    }
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

    if (!brbData[urlToks[1].split("=")[1]])
        tag = TAG_404;

    return tag;
}

function validURL(str) {
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(str);
}

/******************************************************************************/
/**************************** BROWSER STORAGE STUFF ***************************/
/******************************************************************************/

var hasStorage = false;

function storageAvailable(type) {
    try {
        var storage = window[type], x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (e.code === 22 || e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}

function saveData() {
    if (!hasStorage) {
        console.log("Saving data failed: local storage not available");
        return;
    }

    localStorage.setItem("brbmeData", JSON.stringify(brbData));
}

function getData() {
    if (!hasStorage) {
        console.log("Retrieving data failed: local storage not available");
        return;
    }

    var temp = JSON.parse(localStorage.getItem("brbmeData"));
    if (temp) brbData = temp;
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
    var am_pm = ((h>12) ? "pm" : "am");
    h = checkTime(h%12);
    m = checkTime(m);
    clockEl.innerHTML = h + ":" + m + am_pm;
}

function initClock() {
    clockEl = document.getElementById("time");
    clockInterval = setInterval(updateClock, 500);
}

/******************************************************************************/
/**************************** BRB PAGE STUFF **********************************/
/******************************************************************************/

function hideBrbSection() {
    exitFullScreen();
    document.getElementById("mainCont").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("mainCont").style.display = null;
    }, 500);
}

function showBrbSection() {
    document.getElementById("main").classList.remove("mainGrid");
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
    document.getElementById("brbImg").src = brbData[curPageTag].imgSrc;
}

function handlePressEnter(ev) {
    var code = (ev.keyCode ? ev.keyCode : ev.which);
    if (code == 13) {
        ev.target.blur();
        ev.preventDefault();
    }
}

function initTextArea() {
    document.getElementById("brbText").value = brbData[curPageTag].text;
    document.getElementById("brbText").addEventListener("keydown", autosize);
    document.getElementById("brbText").addEventListener("keydown", handlePressEnter);
}

function initBrb() {
    initImage();
    initTextArea();
    autosize();
    showBrbSection();
    showFullScreenButton();
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
        document.getElementById("main").classList.remove("mainCustom");
    }, 500);
}

function showCustomSection() {
    showBackButton();
    document.getElementById("customCont").style.display = "flex";
    document.getElementById("main").classList.add("mainCustom");
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
    if (checkVal.length > 0 && !brbData[checkVal] && RegExp(/^[a-z0-9_-]+$/i).test(checkVal)) {
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
        brbData[tagValue] = {};
        brbData[tagValue].imgSrc   = urlValue;
        brbData[tagValue].text     = msgValue;
        brbData[tagValue].isCustom = true;
        brbData[tagValue].display = true;
        curPageTag = tagValue;
        hideCustomSection();
        window.history.pushState(null,"", "/?tag=" + curPageTag);
        setTimeout(openOption, 500);
        fillGrid();
        saveData();
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
    setTimeout(showCustomSection, 500);
}

/******************************************************************************/
/**************************** GRID SEARCH STUFF *******************************/
/******************************************************************************/

var curSearchValue = "";

function searchError() {
    console.log("not valid search input...");
}

function gridSearchHandler(ev) {
    console.log(ev);
    if (ev.metaKey) return true;

    var pressedChar = ev.key;

    if (pressedChar.length == 1 && curSearchValue.length < 50 &&
             RegExp(/^[a-z0-9_-]+$/i).test(pressedChar))
        curSearchValue += pressedChar;
    else searchError();

    console.log(curSearchValue);

    if (curSearchValue.length > 0)
        document.getElementById("titleEl").innerHTML = curSearchValue;
    else
        document.getElementById("titleEl").innerHTML = "brb";

    filterGridOptions();

    if (pressedChar == "Backspace") {
        ev.preventDefault();
        return false;
    }
}

function gridBackspaceHandler(ev) {
    if (ev.metaKey) return true;

    var pressedChar = ev.key;
    console.log(pressedChar == "Backspace");

    if (pressedChar == "Backspace") {
        if (curSearchValue.length > 0) {
            curSearchValue = curSearchValue.slice(0,curSearchValue.length-1);
            if (curSearchValue.length > 0)
                document.getElementById("titleEl").innerHTML = curSearchValue;
            else
                document.getElementById("titleEl").innerHTML = "brb";
            filterGridOptions();
        }
        ev.preventDefault();
        return false;
    }
}

function filterGridOptions() {
    var gridItems = document.getElementsByClassName("gridItem");
    for (var i = 0; i < gridItems.length; i++) {
        if (gridItems[i].id.split("_")[1].toLowerCase()
                .startsWith(curSearchValue.toLowerCase()) ||
            gridItems[i].id.split("_")[1].toLowerCase()
                    .indexOf(curSearchValue.toLowerCase()) > -1) {
            gridItems[i].style.display = null;
        }
        else gridItems[i].style.display = "none";
    }
}

/******************************************************************************/
/**************************** FULL PAGE STUFF *********************************/
/******************************************************************************/

var fullscreenEnabled = false;

function showFullScreenButton() {
    var fullScreenButton = document.getElementById("fullScreenButton");
    fullScreenButton.style.display = "flex";
    setTimeout(function () {
        fullScreenButton.style.opacity = 1;
    }, 10);
}

function hideFullScreenButton() {
    var fullScreenButton = document.getElementById("fullScreenButton");
    fullScreenButton.style.opacity = null;
    setTimeout(function () {
        fullScreenButton.style.display = null;
    }, 500);
}

function toggleFullScreen() {
    console.log(fullscreenEnabled);
    if (fullscreenEnabled) exitFullScreen();
    else enterFullScreen();
}

function enterFullScreen() {
    setTimeout(function () {
        document.getElementById("fullScreenButton").classList.replace("fullScreenButton", "fullScreenButtonEnabled");
    }, 700);
    var i = document.documentElement;
    if (i.requestFullscreen) i.requestFullscreen();
    else if (i.webkitRequestFullscreen) i.webkitRequestFullscreen();
    else if (i.mozRequestFullScreen) i.mozRequestFullScreen();
    else if (i.msRequestFullscreen) i.msRequestFullscreen();
    fullscreenEnabled = true;
}

function exitFullScreen() {
    setTimeout(function () {
        document.getElementById("fullScreenButton").classList.replace("fullScreenButtonEnabled", "fullScreenButton");
    }, 700);
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    fullscreenEnabled = false;
}

/******************************************************************************/
/**************************** GRID PAGE STUFF *********************************/
/******************************************************************************/

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
    document.getElementById("titleEl").innerHTML = "brb";
    document.body.removeEventListener("keypress",gridSearchHandler, false);
    document.body.removeEventListener("keydown",gridBackspaceHandler, false);
    document.getElementById("gridCont").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("main").classList.remove("mainGrid");
        document.getElementById("gridCont").style.display = "none";
    }, 500);
}

function showGridSection() {
    document.body.addEventListener("keypress", gridSearchHandler, false);
    document.body.addEventListener("keydown", gridBackspaceHandler, false);
    document.getElementById("main").classList.add("mainGrid");
    document.getElementById("gridCont").style.display = null;
    setTimeout(function () {
        document.getElementById("gridCont").style.opacity = 1;
        // fixGridElSize();
    }, 10);
}

function getParent(el,parentClass) {
    while (!el.classList.contains(parentClass)) {
        el = el.parentNode;
        if (el == document.body) return false;
    }
    return el;
}

function handleOptionClick(ev) {
    if (getParent(ev.target, "gridItemDeleteButton")) return;
    var el = getParent(ev.target, "gridItem");
    curPageTag = el.id.split("_")[1];
    console.log("Going to:  " + curPageTag);
    window.history.replaceState(null,"", "/?tag=" + curPageTag);
    openOption();
}

var delConfirmTag = false;

function exitDelConfirm(ev) {
    if (ev && !getParent(ev.target,"gridItemDeleteButton")) {
        document.getElementById("gridItemLabelText_" + delConfirmTag).innerHTML = delConfirmTag;
        document.getElementById("gridItemLabelText_" + delConfirmTag).style.color = null;
        delConfirmTag = false;
        document.body.removeEventListener("click",exitDelConfirm);
    }
}

function handleDeleteOption(ev) {
    var el = getParent(ev.target, "gridItem");
    var delTag = el.id.split("_")[1];
    if (!delConfirmTag) {
        delConfirmTag = delTag;
        document.getElementById("gridItemLabelText_" + delTag).innerHTML = "you sure?";
        document.getElementById("gridItemLabelText_" + delTag).style.color = "red";
        document.body.addEventListener("click",exitDelConfirm);
    }
    else {
        if (brbData[delTag].custom) delete brbData[delTag];
        brbData[delTag].display = false;
        var delElement = document.getElementById("gridItem_" + delTag);
        delElement.parentNode.removeChild(delElement);
        document.body.removeEventListener("click",exitDelConfirm);
        delConfirmTag = false;
        saveData();
    }
}

function openOption() {
    document.title = "brb.me | " + curPageTag;
    document.getElementById("gridCont").style.opacity = null;
    hideGridSection();
    hideCustomSection();
    setTimeout(initBrb, 500);
}

function addOption(tag, src) {
    var gridItem = document.createElement("div");
    gridItem.className = "gridItem";
    if (brbData[tag].order) gridItem.style.order = brbData[tag].order;
    else gridItem.style.order = 1;
    gridItem.id = "gridItem_" + tag;

    var gridItemImage = document.createElement("div");
    gridItemImage.className = "gridItemImage";
    gridItemImage.style.backgroundImage = "url('" + src + "')";
    gridItemImage.alt = "grid item " + tag;
    gridItem.appendChild(gridItemImage);

    gridItem.addEventListener("click",handleOptionClick);

    var gridItemLabel = document.createElement("div");
    gridItemLabel.className = "gridItemLabel";

    var gridItemTextEl = document.createElement("p");
    gridItemTextEl.id = "gridItemLabelText_" + tag;
    gridItemTextEl.innerHTML = tag;
    gridItemLabel.appendChild(gridItemTextEl);

    var gridItemDeleteButton = document.createElement("p");
    gridItemDeleteButton.id = "gridItemDeleteButton_" + tag;
    gridItemDeleteButton.className = "gridItemDeleteButton";
    gridItemDeleteButton.innerHTML = "&times;";
    gridItemDeleteButton.addEventListener("click",handleDeleteOption);
    gridItemLabel.appendChild(gridItemDeleteButton);

    gridItem.appendChild(gridItemLabel);
    gridEl.appendChild(gridItem);
}

function openGrid() {
    document.title = "brb.me";
    curPageTag = TAG_GRID;
    hideCustomSection();
    hideBackButton();
    hideBrbSection();
    hideFullScreenButton();

    setTimeout(showGridSection, 500);
    curSearchValue = "";
    filterGridOptions();
}

function fixGridElSize() {
    if (curPageTag == TAG_GRID) {
        var pageTags = Object.keys(brbData);
        for (var i = 0; i < pageTags.length; i++) {
            var tempGridEl = document.getElementById("gridItem_" + pageTags[i]);
            tempGridEl.style.maxWidth = null;
        }
        setTimeout(function () {
            var curMaxWidth = document.getElementById("gridItem_custom").clientWidth;
            for (var i = 0; i < pageTags.length; i++) {
                var tempGridEl = document.getElementById("gridItem_" + pageTags[i]);
                tempGridEl.style.maxWidth = curMaxWidth + "px";
            }
        }, 1000);
    }
}

function fillGrid() {
    console.log(brbData);
    gridEl = document.getElementById("grid");
    var imgTags = Object.keys(brbData);
    for (var i = 0; i < imgTags.length; i++)
        if (brbData[imgTags[i]] && brbData[imgTags[i]].display
            && !document.getElementById("gridItem_" + imgTags[i]))
            addOption(imgTags[i], brbData[imgTags[i]].imgSrc);
}

function initGrid() {
    gridEl = document.getElementById("grid");
    fillGrid();
    document.getElementById("gridItem_custom").addEventListener("click",openCustomBrb);
}

/******************************************************************************/
/**************************** ABOUT POPUP STUFF *******************************/
/******************************************************************************/

function showAbout() {
    var aboutPopup = document.getElementById("aboutPopup");
    aboutPopup.style.display = "flex";
    setTimeout(function () {
        aboutPopup.style.opacity = 1;
    }, 10);
}

function hideAbout(ev) {
    if (ev.target.classList.contains("aboutPopupCont","aboutPopupContInner")) {
        var aboutPopup = document.getElementById("aboutPopup");
        aboutPopup.style.opacity = null;
        setTimeout(function () {
            aboutPopup.style.display = null;
        }, 310);
    }
}

function initAbout() {
    document.getElementById("aboutLink").addEventListener("click",showAbout);
    document.getElementById("aboutPopup").addEventListener("click",hideAbout);
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

function updatePageLocation() {
    curPageTag = getPageTag();
    if (curPageTag == TAG_GRID) openGrid();
    else if (curPageTag == TAG_CUSTOM) openCustomBrb();
    else openOption();
}

function init() {
    hasStorage = storageAvailable('localStorage');
    getData();

    // init back button
    document.getElementById("backButton").addEventListener("click", function () {
        window.history.pushState(null,"", "/");
        openGrid();
    });
    // init custom save button
    document.getElementById("customSaveButton").addEventListener("click",submitCustomBrb);
    // init fullscreen button
    document.getElementById("fullScreenButton").addEventListener("click",toggleFullScreen);

    curPageTag = getPageTag();

    initGrain();
    initClock();
    initGrid();
    initAbout();

    if (curPageTag == TAG_GRID) showGridSection();
    else {
        hideGridSection();
        if (curPageTag == TAG_CUSTOM) openCustomBrb();
        else initBrb();
    }
    window.addEventListener('popstate', updatePageLocation);
}

window.onload = init;
