
const usernameElement = document.querySelector("#username");
const gamesList = document.querySelector("#games-list");
const message = document.querySelector("#message");
const logoutButton = document.querySelector("#logout-button");
const totalGamesElement = document.querySelector("#total-games");
const completedGamesElement = document.querySelector("#completed-games");
const totalHoursElement = document.querySelector("#total-hours");
const averageRatingElement = document.querySelector("#average-rating");

const searchInput = document.querySelector("#search-input");
const platformFilter = document.querySelector("#platform-filter");
const statusFilter = document.querySelector("#status-filter");
const gameForm = document.querySelector("#game-form");
const gamePlatformSelect = document.querySelector("#game-platform");
const gameStatusSelect = document.querySelector("#game-status");
const gameGenreInput = document.querySelector("#game-genre");
const gameDateInput = document.querySelector("#game-date");

const addGameButton = document.querySelector("#add-game-button");
const addGameForm = document.querySelector("#add-game-form");
const cancelGameButton = document.querySelector("#cancel-game-button");

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

async function loadFilters() {
    const platformsResponse = await fetch("/api/platforms");
    const statusesResponse = await fetch("/api/statuses");

    if (platformsResponse.status === 401 || statusesResponse.status === 401) {
        window.location.href = "/static/login.html";
        return;
    }

    if (!platformsResponse.ok || !statusesResponse.ok) {
        throw new Error("Не удалось загрузить фильтры");
    }

    const platforms = await platformsResponse.json();
    const statuses = await statusesResponse.json();

   platforms.forEach((platform) => {
    const option = document.createElement("option");
    option.value = platform.id;
    option.textContent = platform.name;

    platformFilter.append(option);
    gamePlatformSelect.append(option.cloneNode(true));
    });

    statuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status.id;
    option.textContent = status.name;

    statusFilter.append(option);
    gameStatusSelect.append(option.cloneNode(true));
    });
}

// Загружаем список игр
async function loadGames() {

    const search = searchInput.value.trim();
    const platformId = platformFilter.value;
    const statusId = statusFilter.value;

    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (platformId) {
        params.append("platform_id", platformId);
    }

    if (statusId) {
        params.append("status_id", statusId);
    }

    message.textContent = "Загрузка игр...";

    const response = await fetch(`/api/games?${params.toString()}`);

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

        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать";
        editButton.classList.add("edit-game-button");

        editButton.addEventListener("click", () => {
            editGame(game);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.classList.add("delete-game-button");

        deleteButton.addEventListener("click", () => {
            deleteGame(game.id);
        });

        card.append(title, hours, rating, editButton, deleteButton);
        gamesList.append(card);
    });
}

// Открываем игру для редактирования
function editGame(game) {
    document.querySelector("#game-id").value = game.id;

    document.querySelector("#game-title").value = game.title;
    document.querySelector("#game-description").value = game.description ?? "";
    gameGenreInput.value = game.genre ?? "";
    gameDateInput.value = game.release_date ?? "";
    gamePlatformSelect.value = game.platform_id;
    gameStatusSelect.value = game.status_id;
    document.querySelector("#game-hours").value = game.hours_played;
    document.querySelector("#game-rating").value = game.rating ?? "";

    addGameForm.querySelector("h2").textContent = "Редактировать игру";
    gameForm.querySelector('button[type="submit"]').textContent = "Сохранить изменения";

    addGameForm.hidden = false;
}

async function deleteGame(gameId) {
    const confirmed = confirm("Ты действительно хочешь удалить эту игру?");

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/api/games/${gameId}`, {
            method: "DELETE",
        });

        if (response.status === 401) {
            window.location.href = "/static/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Не удалось удалить игру");
        }

        await loadGames();
        await loadStats();

    } catch (error) {
        message.textContent = "Ошибка при удалении игры";
    }
}

async function loadStats() {
    const response = await fetch("/api/games/stats");

    if (response.status === 401) {
        window.location.href = "/static/login.html";
        return;
    }

    if (!response.ok) {
        throw new Error("Не удалось загрузить статистику");
    }

    const stats = await response.json();

    totalGamesElement.textContent = stats.total_games;
    completedGamesElement.textContent = stats.completed_games;
    totalHoursElement.textContent = stats.total_hours;
    averageRatingElement.textContent = stats.average_rating ?? "—";
}

// Обновляем список при изменении поиска или фильтров
searchInput.addEventListener("input", loadGames);
platformFilter.addEventListener("change", loadGames);
statusFilter.addEventListener("change", loadGames);

// Открываем форму добавления игры
addGameButton.addEventListener("click", () => {
    addGameForm.hidden = false;
});

// Закрываем форму добавления игры
cancelGameButton.addEventListener("click", () => {
    addGameForm.hidden = true;
});

// Добавляем новую игру
gameForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const gameData = {
        title: document.querySelector("#game-title").value.trim(),
        description: document.querySelector("#game-description").value.trim() || null,
        genre: gameGenreInput.value.trim() || null,
        status_id: Number(gameStatusSelect.value),
        hours_played: Number(document.querySelector("#game-hours").value) || 0,
        rating: document.querySelector("#game-rating").value
            ? Number(document.querySelector("#game-rating").value)
            : null,
        release_date: gameDateInput.value || null,
        platform_id: Number(gamePlatformSelect.value),
    };

    try {
    const gameId = document.querySelector("#game-id").value;

    const url = gameId
        ? `/api/games/${gameId}`
        : "/api/games";

    const method = gameId ? "PATCH" : "POST";

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
    });

    if (response.status === 401) {
        window.location.href = "/static/login.html";
        return;
    }

    if (!response.ok) {
        const error = await response.json();
        message.textContent = error.detail || "Не удалось сохранить игру";
        return;
    }

    gameForm.reset();
    document.querySelector("#game-id").value = "";

    addGameForm.querySelector("h2").textContent = "Добавить игру";
    gameForm.querySelector('button[type="submit"]').textContent = "Сохранить игру";

    addGameForm.hidden = true;

    await loadGames();
    await loadStats();

} catch (error) {
    message.textContent = "Ошибка при сохранении игры";
}
});

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
            await loadFilters();
            await loadGames();
            await loadStats();
        }
    } catch (error) {
        message.textContent = "Ошибка загрузки данных";
    }
}

init();
