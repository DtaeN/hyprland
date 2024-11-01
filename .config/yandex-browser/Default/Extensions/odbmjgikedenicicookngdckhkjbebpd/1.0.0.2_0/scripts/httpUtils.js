function _generateDomainRegexp()
{
	var topLevelDomains = {
		"au": "com|net|org|edu|gov|asn|id|info|conf|oz|act|nsw|nt|qld|sa|tas|vic|wa|act.edu|nsw.edu|nt.edu|qld.edu|sa.edu|tas.edu|vic.edu|wa.edu|qld.gov|sa.gov|tas.gov|vic.gov|wa.gov|blogspot.com",
		"br": "adm|adv|agr|am|arq|art|ato|b|bio|blog|bmd|cim|cng|cnt|com|coop|ecn|eco|edu|emp|eng|esp|etc|eti|far|flog|fm|fnd|fot|fst|g12|ggf|gov|imb|ind|inf|jor|jus|leg|lel|mat|med|mil|mp|mus|net|*nom|not|ntr|odo|org|ppg|pro|psc|psi|qsl|radio|rec|slg|srv|taxi|teo|tmp|trd|tur|tv|vet|vlog|wiki|zlg|blogspot.com",
		"cn": "ac|com|edu|gov|net|org|mil|ah|bj|cq|fj|gd|gs|gz|gx|ha|hb|he|hi|hl|hn|jl|js|jx|ln|nm|nx|qh|sc|sd|sh|sn|sx|tj|xj|xz|yn|zj|hk|mo|tw|",
		"com": "betainabox|ar|br|cn|de|eu|gb|hu|jpn|kr|mex|no|qc|ru|sa|se|uk|us|uy|za|africa|gr|co|cloudcontrolled|cloudcontrolapp|dreamhosters|dyndns-at-home|dyndns-at-work|dyndns-blog|dyndns-free|dyndns-home|dyndns-ip|dyndns-mail|dyndns-office|dyndns-pics|dyndns-remote|dyndns-server|dyndns-web|dyndns-wiki|dyndns-work|blogdns|cechire|dnsalias|dnsdojo|doesntexist|dontexist|doomdns|dyn-o-saur|dynalias|est-a-la-maison|est-a-la-masion|est-le-patron|est-mon-blogueur|from-ak|from-al|from-ar|from-ca|from-ct|from-dc|from-de|from-fl|from-ga|from-hi|from-ia|from-id|from-il|from-in|from-ks|from-ky|from-ma|from-md|from-mi|from-mn|from-mo|from-ms|from-mt|from-nc|from-nd|from-ne|from-nh|from-nj|from-nm|from-nv|from-oh|from-ok|from-or|from-pa|from-pr|from-ri|from-sc|from-sd|from-tn|from-tx|from-ut|from-va|from-vt|from-wa|from-wi|from-wv|from-wy|getmyip|gotdns|hobby-site|homelinux|homeunix|iamallama|is-a-anarchist|is-a-blogger|is-a-bookkeeper|is-a-bulls-fan|is-a-caterer|is-a-chef|is-a-conservative|is-a-cpa|is-a-cubicle-slave|is-a-democrat|is-a-designer|is-a-doctor|is-a-financialadvisor|is-a-geek|is-a-green|is-a-guru|is-a-hard-worker|is-a-hunter|is-a-landscaper|is-a-lawyer|is-a-liberal|is-a-libertarian|is-a-llama|is-a-musician|is-a-nascarfan|is-a-nurse|is-a-painter|is-a-personaltrainer|is-a-photographer|is-a-player|is-a-republican|is-a-rockstar|is-a-socialist|is-a-student|is-a-teacher|is-a-techie|is-a-therapist|is-an-accountant|is-an-actor|is-an-actress|is-an-anarchist|is-an-artist|is-an-engineer|is-an-entertainer|is-certified|is-gone|is-into-anime|is-into-cars|is-into-cartoons|is-into-games|is-leet|is-not-certified|is-slick|is-uberleet|is-with-theband|isa-geek|isa-hockeynut|issmarterthanyou|likes-pie|likescandy|neat-url|saves-the-whales|selfip|sells-for-less|sells-for-u|servebbs|simple-url|space-to-rent|teaches-yoga|writesthisblog|firebaseapp|flynnhub|githubusercontent|ro|appspot|blogspot|codespot|googleapis|googlecode|pagespeedmobilizer|withgoogle|herokuapp|herokussl|4u|nfshost|operaunite|outsystemscloud|rhcloud|sinaapp|vipsinaapp|1kapp|hk|yolasite",
		"de": "com|fuettertdasnetz|isteingeek|istmein|lebtimnetz|leitungsen|traeumtgerade|blogspot",
		"fr": "com|asso|nom|prd|presse|tm|aeroport|assedic|avocat|avoues|cci|chambagri|chirurgiens-dentistes|experts-comptables|geometre-expert|gouv|greta|huissier-justice|medecin|notaires|pharmacien|port|veterinaire|blogspot",
		"kz": "org|edu|net|gov|mil|com",
		"org": "ae|us|dyndns|blogdns|blogsite|boldlygoingnowhere|dnsalias|dnsdojo|doesntexist|dontexist|doomdns|dvrdns|dynalias|endofinternet|endoftheinternet|from-me|game-host|go.dyndns|gotdns|kicks-ass|misconfused|podzone|readmyblog|selfip|sellsyourhome|servebbs|serveftp|servegame|stuff-4-sale|webhop|eu|al.eu|asso.eu|at.eu|au.eu|be.eu|bg.eu|ca.eu|cd.eu|ch.eu|cn.eu|cy.eu|cz.eu|de.eu|dk.eu|edu.eu|ee.eu|es.eu|fi.eu|fr.eu|gr.eu|hr.eu|hu.eu|ie.eu|il.eu|in.eu|int.eu|is.eu|it.eu|jp.eu|kr.eu|lt.eu|lu.eu|lv.eu|mc.eu|me.eu|mk.eu|mt.eu|my.eu|net.eu|ng.eu|nl.eu|no.eu|nz.eu|paris.eu|pl.eu|pt.eu|q-a.eu|ro.eu|ru.eu|se.eu|si.eu|sk.eu|tr.eu|uk.eu|us.eu|hk|za",
		"ru": "ac|com|edu|int|net|org|pp|adygeya|altai|amur|arkhangelsk|astrakhan|bashkiria|belgorod|bir|bryansk|buryatia|cbg|chel|chelyabinsk|chita|chukotka|chuvashia|dagestan|dudinka|e-burg|grozny|irkutsk|ivanovo|izhevsk|jar|joshkar-ola|kalmykia|kaluga|kamchatka|karelia|kazan|kchr|kemerovo|khabarovsk|khakassia|khv|kirov|koenig|komi|kostroma|krasnoyarsk|kuban|kurgan|kursk|lipetsk|magadan|mari|mari-el|marine|mordovia|msk|murmansk|nalchik|nnov|nov|novosibirsk|nsk|omsk|orenburg|oryol|palana|penza|perm|ptz|rnd|ryazan|sakhalin|samara|saratov|simbirsk|smolensk|spb|stavropol|stv|surgut|tambov|tatarstan|tom|tomsk|tsaritsyn|tsk|tula|tuva|tver|tyumen|udm|udmurtia|ulan-ude|vladikavkaz|vladimir|vladivostok|volgograd|vologda|voronezh|vrn|vyatka|yakutia|yamal|yaroslavl|yekaterinburg|yuzhno-sakhalinsk|amursk|baikal|cmw|fareast|jamal|kms|k-uralsk|kustanai|kuzbass|magnitka|mytis|nakhodka|nkz|norilsk|oskol|pyatigorsk|rubtsovsk|snz|syzran|vdonsk|zgrad|gov|mil|test|blogspot",
		"ua": "com|edu|gov|in|net|org|cherkassy|cherkasy|chernigov|chernihiv|chernivtsi|chernovtsy|ck|cn|cr|crimea|cv|dn|dnepropetrovsk|dnipropetrovsk|dominic|donetsk|dp|if|ivano-frankivsk|kh|kharkiv|kharkov|kherson|khmelnitskiy|khmelnytskyi|kiev|kirovograd|km|kr|krym|ks|kv|kyiv|lg|lt|lugansk|lutsk|lv|lviv|mk|mykolaiv|nikolaev|od|odesa|odessa|pl|poltava|rivne|rovno|rv|sb|sebastopol|sevastopol|sm|sumy|te|ternopil|uz|uzhgorod|vinnica|vinnytsia|vn|volyn|yalta|zaporizhzhe|zaporizhzhia|zhitomir|zhytomyr|zp|zt|co|pp",
		"uk": "ac|co|gov|ltd|me|net|nhs|org|plc|police|*sch|service.gov|blogspot.co",
		"hk": "com|edu|gov|idv|net|org|blogspot|ltd|inc",
		"kr": "ac|co|es|go|hs|kg|mil|ms|ne|or|pe|re|sc|busan|chungbuk|chungnam|daegu|daejeon|gangwon|gwangju|gyeongbuk|gyeonggi|gyeongnam|incheon|jeju|jeonbuk|jeonnam|seoul|ulsan|blogspot",
		"id": "ac|biz|co|desa|go|mil|my|net|or|sch|web",
		"ph": "com|net|org|gov|edu|ngo|mil|i",
		"tw": "edu|gov|mil|com|net|org|idv|game|ebiz|club|blogspot",
		"jp": "ac|ad|co|ed|go|gr|lg|ne|or|blogspot",
		"vn": "com|net|org|edu|gov|int|ac|biz|info|name|pro|health",
		"in": "co|firm|net|org|gen|ind|nic|ac|edu|res|gov|mil|blogspot",
		"my": "com|net|org|gov|edu|mil|name",
		"sg": "com|net|org|gov|edu|per|blogspot",
		"ee": "edu|gov|riik|lib|med|com|pri|aip|org|fie",
		"th": "ac|co|go|in|mi|net|or"
	};
	var customPart = "";
	for (var _top in topLevelDomains)
	{
		if (topLevelDomains.hasOwnProperty(_top))
		{
			customPart += "(?:(?:" + topLevelDomains[_top].replace(/\./gi, "\\.").replace(/\*/gi, "[\\w\\u0430-\\u044f]\\+\\*") + ")\\." + _top + ")|";
		}
	}
	var basePart = "((?:[^.]+)\\.(?:" + customPart + "[\\w\\u0430-\\u044f]+))$";
	var outReg = new RegExp(basePart, "i");
	return outReg;
}

