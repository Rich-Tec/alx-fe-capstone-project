const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const bookDetails = document.getElementById("bookDetails");

const detailsTitle = document.getElementById("detailsTitle");
const detailsAuthor = document.getElementById("detailsAuthor");
const detailsCover = document.getElementById("detailsCover");
const detailsDescription = document.getElementById("detailsDescription");
const detailsPublishDate = document.getElementById("detailsPublishDate");
const detailsISBN = document.getElementById("detailsISBN");
const detailsPages = document.getElementById("detailsPages");
const detailsSubjects = document.getElementById("detailsSubjects");
const closeDetails = document.getElementById("closeDetails");

// Search books
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchBooks(query);
  }
});

async function fetchBooks(query) {
  resultsDiv.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.docs.length === 0) {
      resultsDiv.innerHTML = "<p>No books found. Try another search.</p>";
      return;
    }

    displayBooks(data.docs);
  } catch (error) {
    resultsDiv.innerHTML = "<p class='text-red-500'>Error fetching data. Please try again.</p>";
    console.error(error);
  }
}

// Display search results
function displayBooks(books) {
  resultsDiv.innerHTML = "";

  books.forEach(book => {
    const coverId = book.cover_i;
    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "https://via.placeholder.com/150x200?text=No+Cover";

    const card = document.createElement("div");
    card.className = "book-card bg-white p-4 rounded shadow-md";
    card.innerHTML = `
      <img src="${coverUrl}" alt="Cover" class="w-full h-60 object-cover rounded mb-3">
      <h3 class="font-bold text-lg mb-1">${book.title}</h3>
      <p class="text-gray-700">Author: ${book.author_name ? book.author_name.join(", ") : "Unknown"}</p>
      <p class="text-gray-500">Publisher: ${book.publisher ? book.publisher[0] : "N/A"}</p>
    `;

    card.addEventListener("click", () => showDetails(book));
    resultsDiv.appendChild(card);
  });
}

// Show detailed view
async function showDetails(book) {
  bookDetails.classList.remove("hidden");

  detailsTitle.textContent = book.title;
  detailsAuthor.textContent = book.author_name ? book.author_name.join(", ") : "Unknown";
  detailsCover.src = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/200x300?text=No+Cover";

  // Fetch work details
  try {
    const workKey = book.key; // e.g., "/works/OL12345W"
    const workRes = await fetch(`https://openlibrary.org${workKey}.json`);
    const workData = await workRes.json();

    detailsDescription.textContent = workData.description?.value || workData.description || "No description available.";
    detailsPublishDate.textContent = book.first_publish_year || "N/A";
    detailsISBN.textContent = book.isbn ? book.isbn[0] : "N/A";
    detailsPages.textContent = book.number_of_pages_median || "N/A";
    detailsSubjects.textContent = workData.subjects ? workData.subjects.join(", ") : "N/A";
  } catch (error) {
    console.error(error);
  }
}

// Close details
closeDetails.addEventListener("click", () => {
  bookDetails.classList.add("hidden");
});
