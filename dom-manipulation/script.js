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

  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";

  alert("Quote added successfully!");
}

// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);

// Initialize page
showRandomQuote();
createAddQuoteForm();
