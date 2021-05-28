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

function closeModal() {
    fromId("modal-container").animate(
        [ { opacity: 0 } ],
        {
            fill: "forwards",
            easing: "steps(4, end)",
            duration: 250,
            easing: "ease-in-out"
        }
    );

    setTimeout(() => {
        fromId("modal-container").style.display = "none";
    }, 250);
}

function openModal() {
    fromId("modal-container").animate(
        [ { opacity: 1 } ],
        {
            fill: "forwards",
            easing: "steps(4, end)",
            duration: 250,
            easing: "ease-in-out"
        }
    );

    setTimeout(() => {
        fromId("modal-container").style.display = "flex";
    }, 250);
}

/*************************************************************
 * EVENT HANDLERS
 *************************************************************/

fromId("close-btn").addEventListener("click", closeModal);