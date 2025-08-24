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
/* ===== Sync & Conflict (append this to the END of script.js) ===== */

const SERVER_BASE = "https://jsonplaceholder.typicode.com"; // mock API
const CONFLICTS_KEY = "dqg_conflicts_v1";
let autoSyncTimer = null;

// Helper: pseudo server updatedAt for demo
function pseudoServerUpdatedAt(id) {
  const d = new Date(2024, (id % 12), (id % 28) + 1, id % 24, id % 60, 0);
  return d.toISOString();
}

// Map a JSONPlaceholder post to our "server quote" shape
function mapPostToQuote(post) {
  return {
    id: `srv-${post.id}`,
    text: String(post.title || "").trim(),
    category: "Server",
    updatedAt: pseudoServerUpdatedAt(post.id),
    origin: "server"
  };
}

// Ensure required helper functions exist (safe fallbacks)
if (typeof saveQuotes !== "function") {
  function saveQuotes() { localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes)); }
}
if (typeof escapeHtml !== "function") {
  function escapeHtml(s) { return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
}
if (typeof populateCategories !== "function") {
  function populateCategories() { /* optional - no-op if missing */ }
}
if (typeof filterQuotes !== "function") {
  function filterQuotes() { showRandomQuote(); } // fallback
}

// Normalize local quotes so each has id, updatedAt, origin
function normalizeQuotes() {
  let changed = false;
  quotes.forEach((q, idx) => {
    if (!q.id) { q.id = `loc-${Date.now()}-${idx}-${Math.random().toString(36).slice(2,7)}`; changed = true; }
    if (!q.updatedAt) { q.updatedAt = new Date().toISOString(); changed = true; }
    if (!q.origin) { q.origin = q.id && q.id.startsWith("srv-") ? "server" : "local"; changed = true; }
  });
  if (changed) saveQuotes();
}

// Conflicts persistence
function loadConflicts() {
  try { const raw = localStorage.getItem(CONFLICTS_KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function saveConflicts(conflicts) { localStorage.setItem(CONFLICTS_KEY, JSON.stringify(conflicts)); }

// UI refs (these elements were added to index.html)
const syncNowBtn = document.getElementById("syncNow");
const autoSyncToggle = document.getElementById("autoSyncToggle");
const syncStatusEl = document.getElementById("syncStatus");
const openConflictsBtn = document.getElementById("openConflicts");
const conflictPanel = document.getElementById("conflictPanel");
const conflictList = document.getElementById("conflictList");
const applyConflictChoicesBtn = document.getElementById("applyConflictChoices");
const closeConflictsBtn = document.getElementById("closeConflicts");

function setSyncStatus(text) { if (syncStatusEl) syncStatusEl.textContent = text; }
function updateConflictButtonVisibility() {
  if (!openConflictsBtn) return;
  const conflicts = loadConflicts();
  openConflictsBtn.style.display = conflicts.length ? "inline-block" : "none";
}

// Merge strategy: server-wins by default, but record conflicts for manual review
function mergeServerQuotes(serverQuotes) {
  const localById = new Map((quotes || []).map(q => [q.id, q]));
  const conflicts = loadConflicts();

  serverQuotes.forEach(sq => {
    const lq = localById.get(sq.id);
    if (!lq) {
      // New server item -> add
      quotes.push(sq);
      return;
    }

    const differs = (lq.text !== sq.text) || (lq.category !== sq.category);
    if (!differs) return;

    const existing = conflicts.find(c => c.id === sq.id);
    if (existing) {
      // Respect user's previous choice
      if (existing.choice === "local") {
        // keep local
      } else {
        Object.assign(lq, sq);
      }
    } else {
      // record conflict and apply server-wins immediately
      conflicts.push({ id: sq.id, local: { ...lq }, server: sq, choice: "server" });
      Object.assign(lq, sq);
    }
  });

  saveConflicts(conflicts);
  updateConflictButtonVisibility();
  saveQuotes();
  if (typeof populateCategories === "function") populateCategories();
}

// Render the conflict panel for manual resolution
function renderConflictPanel() {
  const conflicts = loadConflicts();
  if (!conflictList) return;
  if (!conflicts.length) {
    conflictList.textContent = "No conflicts.";
    return;
  }
  conflictList.innerHTML = "";
  conflicts.forEach((c, i) => {
    const wrap = document.createElement("div");
    wrap.style.borderTop = "1px solid #eee";
    wrap.style.padding = "8px 0";
    wrap.innerHTML = `
      <div style="margin-bottom:6px;"><strong>ID:</strong> ${c.id}</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div>
          <div><em>Local</em></div>
          <div><strong>${escapeHtml(c.local.text || "")}</strong> <span class="muted">(${escapeHtml(c.local.category || "")})</span></div>
          <label style="display:flex;gap:6px;align-items:center;margin-top:6px;">
            <input type="radio" name="choice-${i}" value="local" ${c.choice === "local" ? "checked" : ""}>
            Keep Local
          </label>
        </div>
        <div>
          <div><em>Server</em></div>
          <div><strong>${escapeHtml(c.server.text || "")}</strong> <span class="muted">(${escapeHtml(c.server.category || "")})</span></div>
          <label style="display:flex;gap:6px;align-items:center;margin-top:6px;">
            <input type="radio" name="choice-${i}" value="server" ${c.choice === "server" ? "checked" : ""}>
            Keep Server
          </label>
        </div>
      </div>
    `;
    conflictList.appendChild(wrap);
  });
}

// Apply choices from conflict panel
function applyConflictChoices() {
  const conflicts = loadConflicts();
  if (!conflicts.length) { conflictPanel.hidden = true; return; }

  conflicts.forEach((c, i) => {
    const selected = conflictList.querySelector(`input[name="choice-${i}"]:checked`);
    if (selected) c.choice = selected.value;
  });

  const byId = new Map(quotes.map(q => [q.id, q]));
  conflicts.forEach(c => {
    const target = byId.get(c.id);
    if (!target) return;
    if (c.choice === "local") Object.assign(target, c.local);
    else Object.assign(target, c.server);
    target.updatedAt = new Date().toISOString();
  });

  saveQuotes();
  saveConflicts(conflicts);
  conflictPanel.hidden = true;
  updateConflictButtonVisibility();
  if (typeof filterQuotes === "function") filterQuotes();
}

// Sync routine: pull server quotes and merge
async function syncWithServer() {
  try {
    setSyncStatus("Syncing…");
    const res = await fetch(`${SERVER_BASE}/posts?_limit=20`);
    const posts = await res.json();
    const serverQuotes = posts.map(mapPostToQuote);

    normalizeQuotes();
    mergeServerQuotes(serverQuotes);

    const ts = new Date();
    setSyncStatus(`Last sync: ${ts.toLocaleTimeString()}`);
  } catch (err) {
    console.error("Sync failed:", err);
    setSyncStatus("Sync failed (check console)");
  }
}

// Optional: simulate pushing local quote to server
async function pushLocalNewQuote(q) {
  if (!q || q.origin !== "local") return;
  try {
    await fetch(`${SERVER_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: q.text, body: q.category, userId: 1 })
    });
  } catch (e) {
    console.warn("Simulated push failed:", e);
  }
}

// Wrap/add to addQuote so we ensure metadata for the last added quote and simulate push
(function hookAddQuote() {
  const _originalAddQuote = (typeof window.addQuote === "function") ? window.addQuote : (typeof addQuote === "function" ? addQuote : null);

  window.addQuote = function() {
    if (_originalAddQuote) {
      try { _originalAddQuote(); } catch (e) { console.warn("Original addQuote threw:", e); }
    }

    // Ensure metadata for last item
    if (!quotes || !quotes.length) return;
    const last = quotes[quotes.length - 1];
    if (!last) return;
    if (!last.id) last.id = `loc-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    if (!last.origin) last.origin = "local";
    if (!last.updatedAt) last.updatedAt = new Date().toISOString();
    saveQuotes();

    // Optionally push/simulate the push
    pushLocalNewQuote(last);
  };
})();

// Wire UI event listeners (guarded - only attach if elements exist)
if (syncNowBtn) syncNowBtn.addEventListener("click", () => syncWithServer());
if (openConflictsBtn) openConflictsBtn.addEventListener("click", () => {
  renderConflictPanel();
  conflictPanel.hidden = false;
});
if (closeConflictsBtn) closeConflictsBtn.addEventListener("click", () => { conflictPanel.hidden = true; });
if (applyConflictChoicesBtn) applyConflictChoicesBtn.addEventListener("click", applyConflictChoices);

// Auto-sync toggle
if (autoSyncToggle) {
  function startAutoSync() {
    if (autoSyncTimer) clearInterval(autoSyncTimer);
    if (autoSyncToggle.checked) autoSyncTimer = setInterval(syncWithServer, 30000); // 30s
  }
  autoSyncToggle.addEventListener("change", startAutoSync);
  startAutoSync();
}

// Kick-off
updateConflictButtonVisibility();
syncWithServer();


// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
document.getElementById('showLast').addEventListener('click', showLastViewedQuote);
document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);

// Initialize page
loadQuotes();
showRandomQuote();
filterQuotes();
createAddQuoteForm();
