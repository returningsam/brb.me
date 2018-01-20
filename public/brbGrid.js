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

var gridEl;

function addOption(tag, src) {
    var gridItem = document.createElement("div");
    gridItem.className = "gridItem";
    gridItem.id = "gridItem_" + tag;
    gridItem.style.backgroundImage = "url(" + src + ")";

    var gridItemTextEl = document.createElement("a");
    gridItemTextEl.innerHTML = tag;
    gridItemTextEl.href = "index.html?tag=" + tag;

    gridItem.appendChild(gridItemTextEl);

    gridEl.appendChild(gridItem);
}

function initOptions() {
    gridEl = document.getElementById("grid");
    var imgTags = Object.keys(imgSrcs);
    for (var i = 0; i < imgTags.length; i++)
        if (imgSrcs[imgTags[i]]) addOption(imgTags[i], imgSrcs[imgTags[i]]);
}

function init() {
    initOptions();
}

window.onload = init;
