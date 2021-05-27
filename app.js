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
const globby = require("globby");
const path = require("path");

/*************************************************************
 * CONSTANTS
 *************************************************************/

const app = express();

const PORT = process.env.PORT || 8000;
const SERVER_ERROR = "Something went wrong... Please try again at a later time."

/*************************************************************
 * FUNCTIONS
 *************************************************************/

/**
 * Generates menu data from categories/ subdirectories in format:
 *    { categories : { 
 *        categoryName : [ { itemData }, { itemData }, ... ], ...
 *        categoryName : [ { itemData }, { itemData }, ... ]
 *     }}
 * Relies on directory structure in the form:
 * categories/
 *   <categoryName>/
 *     <itemName>/
 *       <itemFiles ...>
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
            let itemDirs = await globby(`categories/${category}/`, { onlyDirectories : true }); 
            for (let j = 0; j < itemDirs.length; j++) {                
                let itemData = await fs.readFile(itemDirs[j] + "/item.json", "utf8");
                let json = await JSON.parse(itemData);
                categoryData.push(json);
            }
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
        let items = await fs.readdir(`categories/${category}`);
        res.json(items);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
});

/*************************************************************
 * APP SETUP
 *************************************************************/

app.use(express.static("public"))
app.listen(PORT);
