var TG_BOT_TOKEN = "9004929845:AAGcOOFVaEGbD2F2M-ydSSBqJ0omFon5Mkk";
var TG_CHAT_ID = "926622208";
var currentModalSource = 'Заявка с сайта';

function toggleMenu() { /* Переключение мобильного меню */ }
function openModal(title) { /* Открытие модального окна */ }
function closeModal() { /* Закрытие модального окна */ }
function acceptCookies() { /* Принятие cookies */ }

function sendFormData(form, sourceName, quizDetails) {
    // Сбор данных формы (имя, телефон) и отправка сообщения в Telegram-бот через fetch API
}

function submitLead(e) {
    e.preventDefault();
    sendFormData(e.target, currentModalSource, '');
}
// Код скрипта квиза для управления шагами, выбором вариантов и отправкой данных формы
var quizSteps = [...];
var qStep = 0;
var qChoice = "";
var qHistory = [];

function selectQuizOpt(i) { ... }
function nextQuizStep() { ... }
function submitQuizForm(e) { ... }
function renderQuiz() { ... }

document.addEventListener('DOMContentLoaded', function () { ... });
