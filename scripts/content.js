function getDirectDownloadLink(driveLink) {
    const fileIdMatch = driveLink.match(/\/file\/d\/(.*?)\//);
    if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return null;
}

function extractFileName(anchor) {
    const secondDiv = anchor.querySelector('div:nth-child(2)');
    if (secondDiv) {
        const firstDivInsideSecondDiv = secondDiv.querySelector('div:nth-child(1)');
        if (firstDivInsideSecondDiv) {
            return firstDivInsideSecondDiv.textContent.trim();
        }
    }
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getDriveLinks") {
        const driveFiles = Array.from(document.querySelectorAll('a'))
            .filter(a => a.href.includes("drive.google.com/file/d/"))
            .map(a => {
                const fileName = extractFileName(a);
                const fileLink = getDirectDownloadLink(a.href);
                return { name: fileName, link: fileLink };
            })
            .filter(file => file.link !== null && file.name !== null);

        sendResponse({ files: driveFiles });
    }
});
