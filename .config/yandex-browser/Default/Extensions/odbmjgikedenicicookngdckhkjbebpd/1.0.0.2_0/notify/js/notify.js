
var Cashback = {};
var init = function() 
{
    chrome.runtime.sendMessage({action: "getInfoForNotify"}, function (response) {
        renderView(response);
    });
}

function onCloseClick(event) {
	chrome.runtime.sendMessage({action: "closeFrame"});
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});



function initHandlers()
{
    $('.header-close').on('click', onCloseClick);

    window.onload = function () {
        chrome.runtime.sendMessage({action: "popupReady"});
    }
}

function renderView (info) {

	function round (value, decimals) {
	    return Number(Math.ceil(value+'e'+decimals)+'e-'+decimals);
	}

    if (info) {
        $('.store_card-img').each(function (index,element) {
        	element.src = info.image;
        	element.alt = info.title;
        });
        $('.extension_wrapper').attr('hidden','');

        var resOfferValue = round(info.cback.val, (info.cback.cur ? 0 : 1)) + (info.cback.cur ? "р" : "%");
        var offerMessage = "Кэшбэк" + info.cback.rng + " ";

        $('.store_cashback').each(function (index,element) {
            element.textContent = offerMessage;
            var bValue = document.createElement("b");
            bValue.textContent = resOfferValue;
            element.appendChild(bValue);
        });

        if (!info.isActivated) {
            $('.cashback_not_activated').removeAttr('hidden');
        } else {
            $('.cashback_activated').removeAttr('hidden');
        }
}
    initHandlers();
}