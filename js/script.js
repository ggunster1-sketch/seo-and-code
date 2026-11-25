var FORM_ACCESS_KEY = "7eb5f8fa-41ec-4462-8366-2e171193bc2e";
var currentModalSource = "Заявка с сайта";

function toggleMenu() {
    var m = document.getElementById("mobileMenu");
    if (m) m.classList.toggle("open");
}

function openModal(title) {
    currentModalSource = title || "Заявка с сайта";
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
    var inputs = form.querySelectorAll("input");
    var nameVal = "";
    var phoneVal = "";
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "text") nameVal = inputs[i].value;
        if (inputs[i].type === "tel") phoneVal = inputs[i].value;
    }

    var btn = form.querySelector("button[type='submit']");
    var oldText = btn ? btn.innerText : "";
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Отправка...";
    }

    var payload = {
        access_key: FORM_ACCESS_KEY,
        subject: "Новая заявка с сайта seo-and-code.ru (" + source + ")",
        from_name: "Сайт Веб-Код",
        Имя: nameVal,
        Контакт: phoneVal,
        Форма: source
    };
    if (details) {
        payload.Ответы_квиза = details;
    }

    fetch("https://web3forms.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
        if (d.success) {
            alert("Спасибо! Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.");
            form.reset();
            closeModal();
        } else {
            alert("Не удалось отправить. Напишите нам напрямую в Telegram: @nedurovv");
        }
    })
    .catch(function () {
        alert("Ошибка соединения. Напишите нам напрямую в Telegram: @nedurovv");
    })
    .finally(function () {
        if (btn) {
            btn.disabled = false;
            btn.innerText = oldText;
        }
    });
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

    var step = 0;
    var choice = "";
    var answers = [];

    window.selectQuizOpt = function (idx) {
        choice = steps[step].opts[idx];
        drawQuiz();
    };

    window.nextQuizStep = function () {
        if (!choice) {
            alert("Выберите один из вариантов ответа.");
            return;
        }
        answers.push(choice);
        choice = "";
        step++;
        drawQuiz();
    };

    window.submitQuizForm = function (e) {
        e.preventDefault();
        sendLead(e.target, "Квиз на главной", answers.join(" | "));
    };

    function drawQuiz() {
        var bar = document.getElementById("quizProgress");
        if (step < steps.length) {
            if (bar) bar.style.width = ((step + 1) / (steps.length + 1) * 100) + "%";
            var cur = steps[step];
            var html = "<h3 style='font-size:20px;margin-bottom:18px;'>" + cur.q + "</h3>";
            for (var i = 0; i < cur.opts.length; i++) {
                var cls = (choice === cur.opts[i]) ? "quiz-opt selected" : "quiz-opt";
                html += "<div class='" + cls + "' onclick='selectQuizOpt(" + i + ")'>" + cur.opts[i] + "</div>";
            }
            html += "<button type='button' class='btn btn-gold' style='margin-top:10px;' onclick='nextQuizStep()'>Далее →</button>";
            box.innerHTML = html;
        } else {
            if (bar) bar.style.width = "100%";
            box.innerHTML =
                "<h3 style='font-size:22px;color:#F59E0B;margin-bottom:10px;'>Расчет готов!</h3>" +
                "<p style='color:#9CA3AF;font-size:14px;margin-bottom:18px;'>Вы выбрали: " + answers.join(" • ") + ". Укажите контакт:</p>" +
                "<form onsubmit='submitQuizForm(event)'>" +
                "<input type='text' class='input' placeholder='Ваше имя' required>" +
                "<input type='tel' class='input' placeholder='Телефон или @ник в Telegram' required>" +
                "<label class='consent-label'><input type='checkbox' checked required><span>Согласен на обработку персональных данных (152-ФЗ).</span></label>" +
                "<button type='submit' class='btn btn-gold btn-full'>Получить расчет стоимости</button>" +
                "</form>";
        }
    }

    drawQuiz();
});
