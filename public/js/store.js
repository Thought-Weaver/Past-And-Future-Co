/*
  Name: Logan Apple
  CS 101 Spring 2021
  Date: May 26th, 2021

  The JS for the L&A Past and Future Co. website. This is the store
  script, which handles displaying the modal when an item card is
  clicked. It also handles the cart and purchase flow.
 */

/************************************************************************
 * IMPORTS
 ***********************************************************************/

import { 
    openModal,
    closeModal,
    fromId,
    createElem,
    fromTag,
    checkStatus,
    handleError,
    formatKebabCase,
    formatTitleCase
} from "./utils.js";

/*************************************************************
 * FUNCTIONS
 *************************************************************/

/**
 * Create an item card element for the store listing.
 *
 * @param {String} category - The category of the item.
 * @param {Object} item - The item information from the API call.
 */
function createItemCard(category, item, index) {
    let card = createElem("article");
    card.classList.add("card");

    let img = createElem("img");
    img.src = "img/" + item["image"];
    img.alt = item["name"] + " icon";

    let title = createElem("h2");
    title.innerText = item["name"];

    let hr = createElem("hr");

    let shortDesc = createElem("p");
    shortDesc.innerText = item["short-description"];

    let buttonContainer = createElem("div");
    
    let moreInfoButton = createElem("button");
    moreInfoButton.innerText = "More Info";
    moreInfoButton.addEventListener("click", () => { getItemForModal(category, item["name"]) });

    let addToCartButton = createElem("button");
    addToCartButton.innerText = "Add to Cart";
    addToCartButton.disabled = item["quantity"] <= 0;
    addToCartButton.addEventListener("click", () => { addToCart(category, item) });

    buttonContainer.appendChild(moreInfoButton);
    buttonContainer.appendChild(addToCartButton);

    [img, title, hr, shortDesc, buttonContainer].forEach(elem => {
        card.appendChild(elem);
    });

    card.style.opacity = 0;
    fromId("store-items").appendChild(card);

    card.animate(
        [ { opacity: 0, transform: `translateY(${index % 2 ? 20 : -20}px)` },
          { opacity: 1, transform: `translateY(0px)` }
        ],
        {
            fill: "forwards",
            duration: 1000,
            easing: "ease-in-out",
            delay: 250 * index
        }
    );
}

/**
 * Populate the store listing with all the store items.
 *
 * @param {Object} response - The JSON of all items in the store.
 */
