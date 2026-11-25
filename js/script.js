var TG_BOT_TOKEN = "9004929845:AAGcOOFVaEGbD2F2M-ydSSBqJ0omFon5Mkk";
var TG_CHAT_ID = "926622208";

var currentModalSource = 'Заявка с сайта';

function toggleMenu() {
    var menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('open');
}

function openModal(title) {
    currentModalSource = title || 'Заявка с сайта';
    var titleEl = document.getElementById('modalTitle');
    var modalEl = document.getElementById('leadModal');
    if (titleEl) titleEl.innerText = currentModalSource;
    if (modalEl) modalEl.classList.add('show');
}

function closeModal() {
    var modalEl = document.getElementById('leadModal');
    if (modalEl) modalEl.classList.remove('show');
}

function sendFormData(form, sourceName, quizDetails) {
    var inputs = form.querySelectorAll('input');
    var nameVal = '';
    var phoneVal = '';

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'text') nameVal = inputs[i].value;
        if (inputs[i].type === 'tel') phoneVal = inputs[i].value;
    }

    var btn = form.querySelector('button[type="submit"]');
    var oldBtnText = btn ? btn.innerText : '';
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Отправка...';
    }

    var message = "🔥 Новая заявка с сайта seo-and-code.ru\n\n" +
                  "📌 Форма: " + sourceName + "\n" +
                  "👤 Имя: " + nameVal + "\n" +
                  "📞 Контакт: " + phoneVal;

    if (quizDetails) {
        message += "\n📝 Ответы квиза: " + quizDetails;
    }

    var url = "https://api." + "telegram.org/bot" + TG_BOT_TOKEN + "/sendMessage";

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: message
        })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.ok) {
            alert('Спасибо! Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
            form.reset();
            closeModal();
        } else {
            alert('Не удалось отправить заявку автоматически. Напишите нам напрямую в Telegram: @nedurovv');
        }
    })
    .catch(function () {
        alert('Ошибка сети. Напишите нам напрямую в Telegram: @nedurovv');
    })
    .finally(function () {
        if (btn) {
            btn.disabled = false;
            btn.innerText = oldBtnText;
        }
    });
}

function submitLead(e) {
    e.preventDefault();
    sendFormData(e.target, currentModalSource, '');
}

function acceptCookies() {
    localStorage.setItem('webcode_cookie_ok', '1');
    var bar = document.getElementById('cookieBar');
    if (bar) bar.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    var bar = document.getElementById('cookieBar');
    if (bar && localStorage.getItem('webcode_cookie_ok')) {
        bar.style.display = 'none';
    }

    var quizContent = document.getElementById('quizContent');
    if (!quizContent) return;

    var quizSteps = [
        {
            q: "Шаг 1 из 3. Какая задача стоит перед вашим бизнесом?",
            opts: [
                "Создать продающий лендинг с нуля",
                "Разработать многостраничный сайт с SEO",
                "Настроить и вести рекламу в Яндекс Директ",
                "Комплекс: Сайт + Реклама + Чат-бот"
            ]
        },
        {
            q: "Шаг 2 из 3. Где планируете привлекать клиентов?",
            opts: [
                "Приморский край (Владивосток, Большой Камень, Находка, Уссурийск)",
                "Конкретный город или регион России",
                "Вся Россия"
            ]
        },
        {
            q: "Шаг 3 из 3. Когда планируете запуск проекта?",
            opts: [
                "Срочно, в ближайшие 5–7 дней",
                "В течение 2–3 недель",
                "Пока изучаю варианты и цены"
            ]
        }
    ];

    var qStep = 0;
    var qChoice = "";
    var qHistory = [];

    window.selectQuizOpt = function (index) {
        qChoice = quizSteps[qStep].opts[index];
        renderQuiz();
    };

    window.nextQuizStep = function () {
        if (!qChoice) {
            alert('Пожалуйста, выберите один из вариантов ответа.');
            return;
        }
        qHistory.push(qChoice);
        qChoice = "";
        qStep++;
        renderQuiz();
    };

    window.submitQuizForm = function (e) {
        e.preventDefault();
        sendFormData(e.target, 'Квиз-калькулятор на главной', qHistory.join(' | '));
    };

    function renderQuiz() {
        var bar = document.getElementById('quizProgress');
        if (qStep < quizSteps.length) {
            if (bar) bar.style.width = ((qStep + 1) / (quizSteps.length + 1) * 100) + '%';
            var item = quizSteps[qStep];
            var html = '<h3 style="font-size: 20px; margin-bottom: 18px;">' + item.q + '</h3>';
            for (var i = 0; i < item.opts.length; i++) {
                var opt = item.opts[i];
                var cls = (qChoice === opt) ? 'quiz-opt selected' : 'quiz-opt';
                html += '<div class="' + cls + '" onclick="selectQuizOpt(' + i + ')">' + opt + '</div>';
            }
            html += '<button type="button" class="btn btn-gold" style="margin-top: 10px;" onclick="nextQuizStep()">Далее →</button>';
            quizContent.innerHTML = html;
        } else {
            if (bar) bar.style.width = '100%';
            quizContent.innerHTML =
                '<h3 style="font-size: 22px; color: #F59E0B; margin-bottom: 10px;">Расчет готов!</h3>' +
                '<p style="color: #9CA3AF; font-size: 14px; margin-bottom: 18px;">Вы выбрали: ' + qHistory.join(' • ') + '. Укажите контакт, куда отправить смету:</p>' +
                '<form onsubmit="submitQuizForm(event)">' +
                '<input type="text" class="input" placeholder="Ваше имя" required>' +
                '<input type="tel" class="input" placeholder="Телефон или @ник в Telegram" required>' +
                '<label class="consent-label"><input type="checkbox" checked required><span>Согласен на обработку персональных данных (152-ФЗ).</span></label>' +
                '<button type="submit" class="btn btn-gold btn-full">Получить расчет стоимости</button>' +
                '</form>';
        }
    }

    renderQuiz();
});
