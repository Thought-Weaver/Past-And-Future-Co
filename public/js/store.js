/*
  Name: Logan Apple
  CS 101 Spring 2021
  Date: May 26th, 2021

  The JS for the L&A Past and Future Co. website. This is the store
  script, which handles displaying the modal when an item card is
  clicked. It also handles the cart and purchase flow.
 */

/************************************************************************
 * CONSTANTS
 ***********************************************************************/

const fromId = document.getElementById.bind(document);
const createElem = document.createElement.bind(document);

/*************************************************************
 * FUNCTIONS
 *************************************************************/

function closeModal(id) {
    fromId(id).animate(
        [ { opacity: 0 } ],
        {
            fill: "forwards",
            easing: "steps(4, end)",
            duration: 250,
            easing: "ease-in-out"
        }
    );

    setTimeout(() => {
        fromId(id).style.display = "none";
    }, 250);
}

function openModal(id) {
    fromId(id).style.display = "flex";

    fromId(id).animate(
        [ { opacity: 1 } ],
        {
            fill: "forwards",
            easing: "steps(4, end)",
            duration: 250,
            easing: "ease-in-out"
        }
    );
}

function createItemCards(response) {
    let container = fromId("store-items");
    while (container.firstChild) {
        container.firstChild.remove();
    }

    Object.keys(response["categories"]).forEach(category => {
        response["categories"][category].forEach(item => {
            let card = createElem("article");
            card.classList.add("card");
    
            let img = createElem("img");
            img.src = "img/" + item["image"];
            img.alt = item["name"] + " icon";

            let title = createElem("h2");
            title.innerText = item["name"];

            let hr = createElem("hr");

            let short_desc = createElem("p");
            short_desc.innerText = item["short-description"];

            let button_container = createElem("div");
            
            let more_info_button = createElem("button");
            more_info_button.innerText = "More Info";
            more_info_button.addEventListener("click", () => { getItem(category, item["name"]) });

            let add_to_cart_button = createElem("button");
            add_to_cart_button.innerText = "Add to Cart";
            // TODO: Get cart functionality working.

            button_container.appendChild(more_info_button);
            button_container.appendChild(add_to_cart_button);

            [img, title, hr, short_desc, button_container].forEach(elem => {
                card.appendChild(elem);
            });

            fromId("store-items").appendChild(card);
        })
    })
}

function getItems() {
    fetch("/items")
        .then(checkStatus)
        .then(response => response.json())
        .then(createItemCards)
        .catch(handleError);
}

function displayItemModal(response) {
    fromId("modal-img").src = "img/" + response["image"];
    fromId("modal-img").alt = response["name"];

    fromId("modal-title").textContent = response["name"];

    fromId("modal-desc").textContent = response["full-description"];

    fromId("modal-price").textContent = "Price: " + response["price"].toString();
    fromId("modal-quantity").textContent = "Quantity: " + response["quantity"].toString();

    // TODO: Get cart functionality working.
    // fromId("add-to-cart-btn").addEventListener

    openModal("modal-container");
}

function getItem(category, item) {
    let categoryFormatted = formatKebabCase(category);
    let itemFormatted = formatKebabCase(item);

    fetch(`/categories/${categoryFormatted}/${itemFormatted}`)
        .then(checkStatus)
        .then(response => response.json())
        .then(displayItemModal)
        .catch(handleError);
}

/**
 * Checks the status of the response for an error. In the case of an error,
 * throws an error to interrupt the fetch sequence.
 *
 * @param {Response} response - The response from the API call.
 * @return {object} If successful, a parsed object from the response JSON.
 */
function checkStatus(response) {
    if (!response.ok) {
        throw new Error("Response fetch failed with status " + response.status + "!");
    }
    return response;
}

/**
 * Handles any errors that occur in the fetch sequence.
 *
 * @param {Error} error
 */
function handleError(error) {
    fromId("server-response").getElementsByTagName("h1")[0].textContent = "Error!";
    fromId("server-response").getElementsByTagName("p")[0].textContent = "There's been an error: " + error;

    openModal("response-container");

    setTimeout(() => {
        closeModal("response-container");
    }, 3000);
}

/**
 * Takes a title case string and converts it to dash-separated string.
 * 
 * @param {String} s - The title case string.
 * @returns {String} The kebab case string.
 */
function formatKebabCase(s) {
    return s.toLowerCase().replaceAll(" ", "-");
}

/*************************************************************
 * EVENT HANDLERS
 *************************************************************/

fromId("close-btn").addEventListener("click", () => { closeModal("modal-container") });
window.addEventListener("load", getItems);