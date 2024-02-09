var mainTextarea = document.getElementById("main-textarea");
var downloadLink = document.getElementById("download-link");
var downloadHTMLLink = document.getElementById("download-html-link");
var tabURLs = []; // Need to refactor to not have this in public scope.

function updateTabURLs() {
  chrome.tabs.query({active: false}, tabs => { // Don't save the tab that the user is currently on, which is this extension's tab.
    tabs.forEach(tab => {
        tabURLs.push(tab.url);
    });

    mainTextarea.value = tabURLs.join("\n");
  });
}

downloadLink.addEventListener("click", () => {
  var data = mainTextarea.value; // Can't re-run updateTabURLs() as user may have edited the text.
  var filename = "saved-tabs_" + new Date().toISOString().replace(/:/g, "-").replace("T", "_").slice(0, 19); // Regex replaces all occurences.
  
  createDownloadFile(data, filename, "text/plain");
});
downloadHTMLLink.addEventListener("click", () => {
  downloadHTMLPage(tabURLs);
});

function createDownloadFile(data, filename, type) {
  var file = new Blob([data], {type: type});
  
  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = filename;
}
function createDownloadHTMLFile(data, filename, type) {
  var file = new Blob([data], {type: type});
  
  downloadHTMLLink.href = URL.createObjectURL(file);
  downloadHTMLLink.download = filename;
}

function createHTMLPage(links) {
  const doc = document.createElement('html');
  const head = document.createElement('head');
  const title = document.createElement('title');
  const body = document.createElement('body');

  title.textContent = "Saved Tabs";
  body.style.fontFamily = "Arial, sans-serif";
  body.style.backgroundColor = "#f5f5f5";
  body.style.margin = "0";

  const container = document.createElement('div');
  container.style.maxWidth = "800px";
  container.style.margin = "20px auto";
  container.style.padding = "20px";
  container.style.backgroundColor = "#fff";
  container.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

  const heading = document.createElement('h1');
  heading.style.textAlign = "center";
  heading.style.color = "#333";
  heading.textContent = "Saved Tabs";

  const linkContainer = document.createElement('div');
  linkContainer.style.display = "flex";
  linkContainer.style.flexWrap = "wrap";

  links.forEach(link => {
    const linkItem = document.createElement('div');
    linkItem.style.flex = "0 0 48%";
    linkItem.style.margin = "1%";
    linkItem.style.border = "1px solid #ddd";
    linkItem.style.borderRadius = "5px";
    linkItem.style.overflow = "hidden";
    linkItem.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";

    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = link;
    linkElement.style.display = "block";
    linkElement.style.padding = "10px";
    linkElement.style.textDecoration = "none";
    linkElement.style.color = "#333";
    linkElement.style.overflow = "hidden";
    linkElement.style.whiteSpace = "nowrap";
    linkElement.style.textOverflow = "ellipsis";

    linkItem.appendChild(linkElement);
    linkContainer.appendChild(linkItem);
  });

  head.appendChild(title);
  body.appendChild(container);
  container.appendChild(heading);
  container.appendChild(linkContainer);
  doc.appendChild(head);
  doc.appendChild(body);

  return doc.outerHTML;
}

function downloadHTMLPage(links) {
  var html = createHTMLPage(links);
  var filename = "saved-tabs_" + new Date().toISOString().replace(/:/g, "-").replace("T", "_").slice(0, 19) + ".html"; // Regex replaces all occurences.

  createDownloadHTMLFile(html, filename, "text/html");
}

createDownloadHTMLFile()
updateTabURLs();
createDownloadFile();
