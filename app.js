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
const SERVER_ERROR = "Something went wrong... Please try again at a later time."
const LOGIN_ERROR = "Your login username or password was not recognized."

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
        throw Error(LOGIN_ERROR);
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

app.get("/categories", async (req, res) => {
    try {
        let categories = await fs.readdir("categories");
        res.json(categories);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

app.get("/categories/:category", async (req, res) => {
    try {
        let items = await fs.readdir(`categories/${req.params["category"]}`);
        items = items.map(itemFile => itemFile.replace(".json", ""))
        res.json(items);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

app.get("/categories/:category/:item", async (req, res) => {
    try {
        let item = await fs.readFile(`categories/${req.params["category"]}/${req.params["item"]}.json`, "utf8");
        let json = await JSON.parse(item);
        res.json(json);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

app.get("/items", async (req, res) => {
    try {
        let items = await getItems();
        res.json(items);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

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
        res.status(500).send(SERVER_ERROR);
    }
});

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
        res.status(500).send(SERVER_ERROR);
    }
});

app.post("/login", async (req, res) => {
    try {
        let username = req.body["username"];
        let password = req.body["password"];

        let user = await getUser(username);
        if (!user || user.password != password) {
            throw Error(LOGIN_ERROR);
        }

        req.session.authenticated = true;
        res.redirect("../admin.html");
    }
    catch (err) {
        res.status(401).send(LOGIN_ERROR);
    }
});

app.get("/admin", async (req, res) => {
    if (!req.session.authenticated) {
        res.redirect("../login.html");
    }
});

app.get("/users/:user", async (req, res) => {
    try {
        let json = await getUser(req.params["user"]);
        res.json(json);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

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
        res.status(500).send(SERVER_ERROR);
    }
});

app.delete("/categories/:category/:item", async (req, res) => {
    try {
        await fs.unlink(`categories/${req.params["category"]}/${req.params["item"]}.json`);

        res.type("text");
        res.send(`The item (${formatTitleCase(req.params["item"])}) has been deleted!`);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

app.post("/items/:category/:item", async (req, res) => {
    try {
        await fs.writeFile(`categories/${req.params["category"]}/${req.params["item"]}.json`,
                            JSON.stringify({ name: formatTitleCase(req.params["item"]) }),
                            { flag: "wx" });

        res.type("text");
        res.send(`The item (${formatTitleCase(req.params["item"])}) has been created!`);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

app.listen(PORT);
