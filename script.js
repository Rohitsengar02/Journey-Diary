// DOM Elements
const newPageBtn = document.getElementById("new-page-btn");
const modal = document.getElementById("new-page-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const savePageBtn = document.getElementById("save-page-btn");
const toggleModeBtn = document.getElementById("toggle-mode-btn");
const pagesGrid = document.getElementById("pages-grid");
const pageTitleInput = document.getElementById("page-title");
const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");

const viewPageModal = document.getElementById("view-page-modal");
const viewPageDetails = document.getElementById("view-page-details");
const closeViewBtn = document.getElementById("close-view-btn");

let quill; // Quill editor instance

// Initialize Quill editor
function initializeQuill() {
  const editorContainer = document.getElementById("editor");
  quill = new Quill(editorContainer, {
    theme: "snow",
    placeholder: "Write about your journey...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"]
      ],
    },
  });
  console.log("Quill editor initialized");
}

// Light/Dark mode toggle
toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleModeBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// Load pages from localStorage
function loadPages() {
  const pages = JSON.parse(localStorage.getItem("journeyPages")) || [];
  pagesGrid.innerHTML = ""; // Clear existing pages

  if (pages.length === 0) {
    pagesGrid.innerHTML = `<p>No pages created yet. Click "Create New Page" to start!</p>`;
    return;
  }

  pages.forEach((page, index) => {
    const pageCard = document.createElement("div");
    pageCard.classList.add("page-card");

    if (page.title) {
      const titleElement = document.createElement("h2");
      titleElement.textContent = page.title;
      pageCard.appendChild(titleElement);
    }

    const contentElement = document.createElement("p");
    contentElement.innerHTML = page.text; // Render rich text content
    pageCard.appendChild(contentElement);

    if (page.images.length > 0) {
      const imageElement = document.createElement("img");
      imageElement.src = page.images[0]; // Display the first image
      pageCard.appendChild(imageElement);
    }

    pageCard.addEventListener("click", () => viewPage(index));
    pagesGrid.appendChild(pageCard);
  });
}

// Save a page
function savePage() {
  console.log("savePage function triggered"); // Debugging

  const title = pageTitleInput.value.trim();
  const text = quill.root.innerHTML; // Get Quill editor content
  const images = Array.from(imageInput.files).map(file => URL.createObjectURL(file));

  console.log("Title:", title); // Debugging
  console.log("Text:", text);  // Debugging
  console.log("Images:", images); // Debugging

  // Validation
  if (!text && images.length === 0) {
    alert("Please provide some content or images for the page.");
    return;
  }

  // Retrieve existing pages or initialize an empty array
  const pages = JSON.parse(localStorage.getItem("journeyPages")) || [];
  pages.push({ title, text, images });
  localStorage.setItem("journeyPages", JSON.stringify(pages));

  // Reload pages and close modal
  loadPages();
  closeModal();
}

// View a page
function viewPage(index) {
  const pages = JSON.parse(localStorage.getItem("journeyPages"));
  const page = pages[index];

  viewPageDetails.innerHTML = `
    <h2>${page.title || "Untitled"}</h2>
    <div>${page.text}</div> <!-- Display rich text content -->
    <div class="image-preview">
      ${page.images.map(img => `<img src="${img}" alt="Page Image">`).join("")}
    </div>
  `;
  viewPageModal.classList.remove("hidden");
}

// Close the modal
function closeModal() {
  modal.classList.add("hidden");
  pageTitleInput.value = ""; // Clear the title input
  quill.root.innerHTML = ""; // Clear Quill editor content
  imageInput.value = ""; // Clear the file input
  imagePreview.innerHTML = ""; // Clear the image preview
}

// Close the view modal
function closeViewModal() {
  viewPageModal.classList.add("hidden");
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeQuill(); // Initialize Quill editor
  loadPages();       // Load pages from localStorage

  // Bind event listeners
  newPageBtn.addEventListener("click", () => {
    console.log("Opening modal for new page creation"); // Debugging
    modal.classList.remove("hidden");
  });
  closeModalBtn.addEventListener("click", closeModal);
  closeViewBtn.addEventListener("click", closeViewModal);
  savePageBtn.addEventListener("click", savePage);
});