function _getBaseDomain(hostname)
{
	var matches = hostname.match(_generateDomainRegexp());
	var result;
	if (matches)
	{
		result = matches[1];
	}
	return result;
}

function _getSubDomain(hostname, domain)
{
	var result = hostname.replace(domain, "");
	if (result)
	{
		result = result.replace(/\.$/, "");
	}
	return result;
}

function getHostname (url) {
	var parsedUrl = _parseUrl(url);
	return parsedUrl["hostname"];
}

function _parseUrl(url)
{
	var location = null;

	try
	{
		var href = url.toLowerCase().replace(/^[\s]*|[\s]*$/g,"");
		var pattern = "^(([^:/\\?#]+):)?(//(([^:/\\?#]*)(?::([^/\\?#]*))?))?([^\\?#]*)(\\?([^#]*))?(#(.*))?$";
		var regex = new RegExp(pattern);
		var parts = regex.exec(href);

		var host = parts[4];
		var hostname = parts[5];

		var hostname = hostname.replace(/(^www\.)/ig, "");
		var domain = _getBaseDomain(hostname);
		var subdomain = _getSubDomain(hostname, domain);

		var location = {
			href : href,
			protocol : parts[1] || '',
			host : host || '',
			hostname : hostname || '',
			domain : domain || '',
			subdomain : subdomain || '',
			port : parts[6] || '',
			pathname : parts[7] || '',
			search : parts[8] || '',
			hash : parts[10] || ''
		};

		location.origin = location.protocol + '//' + location.host;
	}
	catch(e)
	{}
	if (!location) {
		location = {
			href : href,
			protocol : parts[1] || '',
			host : host || '',
			hostname : hostname || '',
			domain : domain || '',
			subdomain : subdomain || '',
			port : parts[6] || '',
			pathname : parts[7] || '',
			search : parts[8] || '',
			hash : parts[10] || ''
		};
	}
	return location;  
}