function populateStore(response) {
    let container = fromId("store-items");
    while (container.firstChild) {
        container.firstChild.remove();
    }

    // Keep track of overall item index for delaying animations.
    let index = 0;
    Object.keys(response["categories"]).forEach(category => {
        response["categories"][category].forEach(item => {
            createItemCard(category, item, index);
            index += 1;
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
 * Add all the categories to the select for filtering items.
 *
 * @param {Object} response - The array of categories.
 */
function populateCategorySelect(response) {
    let select = fromId("category-select");
    while (select.firstChild) {
        select.firstChild.remove();
    }

    let option = createElem("option");
    option.value = "All";
    option.innerText = "All";
    select.appendChild(option); 

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
 * If the user is signed in, then change the login button to a
 * sign out button and create a nice welcome heading near the
 * title.
 *
 * @param {Object} response - A JSON response regarding login status.
 */
function createWelcome(response) {
    if (response.loggedin) {
        fromId("login-btn").remove();

        let signout = createElem("a");
        let btn = createElem("button");
        btn.textContent = "Sign Out";
        btn.addEventListener("click", () => {
            fetch("/signout")
                .then(checkStatus)
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(handleError);
        });
        signout.appendChild(btn);
        
        let nav = fromTag("nav")[0];
        nav.insertBefore(signout, nav.firstChild);

        let welcome = createElem("h3");
        welcome.textContent = "Welcome back, " + response.username + ".";
        fromId("title-section").appendChild(welcome);
    }
}

/**
 * Get all the categories and items, then check if the user
 * is logged in.
 */
function loadStore() {
    getCategories();
    getItems();

    fetch("/isloggedin")
        .then(checkStatus)
        .then(response => response.json())
        .then(createWelcome)
        .catch(handleError);
}

/**
 * Filter the list of store items when the select is changed.
 */
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
            .then(response => { 
                let index = 0;
                response.forEach(item => { 
                    getItem(formattedCategory, item, index);
                    index += 1;
                })
            })
            .catch(handleError);
    }
}

/**
 * Display a modal with more information about a particular item.
 *
 * @param {String} category - The category of the item.
 * @param {Object} item - The item information from the API call.
 */
function displayItemModal(category, item) {
    fromId("modal-img").src = "img/" + item["image"];
    fromId("modal-img").alt = item["name"];

    fromId("modal-title").textContent = item["name"];

    fromId("modal-desc").textContent = item["full-description"];

    fromId("modal-price").textContent = "Price: " + item["price"].toString();
    fromId("modal-quantity").textContent = "Quantity: " + item["quantity"].toString();

    fromId("add-to-cart-btn").addEventListener("click", () => { addToCart(category, item) });
    fromId("add-to-cart-btn").disabled = item["quantity"] <= 0;

    openModal("modal-container");
}

/**
 * Add an item to the cart.
 *
 * @param {String} category - The category of the item.
 * @param {Object} item - The item information from the API call.
 */
function addToCart(category, item) {
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }

    let currentCart = JSON.parse(localStorage.getItem("cart"));
    currentCart.push([category, item]);
    
    localStorage.setItem("cart", JSON.stringify(currentCart));
}

/**
 * Remove an item from the cart.
 *
 * @param {number} index - The index of the item in the cart.
 */
function removeFromCart(index) {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    currentCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(currentCart));
}


/**
 * Display the cart modal.
 */
function displayCart() {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let totalCost = 0;

    let cart = fromId("cart-items");
    while (cart.firstChild) {
        cart.firstChild.remove();
    }

    if (currentCart) {
        currentCart.forEach((pair, index) => {
            let item = pair[1];

            let cartItem = createElem("div");
            cartItem.classList.add("cart-item");
            
            let title = createElem("h2");
            title.textContent = item["name"];

            let removeButton = createElem("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => { removeFromCart(index); displayCart(); });

            let info = createElem("p");
            info.textContent = "Price: " + item["price"];

            let textContainer = createElem("div");
            textContainer.appendChild(title);
            textContainer.appendChild(info);

            cartItem.appendChild(textContainer);
            cartItem.appendChild(removeButton);

            fromId("cart-items").appendChild(cartItem);

            totalCost += parseInt(item["price"]);
        });
    }

    fromId("total-cost").textContent = "Total: " + totalCost.toString();

    openModal("cart-container");
}

/**
 * Fetch information for a particular item from the API and create
 * its card, adding it to the store listing.
 *
 * @param {String} category - The category of the item.
 * @param {Object} item - The item information from the API call.
 */
function getItem(category, item, index) {
    fetch(`/categories/${category}/${item}`)
        .then(checkStatus)
        .then(response => response.json())
        .then(response => { createItemCard(category, response, index) })
        .catch(handleError);
}

/**
 * Fetch information for a particular item from the API and display
 * the information on the item modal.
 *
 * @param {String} category - The category of the item.
 * @param {Object} item - The item information from the API call.
 */
function getItemForModal(category, item) {
    let categoryFormatted = formatKebabCase(category);
    let itemFormatted = formatKebabCase(item);

    fetch(`/categories/${categoryFormatted}/${itemFormatted}`)
        .then(checkStatus)
        .then(response => response.json())
        .then(response => { displayItemModal(category, response) })
        .catch(handleError);
}

/**
 * On a successful checkout, display the success message, clear the cart,
 * and refresh the items available.
 *
 * @param {String} text
 */
function checkoutSuccess(text) {
    localStorage.setItem("cart", JSON.stringify([]));

    closeModal("cart-container");

    fromId("server-response").getElementsByTagName("h1")[0].textContent = "Success!";
    fromId("server-response").getElementsByTagName("p")[0].textContent = text;

    openModal("response-container");

    // Refresh the items in case one runs out of stock.
    onSelectChange();
}

/**
 * Post the checkout route.
 */
function checkout() {
    let currentCart = JSON.parse(localStorage.getItem("cart"));
    let cartMapped = currentCart.map(pair => {
        return {
            category: formatKebabCase(pair[0]),
            item: formatKebabCase(pair[1]["name"])
        }
    });

    fetch("/checkout", {
        method: "POST",
        body: JSON.stringify(cartMapped),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(checkStatus)
    .then(response => response.text())
    .then(checkoutSuccess)
    .catch(handleError);
}

/*************************************************************
 * EVENT HANDLERS
 *************************************************************/

fromId("close-btn").addEventListener("click", () => { closeModal("modal-container") });
fromId("close-response-btn").addEventListener("click", () => { closeModal("response-container") });
fromId("close-cart-btn").addEventListener("click", () => { closeModal("cart-container") });
fromId("cart-icon").addEventListener("click", displayCart);
fromId("category-select").addEventListener("change", onSelectChange);
fromId("checkout-btn").addEventListener("click", checkout);
window.addEventListener("load", loadStore);