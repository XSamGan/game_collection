
const usernameElement = document.querySelector("#username");
const gamesList = document.querySelector("#games-list");
const message = document.querySelector("#message");
const logoutButton = document.querySelector("#logout-button");

// Получаем информацию о пользователе
async function loadUser() {
    const response = await fetch("/api/auth/me");

    if (response.status === 401) {
        window.location.href = "/static/login.html";
        return false;
    }

    if (!response.ok) {
        throw new Error("Не удалось загрузить пользователя");
    }

    const user = await response.json();
    usernameElement.textContent = user.username;

    return true;
}

// Загружаем список игр
async function loadGames() {
    message.textContent = "Загрузка игр...";

    const response = await fetch("/api/games");

    if (response.status === 401) {
        window.location.href = "/static/login.html";
        return;
    }

    if (!response.ok) {
        throw new Error("Не удалось загрузить игры");
    }

    const games = await response.json();

    gamesList.replaceChildren();

    if (games.length === 0) {
        message.textContent = "У вас пока нет игр";
        return;
    }

    message.textContent = "";

    games.forEach((game) => {
        const card = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = game.title;

        const hours = document.createElement("p");
        hours.textContent = `Часов сыграно: ${game.hours_played}`;

        const rating = document.createElement("p");
        rating.textContent = `Оценка: ${game.rating ?? "Нет оценки"}`;

        card.append(title, hours, rating);
        gamesList.append(card);
    });
}

// Выход из аккаунта
logoutButton.addEventListener("click", async () => {
    await fetch("/api/auth/logout", {
        method: "POST"
    });

    window.location.href = "/static/login.html";
});

// Запуск
async function init() {
    try {
        const isLoggedIn = await loadUser();

        if (isLoggedIn) {
            await loadGames();
        }
    } catch (error) {
        message.textContent = "Ошибка загрузки данных";
    }
}

init();
