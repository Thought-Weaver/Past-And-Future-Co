/*
    Name: Logan Apple
    CS 101 Spring 2021
    Date: May 26th, 2021

    The JS for the L&A Past and Future Co. admin page. This allows for any
    admin to make adjustments to the products without having to edit JSON
    by hand.
*/

/************************************************************************
 * IMPORTS
 ***********************************************************************/

import { openModal, closeModal, fromId, createElem } from "./utils.js"

/*************************************************************
 * FUNCTIONS
 *************************************************************/

/**
 * Create an item card element for the admin page listing.
 *
 * @param {String} category - The category of the item.
 * @param {Object} item - The item information from the API call.
 */
function createItemCard(category, item) {
    let card = createElem("form");
    card.classList.add("card");

    let nameTitle = createElem("h2");
    nameTitle.textContent = item["name"];

    let categoryTitle = createElem("p");
    categoryTitle.textContent = "Category: " + category;

    let hr = createElem("hr");

    let imgLabel = createElem("label");
    imgLabel.for = "image";
    imgLabel.textContent = "Image";

    let img = createElem("input");
    img.value = item["image"];
    img.name = "image";

    let quantityLabel = createElem("label");
    quantityLabel.for = "quantity";
    quantityLabel.textContent = "Quantity";

    let quantity = createElem("input");
    quantity.value = item["quantity"];
    quantity.name = "quantity";

    let priceLabel = createElem("label");
    priceLabel.for = "price";
    priceLabel.textContent = "Price";

    let price = createElem("input");
    price.value = item["price"];
    price.name = "price";

    let shortDescLabel = createElem("label");
    shortDescLabel.for = "short";
    shortDescLabel.textContent = "Short Desc";

    let shortDesc = createElem("textarea");
    shortDesc.value = item["short-description"];
    shortDesc.name = "short-description";

    let fullDescLabel = createElem("label");
    fullDescLabel.for = "full";
    fullDescLabel.textContent = "Full Desc";

    let fullDesc = createElem("textarea");
    fullDesc.value = item["full-description"];
    fullDesc.name = "full-description";

    let deleteButton = createElem("button");
    deleteButton.textContent = "Delete";

    let updateButton = createElem("button");
    updateButton.type = "submit";
    updateButton.textContent = "Update";

    card.addEventListener("submit", event => { updateItem(event, category, item["name"], card) });
    deleteButton.addEventListener("click", event => { deleteItem(event, category, item["name"]) });

    [nameTitle, categoryTitle, hr, imgLabel, img,
     quantityLabel, quantity, priceLabel, price,
     shortDescLabel, shortDesc, fullDescLabel, fullDesc,
     deleteButton, updateButton].forEach(elem => {
        card.appendChild(elem);
    });

    fromId("store-items").appendChild(card);
}


/**
 * Populate the admin panel listing with all the store items.
 *
 * @param {Object} response - The JSON of all items in the store.
 */
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


/**
 * Fetch all the items using the API.
 */
function getItems() {
    fetch("/items")
        .then(checkStatus)
        .then(response => response.json())
        .then(populateStore)
        .catch(handleError);
}


/**
 * Update a particular item's information in the store.
 *
 * @param {Event} event - The form submission event.
 * @param {String} category - The item's category.
 * @param {String} name - The item's name.
 * @param {Element} itemCard - The card element on the page.
 */
function updateItem(event, category, name, itemCard) {
    event.preventDefault();

    let formattedCategory = formatKebabCase(category);
    let formattedName = formatKebabCase(name);
    fetch(`/categories/${formattedCategory}/${formattedName}`, {
        method: "POST",
        body: JSON.stringify({
            "category": category,
            "item": name,
            "image": itemCard.querySelector("[name='image']").value,
            "quantity": itemCard.querySelector("[name='quantity']").value,
            "price": itemCard.querySelector("[name='price']").value,
            "short-description": itemCard.querySelector("[name='short-description']").value,
            "full-description": itemCard.querySelector("[name='full-description']").value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(checkStatus)
    .then(response => response.text())
    .then(text => {
        fromId("server-response").getElementsByTagName("h1")[0].textContent = "Success!";
        fromId("server-response").getElementsByTagName("p")[0].textContent = text;
        openModal("response-container");
    })
    .catch(handleError);
}


/**
 * Delete an item from the store.
 *
 * @param {Event} event - The button press event.
 * @param {String} category - The item's category.
 * @param {String} name - The item's name.
 */
function deleteItem(event, category, name) {
    event.preventDefault();

    let formattedCategory = formatKebabCase(category);
    let formattedName = formatKebabCase(name);
    fetch(`/categories/${formattedCategory}/${formattedName}`, { method: "DELETE" })
    .then(checkStatus)
    .then(response => response.text())
    .then(text => {
        fromId("server-response").getElementsByTagName("h1")[0].textContent = "Success!";
        fromId("server-response").getElementsByTagName("p")[0].textContent = text;
        openModal("response-container");
        getItems();
    })
    .catch(handleError);
}


/**
 * Add an item to the store using the inputs on the admin panel.
 */
function addItem() {
    let name = fromId("new-item-name").value;
    let category = fromId("new-item-category").value;

    let formattedCategory = formatKebabCase(category);
    let formattedName = formatKebabCase(name);
    fetch(`/items/${formattedCategory}/${formattedName}`, { method: "POST" })
    .then(checkStatus)
    .then(response => response.text())
    .then(text => {
        fromId("server-response").getElementsByTagName("h1")[0].textContent = "Success!";
        fromId("server-response").getElementsByTagName("p")[0].textContent = text;
        openModal("response-container");
        getItems();
    })
    .catch(handleError);
}


/**
 * Add all the categories to the select for adding an item.
 *
 * @param {Object} response - The array of categories.
 */
function populateCategorySelect(response) {
    let select = fromId("new-item-category");
    while (select.firstChild) {
        select.firstChild.remove();
    }

    response.forEach(category => {
        let option = createElem("option");
        option.value = category;
        option.innerText = formatTitleCase(category);
        select.appendChild(option);
    });
}


/**
 * Fetch all the categories in the store, then populate
 * the select.
 */
function getCategories() {
    fetch("/categories")
        .then(checkStatus)
        .then(response => response.json())
        .then(populateCategorySelect)
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

fromId("close-response-btn").addEventListener("click", () => { closeModal("response-container") });
fromId("add-item-btn").addEventListener("click", addItem);
window.addEventListener("load", () => { getItems(); getCategories(); });