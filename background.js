//
// Author cloud@txthinking.com
//

chrome.browserAction.onClicked.addListener(function(tab) {
    var on = localStorage.on || 'yes';
    if(on === 'yes'){
        localStorage.on = 'no';
        chrome.browserAction.setIcon({path: "off.png"});
        chrome.browserAction.setTitle({title: "Click to enable"});
    }else{
        localStorage.on = 'yes';
        chrome.browserAction.setIcon({path: "on.png"});
        chrome.browserAction.setTitle({title: "Click to disable"});
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        var on = localStorage.on || 'yes';
        if(on === 'no'){
            return {
                requestHeaders: details.requestHeaders
            };
        }

        var ai;
        var ri;
        var name;
        var value;
        for (var i=0; i<details.requestHeaders.length; i++) {
            if(typeof ai !== 'undefined' && typeof ri !== 'undefined'){
                break;
            }
            name = details.requestHeaders[i].name;
            if (name === 'Accept' || name === 'accept') {
                ai = i;
            }
            if (name === 'Referer' || name === 'referer') {
                ri = i;
            }
        }
        value = details.requestHeaders[ai].value;
        v = value.split(",");
        if(v.length>0){
            // wiki: https://en.wikipedia.org/wiki/MIME_type#Type_image
            var ihs = ["image/webp", "image/png", "image/gif", "image/jpeg", "image/pjpeg"];
            if(ihs.indexOf(v[0]) !== -1){
                details.requestHeaders[ri].value = details.url;
                if(details.url.indexOf("qpic.cn") !== -1){
                    details.requestHeaders.splice(ri, 1);
                }
            }
            console.log(details)
        }
        return {
            requestHeaders: details.requestHeaders
        };
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking", "requestHeaders"]
);

