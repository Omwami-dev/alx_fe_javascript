const STORAGE_KEY = "dqg_quotes_v1";
const SESSION_LAST_INDEX_KEY = "dqg_last_index_v1";
const FILTER_KEY = "dqg_last_filter_v1";


// Initial array of quotes with text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Do one thing every day that scares you.", category: "Inspiration" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Positivity" }
];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${text}</strong> <em>(${category})</em>`;
  sessionStorage.setItem(SESSION_LAST_INDEX_KEY, randomIndex);
}

// Function to create and insert the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.style.marginTop = "20px";

  const quoteInput = document.createElement('input');
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  const categoryInput = document.createElement('input');
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addButton = document.createElement('button');
  addButton.textContent = "Add Quote";
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to add a new quote dynamically
function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
   saveQuotes(); 
   populateCategories();

  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";

  alert("Quote added successfully!");
}
 function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      quotes = JSON.parse(saved);
    } catch (e) {
      console.warn("Invalid quotes in storage, using defaults.");
    }
  }
}

function showLastViewedQuote() {
  const idx = sessionStorage.getItem(SESSION_LAST_INDEX_KEY);
  if (idx !== null) {
    const { text, category } = quotes[idx];
    quoteDisplay.innerHTML = `<strong>${text}</strong> <em>(${category})</em>`;
  } else {
    alert("No quote viewed this session.");
  }
}
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Remove all except "All Categories"
  categorySelect.querySelectorAll("option:not([value='all'])").forEach(opt => opt.remove());

  // Add new categories
  uniqueCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  // Restore last selected filter from localStorage
  const savedFilter = localStorage.getItem(FILTER_KEY) || "all";
  categorySelect.value = savedFilter;
}
function filterQuotes() {
  const categorySelect = document.getElementById("categoryFilter");
  const selectedCategory = categorySelect.value;

  localStorage.setItem(FILTER_KEY, selectedCategory); // remember user's filter choice

  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const { text, category } = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${text}</strong> <em>(${category})</em>`;
}


// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
document.getElementById('showLast').addEventListener('click', showLastViewedQuote);
document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);

// Initialize page
loadQuotes();
showRandomQuote();
filterQuotes();
createAddQuoteForm();
