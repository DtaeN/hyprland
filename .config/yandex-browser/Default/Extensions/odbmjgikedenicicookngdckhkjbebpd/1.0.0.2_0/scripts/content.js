(function () {
var isGotMessage = false;

var timeOutId = null;
var actualFrame = null;

var isNeedShowFrame = false;

var iframeId = "t_cashback_extension_inline_annotation";
var notifyHtmlUrl = "notify/notify.html"; 

var frameHeightPx = 280;

function showNotificationMessage(info) {
    if (document.querySelector('#' + iframeId) === null) {
        if (info && !info.isShown) {
            var iframeHeight = "height: " + frameHeightPx + "px!important;";
            var iframeStyle = iframeHeight + "width: 400px!important; visibility: hidden; display: block!important; border:0px!important; clip: unset!important; position: fixed; z-index: 2147483647;\
                                top: 10px; right: 10px; padding: 0px; margin: 0px; background-color: #fff; box-shadow: 0 15px 24px 0 rgba(0,0,0,.07)";
            var div = document.createElement("iframe");
            div.src = chrome.extension.getURL(notifyHtmlUrl);
            div.id = iframeId;
            div.style.cssText = iframeStyle;
            if (document.body) {
                document.body.appendChild(div);
                actualFrame = div;
                isNeedShowFrame = true;
                setTimeout(function(){
                    changeFrame();
                }, 500);
                timeOutId = setTimeout(function () {
                    closeFrame();
                }, 10000);
            } else {
                setTimeout(function() {
                    showNotificationMessage(info);
                }, 1000);
            }
        }
    }
};

function closeFrame () {
    clearTimeout(timeOutId);
    var frame = document.querySelector('#' + iframeId);
    if (frame)
    {
        frame.remove();
    }

    chrome.runtime.sendMessage('isShown', function(response) {
        if (chrome.runtime.lastError) {
            var obj = { some : chrome.runtime.lastError};
            delete obj;
        }
    });
};

function changeFrame () {
    if (isNeedShowFrame) {
        actualFrame.style.visibility = "visible";
    }
}

chrome.runtime.sendMessage({name:'isInfoNeeded', url: location.href}, function(response) {

    var callback = function () {

        var _iframeEl = document.querySelector('#' + iframeId), 
            callback = response;
        if (_iframeEl && typeof response == 'object' && response.is_special) {
            var logo = _iframeEl.querySelector('.header-logo');
            if (logo)
            {
                var appendToHeader = '<span color="red">' + response.special_text + '</span>';
                logo.parentNode.insertBefore(appendToHeader, logo);
            }

        }
        else if (response) {
            setTimeout(callback, 0);
        }
    }
    
    callback();
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if ((message.type === "show_notification_message") && !isGotMessage) {
        isGotMessage = true;
        showNotificationMessage(message.data);
    } else if (message.type === 'popupReady') {
        changeFrame();
    } else if (message.type === 'closeFrame') {
        closeFrame();
    }
});
}) ();