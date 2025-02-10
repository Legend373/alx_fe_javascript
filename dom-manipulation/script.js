const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Wisdom" }
];

async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await response.json();
        const newQuotes = data.map(post => ({ text: post.title, category: "General" }));
        syncQuotes(newQuotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

async function postQuoteToServer(text, category) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, category })
        });
        const newQuote = await response.json();
        console.log("Quote posted successfully:", newQuote);
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

function syncQuotes(newQuotes) {
    let updated = false;
    const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    newQuotes.forEach(newQuote => {
        if (!storedQuotes.some(q => q.text === newQuote.text)) {
            storedQuotes.push(newQuote);
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem("quotes", JSON.stringify(storedQuotes));
        quotes.length = 0;
        quotes.push(...storedQuotes);
        populateCategories();
        showNotification("New quotes have been added from the server.");
    }
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.top = "10px";
    notification.style.right = "10px";
    notification.style.backgroundColor = "#333";
    notification.style.color = "#fff";
    notification.style.padding = "10px";
    notification.style.borderRadius = "5px";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

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

setInterval(fetchQuotesFromServer, 60000);

fetchQuotesFromServer();
showRandomQuote();
createAddQuoteForm();
