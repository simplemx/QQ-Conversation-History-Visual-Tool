(function(context) {
    var welcomeMsgArray = [
        "第一个句子", 
        "第二个句子", 
        "第三个句子", 
        "第四个句子"
        ];
    var coverMsgArray = [
        "这里想些好句子", 
        "根据长短精心安排合理", 
        "就可以拼出个心形", 
        "应该是挺不错的", 
        "对吧对吧", 
        "啦拉"
        ];

    var welcomeMsgIndex = 0;
    var currentWelcomeDiv = null;
    var welcomeMsgDiv1 = null;
    var welcomeMsgDiv2 = null;
    var getCurrentWelcomeDiv = function() {
        if (currentWelcomeDiv === null) {
            return welcomeMsgDiv1;
        } else {
            return currentWelcomeDiv === welcomeMsgDiv1 ? welcomeMsgDiv2: welcomeMsgDiv1;
        }
    };

    var showCoverMsg = function() {
        var cover = document.getElementById("cover");
        if (cover) {
            var newElem = null;
            var elems = [];
            for (var i = 0; i < coverMsgArray.length; i++) {
                newElem = document.createElement("div");
                newElem.setAttribute("class", "coverMsg opacityDiv");
                newElem.setAttribute("id", "coverMsg" + i);
                newElem.innerText = coverMsgArray[i];
                cover.appendChild(newElem);
                elems.push(newElem);
            }
            for (var i = 0; i < elems.length; i++) {
                setTimeout((function(elem) {
                    return function() {
                        elem.style.opacity = 100;
                    };
                })(elems[i]), 1000 * i);
            }
            setTimeout(initWelcomeInfo, elems.length * 1000);
        }
    };

    var initWelcomeInfo = function() {
        var div = document.getElementById("center");
        if (div) {
            div.style.opacity = 100;
            div.onclick = function() {
                var start = document.getElementById("start");
                start.style.display = "none";
                var main = document.getElementById("main");
                main.style.display = "block";
                beginShow();
            };
            var before = document.getElementById("beforeline");
            if (before) {
                before.style.opacity = 100;
            }
            var after = document.getElementById("afterline");
            if (after) {
                after.style.opacity = 100;
            }
        }
    };

    context.showWelcomeMsg = function() {
        welcomeMsgDiv1 = document.getElementById("welcomeMsg1");
        welcomeMsgDiv2 = document.getElementById("welcomeMsg2");

        if (currentWelcomeDiv) {
            currentWelcomeDiv.style.opacity = 0;
        }
        currentWelcomeDiv = getCurrentWelcomeDiv();
        if (currentWelcomeDiv && welcomeMsgIndex < welcomeMsgArray.length) {
            currentWelcomeDiv.style.opacity = 100;
            currentWelcomeDiv.innerText = welcomeMsgArray[welcomeMsgIndex++];
            setTimeout(showWelcomeMsg, 3000);
        } 
        else if (coverMsgArray && coverMsgArray.length > 0) {
            showCoverMsg();
        } 
        else {
            setTimeout(initWelcomeInfo, 2000);
        }
    };
})(window);

window.onload = function() {
    showWelcomeMsg();
};