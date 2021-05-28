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

function createItemCard(category, item) {
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
    more_info_button.addEventListener("click", () => { getItemForModal(category, item["name"]) });

    let add_to_cart_button = createElem("button");
    add_to_cart_button.innerText = "Add to Cart";
    add_to_cart_button.disabled = item["quantity"] > 0;
    // TODO: Get cart functionality working.

    button_container.appendChild(more_info_button);
    button_container.appendChild(add_to_cart_button);

    [img, title, hr, short_desc, button_container].forEach(elem => {
        card.appendChild(elem);
    });

    fromId("store-items").appendChild(card);
}

function populateStore(response) {
    let container = fromId("store-items");
    while (container.firstChild) {
        container.firstChild.remove();
    }

    Object.keys(response["categories"]).forEach(category => {
        response["categories"][category].forEach(item => {
            createItemCard(category, item);
        })
    })
}

function getItems() {
    fetch("/items")
        .then(checkStatus)
        .then(response => response.json())
        .then(populateStore)
        .catch(handleError);
}

function populateCategorySelect(response) {
    let select = fromId("category-select");
    while (select.firstChild) {
        select.firstChild.remove();
    }

    let option = createElem("option");
    option.value = "All";
    option.innerText = "All";
    fromId("category-select").appendChild(option); 

    response.forEach(category => {
        let option = createElem("option");
        option.value = category;
        option.innerText = formatTitleCase(category);
        fromId("category-select").appendChild(option);
    });
}

function getCategories() {
    fetch("/categories")
        .then(checkStatus)
        .then(response => response.json())
        .then(populateCategorySelect)
        .catch(handleError);
}

function getItemsAndCategories() {
    getCategories();
    getItems();
}

function onSelectChange() {
    let container = fromId("store-items");
    while (container.firstChild) {
        container.firstChild.remove();
    }

    let category = fromId("category-select").value;
    if (category == "All") {
        getItems();
    }
    else {
        let formattedCategory = formatKebabCase(category);
        fetch(`/categories/${formattedCategory}`)
            .then(checkStatus)
            .then(response => response.json())
            .then(response => { response.forEach(item => { getItem(formattedCategory, item) }) })
            .catch(handleError);
    }
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
    fetch(`/categories/${category}/${item}`)
        .then(checkStatus)
        .then(response => response.json())
        .then((response) => { createItemCard(category, response) })
        .catch(handleError);
}

function getItemForModal(category, item) {
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

/**
 * Takes a dash-separated string and converts it to a title case string.
 * 
 * @param {String} s - The dash-separated string.
 * @returns {String} The string formatted in title case.
 */
function formatTitleCase(s) {
    let words = s.split("-");
    let firstWord = words[0];
    let result = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    for (let i = 1; i < words.length; i++) {
        let nextWord = words[i];
        result += " " + nextWord.charAt(0).toUpperCase() + nextWord.slice(1);
    }
    return result;
}

/*************************************************************
 * EVENT HANDLERS
 *************************************************************/

fromId("close-btn").addEventListener("click", () => { closeModal("modal-container") });
fromId("close-response-btn").addEventListener("click", () => { closeModal("response-container") });
fromId("category-select").addEventListener("change", onSelectChange);
window.addEventListener("load", getItemsAndCategories);