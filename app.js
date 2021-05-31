/**
 * Name: Logan Apple
 * CS 101 Spring 2021
 * Date: May 26th, 2021
 * 
 * This is the app for running the main part of the site! It contains
 * endpoints for the cart, store, and user information. It also runs
 * the content, providing a webserver for static client-facing content.
 */
"use strict";

/*************************************************************
 * IMPORTS
 *************************************************************/

const express = require("express");
const fs = require("fs/promises");
const bodyParser = require("body-parser");
var session = require("express-session");

/*************************************************************
 * CONSTANTS
 *************************************************************/

const app = express();

const PORT = process.env.PORT || 8000;

const SERVER_ERROR = "Something went wrong... Please try again at a later time.";
const LOGIN_ERROR = "Your login username or password was not recognized.";
const SIGNUP_ERROR = "That username already exists.";
const NOT_LOGGED_IN_ERROR = "You are not logged in.";

/*************************************************************
 * APP SETUP
 *************************************************************/

app.use(session({
    secret: "keepit",
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(express.static("public"));

/*************************************************************
 * FUNCTIONS
 *************************************************************/

/**
 * Given a username, try to retrieve the user information file.
 *
 * @param {String} username - The user's username.
 * @return {Object} The JSON for the user's file. 
 */
async function getUser(username) {
    try {
        let item = await fs.readFile(`users/${username}.json`, "utf8");
        let json = await JSON.parse(item);
        return json;
    }
    catch (err) {
        return undefined;
    }
}

/**
 * Retrieves all item JSON from the categories subfolders.
 * 
 * @returns {Object} Generated items in valid JSON format. 
 */
 async function getItems() {
    let result = {};
    try {
        let categories = await fs.readdir("categories");
        for (let i = 0; i < categories.length; i++) {
            let category = categories[i];
            let categoryData = [];

            let items = await fs.readdir(`categories/${category}/`);

            await Promise.all(items.map(async (itemFile) => {
                let itemData = await fs.readFile(`categories/${category}/` + itemFile, "utf8");
                let json = await JSON.parse(itemData);
                categoryData.push(json);
            }));
            
            let formattedCategory = formatTitleCase(category);
            result[formattedCategory] = categoryData;
        }
        return { "categories" : result };
    }
    catch (err) {
        throw err;
    }
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
 * ENDPOINTS
 *************************************************************/

/**
 * @api {get} /categories/ Request Item Categories
 * @apiName GetCategories
 * @apiGroup Items
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Array} categories Categories of items.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if there's a problem reading the list of categories.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.get("/categories", async (req, res) => {
    try {
        let categories = await fs.readdir("categories");
        res.json(categories);
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {get} /categories/:category Request Items in Category
 * @apiName GetCategory
 * @apiGroup Items
 * @apiVersion 0.1.0
 *
 * @apiParam {String} category The name of the category.
 * 
 * @apiSuccess {Array} items Item names in the category.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if there's a problem reading the particular category directory.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.get("/categories/:category", async (req, res) => {
    try {
        let items = await fs.readdir(`categories/${req.params["category"]}`);
        items = items.map(itemFile => itemFile.replace(".json", ""))
        res.json(items);
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {get} /categories/:category Request Item
 * @apiName GetItem
 * @apiGroup Items
 * @apiVersion 0.1.0
 *
 * @apiParam {String} category The name of the category.
 * @apiParam {String} item The name of the item.
 * 
 * @apiSuccess {String} name Title-case name of the item.
 * @apiSuccess {String} short-description A short summary of what the item is.
 * @apiSuccess {Array} full-description A long description of the item.
 * @apiSuccess {Number} quantity The number of this item in-stock.
 * @apiSuccess {Number} price How much the item costs.
 * @apiSuccess {String} image The name of the image representing this item, stored in public images.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if there's a problem retrieving the particular item.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.get("/categories/:category/:item", async (req, res) => {
    try {
        let item = await fs.readFile(`categories/${req.params["category"]}/${req.params["item"]}.json`, "utf8");
        let json = await JSON.parse(item);
        res.json(json);
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {get} /items Request All Items
 * @apiName GetItems
 * @apiGroup Items
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Object} items A dictionary of everything in the categories folder.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if there's a problem retrieving the items.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.get("/items", async (req, res) => {
    try {
        let items = await getItems();
        res.json(items);
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {post} /contact-form Contact Form
 * @apiName ContactForm
 * @apiGroup Contact
 * @apiVersion 0.1.0
 * 
 * @apiParam (Request body) {String} name The person's full name.
 * @apiParam (Request body) {String} email The person's email.
 * @apiParam (Request body) {String} message The sent message.
 * 
 * @apiSuccess {String} response A message that the message was successfully recorded.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if there's an issue writing the message to the contact-forms folder.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.post("/contact-form", async (req, res) => {
    try {
        let name = req.body["name"];
        let email = req.body["email"];
        let message = req.body["message"];

        var dateString = new Date().toLocaleString();
        dateString = dateString.replaceAll("/", "-").replaceAll(":", "-").replace(",", "");

        await fs.writeFile(
            `./contact-forms/${name} (${dateString}).txt`,
            `Name: ${name}\n\nE-mail: ${email}\n\nMessage: ${message}`,
            "utf-8");

        res.type("text");
        res.send("Your response has been received and recorded.");
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {post} /checkout Checkout
 * @apiName Checkout
 * @apiGroup Items
 * @apiVersion 0.1.0
 * 
 * @apiParam (Request body) {Array} items An array of dictionaries with category and item keys.
 * 
 * @apiSuccess {String} response A message that the order is on its way.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised when there's a problem reading the information about the item or decrementing the quantity.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.post("/checkout", async (req, res) => {
    try {
        for (let i = 0; i < req.body.length; ++i) {
            let item = req.body[i];
            let itemFile = await fs.readFile(`categories/${item["category"]}/${item["item"]}.json`);
            let json = await JSON.parse(itemFile);

            if (json["quantity"] > 0) {
                json["quantity"] -= 1;
            }
            else {
                throw Error("Quantity not greater than 0.");
            }

            await fs.writeFile(
                `categories/${item["category"]}/${item["item"]}.json`,
                JSON.stringify(json),
                "utf-8"
            );
        }

        res.type("text");
        res.send("Your order is on its way!");
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {post} /login Login
 * @apiName Login
 * @apiGroup Auth
 * @apiVersion 0.1.0
 * 
 * @apiParam (Request body) {String} username The person's username.
 * @apiParam (Request body) {String} password The persons' password.
 * 
 * @apiError (Not Authenticated 401) NotAuthenticated
 *     Raised when the username or password of the user isn't valid.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "statusMessage": "Your login username or password was not recognized."
 *     }
 */
app.post("/login", async (req, res) => {
    try {
        let username = req.body["username"];
        let password = req.body["password"];

        let user = await getUser(username);
        if (!user || user.password != password) {
            throw Error(LOGIN_ERROR);
        }

        req.session.authenticated = true;
        req.session.username = user.username;
        req.session.admin = user.admin;

        if (req.session.admin) {
            res.redirect("../admin.html");
        }
        else {
            res.redirect("../index.html");
        }
    }
    catch (err) {
        res.statusMessage = LOGIN_ERROR;
        res.status(401).end();
    }
});

/**
 * @api {post} /signup Sign Up
 * @apiName SignUp
 * @apiGroup Auth
 * @apiVersion 0.1.0
 * 
 * @apiParam (Request body) {String} username The person's username.
 * @apiParam (Request body) {String} password The persons' password.
 * 
 * @apiError (Not Authenticated 401) NotAuthenticated
 *     Raised when the username already exists.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "statusMessage": "That username already exists!"
 *     }
 */
 app.post("/signup", async (req, res) => {
    try {
        let username = req.body["username"];
        let password = req.body["password"];

        let user = await getUser(username);
        if (!user) {
            let json = {
                "username": username,
                "password": password
            };

            await fs.writeFile(`users/${username}.json`,
                                JSON.stringify(json),
                                "utf8");

            req.session.authenticated = true;
            req.session.username = username;
            res.redirect("../index.html");
        }
        else {
            throw Error(SIGNUP_ERROR)
        }
    }
    catch (err) {
        res.statusMessage = SIGNUP_ERROR;
        res.status(401).end();
    }
});

/**
 * @api {get} /isloggedin Is Logged In
 * @apiName IsLoggedIn
 * @apiGroup Auth
 * @apiVersion 0.1.0
 * 
 * @apiSuccess {Object} response Contains a "loggedin" key that specifies
 *     whether the person is logged in and a defined "username" key if so.
 * 
 */
 app.get("/isloggedin", async (req, res) => {
    res.json({ 
        "loggedin": req.session.authenticated,
        "username": req.session.username
    });
});

/**
 * @api {get} /signout Sign Out
 * @apiName SignOut
 * @apiGroup Auth
 * @apiVersion 0.1.0
 * 
 * @apiSuccess {Object} response Redirects to main page if successful.
 * 
 * @apiError (Not Authenticated 401) NotAuthenticated
 *     Raised when this is called while the user isn't logged in.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "statusMessage": "You are not logged in!"
 *     }
 */
 app.get("/signout", async (req, res) => {
    try {
        if (!req.session.authenticated) {
            throw Error(NOT_LOGGED_IN_ERROR);
        }

        req.session.authenticated = false;
        req.session.username = undefined;
        req.session.admin = undefined;

        res.redirect("../index.html");
    }
    catch (err) {
        res.statusMessage = NOT_LOGGED_IN_ERROR;
        res.status(401).end();
    }
});

/**
 * @api {get} /admin Admin Check
 * @apiName Admin
 * @apiGroup Auth
 * @apiVersion 0.1.0
 * 
 */
app.get("/admin", async (req, res) => {
    if (!req.session.authenticated || !req.session.admin) {
        res.redirect("../login.html");
    }
});

/**
 * @api {post} /categories/:category/:item Update Item
 * @apiName UpdateItem
 * @apiGroup Items
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} category The item's category.
 * @apiParam {String} item The item's name.
 * 
 * @apiParam (Request body) {String} image The updated image filename to represent the item.
 * @apiParam (Request body) {String} quantity The updated item quantity.
 * @apiParam (Request body) {String} price The updated item price.
 * @apiParam (Request body) {String} short-description The updated item short summary.
 * @apiParam (Request body) {String} full-description The updated item full description.
 * 
 * @apiSuccess {String} response A message that the item has been updated.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if there's an error reading/writing when updating the item.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.post("/categories/:category/:item", async (req, res) => {
    try {
        let item = await fs.readFile(`categories/${req.params["category"]}/${req.params["item"]}.json`, "utf8");
        let json = await JSON.parse(item);
        
        json["image"] = req.body["image"];
        json["quantity"] = req.body["quantity"];
        json["price"] = req.body["price"];
        json["short-description"] = req.body["short-description"];
        json["full-description"] = req.body["full-description"];

        await fs.writeFile(`categories/${req.params["category"]}/${req.params["item"]}.json`,
                           JSON.stringify(json),
                           "utf8");

        res.type("text");
        res.send(`The item (${formatTitleCase(req.params["item"])}) has been updated!`);
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {delete} /categories/:category/:item Delete Item
 * @apiName DeleteItem
 * @apiGroup Items
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} category The item's category.
 * @apiParam {String} item The item's name.
 * 
 * @apiSuccess {String} response A message that the item has been deleted.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if something goes wrong trying to delete the item.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.delete("/categories/:category/:item", async (req, res) => {
    try {
        await fs.unlink(`categories/${req.params["category"]}/${req.params["item"]}.json`);

        res.type("text");
        res.send(`The item (${formatTitleCase(req.params["item"])}) has been deleted!`);
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

/**
 * @api {post} /items/:category/:item Create Item
 * @apiName CreateItem
 * @apiGroup Items
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} category The item's category.
 * @apiParam {String} item The item's name.
 * 
 * @apiSuccess {String} response A message that the item has been created.
 * 
 * @apiError (Internal Server Error 500) InternalServerError
 *     Raised if the item trying to be created already exists.
 * @apiErrorExample Error Response (example):
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "statusMessage": "Something went wrong... Please try again at a later time."
 *     }
 */
app.post("/items/:category/:item", async (req, res) => {
    try {
        await fs.writeFile(`categories/${req.params["category"]}/${req.params["item"]}.json`,
                            JSON.stringify({ name: formatTitleCase(req.params["item"]) }),
                            { flag: "wx" });

        res.type("text");
        res.send(`The item (${formatTitleCase(req.params["item"])}) has been created!`);
    }
    catch (err) {
        res.statusMessage = SERVER_ERROR;
        res.status(500).end();
    }
});

app.listen(PORT);
