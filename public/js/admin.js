/*
Name: Logan Apple
CS 101 Spring 2021
Date: May 26th, 2021

The JS for the L&A Past and Future Co. admin page. This allows for any
admin to make adjustments to the products without having to edit JSON
by hand.
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

    let updateButton = createElem("button");
    updateButton.type = "submit";
    updateButton.textContent = "Update";

    card.addEventListener("submit", event => { updateItem(event, category, item["name"], card) });

    [nameTitle, categoryTitle, hr, imgLabel, img,
     quantityLabel, quantity, priceLabel, price,
     shortDescLabel, shortDesc, fullDescLabel, fullDesc,
     updateButton].forEach(elem => {
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
window.addEventListener("load", getItems);