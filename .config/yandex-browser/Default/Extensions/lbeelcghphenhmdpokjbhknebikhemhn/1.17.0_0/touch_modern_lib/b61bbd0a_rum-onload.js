!function(e){function t(){var t=e._addListener||addEventListener;"complete"===document.readyState?n():t("load",n)}function n(){if(removeEventListener("load",n),e.sendTimeMark("1724"),e.getSetting("sendAutoResTiming"))for(var t=e.getSetting("autoResTimingSelector")||"script[data-rCid], div[data-rCid]",i=document.querySelectorAll(t),a=0,d=i.length;a<d;a++){var r=i[a],o=r.src;if(!o){var u=getComputedStyle(r).backgroundImage;if(u){var l=u.match(/^url\(["']?(.*?)["']?\)$/);l&&(o=l[1])}}o&&e.sendResTiming(r.getAttribute("data-rCid"),o)}}e.enabled&&!e._onloadCounterInited&&(e._onloadCounterInited=!0,t(),e._onInit&&e._onInit.push(t))}(Ya.Rum);