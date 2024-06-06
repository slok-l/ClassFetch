document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getDriveLinks" }, function (response) {
            if (response && response.files.length > 0) {
                const fileList = document.getElementById('fileList');
                response.files.forEach(file => {
                    const li = document.createElement('li');
                    li.textContent = file.name;
                    fileList.appendChild(li);
                });

                document.getElementById('downloadAll').addEventListener('click', function () {
                    response.files.forEach(file => {
                        chrome.downloads.download({ url: file.link, filename: file.name });
                    });
                });
            } else {
                document.getElementById('fileList').textContent = 'No Google Drive files found.';
            }
        });
    });
});
