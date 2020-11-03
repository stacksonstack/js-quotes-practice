const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")



quoteList.addEventListener("click", event => {
	if (event.target.matches(".btn-success")) {
		handleAddLikeToQuote(event)
	} else if (event.target.matches(".btn-danger")){
		handleDeleteQuote(event)
	}
})
newQuoteForm.addEventListener("submit", handleNewQuoteForm)


function handleAddLikeToQuote(event) {
	const span = event.target.firstElementChild
	const newLikeTotal = parseInt(span.textContent) + 1
	const quoteLi = event.target.closest("li")
	const quoteId = parseInt(quoteLi.dataset.id)

	const data = {
		"quoteId": quoteId,
		"createdAt": Date.now()
	}
	
	const config = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	}

	fetch("http://localhost:3000/likes", config)
	.then(response => response.json())
	.then(() => {
		span.textContent = newLikeTotal
	})
}

function handleDeleteQuote(event) {
	const quoteLi = event.target.closest("li")
	const quoteId = parseInt(quoteLi.dataset.id)

	fetch(`http://localhost:3000/quotes/${quoteId}`, {method: "DELETE"})
	.then(response => response.json())
	.then(() => { quoteLi.remove() })
}

function handleNewQuoteForm(event) {
	event.preventDefault()
	
	const quote = {
		"quote": event.target.quote.value,
		"author": event.target.author.value
	}

	const config = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify(quote)
	}

	fetch(`http://localhost:3000/quotes`, config)
	.then(response => response.json())
	.then(newQuoteObj => {
		
		countLikes(newQuoteObj.id)
			.then(arrayOfLikes => {
				const likes = arrayOfLikes.length
				renderQuote(newQuoteObj, likes)
			})
	})

	event.target.reset()
}

function countLikes(quoteId) {
	return fetch(`http://localhost:3000/likes?quoteId=${quoteId}`)
		.then(response => response.json())
}



function renderQuotes(quotesData) {
	quotesData.forEach(quote => renderQuote(quote, quote.likes.length))
}

function renderQuote(quoteObj, likes) {
	const author = quoteObj.author
	const quote = quoteObj.quote
	
	const li = document.createElement("li")
	li.classList.add("quote-card")
	li.dataset.id = quoteObj.id

	const blockquote = document.createElement("blockquote")
	blockquote.classList.add("blockquote")

	const p = document.createElement("p")
	p.classList.add("mb-0")
	p.textContent = quote

	const footer = document.createElement("footer")
	footer.classList.add("blockquote-footer")
	footer.textContent = author

	const br = document.createElement("br")

	const likeButton = document.createElement("button")
	likeButton.classList.add("btn-success")
	likeButton.innerHTML = `Likes: <span>${likes}</span>`

	const deleteButton = document.createElement("button")
	deleteButton.classList.add("btn-danger")
	deleteButton.textContent = "Delete"

	blockquote.append(p, footer, br, likeButton, deleteButton)
	li.append(blockquote)
	quoteList.append(li)
}


function initialize() {
	fetch(`http://localhost:3000/quotes?_embed=likes`)
		.then(response => response.json())
		.then(data => {
			renderQuotes(data)
		})
}

initialize()
