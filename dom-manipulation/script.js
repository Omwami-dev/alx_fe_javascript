// Initial array of quotes with text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Do one thing every day that scares you.", category: "Inspiration" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Positivity" }
];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteButton = document.getElementById('addQuoteBtn');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${text}</strong> <em>(${category})</em>`;
}

// Function to add a new quote dynamically
function addQuote() {
  const newText = newQuoteTextInput.value.trim();
  const newCategory = newQuoteCategoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  newQuoteTextInput.value = "";
  newQuoteCategoryInput.value = "";

  alert("Quote added successfully!");
}

// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteButton.addEventListener('click', addQuote);

// Show an initial random quote on page load
showRandomQuote();
