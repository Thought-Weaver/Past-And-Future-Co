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
const bodyParser = require('body-parser')

/*************************************************************
 * CONSTANTS
 *************************************************************/

const app = express();

const PORT = process.env.PORT || 8000;
const SERVER_ERROR = "Something went wrong... Please try again at a later time."

/*************************************************************
 * APP SETUP
 *************************************************************/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(express.static("public"));

/*************************************************************
 * FUNCTIONS
 *************************************************************/

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
        items = items.map(itemFile => formatTitleCase(itemFile.replace(".json", "")))
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
        console.log(req.body);
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

app.listen(PORT);
