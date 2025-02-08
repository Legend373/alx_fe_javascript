const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Wisdom" }
];

function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available for this category.</p>";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").innerHTML = `<p><strong>${filteredQuotes[randomIndex].category}:</strong> "${filteredQuotes[randomIndex].text}"</p>`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
      <h2>Add a New Quote</h2>
      <form id="quoteForm">
        <input type="text" id="quoteText" placeholder="Enter quote" required />
        <input type="text" id="quoteCategory" placeholder="Enter category" required />
        <button type="submit">Add Quote</button>
      </form>
      
      <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
      <label for="categoryFilter">Filter by Category:</label>
      <select id="categoryFilter" onchange="filterQuotes()">
        <option value="all">All Categories</option>
      </select>
    `;
    document.body.appendChild(formContainer);

    document.getElementById("quoteForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const text = document.getElementById("quoteText").value;
        const category = document.getElementById("quoteCategory").value;
        if (text && category) {
            quotes.push({ text, category });
            saveQuotes();
            populateCategories();
            alert("Quote added successfully!");
            event.target.reset();
        }
    });

    document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
    populateCategories();
}

function exportToJsonFile() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    localStorage.setItem("selectedCategory", document.getElementById("categoryFilter").value);
}

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
    }
}

function getFilteredQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    return selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
}

function filterQuotes() {
    saveQuotes();
    showRandomQuote();
}

// Initialize
showRandomQuote();
createAddQuoteForm();
