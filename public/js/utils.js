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