function getTableRuleRow(aliasName, aliasUrl, deleteBtn) {
    let tr = $('<tr/>')
    tr.append($('<td/>').html(aliasName))
    tr.append($('<td/>').html(aliasUrl))
    tr.append($('<td/>').append(deleteBtn))
    return tr
}

function drawTableRule(aliasName, aliasUrl) {
    let tbody = $('#tableBody')

    let deleteBtn = $('<button/>', {
        class: 'btn btn-danger btn-sm',
        on: {
            click: function () {
                deleteAlias(aliasName)
            }
        }
    }).html('Delete')

    let tr = getTableRuleRow(aliasName, aliasUrl, deleteBtn)
    tbody.append(tr)
}


function drawAllTableRule(alias) {
    let tbody = $('#tableBody')
    tbody.html('')

    const entries = Object.entries(alias)
    entries.sort((a, b) => a[0].localeCompare(b[0]));

    for (const [aliasName, aliasUrl] of entries) {
        drawTableRule(aliasName, aliasUrl)
    }

}

function deleteAlias(aliasName) {
    chrome.storage.sync.get({
        alias: {}
    }, function (items) {
        let alias = items.alias
        
        delete alias[aliasName]

        chrome.storage.sync.set({
            alias: alias
        }, function () {
            drawAllTableRule(alias)
        });

    });
}

function savePageRule() {
    var aliasUrl = document.getElementById('aliasUrl').value.trim();
    var aliasName = document.getElementById('aliasName').value.trim();

    chrome.storage.sync.get({
        alias: {}
    }, function (items) {
        let alias = items.alias

        if(aliasName in alias) {
            const replace = confirm('This alias already used for url: ' + alias[aliasName] + '. Replace it?')
            if (replace) {
                alias[aliasName] = aliasUrl
            }
        } else {
            alias[aliasName] = aliasUrl
        }
        
        chrome.storage.sync.set({
            alias: alias
        }, function () {
            drawAllTableRule(alias)
        });

    });
}

function clearAllAlias() {
    chrome.storage.sync.set({
        alias: {}
    }, function () {
        drawAllTableRule(alias)
    });
}

document.getElementById('save').addEventListener('click', savePageRule);
// document.getElementById('clearAll').addEventListener('click', clearAllRules);


chrome.storage.sync.get({
    alias: {}
}, function (items) {
    let alias = items.alias
    drawAllTableRule(alias)
})


var isImportAction = false

function setImportAction(flag) {
    isImportAction = flag
    if (flag) {
        $("#btn-close-box").html('Import')
    } else {
        $("#btn-close-box").html('Close')
    }
}

$("#export").click(function () {
    setImportAction(false)
    chrome.storage.sync.get({
        alias: {}
    }, function (items) {
        let alias = items.alias

        let aliasJson = JSON.stringify(alias)
        $('#export-box').show()
        $('#export-data').val(aliasJson)
    });
});

$("#import").click(function () {
    $('#export-box').show()
    $('#export-data').val('')
    setImportAction(true)
})


$("#btn-close-box").click(function () {
    if (isImportAction) {
        let aliasJson = $('#export-data').val()
        if (aliasJson.trim()) {
            let aliasImport = JSON.parse(aliasJson)

            chrome.storage.sync.get({
                alias: {}
            }, function (items) {
                let alias = items.alias
                for (const [key, value] of Object.entries(aliasImport)) {
                    alias[key] = value
                }
                
                chrome.storage.sync.set({
                    alias: alias
                }, function () {
                    drawAllTableRule(alias)
                });

            });
        }
        
    }


    $('#export-box').hide()
    $('#export-data').val('')
    setImportAction(false)
});

