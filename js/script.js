var FORMSPREE_URL = "https://formspree.io" + "/f/maeovbgd";


var currentModalSource = "Заявка с сайта";

function toggleMenu() {
    var m = document.getElementById("mobileMenu");
    if (m) m.classList.toggle("open");
}

function toggleChatWidget() {
    var w = document.getElementById("chatWidgetMenu");
    if (w) w.classList.toggle("open");
}

function toggleFaq(btn) {
    var item = btn.parentElement;
    if (item) {
        item.classList.toggle("active");
        var icon = btn.querySelector("span");
        if (icon) {
            icon.innerText = item.classList.contains("active") ? "−" : "+";
        }
    }
}

function openModal(title) {
    currentModalSource = title || "Заявка с сайта";
    var w = document.getElementById("chatWidgetMenu");
    if (w) w.classList.remove("open");
    var t = document.getElementById("modalTitle");
    var m = document.getElementById("leadModal");
    if (t) t.innerText = currentModalSource;
    if (m) m.classList.add("show");
}

function closeModal() {
    var m = document.getElementById("leadModal");
    if (m) m.classList.remove("show");
}

function acceptCookies() {
    localStorage.setItem("webcode_cookie_ok", "1");
    var b = document.getElementById("cookieBar");
    if (b) b.style.display = "none";
}

function sendLead(form, source, details) {
    var nameInput = form.querySelector("input[type='text']");
    var phoneInput = form.querySelector("input[type='tel']");
    var methodSelect = form.querySelector("select");

    var nameVal = nameInput ? nameInput.value.trim() : "";
    var phoneVal = phoneInput ? phoneInput.value.trim() : "";
    var methodVal = methodSelect ? methodSelect.value : "Не указан";

    var btn = form.querySelector("button[type='submit']");
    var oldText = btn ? btn.innerText : "";
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Отправка...";
    }

    var iframeName = "hidden_lead_frame";
    var iframe = document.getElementById(iframeName);
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = iframeName;
        iframe.name = iframeName;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    var tempForm = document.createElement("form");
    tempForm.action = FORMSPREE_URL;
    tempForm.method = "POST";
    tempForm.target = iframeName;
    tempForm.style.display = "none";

    var fields = {
        "Источник_заявки": source,
        "Имя_клиента": nameVal,
        "Контакт_клиента": phoneVal,
        "Как_удобнее_связаться": methodVal
    };
    if (details) {
        fields["Ответы_квиза"] = details;
    }

    for (var key in fields) {
        var inp = document.createElement("input");
        inp.type = "hidden";
        inp.name = key;
        inp.value = fields[key];
        tempForm.appendChild(inp);
    }

    document.body.appendChild(tempForm);
    tempForm.submit();

    setTimeout(function () {
        document.body.removeChild(tempForm);
        if (btn) {
            btn.disabled = false;
            btn.innerText = oldText;
        }
        alert("Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.");
        form.reset();
        closeModal();
    }, 800);
}

function submitLead(e) {
    e.preventDefault();
    sendLead(e.target, currentModalSource, "");
}

