// ==UserScript==
// @name         TapSwapBot
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  AutoClick
// @author       anonymous
// @match        *.tapswap.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @downloadURL  https://github.com/trungduy17/telebot/raw/main/tw.user.js
// @updateURL    https://github.com/trungduy17/telebot/raw/main/tw.user.js
// @homepage     https://github.com/trungduy17/telebot
// @grant        none
// ==/UserScript==

// Configurable values
const minClickDelay = 30; // Minimum delay between clicks in milliseconds
const maxClickDelay = 50; // Maximum delay between clicks in milliseconds
const pauseMinTime = 5000; // Minimum pause time in milliseconds (5 seconds)
const pauseMaxTime = 10000; // Maximum pause time in milliseconds (10 seconds)
const energyThreshold = 25; // Energy threshold below which a pause is taken
const checkInterval = 5000; // Interval to check for coin presence in milliseconds (3 seconds)
const maxCheckAttempts = 10; // Maximum number of attempts to check for coin presence

let checkAttempts = 0; // Counter for check attempts

function triggerEvent(element, eventType, properties) {
    const event = new MouseEvent(eventType, properties);
    element.dispatchEvent(event);
}

function getRandomCoordinateInCircle(radius) {
    let x, y;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
    } while (x * x + y * y > 1); // Ensure the point is inside the circle
    return {
        x: Math.round(x * radius),
        y: Math.round(y * radius)
    };
}

function getCurrentEnergy() {
    const energyElement = document.querySelector("div._value_tzq8x_13 h4._h4_1w1my_1");
    if (energyElement) {
        return parseInt(energyElement.textContent);
    }
    return null;
}

function checkCoinAndClick() {
    const button = document.querySelector("#ex1-layer img");

    if (button) {
        console.log("%cCoin found. Performing click.", "background: #8774E1; color: #fff; padding: 5px;");
        clickButton();
    } else {
        checkAttempts++;
        if (checkAttempts >= maxCheckAttempts) {
            console.log("%cCoin not found after 5 attempts. Reloading page.", "background: #8774E1; color: #fff; padding: 5px;");
            location.reload();
        } else {
            console.log(`%cCoin not found. Attempt ${checkAttempts}/${maxCheckAttempts}. Retrying in 3 seconds.`, "background: #8774E1; color: #fff; padding: 5px;");
            setTimeout(checkCoinAndClick, checkInterval);
        }
    }
}

function clickButton() {
    const currentEnergy = getCurrentEnergy();
    if (currentEnergy !== null && currentEnergy < energyThreshold) {
        const pauseTime = pauseMinTime + Math.random() * (pauseMaxTime - pauseMinTime);
        console.log(`%cEnergy below ${energyThreshold}. Pausing for ${Math.round(pauseTime / 1000)} seconds.`, "background: #8774E1; color: #fff; padding: 5px;");
        setTimeout(clickButton, pauseTime);
        return;
    }

    const button = document.querySelector("#ex1-layer img");

    if (button) {
        const rect = button.getBoundingClientRect();
        const radius = Math.min(rect.width, rect.height) / 2;
        const { x, y } = getRandomCoordinateInCircle(radius);

        const clientX = rect.left + radius + x;
        const clientY = rect.top + radius + y;

        const commonProperties = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientX,
            clientY: clientY,
            screenX: clientX,
            screenY: clientY,
            pageX: clientX,
            pageY: clientY,
            pointerId: 1,
            pointerType: "touch",
            isPrimary: true,
            width: 1,
            height: 1,
            pressure: 0.5,
            button: 0,
            buttons: 1
        };

        // Trigger events
        triggerEvent(button, 'pointerdown', commonProperties);
        triggerEvent(button, 'mousedown', commonProperties);
        triggerEvent(button, 'pointerup', { ...commonProperties, pressure: 0 });
        triggerEvent(button, 'mouseup', commonProperties);
        triggerEvent(button, 'click', commonProperties);

        // Schedule the next click with a random delay
        const delay = minClickDelay + Math.random() * (maxClickDelay - minClickDelay);
        setTimeout(checkCoinAndClick, delay);
    } else {
        console.log("%cButton not found!", "background: #8774E1; color: #fff; padding: 5px;");
        setTimeout(checkCoinAndClick, checkInterval);
    }
}

