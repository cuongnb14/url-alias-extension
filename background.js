chrome.webNavigation.onErrorOccurred.addListener((details) => {
    let aliasName = details.url.split("///")[1];

    chrome.storage.sync.get(['alias'], (items) => {
        const url = items.alias[aliasName]
        if (url) {
            chrome.tabs.update(details.tabId, {url: url});
        }
    })
})
