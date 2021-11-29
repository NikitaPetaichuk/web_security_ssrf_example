function loadFileByURL() {
    let urlInput = document.getElementById('url-input-id');
    let url = urlInput.value;

    let request = new XMLHttpRequest();
    request.open('POST', '/api/load_url');
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
        if (request.status === 400) {
            alert("Picture by this URL is unavailable");
        } else if (request.status === 200) {
            let response = JSON.parse(request.response);
            let avatar = document.getElementById('avatar-id');
            avatar.src = response.path;
        }
    }
    request.send(JSON.stringify({url: url}));
}


function loadLocalFile() {
    let fileInput = document.getElementById('file-input-id');
    let picture = fileInput.files[0];
    let formData = new FormData();
    formData.append("picture", picture);

    let request = new XMLHttpRequest();
    request.open('POST', '/api/load_local');
    request.onload = function () {
        if (request.status === 415) {
            alert("Unsupported file type!");
        } else if (request.status === 200) {
            let response = JSON.parse(request.response);
            let avatar = document.getElementById('avatar-id');
            avatar.src = response.path;
        }
    }
    request.send(formData);
}

window.onload = function () {
    let loadFileByURLButton = document.getElementById('submit-url-input');
    loadFileByURLButton.onclick = loadFileByURL;

    let loadLocalFileButton = document.getElementById('submit-file-input');
    loadLocalFileButton.onclick = loadLocalFile;
}
