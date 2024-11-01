var chromeManifest = null;
var chromeTabs = chrome.tabs;
var ChromeRealTabs = {};

var Storage = {
	set: function(key, value, json) {
		typeof json == 'undefined' && (json = true);

		data = typeof value == 'undefined' ? null : value;

		json && (data = JSON.stringify(data));

		window.localStorage.setItem(key, data);

		return value;
	},
	get: function(key, value, json) {
		var data = window.localStorage.getItem(key);

		if (data === null)
		{
			return value;
		}

		try 
		{
			data = JSON.parse(data);
		}
		catch(e)
		{
			json && (data = value);
		}

		return data;
	}
}

function getFromStorageLocal (key) {
	return new Promise (function (resolve, reject) {
		chrome.storage.local.get(key, function (res) {
			res = res[key] ? res[key] : null;
			resolve(res);
		});
	});
}

function getAllTabs()
{
	var promise = new Promise(function(resolve, reject) {
		chromeTabs.query({}, function (tabs)
		{
			resolve(tabs);
		});
	});

	return promise;
}

function chromeCheckRealTab(tabId, callback)
{
	chromeTabs.get(tabId, function (tab)
	{
		callback(!chrome.runtime.lastError && tab, tab);
	});
}
							
getAllTabs().then(function (tabs) {
	for (var i = 0, l = tabs.length; i < l; ++i)
	{
		var tabId = tabs[i].id;
		ChromeRealTabs[tabId] = tabId;
	}
});

chromeTabs.onCreated.addListener(function (tab)
{
	chromeCheckRealTab(tab.id, function(isReal)
	{
		if (isReal)
		{
			ChromeRealTabs[tab.id] = tab.id;
		}
	});
}); 

chromeTabs.onReplaced.addListener(function(addedTabId, removedTabId)
{
	chromeCheckRealTab(addedTabId, function (isReal, newTab)
	{
		if (isReal)
		{
			delete ChromeRealTabs[removedTabId];
			ChromeRealTabs[newTab.id] = newTab.id;
		}
	});
});

chromeTabs.onRemoved.addListener(function(tabId, removeInfo)
{
	delete ChromeRealTabs[tabId];
});

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
	try
	{
		if (typeof onBeforeRequest == 'function')
		{
			var tabId = details.tabId;
			var url = details.url;
			var fake = ChromeRealTabs[tabId] || -1;

			details.fake = fake;

			var value = onBeforeRequest(details);
			if (value instanceof Object)
			{
				var redirectUrl = value.redirectUrl;
				var cancel = value.cancel;

				redirectUrl = typeof redirectUrl == 'string' && redirectUrl != url && redirectUrl;

				if (cancel === true)
				{
					return {cancel: true};
				}
				else if (redirectUrl && fake != -1)
				{
					chromeTabs.update(tabId, {url : redirectUrl});
					return {cancel: true};
				}
			}
		}
	}
	catch(e) 
	{}
}, {urls: ["<all_urls>"]}, ["blocking"]);