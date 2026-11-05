const QUESTIONS = [
    {
        text: "А когда с человеком может произойти дрожемент?",
        answers: [
            { text: "Когда он влюбляется", correct: false },
            { text: "Когда он идет шопиться", correct: false },
            { text: "Когда он слышит смешную шутку", correct: false },
            { text: "Когда он боится, пугается", correct: true }
        ],
        explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»."
    },
    {
        text: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
            { text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", correct: false },
            { text: "Антон очень надоедливый и въедливый человек, всех задолбал", correct: false },
            { text: "Молодец, Антон, всех победил!", correct: true },
            { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", correct: false }
        ],
        explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»."
    },
    {
        text: "А фразу «заскамить мамонта» как понимать?",
        answers: [
            { text: "Разозлить кого-то из родителей", correct: false },
            { text: "Увлекаться археологией", correct: false },
            { text: "Развести недотепу на деньги", correct: true },
            { text: "Оскорбить пожилого человека", correct: false }
        ],
        explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца."
    },
    {
        text: "Кто такие бефефе?",
        answers: [
            { text: "Вши?", correct: false },
            { text: "Милые котики, такие милые, что бефефе", correct: false },
            { text: "Лучшие друзья", correct: true },
            { text: "Люди, которые не держат слово", correct: false }
        ],
        explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever."
    },
    {
        text: "Что из перечисленного можно назвать крашем, если ты чиллишь в компании и вдруг залипаешь на кого-то?",
        answers: [
            { text: "Человек, который тебе очень нравится и вызывает симпатию.", correct: true },
            { text: "Тот, на кого приятно смотреть и хочется общаться.", correct: true },
            { text: "Твоя сильно накрашенная подруга, которая переоценила свой макияж.", correct: false },
            { text: "Трэш в более мягкой интерпретации.", correct: false }
        ],
        explanation: "«Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться."
    }
];

const LETTERS = ["А", "Б", "В", "Г"];
const PAUSE = 3000;
const DELAY = 250;
const DELAY_ONE = 500;

const area = document.getElementById('area');
const statusBox = document.getElementById('status');
const statsBox = document.getElementById('stats');
const restartBtn = document.getElementById('restart');

let order = [];
let current = 0;
let rightAnswers = 0;
let finished = false;
let runId = 0;

function shuffle(arr) {
    return arr.slice().sort(function () {
        return Math.random() - 0.5;
    });
}

function showNext() {
    if (current >= order.length) {
        finish();
        return;
    }

    const q = order[current];
    current++;
    const card = document.createElement("article");
    card.className = "question";

    const head = document.createElement("div");
    head.className = 'q-head';
    head.innerHTML = "<span>" + current + ".</span>" +
        '<span class="q-text"></span>' + '<span class="marker"></span>';
    head.querySelector('.q-text').textContent = q.text;
    const marker = head.querySelector('.marker');

    const box = document.createElement('div');
    box.className = 'answers';

    const buttons = shuffle(q.answers).map(function (ans, i) {
        const btn = document.createElement("button");
        btn.className = 'answer';
        btn.type = 'button';

        const letter = document.createElement('span');
        letter.className = 'letter';
        letter.textContent = LETTERS[i];

        const text = document.createElement('span');
        text.textContent = ans.text;

        const explain = document.createElement('span');
        explain.className = 'explain';
        explain.textContent = q.explanation;

        btn.append(letter, text, explain);
        btn.addEventListener('click', function () {
            onAnswer(box, marker, buttons, btn, ans);
        });
        box.appendChild(btn);
        return btn;
    });

    card.addEventListener('click', function () {
        if (finished) {
            showReview(card, q);
        }
    });

    card.append(head, box);
    area.appendChild(card);

    // первый вопрос не прокручиваем, чтобы страница не прыгала при загрузке
    if (current > 1) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function onAnswer(box, marker, buttons, btn, ans) {
    const run = runId;
    box.classList.add('locked');

    btn.classList.add(ans.correct ? 'correct' : 'wrong');
    if (ans.correct) rightAnswers++;

    setTimeout(function () {
        if (run !== runId) return;

        const leaving = ans.correct
            ? buttons.filter(function (b) { return b !== btn; })
            : buttons;

        leaving.forEach(function (b, i) {
            b.style.transitionDelay = (i * DELAY) + 'ms';
            b.classList.add('leave');
        });

        marker.textContent = ans.correct ? '✓' : '✗';
        marker.classList.add(ans.correct ? 'ok' : 'bad', 'show');

        const leaveTotal = (leaving.length - 1) * DELAY + DELAY_ONE;

        setTimeout(function () {
            if (run !== runId) return;
            if (ans.correct) btn.classList.add('leave');

            setTimeout(function () {
                if (run !== runId) return;
                buttons.forEach(function (b) {
                    b.classList.add('removed');
                });
                box.style.padding = '0';
                showNext();
            }, ans.correct ? DELAY_ONE : 0);
        }, leaveTotal);
    }, PAUSE);
}

function finish() {
    finished = true;
    statsBox.textContent = 'Правильных ответов: ' + rightAnswers + ' из ' + order.length;
    statusBox.hidden = false;
    document.querySelectorAll('.question').forEach(
        function (c) {
            c.classList.add('done');
        }
    );
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showReview(card, q) {
    if (card.querySelector('.review')) return;

    document.querySelectorAll('.review').forEach(function (r) { r.remove(); });

    const review = document.createElement('div');
    review.className = 'review';

    q.answers.filter(function (a) {
        return a.correct;
    }).forEach(function (a) {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.textContent = a.text;
        review.appendChild(item);
    });

    const explanation = document.createElement('div');
    explanation.textContent = q.explanation;
    review.lastChild.appendChild(explanation);

    card.appendChild(review);
}

function startQuiz() {
    runId++;
    area.innerHTML = '';
    statusBox.hidden = true;
    finished = false;
    current = 0;
    rightAnswers = 0;
    order = shuffle(QUESTIONS);
    showNext();
}

startQuiz();

if (restartBtn) {
    restartBtn.addEventListener('click', function () {
        startQuiz();
        document.querySelector('.page').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}