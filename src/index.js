const quotesURL = "http://localhost:3000/quotes?_embed=likes"
const quotesIndexURL = "http://localhost:3000/quotes/"
const aQuoteURL = (id) => `${quotesIndexURL}${id}`
const likesURL = "http://localhost:3000/likes"

const makeEl = (type, classType = "" ) => { 
        let el = document.createElement(type) 
        el.classList = classType
        return el
    }

    
document.addEventListener("DOMContentLoaded", () => {

    const quotesList = document.querySelector("#quote-list")
    const newQuoteForm = document.querySelector("#new-quote-form")


    // get quotes from API
    const getQuotes = (url) => fetch(url)
        .then( response => response.json())
        .then( quotes => renderQuotes(quotes))

    // render quotes on page
    const renderQuotes = (quotes) => {
        quotesList.innerHTML = ""
        for(const quote of quotes){
            createQuoteCard(quote)
        }
    }

    // add new quote using form
    newQuoteForm.addEventListener("submit", function(e){
        e.preventDefault
        const quoteInput = document.querySelector("#new-quote").value
        const authorInput = document.querySelector("#author").value

        let configObj = {
            method: "POST",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({
                "quote": quoteInput,
                "author": authorInput
            })
        }
        fetch(quotesIndexURL, configObj)
            .then( response => response.json())
            .then( quote => createQuoteCard(quote))
        e.target.reset
    })

    // create element for a quote
    const createQuoteCard = (thisQuote) => {
        const { quote, author, likes } = thisQuote
        const li = makeEl("li", "quote-card")
        const block = makeEl("blockquote", "blockquote")
        
        const p = makeEl("p", "mb-0")
        p.innerText = quote

        const footer = makeEl("footer", "blockquote-footer")
        footer.innerText = author

        br = makeEl("br")

        const likeButton = makeEl("button", "btn-success")
        likeButton.innerText = "Likes: "
        const count = makeEl("span")
        count.innerText = likes.length
        likeButton.append(count)

        const deleteButton = makeEl("button", "btn-danger")
        deleteButton.innerText = "Delete"
        

        block.append(p, footer, br, likeButton, deleteButton)
        li.append(block)
        quotesList.append(li)
        addLiker(likeButton, thisQuote)
        addDeleter(deleteButton, thisQuote)
    }

    // add event listener for delete button that deletes from API & updates front end
    const addDeleter = (button, quote) => {
        button.addEventListener("click", function(){
            const configObj = { method: "DELETE"}
            fetch(aQuoteURL(quote.id), configObj)
                .then(getQuotes(quotesURL))
        }
        )
    }

    // add event listener for like button
    // button creates new Like in DB - post request to likes
    // uses ID of the current quote as the quoteID

    const addLiker = (button, quote) => {
        button.addEventListener("click", function(){
           const configObj = { 
                "method": "POST",
                "headers": {"content-type": "application/json"},
                "body": JSON.stringify({
                    "quoteId": quote.id
                })
            }
            fetch(likesURL, configObj)
                .then( () => {
                    const counter = button.querySelector("span")
                    counter.innerText ++
                })
        }

            // this button creates a like in the API
            // will need to use a fetch post request
            // and updates the number of likes without refreshing the page
        )
    }


// run initial fetch
    getQuotes(quotesURL)

})