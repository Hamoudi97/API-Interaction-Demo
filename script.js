// Elements
const fetchBtn = document.getElementById("fetch-btn");
const xhrBtn = document.getElementById("xhr-btn");
const postForm = document.getElementById("post-form");
const putForm = document.getElementById("put-form");
const deleteForm = document.getElementById("delete-form");
const error = document.getElementsByClassName("error");
const errorType = document.getElementById("error-type");
const errorMessage = document.getElementById("error-message");

// Results
const getResults = document.getElementById("get-results");
const postResults = document.getElementById("post-results");
const putResults = document.getElementById("put-results");
const deleteResults = document.getElementById("delete-results");

document.addEventListener("DOMContentLoaded", function () {
  startEvents();
});

function startEvents() {
  // GET requests
  if (fetchBtn) fetchBtn.addEventListener("click", handleFetchRequest);
  if (xhrBtn) xhrBtn.addEventListener("click", handleXhrRequest);

  // Form submits
  if (postForm) postForm.addEventListener("submit", handlePostSubmit);
  if (putForm) putForm.addEventListener("submit", handlePutSubmit);
  if (deleteForm) deleteForm.addEventListener("submit", handleDeleteSubmit);
}

// Fetch with fetch()
async function handleFetchRequest() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    displayResult(getResults, await response.json());
  } catch (error) {
    showError("Fetch Error", error.message);
  }
}

// Fetch with XHR
function handleXhrRequest() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/2");

  xhr.onload = function () {
    if (xhr.status === 200) {
      displayResult(getResults, JSON.parse(xhr.responseText));
    } else {
      showError("XHR Error", `Request failed with status ${xhr.status}`);
    }
  };

  xhr.onerror = function () {
    showError("Network Error");
  };

  xhr.send();
}

// Gets the form data
function getFormData(form, type) {
  return {
    id: form.querySelector(`#${type}-id`)?.value,
    title: form.querySelector(`#${type}-title`)?.value,
    body: form.querySelector(`#${type}-body`)?.value,
    userId: 1,
  };
}

// Displays Results
function displayResult(content, data) {
  if (!content) return;

  content.innerHTML = `
            <div class="result-item">
                <h3>${data.title || "Success"}</h3>
                <p>${data.body || data.message}</p>
                ${data.id ? `<p>ID: ${data.id}</p>` : ""}
            </div>`;
}

// Post handler
async function handlePostSubmit(e) {
  e.preventDefault();
  const formData = getFormData(e.target, "post");

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    });

    displayResult(postResults, await response.json());
  } catch (error) {
    showError("POST Error", error.message);
  }
}

// Put handler
function handlePutSubmit(e) {
  e.preventDefault();
  const formData = getFormData(e.target, "put");

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `https://jsonplaceholder.typicode.com/posts/${formData.id}`);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 200) {
      displayResult(putResults, JSON.parse(xhr.responseText));
    } else {
      showError("PUT Error", `Request failed with status ${xhr.status}`);
    }
  };

  xhr.onerror = function () {
    showError("Network Error", "Failed to make PUT request");
  };

  xhr.send(JSON.stringify(formData));
}

// Delete handler
async function handleDeleteSubmit(e) {
  e.preventDefault();
  const postId = document.getElementById("delete-id").value;

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "DELETE",
      }
    );

    displayResult(deleteResults, {
      status: response.status,
      message: `Post ${postId} deleted!`,
    });
  } catch (error) {
    showError("DELETE Error", error.message);
  }
}

// shows error
function showError(type, message) {
  errorType.textContent = type;
  errorMessage.textContent = message;
  error.style.display = "block";
  setTimeout(() => (error.style.display = "none"), 6000);
}
