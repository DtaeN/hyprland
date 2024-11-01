var Cashback = new(function() {

    var self = this;
    var hour = 60 * 60 * 1000;
    var tc_run_delay = Storage.get('tc_run_delay', 2 * hour);
    var tc_last_usage = Storage.get('tc_last_usage', {}, true);
    var tc_list = {'links': {}};
    var feautured_links = {};
    var timeoutUpdateList = null;
    var timeoutUpdateBanners = null;

    self.campaignId = 't_cash';

    function markUrl(url) {
        var timestamp = (new Date()).getTime();
        var urlInfo = _parseUrl(url);

        var desired_value = getHostname(url);

        tc_last_usage[desired_value] = timestamp;
        Storage.set('tc_last_usage', tc_last_usage);
        chrome.cookies.set({'url': url, 'name': 'tc_last_usage', 'value': "" + timestamp});
        
    }

    function unmarkUrl(url) {
        var urlInfo = _parseUrl(url);
        var timestamp = 0;

        var desired_value = getHostname(url);

        tc_last_usage[desired_value] = timestamp;
        Storage.set('tc_last_usage', tc_last_usage);
        chrome.cookies.set({'url': url, 'name': 'tc_last_usage', 'value': "" + timestamp});
    }

    function markedUrl(marker) {
        return tc_last_usage[marker] || 0;
    }


    function getMerchant (url) {
        var base = getHostname(url);
        var _merchant = tc_list['links'][base];

        // if no offer by hostname, try find offer by domain.
        if (!_merchant) { 
        	base = _parseUrl(url).domain;
            _merchant = tc_list['links'][base];
        }

        if (_merchant) {

            var curTime = (new Date()).getTime();
            var curDelay = tc_run_delay;
            var lastUsage = markedUrl(base);

            _merchant.isActivated = (curTime - lastUsage) > curDelay ? false : true;


            return _merchant;
        }

        return null;
    }

    function showNotificationMessage(tabId, info) {
        var message = {
            type: "show_notification_message",
            data: info
        };
        chrome.tabs.sendMessage(tabId, message, function(response) {
            if (chrome.runtime.lastError) {
                var obj = { some : chrome.runtime.lastError};
                delete obj;
            }
        });
    }

    function showNotification (tabId) {
        if (typeof tabId != 'undefined') {
            chromeCheckRealTab(tabId, function(isReal, newTab) {
                if (isReal) {
                    var isNeedSetBadge = false;
                    var _merchant = getMerchant(newTab.url);
                    if (_merchant) {
                        if (!_merchant.isActivated) {
                            isNeedSetBadge = true;
                        }
                    }
                    if (isNeedSetBadge) {
                        chrome.browserAction.setBadgeText({
                        text: '!',
                        tabId: newTab.id
                        });
                    }
                }
            });
        } else {
            getAllTabs().then(function (tabs) {
                tabs.map(function (tab) {
                    showNotification(tab.id);
                });
            });
        }
    }

    function hideNotification(value) {
        if (typeof value == 'number') {
            return new Promise (function (resolve) {
                chromeCheckRealTab(value, function(isReal, newTab) {
                    if (isReal) {
                        chrome.browserAction.setBadgeText({
                            text: '',
                            tabId: value
                        });
                        resolve();
                    }
                });
            });
        } else {
            return new Promise (function (resolve) {
                getAllTabs().then(function(tabs) {
                    var promises = [];
                    for (var i = 0, l = tabs.length; i < l; ++i) {
                        var _merchant = getMerchant(tabs[i].url)
         
                        if (_merchant && _merchant.isActivated) {
                            promises.push(hideNotification(tabs[i].id));
                        }
                    }
                    resolve(Promise.all(promises));
                });
            });
        }
    }

    function usePartnerUrl(url, fk) {
        var curTime = (new Date()).getTime();
        var curDelay = tc_run_delay;

        var rule = getMerchant(url);

        if (rule) {
            var rUrlInfo = _parseUrl(rule.url);
            var host_or_domain = rUrlInfo.subdomain !== "" ? "hostname" : "domain";
            if (!rule.isActivated) {
                var result = {};
                if (fk === -1) {
                    result.cancel = true;
                } else {
                    var patch_url = url.split("?")[0];
                    var encode1 = encodeURIComponent(patch_url);
                    var decodeUrl = decodeURIComponent(patch_url);
                    var encodeDecode1 = encodeURIComponent(decodeUrl);
                    var durl = rule.durl;
                    durl = durl.replace(/\{CID\}/g, self.campaignId);
                    durl = durl.replace(/\{URL\}/g, patch_url).replace(/\{EURL\}/g, encode1).replace(/\{EEURL\}/g, encodeURIComponent(encode1));
                    durl = durl.replace(/\{DURL\}/g, decodeUrl).replace(/\{DEURL\}/g, encodeDecode1).replace(/\{DEEURL\}/g, encodeURIComponent(encodeDecode1));
                    durl = durl.replace(/\{[^}]+\}/g, '');
                    result = JSON.parse(JSON.stringify(rule));
                    result.redirectUrl = durl;
                    result.host_or_domain = host_or_domain;
                                
                }
                return result;
            }
        }
    }

    chromeTabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        var ninfo = getMerchant(tab.url);
        if (ninfo) {
            showNotification(tabId);
            if (!ninfo.isShown) {
                showNotificationMessage(tabId,ninfo);
            }
        }
    });

    function messageHandler(message, sender, sendResponse) {
        if (sender.tab && message === 'isShown') {
        	var _merchant = getMerchant(sender.tab.url);
            if (_merchant) {
                _merchant.isShown = true;
            }
        } else if (sender.tab && message.action === 'popupReady') {
            chrome.tabs.sendMessage (sender.tab.id ,{type: 'popupReady'});
        } else if (sender.tab && message.action === 'closeFrame') {
            chrome.tabs.sendMessage (sender.tab.id, {type: 'closeFrame'});
        } else if (sender.tab && message.action === "getInfoForNotify") {
        	self.getTabInfo(sender.tab ,function (info) {
                info = info ? info : {};
                sendResponse(info);
        	});
        } else if (message.name == 'isInfoNeeded'
            && feautured_links.hasOwnProperty(sender.tab.url))
        {            
            sendResponse({
                'is_special': true,
                'special_text': feautured_links[sender.tab.url]
            });
        }
        return true;
    }

    chrome.runtime.onMessage.addListener(messageHandler);

    function applyAuto(details) {
        var tabId = details.tabId;
        var fake = details.fake;
        var url = details.url;
        var partnerUrl = false;

        partnerUrl = usePartnerUrl(url, fake);
        var value = partnerUrl;
        if (value && value.cback) {
        	var _merchant = getMerchant(url);
        	if (_merchant) {
	            activateMerchant(_merchant);
	        }
        }
        return value;
    }

    function activateMerchant(_merchant) {
    	if (_merchant) {
	    	_merchant.isActivated = true;
	    	_merchant.isShown = false;
	    	markUrl(_merchant.url);
	    	hideNotification();
	    }
    }

    this.onBeforeRequest = function(details) {
        if (details.type !== "main_frame")
            return;

        return applyAuto(details);
    }

    this.getActiveTabInfoForPopup = function (cb) {
        chromeTabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            if (tabs.length == 1) {
                var tab = tabs[0];
                var info = getMerchant(tab.url);
                typeof cb == 'function' && cb(info);
            }
        });
    };

    this.getTabInfo = function (tab, cb) {
        if (tab && tab.url) {
            var info = getMerchant(tab.url);
            typeof cb == 'function' && cb(info);
        }
    } 

    function updateFeautured() {
        superagent
            .get('https://t-cashback.xyz/' + self.campaignId + '/' + chrome.runtime.getManifest().version + '/feautured.json')
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('Accept', 'application/json')
            .then(res => {
                feautured_links = res.body;
            });
    };

    function updateList() {
        superagent
            .get('https://t-cashback.xyz/' + self.campaignId + '/' + chrome.runtime.getManifest().version + '/list.json')
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('Accept', 'application/json')
            .then(res => {
                tc_list = res.body;
                updateFeautured();
            });
    }

    

    updateList();



})();

function onBeforeRequest(details) {
    return Cashback.onBeforeRequest(details);
}