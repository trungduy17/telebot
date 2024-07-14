// ==UserScript==
// @name         Tele Bot on Web
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fake Android to play Tele Bot on Web
// @author       You
// @match        *.whitechain.io/*
// @match        *.hamsterkombat.io/*
// @match        *.hamsterkombatgame.io/*
// @match        *.cex.io/*
// @match        *.tapswap.club/*
// @match        *://*.memefi.club/*
// @match        *.kibble.exchange/*
// @match        *.netlify.app/*
// @match        *.pxlvrs.io/*
// @match        *.gemz.fun/*
// @match        *.scroo-g.com/*
// @match        *.blum.codes/*
// @match        *.tomarket.ai/*
// @match        *.dapplab.xyz/*
// @match        *.digitaloceanspaces.com/*
// @match        *.ktnff.tech/*
// @match        *.wormfare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL  https://github.com/trungduy17/telebot/raw/main/telebotweb.user.js
// @updateURL    https://github.com/trungduy17/telebot/raw/main/telebotweb.user.js
// @homepage     https://github.com/trungduy17/telebot
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // PixelTap bypass
    function replaceScriptUrl() {
        // Список URL-адресов для замены
        const urlsToReplace = [
            'https://telegram.org/js/telegram-web-app.js'
        ];
        const newUrl = 'https://ktnff.tech/hamsterkombat/telegram-web-app.js';

        // Получаем все теги <script> на странице
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            // Проверяем, содержит ли src один из URL-адресов для замены
            if (urlsToReplace.includes(script.src)) {
                // Создаем новый тег <script> с новым URL
                const newScript = document.createElement('script');
                newScript.src = newUrl;
                newScript.type = 'text/javascript';

                // Заменяем старый тег на новый
                script.parentNode.replaceChild(newScript, script);
                console.log('Script URL replaced:', newScript.src);
            }
        }
    }

    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                replaceScriptUrl();
            }
        });
    });

    // Настройки наблюдателя
    const config = {
        childList: true,
        subtree: true
    };

    // Начинаем наблюдение за изменениями в DOM
    observer.observe(document.body, config);

    // Первоначальный запуск замены URL
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

    // Функция для изменения хэша и выполнения кода
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
        // Проверка, содержит ли сообщение JavaScript код
        if (message && message.code) {
            try {
                code = message.code;
                // Выполнение JavaScript кода в контексте веб-страницы
                eval(message.code);
            } catch (error) {
                console.error('Ошибка выполнения JavaScript кода:', error);
            }
        }
    });

})();
