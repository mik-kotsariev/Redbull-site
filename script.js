/* =============================================================
   Red Bull Racing — Лабораторна робота №3: JavaScript
   Автор: Коцарєв М. | ПЗПІ-25-3, ХНУРЕ
   Усі коментарі та текстовий контент — українською мовою
   ============================================================= */

/* ---------------------------------------------------------------
   Виконання після повного завантаження DOM
   --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

    /* =============================================================
       БЛОК 1, Завдання 1:
       Функція, що приймає текст та розмір шрифту, виводить текст
       через style.fontSize. Мотиваційна цитата Крістіана Хорнера.
       ============================================================= */
    function showQuote(text, fontSize) {
        var quoteBlock = document.getElementById('horner-quote');
        if (quoteBlock) {
            quoteBlock.textContent = text;
            quoteBlock.style.fontSize = fontSize;
        }
    }

    // Виклик функції з цитатою Крістіана Хорнера
    showQuote(
        '«Ніколи не здавайся. Перемога — це питання наполегливості та віри у свою команду.» — Крістіан Хорнер',
        '18px'
    );

    /* =============================================================
       БЛОК 1, Завдання 2:
       Іконка болида, що з'являється у новому місці екрана щосекунди.
       Використовуються style.top, style.left та setInterval.
       ============================================================= */
    var carIcon = document.getElementById('moving-car');
    if (carIcon) {
        setInterval(function () {
            var maxTop = window.innerHeight - 60;
            var maxLeft = window.innerWidth - 80;
            var newTop = Math.floor(Math.random() * maxTop);
            var newLeft = Math.floor(Math.random() * maxLeft);

            carIcon.style.top = newTop + 'px';
            carIcon.style.left = newLeft + 'px';
        }, 1000);
    }

    /* =============================================================
       БЛОК 1, Завдання 3:
       Кнопка, що знаходить усі теги <p> і змінює розмір шрифту
       на 15px через getElementsByTagName та setAttribute.
       ============================================================= */
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

    /* =============================================================
       БЛОК 1, Завдання 4:
       Текстові годинники, що оновлюються щосекунди (setInterval).
       Виводяться у шапці сайту.
       ============================================================= */
    var clockElement = document.getElementById('header-clock');
    if (clockElement) {
        function pad(num) {
            return num < 10 ? '0' + num : num.toString();
        }
        function updateClock() {
            var now = new Date();
            var hours = pad(now.getHours());
            var minutes = pad(now.getMinutes());
            var seconds = pad(now.getSeconds());
            clockElement.textContent = hours + ':' + minutes + ':' + seconds;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    /* =============================================================
       БЛОК 1, Завдання 5:
       Ефект плавного вытирання (зменшення opacity) текстового блоку
       з використанням таймера (setInterval).
       ============================================================= */
    var fadeBtn = document.getElementById('btn-fade');
    var fadeTarget = document.getElementById('fade-target');
    if (fadeBtn && fadeTarget) {
        fadeBtn.addEventListener('click', function () {
            alert('Завдання 1.5: Ефект плавного витирання запущено!');
            var currentOpacity = 1.0;
            fadeTarget.style.opacity = currentOpacity;
            fadeTarget.style.transition = 'none';

            var fadeInterval = setInterval(function () {
                currentOpacity -= 0.05; // Швидше витирання для наочності
                if (currentOpacity <= 0) {
                    currentOpacity = 0;
                    clearInterval(fadeInterval);
                    setTimeout(function () {
                        fadeTarget.style.transition = 'opacity 0.5s ease';
                        fadeTarget.style.opacity = '1';
                    }, 1500);
                }
                fadeTarget.style.opacity = currentOpacity;
            }, 30);
        });
    }

    /* =============================================================
       БЛОК 2, Завдання 1:
       Всплываюча підказка (tooltip) при кліку на ім'я пілота.
       Підказка визначає напрямок, щоб не вийти за межі екрана.
       Ховається при кліку в інше місце.
       ============================================================= */
    var pilotNames = document.querySelectorAll('.pilot-name');
    var activeTooltip = null;

    // Використовуємо класичний цикл for замість forEach для сумісності з ES5 (старі браузери)
    for (var i = 0; i < pilotNames.length; i++) {
        pilotNames[i].addEventListener('click', function (e) {
            e.stopPropagation();

            if (activeTooltip) {
                activeTooltip.parentNode.removeChild(activeTooltip);
                activeTooltip = null;
            }

            var tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;

            var tooltip = document.createElement('div');
            tooltip.className = 'js-tooltip';
            tooltip.innerHTML = tooltipText;
            document.body.appendChild(tooltip);

            var rect = this.getBoundingClientRect();
            var tooltipWidth = 280;
            var tooltipHeight = 120; // Орієнтовна висота

            var left = rect.left + rect.width / 2 - tooltipWidth / 2;
            if (left < 10) left = 10;
            if (left + tooltipWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltipWidth - 10;
            }

            var top;
            if (rect.top > tooltipHeight + 20) {
                top = rect.top - tooltipHeight - 10 + (window.pageYOffset || document.documentElement.scrollTop);
                tooltip.className += ' js-tooltip--above';
            } else {
                top = rect.bottom + 10 + (window.pageYOffset || document.documentElement.scrollTop);
                tooltip.className += ' js-tooltip--below';
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.style.width = tooltipWidth + 'px';

            activeTooltip = tooltip;

            // setTimeout для анімації появи
            setTimeout(function () {
                tooltip.className += ' js-tooltip--visible';
            }, 10);
        });
    }

    document.addEventListener('click', function () {
        if (activeTooltip) {
            activeTooltip.className = activeTooltip.className.replace(' js-tooltip--visible', '');
            var tooltipToRemove = activeTooltip;
            activeTooltip = null;
            setTimeout(function () {
                if (tooltipToRemove && tooltipToRemove.parentNode) {
                    tooltipToRemove.parentNode.removeChild(tooltipToRemove);
                }
            }, 300);
        }
    });

    /* =============================================================
       БЛОК 2, Завдання 2:
       DIV-блок «Телеметрія» — виводить координати миші
       та код натиснутої клавіші.
       ============================================================= */
    var telemetryBlock = document.getElementById('telemetry');
    var telMouseX = document.getElementById('tel-mouse-x');
    var telMouseY = document.getElementById('tel-mouse-y');
    var telKey = document.getElementById('tel-key');

    if (telemetryBlock) {
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

    /* =============================================================
       БЛОК 2, Завдання 3:
       Кнопки «A+» та «A-» для зміни розміру тексту.
       Вибір зберігається у cookie.
       ============================================================= */
    var btnFontPlus = document.getElementById('btn-font-plus');
    var btnFontMinus = document.getElementById('btn-font-minus');

    function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }

    function getCookie(name) {
        var cookieName = name + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookies = decodedCookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return null;
    }

    var baseFontSize = 16;
    var savedSize = getCookie('rbr_font_size');
    if (savedSize) {
        baseFontSize = parseInt(savedSize, 10);
        document.body.style.fontSize = baseFontSize + 'px';
    }

    if (btnFontPlus) {
        btnFontPlus.addEventListener('click', function () {
            if (baseFontSize < 28) {
                baseFontSize += 2;
                document.body.style.fontSize = baseFontSize + 'px';
                setCookie('rbr_font_size', baseFontSize, 30);
                alert('Шрифт збільшено до ' + baseFontSize + 'px (збережено в cookie)');
            }
        });
    }

    if (btnFontMinus) {
        btnFontMinus.addEventListener('click', function () {
            if (baseFontSize > 10) {
                baseFontSize -= 2;
                document.body.style.fontSize = baseFontSize + 'px';
                setCookie('rbr_font_size', baseFontSize, 30);
                alert('Шрифт зменшено до ' + baseFontSize + 'px (збережено в cookie)');
            }
        });
    }

    /* =============================================================
       БЛОК 2, Завдання 4:
       Сортування масиву об'єктів (пілотів) за ім'ям та за очками.
       Виведення результату на сторінку.
       ============================================================= */
    var pilots = [
        { name: 'Макс Ферстаппен', country: 'Нідерланди', points: 575, number: 1 },
        { name: 'Айзек Хаджар', country: 'Франція', points: 198, number: 35 },
        { name: 'Юкі Цунода', country: 'Японія', points: 263, number: 22 },
        { name: 'Ліам Лоусон', country: 'Нова Зеландія', points: 152, number: 30 },
        { name: 'Арвід Ліндблад', country: 'Великобританія', points: 87, number: 27 }
    ];

    function sortByName(arr) {
        var newArr = arr.slice();
        return newArr.sort(function (a, b) {
            return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0); // ES5-сумісне порівняння
        });
    }

    function sortByPoints(arr) {
        var newArr = arr.slice();
        return newArr.sort(function (a, b) {
            return a.points - b.points; // За зростанням
        });
    }

    var sortOutput = document.getElementById('sort-output');
    var sortByNameBtn = document.getElementById('btn-sort-name');
    var sortByPointsBtn = document.getElementById('btn-sort-points');

    function renderPilots(arr) {
        if (!sortOutput) return;
        var html = '<table class="js-sort-table">';
        html += '<thead><tr><th>№</th><th>Пілот</th><th>Країна</th><th>Очки</th></tr></thead>';
        html += '<tbody>';
        for (var k = 0; k < arr.length; k++) {
            var pilot = arr[k];
            html += '<tr>';
            html += '<td>#' + pilot.number + '</td>';
            html += '<td>' + pilot.name + '</td>';
            html += '<td>' + pilot.country + '</td>';
            html += '<td>' + pilot.points + '</td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
        sortOutput.innerHTML = html;
    }

    if (sortOutput) {
        renderPilots(sortByPoints(pilots));
    }

    if (sortByNameBtn) {
        sortByNameBtn.addEventListener('click', function () {
            renderPilots(sortByName(pilots));
            this.className += ' js-btn--active';
            if (sortByPointsBtn) sortByPointsBtn.className = sortByPointsBtn.className.replace(' js-btn--active', '');
            alert('Відсортовано за ім\'ям!');
        });
    }

    if (sortByPointsBtn) {
        sortByPointsBtn.addEventListener('click', function () {
            renderPilots(sortByPoints(pilots));
            this.className += ' js-btn--active';
            if (sortByNameBtn) sortByNameBtn.className = sortByNameBtn.className.replace(' js-btn--active', '');
            alert('Відсортовано за очками (по зростанню)!');
        });
    }

    /* =============================================================
       БЛОК 3, Завдання 1:
       Заборона виділення та копіювання тексту в
       ексклюзивному новостному блоці.
       ============================================================= */
    var protectedBlock = document.getElementById('protected-news');
    if (protectedBlock) {
        protectedBlock.addEventListener('selectstart', function (e) {
            if (e.preventDefault) e.preventDefault();
            return false;
        });

        protectedBlock.addEventListener('copy', function (e) {
            if (e.preventDefault) e.preventDefault();
            alert('🔒 Копіювання тексту з ексклюзивного блоку заборонено!');
            return false;
        });

        protectedBlock.addEventListener('contextmenu', function (e) {
            if (e.preventDefault) e.preventDefault();
            return false;
        });
    }

    /* =============================================================
       БЛОК 3, Завдання 2:
       Зворотний відлік (countdown) до наступного Гран-прі 2026 року.
       ============================================================= */
    var countdownElement = document.getElementById('countdown-timer');
    var countdownLabel = document.getElementById('countdown-label');

    if (countdownElement) {
        var nextRaceDate = new Date('2026-06-15T14:00:00');
        var nextRaceName = 'Гран-прі Канади 2026';

        if (new Date() > nextRaceDate) {
            nextRaceDate = new Date('2026-06-29T15:00:00');
            nextRaceName = 'Гран-прі Австрії 2026';
        }

        if (countdownLabel) {
            countdownLabel.textContent = nextRaceName;
        }

        function padNum(num) {
            return num < 10 ? '0' + num : num;
        }

        function updateCountdown() {
            var now = new Date();
            var diff = nextRaceDate.getTime() - now.getTime();

            if (diff <= 0) {
                countdownElement.innerHTML = '<span class="countdown__item">🏁 Гонка розпочалась!</span>';
                return;
            }

            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownElement.innerHTML =
                '<div class="countdown__item"><span class="countdown__value">' + days + '</span><span class="countdown__unit">днів</span></div>' +
                '<div class="countdown__separator">:</div>' +
                '<div class="countdown__item"><span class="countdown__value">' + padNum(hours) + '</span><span class="countdown__unit">годин</span></div>' +
                '<div class="countdown__separator">:</div>' +
                '<div class="countdown__item"><span class="countdown__value">' + padNum(minutes) + '</span><span class="countdown__unit">хвилин</span></div>' +
                '<div class="countdown__separator">:</div>' +
                '<div class="countdown__item"><span class="countdown__value">' + padNum(seconds) + '</span><span class="countdown__unit">секунд</span></div>';
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

}); // Кінець DOMContentLoaded