document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("cookieBar");
    if (b && localStorage.getItem("webcode_cookie_ok")) {
        b.style.display = "none";
    }

    var box = document.getElementById("quizContent");
    if (!box) return;

    var steps = [
        {
            q: "Шаг 1 из 4. Какая основная задача стоит перед проектом?",
            opts: [
                "Сайт-визитка / базовый лендинг (от 15 000 ₽)",
                "Продающий лендинг с квизом и SEO (от 28 000 ₽)",
                "Многостраничный сайт под ТОП поиска (от 55 000 ₽)",
                "Настройка и ведение Яндекс Директ (от 20 000 ₽)",
                "Чат-бот для Telegram или ВКонтакте (от 15 000 ₽)",
                "Комплекс: Сайт + Директ + Карты (от 65 000 ₽)"
            ]
        },
        {
            q: "Шаг 2 из 4. Какие дополнительные модули потребуются?",
            opts: [
                "Базовый запуск (без сложных интеграций)",
                "Подключить онлайн-оплату (СБП / карты ЮKassa / Т-Банк)",
                "Упаковка и вывод в ТОП Яндекс Карт и 2ГИС",
                "Интеграция с CRM-системой и онлайн-чатом 24/7"
            ]
        },
        {
            q: "Шаг 3 из 4. Где планируете привлекать клиентов?",
            opts: [
                "Приморский край (Большой Камень, Владивосток, Находка, Уссурийск)",
                "Конкретный город или регион России",
                "Вся Россия"
            ]
        },
        {
            q: "Шаг 4 из 4. Когда планируете старт работ?",
            opts: [
                "Срочно, готовы начать в ближайшие 2–3 дня",
                "В течение 1–2 недель",
                "Пока прицениваемся и собираем предложения"
            ]
        }
    ];

    var step = 0;
    var choice = "";
    var answers = [];

    window.selectQuizOpt = function (idx) {
        choice = steps[step].opts[idx];
        drawQuiz();
    };

    window.nextQuizStep = function () {
        if (!choice) {
            alert("Пожалуйста, выберите один из вариантов ответа.");
            return;
        }
        answers.push(choice);
        choice = "";
        step++;
        drawQuiz();
    };

    window.resetQuiz = function () {
        step = 0;
        choice = "";
        answers = [];
        drawQuiz();
    };

    window.submitQuizForm = function (e) {
        e.preventDefault();
        var summary = "1) Задача: " + answers[0] + " | 2) Модули: " + answers[1] + " | 3) Регион: " + answers[2] + " | 4) Сроки: " + answers[3];
        sendLead(e.target, "Интерактивный квиз-калькулятор", summary);
    };

    function drawQuiz() {
        var bar = document.getElementById("quizProgress");
        if (step < steps.length) {
            if (bar) bar.style.width = ((step + 1) / (steps.length + 1) * 100) + "%";
            var cur = steps[step];
            var html = "<h3 style='font-size:19px;margin-bottom:16px;color:#FFFFFF;'>" + cur.q + "</h3>";
            for (var i = 0; i < cur.opts.length; i++) {
                var cls = (choice === cur.opts[i]) ? "quiz-opt selected" : "quiz-opt";
                html += "<div class='" + cls + "' onclick='selectQuizOpt(" + i + ")'>" + cur.opts[i] + "</div>";
            }
            html += "<button type='button' class='btn btn-gold' style='margin-top:10px;' onclick='nextQuizStep()'>Далее →</button>";
            box.innerHTML = html;
        } else {
            if (bar) bar.style.width = "100%";
            box.innerHTML =
                "<h3 style='font-size:21px;color:#F59E0B;margin-bottom:8px;'>Расчет сформирован!</h3>" +
                "<p style='color:#9CA3AF;font-size:14px;margin-bottom:16px;'>Ваш выбор: <strong>" + answers.join(" • ") + "</strong></p>" +
                "<form onsubmit='submitQuizForm(event)'>" +
                "<input type='text' class='input' placeholder='Ваше имя' required>" +
                "<input type='tel' class='input' placeholder='Телефон или ник в мессенджере' required>" +
                "<select class='select' required>" +
                "<option value='' disabled selected>Как с вами удобнее связаться?</option>" +
                "<option value='Позвонить по телефону'>Позвонить по телефону</option>" +
                "<option value='Написать ВКонтакте'>Написать ВКонтакте</option>" +
                "<option value='Написать в Telegram'>Написать в Telegram</option>" +
                "<option value='Отправить смету на Email'>Отправить смету на Email</option>" +
                "</select>" +
                "<label class='consent-label'><input type='checkbox' required><span>Я даю согласие на обработку персональных данных в соответствии с 152-ФЗ и <a href='privacy.html'>Политикой конфиденциальности</a>.</span></label>" +
                "<div style='display:flex;gap:10px;flex-wrap:wrap;'>" +
                             "<button type='submit' class='btn btn-gold' style='flex:1;'>Получить смету и план работ</button>" +
             "<button type='button' class='btn btn-dark' onclick='resetQuiz()'>Заново</button>" +
             "</div>" +
             "</form>";
     }
 }

    drawQuiz();
});
document.addEventListener("DOMContentLoaded", function () {
    var headerPhones = document.querySelectorAll(".header-phone");
    for (var i = 0; i < headerPhones.length; i++) {
        headerPhones[i].className = "btn btn-dark btn-sm";
        headerPhones[i].innerHTML = "📞 Позвонить";
        headerPhones[i].title = "+7-967-388-88-89";
    }
});