// Function to generate a random delay between min and max milliseconds
function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// HTML selectors and delays for each button
const buttonActions = [
    // Waiting to reload
    { selector: '#app > div._container_1jw9i_1._loading_1jw9i_56 > div._leaveContainer_b7w50_1 > div._buttons_b7w50_19 > button._button_fffa0_1._secondary_fffa0_21._large_fffa0_49', delay: randomDelay(10000, 11000) },

    // Auto claim
    { selector: '#app > div._drawerContainer_1v85a_1 > div._actionContent_1v85a_75 > button', delay: randomDelay(2000, 3000) },

    // Boost Tank
    { selector: '#app > div._container_1jw9i_1._main_1jw9i_27 > div._bottomContent_ghpd6_1 > div > div._wrapper_7h0ke_1 > div._rightBtn_7h0ke_15 > button:nth-child(2)', delay: randomDelay(1000, 2000) },
    { selector: '#app > div._container_1jw9i_1._main_1jw9i_27 > div._bottomContent_ghpd6_1 > div > div._wrapper_7h0ke_1 > div._rightBtn_7h0ke_15 > button', delay: randomDelay(1000, 2000) },
    { selector: '#app > div._container_1jw9i_1._page_1jw9i_46 > div._container_jn9s0_1 > div._stack_sem72_1 > div > button:nth-child(2)', delay: randomDelay(1000, 3000) },

    // Got It button
    { selector: '#app > div._container_1jw9i_1._page_1jw9i_46 > div._drawerContainer_1v85a_1 > div._actionContent_1v85a_75 > button', delay: randomDelay(1000, 3000) },

    // Boost Guru
    { selector: '#app > div._container_1jw9i_1._main_1jw9i_27 > div._bottomContent_ghpd6_1 > div > div._wrapper_7h0ke_1 > div._rightBtn_7h0ke_15 > button:nth-child(2)', delay: randomDelay(1000, 2000) },
    { selector: '#app > div._container_1jw9i_1._main_1jw9i_27 > div._bottomContent_ghpd6_1 > div > div._wrapper_7h0ke_1 > div._rightBtn_7h0ke_15 > button', delay: randomDelay(1000, 2000) },
    { selector: '#app > div._container_1jw9i_1._page_1jw9i_46 > div._container_jn9s0_1 > div._stack_sem72_1 > div > button:nth-child(1)', delay: randomDelay(1000, 3000) },

    // Got It button
    { selector: '#app > div._container_1jw9i_1._page_1jw9i_46 > div._drawerContainer_1v85a_1 > div._actionContent_1v85a_75 > button', delay: randomDelay(1000, 3000) },
];

// Function to click a button by selector
function clickButtonBySelector(selector) {
    const button = document.querySelector(selector);
    if (button) {
        button.click();
        console.log(`${selector} clicked`);
    } else {
        console.log(`${selector} not found`);
    }
}

// Full scenario implementation
async function runScenario() {
    // Step 1: Wait some seconds and click
    await new Promise(resolve => setTimeout(resolve, buttonActions[0].delay));
    clickButtonBySelector(buttonActions[0].selector);

    await new Promise(resolve => setTimeout(resolve, buttonActions[1].delay));
    clickButtonBySelector(buttonActions[1].selector);
    
    for (let i = 0; i < 8; i++) {
        checkCoinAndClick();
        console.log(`Function X (checkCoinAndClick) run ${i + 1} times`);
        // Step 2: Run checkCoinAndClick after random seconds
        await new Promise(resolve => setTimeout(resolve, randomDelay(35000, 40000)));

        // Step 3: Click buttons 2 to 9 in sequence with their specific delays
        for (let j = 2; j < buttonActions.length; j++) { // Start from 2 because button 0-1 is already clicked
            const delay = buttonActions[j].delay;
            await new Promise(resolve => setTimeout(resolve, delay));
            clickButtonBySelector(buttonActions[j].selector);
        }
    }
}

// Start the scenario
runScenario();
