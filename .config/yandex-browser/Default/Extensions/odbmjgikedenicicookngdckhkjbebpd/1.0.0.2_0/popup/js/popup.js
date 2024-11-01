var Cashback = {};
var bgWindow = chrome.extension.getBackgroundPage();
Cashback = bgWindow.Cashback;

var init = function ()
{
    Cashback.getActiveTabInfoForPopup(renderView);
}
document.addEventListener('DOMContentLoaded', function () {
    init();
});

function roundNumbers (value, decimals) {
    return Number(Math.ceil(value+'e'+decimals)+'e-'+decimals);
}

function renderView (info) {
    $('.statement').attr('hidden','');
    $('.no_cashback').removeAttr('hidden');

    if (info) {
        $('.statement_content-title').each(function (index,element) {element.innerText = info.title});
        $('.store_card-img').each(function (index,element) {element.src = info.image; element.alt = info.title;});
        $('.statement').attr('hidden','');

        var resOfferValue = roundNumbers(info.cback.val, (info.cback.cur ? 0 : 1)) + (info.cback.cur ? " р." : "%");
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
}

