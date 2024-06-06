document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getDriveLinks" }, function (response) {
            if (response && response.files.length > 0) {
                const fileList = document.getElementById('fileList');
                response.files.forEach(file => {
                    const li = document.createElement('li');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = file.link;
                    li.textContent = file.name;
                    li.appendChild(checkbox);
                    fileList.appendChild(li);
                });

                document.getElementById('downloadSelected').addEventListener('click', function () {
                    Array.from(fileList.children).forEach(li => {
                        const checkbox = li.querySelector('input[type="checkbox"]');
                        if (checkbox.checked) {
                            chrome.downloads.download({ url: checkbox.value, filename: li.textContent });
                        }
                    });
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