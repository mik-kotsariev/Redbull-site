// Чекаємо завантаження DOM, щоб всі елементи вже були на сторінці
document.addEventListener('DOMContentLoaded', function () {

    // Допоміжна функція — додає 0 перед однозначним числом (3 -> "03")
    // Використовується і для годинника, і для таймера
    function pad(num) {
        return num < 10 ? '0' + num : num.toString();
    }

    /* Вивід тексту з заданим розміром шрифту
       Функція приймає текст і розмір, записує в блок цитати.
       Використовую textContent для безпеки та style.fontSize для стилю */
    function showQuote(text, fontSize) {
        var quoteBlock = document.getElementById('horner-quote');
        if (quoteBlock) {
            quoteBlock.textContent = text;
            quoteBlock.style.fontSize = fontSize;
        }
    }

    // Виводимо цитату Крістіана Хорнера на сторінку
    showQuote(
        '«Ніколи не здавайся. Перемога — це питання наполегливості та віри у свою команду.» — Крістіан Хорнер',
        '18px'
    );

    /* іконка болида, що рухається
       Кожну секунду генерую випадкові координати і ставлю іконку туди.
       Відступ від краю (60/80px) — щоб картинка не виходила за екран */
    var carIcon = document.getElementById('moving-car');
    if (carIcon) {
        setInterval(function () {
            carIcon.style.top = Math.floor(Math.random() * (window.innerHeight - 60)) + 'px';
            carIcon.style.left = Math.floor(Math.random() * (window.innerWidth - 80)) + 'px';
        }, 1000);
    }

    /*  Зміна шрифту всіх абзаців
       Проходжу по всіх <p> через getElementsByTagName,
       і через setAttribute ставлю inline-стиль 15px.
       !important щоб перебити CSS */
    var changeFontBtn = document.getElementById('btn-change-font');
    if (changeFontBtn) {
        changeFontBtn.addEventListener('click', function () {
            var paragraphs = document.getElementsByTagName('p');
            for (var i = 0; i < paragraphs.length; i++) {
                paragraphs[i].setAttribute('style', 'font-size: 15px !important; color: #ffcc00;');
            }
            alert('Завдання 1.3: Розмір шрифту всіх абзаців успішно змінено на 15px!');
            this.textContent = '✓ Розмір змінено!';
            this.className += ' js-btn--done';
        });
    }

    /*Годинник у шапці
       Оновлюю кожну секунду через setInterval.
       pad() додає нулі для гарного вигляду (09:05:03) */
    var clockElement = document.getElementById('header-clock');
    if (clockElement) {
        function updateClock() {
            var now = new Date();
            clockElement.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        }
        updateClock(); // одразу показати, а не чекати секунду
        setInterval(updateClock, 1000);
    }

    /*Плавне зникнення тексту
       Зменшую opacity на 0.05 кожні 30мс через setInterval.
       Коли дійде до 0, чекаю 1.5с і повертаю назад через CSS transition */
    var fadeBtn = document.getElementById('btn-fade');
    var fadeTarget = document.getElementById('fade-target');
    if (fadeBtn && fadeTarget) {
        fadeBtn.addEventListener('click', function () {
            alert('Ефект плавного витирання запущено!');
            var currentOpacity = 1.0;
            fadeTarget.style.opacity = currentOpacity;
            fadeTarget.style.transition = 'none'; // вимикаю CSS-анімацію, бо роблю вручну

            var fadeInterval = setInterval(function () {
                currentOpacity -= 0.05;
                if (currentOpacity <= 0) {
                    currentOpacity = 0;
                    clearInterval(fadeInterval);
                    // Через 1.5 секунди плавно повертаю назад
                    setTimeout(function () {
                        fadeTarget.style.transition = 'opacity 0.5s ease';
                        fadeTarget.style.opacity = '1';
                    }, 1500);
                }
                fadeTarget.style.opacity = currentOpacity;
            }, 30);
        });
    }

    /* Tooltip при кліку на ім'я пілота 
       Створюю div-елемент, позиціоную його біля імені.
       Якщо зверху є місце — ставлю tooltip вище, інакше — нижче.
       Закривається при кліку в будь-яке інше місце */
    var pilotNames = document.querySelectorAll('.pilot-name');
    var activeTooltip = null;

    // Звичайний цикл for, бо forEach не працює з NodeList в старих браузерах
    for (var i = 0; i < pilotNames.length; i++) {
        pilotNames[i].addEventListener('click', function (e) {
            e.stopPropagation(); // щоб клік не закрив одразу tooltip

            // Якщо вже є tooltip — видаляємо
            if (activeTooltip) {
                activeTooltip.parentNode.removeChild(activeTooltip);
                activeTooltip = null;
            }

            var tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;

            // Створюємо блок tooltip
            var tooltip = document.createElement('div');
            tooltip.className = 'js-tooltip';
            tooltip.innerHTML = tooltipText;
            document.body.appendChild(tooltip);

            // Розраховуємо позицію
            var rect = this.getBoundingClientRect();
            var tooltipWidth = 280;
            var tooltipHeight = 120;

            // Центруємо по горизонталі, але не виходимо за екран
            var left = rect.left + rect.width / 2 - tooltipWidth / 2;
            if (left < 10) left = 10;
            if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;

            // Враховуємо прокрутку сторінки
            var scrollY = window.pageYOffset || document.documentElement.scrollTop;
            var top;

            // Визначаємо напрямок: зверху чи знизу
            if (rect.top > tooltipHeight + 20) {
                top = rect.top - tooltipHeight - 10 + scrollY;
                tooltip.className += ' js-tooltip--above';
            } else {
                top = rect.bottom + 10 + scrollY;
                tooltip.className += ' js-tooltip--below';
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.style.width = tooltipWidth + 'px';
            activeTooltip = tooltip;

            // Невелика затримка для запуску CSS-анімації появи
            setTimeout(function () {
                tooltip.className += ' js-tooltip--visible';
            }, 10);
        });
    }

    // Клік по будь-якому місцю — закриваємо tooltip
    document.addEventListener('click', function () {
        if (activeTooltip) {
            activeTooltip.className = activeTooltip.className.replace(' js-tooltip--visible', '');
            var tooltipToRemove = activeTooltip;
            activeTooltip = null;
            // Чекаємо завершення анімації зникнення, потім видаляємо
            setTimeout(function () {
                if (tooltipToRemove && tooltipToRemove.parentNode) {
                    tooltipToRemove.parentNode.removeChild(tooltipToRemove);
                }
            }, 300);
        }
    });

    /* Панель телеметрії
       Показує координати курсора (mousemove) та останню натиснуту клавішу (keydown) */
    var telMouseX = document.getElementById('tel-mouse-x');
    var telMouseY = document.getElementById('tel-mouse-y');
    var telKey = document.getElementById('tel-key');

    if (document.getElementById('telemetry')) {
        document.addEventListener('mousemove', function (e) {
            if (telMouseX) telMouseX.textContent = e.clientX;
            if (telMouseY) telMouseY.textContent = e.clientY;
        });

        document.addEventListener('keydown', function (e) {
            if (telKey) {
                telKey.textContent = (e.key || String.fromCharCode(e.keyCode)) + ' (код: ' + e.keyCode + ')';
            }
        });
    }

    /* Кнопки зміни розміру шрифту + збереження в cookie
       A+ збільшує на 2px, A- зменшує. Межі: від 10 до 28.
       Розмір зберігається в cookie на 30 днів */
    var btnFontPlus = document.getElementById('btn-font-plus');
    var btnFontMinus = document.getElementById('btn-font-minus');

    // Записати значення в cookie на задану кількість днів
    function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 86400000)); // 86400000 = мілісекунд у добі
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    }

    // Отримати значення cookie за назвою
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }

    // Завантажуємо збережений розмір
    var baseFontSize = 16;
    var savedSize = getCookie('rbr_font_size');
    if (savedSize) {
        baseFontSize = parseInt(savedSize, 10);
        document.body.style.fontSize = baseFontSize + 'px';
    }

    // Загальна функція зміни розміру — щоб не дублювати код для + та -
    function changeFontSize(delta, limit, msg) {
        if ((delta > 0 && baseFontSize < limit) || (delta < 0 && baseFontSize > limit)) {
            baseFontSize += delta;
            document.body.style.fontSize = baseFontSize + 'px';
            setCookie('rbr_font_size', baseFontSize, 30);
            alert(msg + baseFontSize + 'px (збережено в cookie)');
        }
    }

    if (btnFontPlus) {
        btnFontPlus.addEventListener('click', function () {
            changeFontSize(2, 28, 'Шрифт збільшено до ');
        });
    }

    if (btnFontMinus) {
        btnFontMinus.addEventListener('click', function () {
            changeFontSize(-2, 10, 'Шрифт зменшено до ');
        });
    }

    /* Сортування пілотів
       Масив об'єктів з даними пілотів.
       Дві функції: sortByName (за алфавітом) і sortByPoints (за очками).
       slice() створює копію масиву, щоб не змінювати оригінал */
    var pilots = [
        { name: 'Макс Ферстаппен', country: 'Нідерланди', points: 575, number: 1 },
        { name: 'Айзек Хаджар', country: 'Франція', points: 198, number: 35 },
        { name: 'Юкі Цунода', country: 'Японія', points: 263, number: 22 },
        { name: 'Ліам Лоусон', country: 'Нова Зеландія', points: 152, number: 30 },
        { name: 'Арвід Ліндблад', country: 'Великобританія', points: 87, number: 27 }
    ];

    // Сортування за іменем (лексикографічне порівняння)
    function sortByName(arr) {
        return arr.slice().sort(function (a, b) {
            return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0);
        });
    }

    // Сортування за очками (по зростанню)
    function sortByPoints(arr) {
        return arr.slice().sort(function (a, b) {
            return a.points - b.points;
        });
    }

    var sortOutput = document.getElementById('sort-output');
    var sortByNameBtn = document.getElementById('btn-sort-name');
    var sortByPointsBtn = document.getElementById('btn-sort-points');

    // Генерація HTML-таблиці з масиву пілотів
    function renderPilots(arr) {
        if (!sortOutput) return;
        var html = '<table class="js-sort-table"><thead><tr><th>№</th><th>Пілот</th><th>Країна</th><th>Очки</th></tr></thead><tbody>';
        for (var k = 0; k < arr.length; k++) {
            var p = arr[k];
            html += '<tr><td>#' + p.number + '</td><td>' + p.name + '</td><td>' + p.country + '</td><td>' + p.points + '</td></tr>';
        }
        sortOutput.innerHTML = html + '</tbody></table>';
    }

    // Обробник кліку на кнопку сортування
    function handleSort(sortFn, activeBtn, inactiveBtn, msg) {
        renderPilots(sortFn(pilots));
        activeBtn.className += ' js-btn--active';
        if (inactiveBtn) inactiveBtn.className = inactiveBtn.className.replace(' js-btn--active', '');
        alert(msg);
    }

    // При завантаженні — одразу виводимо таблицю (сортовану за очками)
    if (sortOutput) renderPilots(sortByPoints(pilots));

    if (sortByNameBtn) {
        sortByNameBtn.addEventListener('click', function () {
            handleSort(sortByName, this, sortByPointsBtn, 'Відсортовано за ім\'ям!');
        });
    }

    if (sortByPointsBtn) {
        sortByPointsBtn.addEventListener('click', function () {
            handleSort(sortByPoints, this, sortByNameBtn, 'Відсортовано за очками (по зростанню)!');
        });
    }

    /* Захист блоку від копіювання
       Блокуємо виділення (selectstart), копіювання (copy) і контекстне меню.
       Це працює разом з CSS user-select: none */
    var protectedBlock = document.getElementById('protected-news');
    if (protectedBlock) {
        ['selectstart', 'copy', 'contextmenu'].forEach(function (evt) {
            protectedBlock.addEventListener(evt, function (e) {
                if (e.preventDefault) e.preventDefault();
                if (evt === 'copy') alert('🔒 Копіювання тексту з ексклюзивного блоку заборонено!');
                return false;
            });
        });
    }

    /* Зворотний відлік до Гран-прі
       Рахуємо різницю між зараз і датою гонки.
       Якщо поточна гонка вже минула — перемикаємось на наступну.
       Оновлюється щосекунди */
    var countdownElement = document.getElementById('countdown-timer');
    var countdownLabel = document.getElementById('countdown-label');

    if (countdownElement) {
        var nextRaceDate = new Date('2026-06-15T14:00:00');
        var nextRaceName = 'Гран-прі Канади 2026';

        // Якщо дата вже пройшла — переходимо до наступного етапу
        if (new Date() > nextRaceDate) {
            nextRaceDate = new Date('2026-06-29T15:00:00');
            nextRaceName = 'Гран-прі Австрії 2026';
        }

        if (countdownLabel) countdownLabel.textContent = nextRaceName;

        function updateCountdown() {
            var diff = nextRaceDate.getTime() - new Date().getTime();

            if (diff <= 0) {
                countdownElement.innerHTML = '<span class="countdown__item">🏁 Гонка розпочалась!</span>';
                return;
            }

            // Розбиваємо різницю на дні, години, хвилини, секунди
            var d = Math.floor(diff / 86400000);
            var h = pad(Math.floor((diff % 86400000) / 3600000));
            var m = pad(Math.floor((diff % 3600000) / 60000));
            var s = pad(Math.floor((diff % 60000) / 1000));

            countdownElement.innerHTML =
                '<div class="countdown__item"><span class="countdown__value">' + d + '</span><span class="countdown__unit">днів</span></div>' +
                '<div class="countdown__separator">:</div>' +
                '<div class="countdown__item"><span class="countdown__value">' + h + '</span><span class="countdown__unit">годин</span></div>' +
                '<div class="countdown__separator">:</div>' +
                '<div class="countdown__item"><span class="countdown__value">' + m + '</span><span class="countdown__unit">хвилин</span></div>' +
                '<div class="countdown__separator">:</div>' +
                '<div class="countdown__item"><span class="countdown__value">' + s + '</span><span class="countdown__unit">секунд</span></div>';
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

}); // кінець DOMContentLoaded
