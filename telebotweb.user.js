// ==UserScript==
// @name         Tele Bot on Web
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Fake Android to play Tele Bot on Web
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL  https://github.com/trungduy17/telebot/raw/main/telebotweb.user.js
// @updateURL    https://github.com/trungduy17/telebot/raw/main/telebotweb.user.js
// @homepage     https://github.com/trungduy17/telebot
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const PATTERNS_URL = 'https://raw.githubusercontent.com/trungduy17/telebot/refs/heads/main/match-patterns.json';
    
    // Function to check if current URL matches any pattern
    function matchesPattern(patterns, currentUrl) {
        return patterns.some(pattern => {
            const regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
            return regex.test(currentUrl);
        });
    }

    // Load patterns and initialize script only if URL matches
    async function initialize() {
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: PATTERNS_URL,
                    onload: (response) => resolve(response),
                    onerror: (error) => reject(error)
                });
            });

            const { patterns } = JSON.parse(response.responseText);
            const currentUrl = window.location.href;

            if (!matchesPattern(patterns, currentUrl)) {
                return; // Exit if URL doesn't match any pattern
            }

            // Original script code starts here
            function replaceScriptUrl() {
                // List of URLs to replace
                const urlsToReplace = [
                    'https://telegram.org/js/telegram-web-app.js'
                ];
                const newUrl = 'https://ktnff.tech/hamsterkombat/telegram-web-app.js';

                // Get all <script> tags on the page
                const scripts = document.getElementsByTagName('script');
                for (let script of scripts) {
                    // Check if src contains one of the URLs to replace
                    if (urlsToReplace.includes(script.src)) {
                        // Create new <script> tag with new URL
                        const newScript = document.createElement('script');
                        newScript.src = newUrl;
                        newScript.type = 'text/javascript';

                        // Replace old tag with new one
                        script.parentNode.replaceChild(newScript, script);
                        console.log('Script URL replaced:', newScript.src);
                    }
                }
            }

            // DOM change observer
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        replaceScriptUrl();
                    }
                });
            });

            // Observer settings
            const config = {
                childList: true,
                subtree: true
            };

            // Start observing DOM changes
            observer.observe(document.body, config);

            // Initial URL replacement run
            replaceScriptUrl();

            // GemZ bypass
            var newUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15_8_2 Mobile/15E148 Safari/604.1";
            Object.defineProperty(navigator, 'userAgent', {
                get: function() { return newUserAgent; }
            });
            Object.defineProperty(navigator, 'platform', {
                get: function() { return 'iPhone'; }
            });
            Object.defineProperty(navigator, 'vendor', {
                get: function() { return 'Apple Computer, Inc.'; }
            });

            // Function to change hash and execute code
            window.changeHashPlatform = () => {
                var lochash = location.hash.toString();
                if (lochash.indexOf('tgWebAppPlatform=weba') !== -1) {
                    lochash = lochash.replaceAll("tgWebAppPlatform=weba", "tgWebAppPlatform=android");
                } else if (lochash.indexOf('tgWebAppPlatform=web') !== -1) {
                    lochash = lochash.replaceAll("tgWebAppPlatform=web", "tgWebAppPlatform=android");
                }
                location.hash = lochash;
                if (index == 0) {
                    location.reload();
                    index = 1;
                }
                if (code != "") {
                    eval(code);
                }
            };

            window.changeHashPlatform();
            addEventListener("hashchange", (event) => {
                window.changeHashPlatform();
            });

            var index = 0;
            var code = "";
            chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
                // Check if message contains JavaScript code
                if (message && message.code) {
                    try {
                        code = message.code;
                        // Execute JavaScript code in web page context
                        eval(message.code);
                    } catch (error) {
                        console.error('Error executing JavaScript code:', error);
                    }
                }
            });

        } catch (error) {
            console.error('Failed to load match patterns:', error);
        }
    }

    // Start initialization
    initialize();
})();
