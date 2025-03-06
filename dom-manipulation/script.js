
document.addEventListener("DOMContentLoaded", function () {
    const newQouteBtn = document.querySelector("#newQuote")

    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Wisdom" }
    ];
    const quote = {
        category: "",
        text: ""
    }
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes))

    }
    function loadQuotes() {
        const storedQuotes = localStorage.getItem("quotes");
        if (storedQuotes) {
            return quotes.push(...JSON.parse(storedQuotes))
        }
    }
    function showRandomQuotes(quotes) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];

        const quoteDisplay = document.querySelector("#quoteDisplay")
        const qouteItem = document.createElement("div")
        const catagory = document.createElement("h2");
        const quoteElement = document.createElement("p")
        catagory.textContent = quote.category;
        quoteElement.textContent = quote.text;
        qouteItem.appendChild(catagory)
        qouteItem.appendChild(quoteElement)
        quoteDisplay.append(qouteItem)

    }
    function createAddQuoteForm() {
        const form = document.createElement("form")
        form.innerHTML = `<input class="text" type="text" placeholder="enter qoute catagory"/>
        <textarea class="text" type="text" placeholder="enter qoute content"></textarea>
        <button type="submit">Add Quote</button>`


        quoteDisplay.appendChild(form)
        return form;
    }
    newQouteBtn.addEventListener("click", () => {
        showRandomQuotes(quotes)



    })
    const form = createAddQuoteForm()

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        quote.category = event.target.querySelector(".text").value.trim();
        quote.text = event.target.querySelector("textarea").value.trim();
        console.log(quote)
        quotes.push(quote)
        console.log(quotes)
        document.querySelector(" form input").value = "";
        document.querySelector(" form textarea").value = "";
        saveQuotes(quotes)
        populateCategories()




    })
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function populateCategories() {



        const categories = new Set();

        // Extract unique categories from the quotes array
        quotes.forEach(quote => {
            if (quote.category) {
                categories.add(quote.category);
            }
        });
        categories.forEach(category => {
            const option = document.createElement("option");
            const categoryFilter = document.querySelector('#categoryFilter');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
            categoryFilter.addEventListener('change', filterQuotes);
        });



    }
    function filterQuotes() {
        const categoryFilter = document.querySelector('#categoryFilter');
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        showRandomQuotes(filteredQuotes);
    }
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
            alert("Quotes synced with server!");
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

    populateCategories();
    fetchQuotesFromServer();
    postQuoteToServer();
    syncQuotes()

})

