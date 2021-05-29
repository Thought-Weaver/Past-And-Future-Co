/*
    Name: Logan Apple
    CS 101 Spring 2021
    Date: May 28th, 2021

    Common functions used across many of the different JS files.
 */

/************************************************************************
 * CONSTANTS
 ***********************************************************************/

export const fromId = document.getElementById.bind(document);
export const fromName = document.getElementsByName.bind(document);
export const createElem = document.createElement.bind(document); 

/************************************************************************
 * FUNCTIONS
 ***********************************************************************/

/**
 * Close a modal on the page.
 *
 * @param {String} id - The ID of the element.
 */
export function closeModal(id) {
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

/**
 * Open a modal on the page.
 *
 * @param {String} id - The ID of the element.
 */
export function openModal(id) {
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

/**
 * Checks the status of the response for an error. In the case of an error,
 * throws an error to interrupt the fetch sequence.
 *
 * @param {Response} response - The response from the API call.
 * @return {object} Valid response if it was successful, else rejected Promise result.
 */
export function checkStatus(response) {
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}
 
/**
 * Handles any errors that occur in the fetch sequence.
 *
 * @param {Error} error - The error raised during the process.
 */
export function handleError(error) {
    fromId("server-response").getElementsByTagName("h1")[0].textContent = "Error!";
    fromId("server-response").getElementsByTagName("p")[0].textContent = error.message;

    openModal("response-container");
}

/**
 * Takes a title case string and converts it to dash-separated string.
 * 
 * @param {String} s - The title case string.
 * @returns {String} The kebab case string.
 */
export function formatKebabCase(s) {
    return s.toLowerCase().replaceAll(" ", "-");
}

/**
 * Takes a dash-separated string and converts it to a title case string.
 * 
 * @param {String} s - The dash-separated string.
 * @returns {String} The string formatted in title case.
 */
export function formatTitleCase(s) {
    let words = s.split("-");
    let firstWord = words[0];
    let result = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    for (let i = 1; i < words.length; i++) {
        let nextWord = words[i];
        result += " " + nextWord.charAt(0).toUpperCase() + nextWord.slice(1);
    }
    return result;
}