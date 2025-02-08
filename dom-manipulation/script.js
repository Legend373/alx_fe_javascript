const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Wisdom" }
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p><strong>${quotes[randomIndex].category}:</strong> "${quotes[randomIndex].text}"</p>`;
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
    `;
    document.body.appendChild(formContainer);

    document.getElementById("quoteForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const text = document.getElementById("quoteText").value;
        const category = document.getElementById("quoteCategory").value;
        if (text && category) {
            quotes.push({ text, category });
            alert("Quote added successfully!");
            event.target.reset();
        }
    });
}

// Initialize
showRandomQuote();
createAddQuoteForm();
