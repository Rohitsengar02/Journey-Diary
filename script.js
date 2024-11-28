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
const deletePageBtn = document.createElement("button"); // Dynamically created delete button

let quill; // Quill editor instance
let currentPageIndex = null; // Track the index of the currently viewed page

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
        ["link", "image"],
      ],
    },
  });
  console.log("Quill editor initialized:", quill);
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

    // Add heading (title)
    if (page.title) {
      const titleElement = document.createElement("h2");
      titleElement.textContent = page.title;
      pageCard.appendChild(titleElement);
    }

    // Add thumbnail image
    if (page.images.length > 0) {
      const thumbnailElement = document.createElement("img");
      thumbnailElement.src = page.images[0]; // Display the first image
      thumbnailElement.alt = "Page Thumbnail";
      thumbnailElement.classList.add("thumbnail");
      pageCard.appendChild(thumbnailElement);
    }

    // Add click event for full preview
    pageCard.addEventListener("click", () => viewPage(index));

    // Append the card to the grid
    pagesGrid.appendChild(pageCard);
  });
}

// Save a page
function savePage() {
  const title = pageTitleInput.value.trim();
  const text = quill.root.innerHTML; // Get Quill editor content
  const images = Array.from(imageInput.files).map((file) =>
    URL.createObjectURL(file)
  );

  // Validation
  if (!title && !text && images.length === 0) {
    alert("Please provide a title, content, or images for the page.");
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

// View a page (full preview)
function viewPage(index) {
  currentPageIndex = index; // Track the currently viewed page
  const pages = JSON.parse(localStorage.getItem("journeyPages"));
  const page = pages[index];

  // Populate view modal
  viewPageDetails.innerHTML = `
    <h2>${page.title || "Untitled"}</h2>
    <div>${page.text}</div> <!-- Display rich text content -->
    <div class="image-preview">
      ${page.images.map((img) => `<img src="${img}" alt="Page Image">`).join("")}
    </div>
  `;

  // Add delete button
  deletePageBtn.textContent = "Delete Page";
  deletePageBtn.className = "delete-page-btn";
  deletePageBtn.addEventListener("click", deletePage); // Bind delete action
  viewPageDetails.appendChild(deletePageBtn);

  viewPageModal.classList.remove("hidden");
}

// Delete a page
function deletePage() {
  if (currentPageIndex === null) return; // Safety check

  const pages = JSON.parse(localStorage.getItem("journeyPages"));
  pages.splice(currentPageIndex, 1); // Remove the page at the current index
  localStorage.setItem("journeyPages", JSON.stringify(pages));

  // Close modal and reload pages
  closeViewModal();
  loadPages();
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
  currentPageIndex = null; // Reset the current page index
  viewPageModal.classList.add("hidden");
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeQuill(); // Initialize Quill editor
  loadPages(); // Load pages from localStorage

  // Bind event listeners
  newPageBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
  closeModalBtn.addEventListener("click", closeModal);
  closeViewBtn.addEventListener("click", closeViewModal);
  savePageBtn.addEventListener("click", savePage);
});
