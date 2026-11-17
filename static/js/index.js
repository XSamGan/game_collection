
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
const rawgSearchInput = document.getElementById("rawg-search");
const rawgResults = document.getElementById("rawg-results");
const gamePlatformSelect = document.querySelector("#game-platform");
const gameStatusSelect = document.querySelector("#game-status");
const gameGenreInput = document.querySelector("#game-genre");
const gameDateInput = document.querySelector("#game-date");

const addGameButton = document.querySelector("#add-game-button");
const addGameForm = document.querySelector("#add-game-form");
const cancelGameButton = document.querySelector("#cancel-game-button");

const sidebarUsername = document.getElementById("sidebar-username");

const topGamesList = document.querySelector("#top-games-list");


let rawgSearchTimeout;

rawgSearchInput.addEventListener("input", () => {
    clearTimeout(rawgSearchTimeout);

    const query = rawgSearchInput.value.trim();

    if (query.length < 2) {
        rawgResults.replaceChildren();
        return;
    }

    rawgSearchTimeout = setTimeout(() => {
        searchRawgGames(query);
    }, 500);
});

async function searchRawgGames(query) {
    try {
        const response = await fetch(
            `/api/rawg/search?search=${encodeURIComponent(query)}`
        );

        if (response.status === 401) {
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error("Ошибка поиска игр");
        }

        const games = await response.json();

        rawgResults.replaceChildren();

        games.forEach((game) => {
            const item = document.createElement("button");
            item.type = "button";
            item.classList.add("rawg-result");

            if (game.background_image) {
                const image = document.createElement("img");
                image.src = game.background_image;
                image.alt = game.name;
                item.append(image);
            }

            const name = document.createElement("span");
            name.textContent = game.name;

            item.append(name);

            item.addEventListener("click", () => {
                selectRawgGame(game);
            });

            rawgResults.append(item);
        });

    } catch (error) {
        console.error(error);
        rawgResults.textContent = "Не удалось выполнить поиск";
    }
}

function selectRawgGame(game) {
    document.getElementById("game-title").value = game.name;

    document.getElementById("game-cover-url").value =
    game.background_image || "";

    document.getElementById("game-genre").value =
        game.genres.join(", ");

    document.getElementById("game-date").value =
        game.released || "";

    rawgSearchInput.value = game.name;
    rawgResults.replaceChildren();
}


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
    sidebarUsername.textContent = user.username;

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
        card.classList.add("game-card");

        // Обложка
        const cover = document.createElement("div");
        cover.classList.add("game-cover");

                if (game.cover_url) {
                    const image = document.createElement("img");
                    image.src = game.cover_url;
                    image.alt = game.title;
                    image.classList.add("game-cover-image");

                    image.addEventListener("error", () => {
                        image.remove();

                        const placeholder = document.createElement("div");
                        placeholder.classList.add("game-cover-placeholder");
                        placeholder.textContent = "🎮";

                        cover.prepend(placeholder);
                    });

                    cover.append(image);
                } else {
                    const placeholder = document.createElement("div");
                    placeholder.classList.add("game-cover-placeholder");
                    placeholder.textContent = "🎮";

                    cover.append(placeholder);
                }

        const platform = document.createElement("span");
        platform.classList.add("platform-label");
        platform.textContent = game.platform_name;

        cover.append(platform);

        // Информация об игре
        const info = document.createElement("div");
        info.classList.add("game-info");

        const title = document.createElement("h3");
        title.classList.add("game-title");
        title.textContent = game.title;

        const genre = document.createElement("p");
        genre.classList.add("game-genre");
        genre.textContent = game.genre || "Жанр не указан";

        const status = document.createElement("span");
        status.classList.add("game-status");
        status.textContent = game.status_name;

        const statusClasses = {
            "Не начата": "status-not-started",
            "Играю": "status-playing",
            "Пройдена": "status-completed",
            "Брошена": "status-dropped"
        };

        if (statusClasses[game.status_name]) {
            status.classList.add(statusClasses[game.status_name]);
        }


        // Часы и оценка
        const meta = document.createElement("div");
        meta.classList.add("game-meta");

        const hours = document.createElement("span");
        hours.textContent = `◷ ${game.hours_played} ч.`;

        const rating = document.createElement("span");
        rating.textContent = `★ ${game.rating ?? "—"}`;

        // Меню с тремя точками
        const menu = document.createElement("div");
        menu.classList.add("game-menu");

        const menuButton = document.createElement("button");
        menuButton.classList.add("game-menu-button");
        menuButton.textContent = "⋯";
        menuButton.type = "button";

        const menuContent = document.createElement("div");
        menuContent.classList.add("game-menu-content");

        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать";
        editButton.type = "button";
        editButton.addEventListener("click", () => {
            editGame(game);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => {
            deleteGame(game.id);
        });

        menuButton.addEventListener("click", () => {
            menu.classList.toggle("open");
        });

        menuContent.append(editButton, deleteButton);
        menu.append(menuButton, menuContent);

        meta.append(hours, rating, menu);
        info.append(title, genre, status, meta);
        card.append(cover, info);

        gamesList.append(card);
    });

}


function editGame(game) {
    document.querySelector("#game-id").value = game.id;

    document.querySelector("#game-title").value = game.title;
    document.querySelector("#game-cover-url").value =
        game.cover_url ?? "";
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
        await loadTopGames();

    } catch (error) {
        message.textContent = "Ошибка при удалении игры";
    }
}

async function loadTopGames() {
    const response = await fetch("/api/games/top");

    if (response.status === 401) {
        window.location.href = "/static/login.html";
        return;
    }

    if (!response.ok) {
        throw new Error("Не удалось загрузить топ игр");
    }

    const games = await response.json();

    topGamesList.replaceChildren();

    if (games.length === 0) {
        topGamesList.textContent = "Пока нет игр с оценками";
        return;
    }

    games.forEach((game, index) => {
        const item = document.createElement("div");
        item.classList.add("top-game-item");

        const image = document.createElement("img");
        image.classList.add("top-game-image");
        image.src = game.cover_url || "";
        image.alt = game.title;

        if (!game.cover_url) {
            image.hidden = true;
        }

        const info = document.createElement("div");
        info.classList.add("top-game-info");

        const title = document.createElement("span");
        title.classList.add("top-game-title");
        title.textContent = `${index + 1}. ${game.title}`;

        const rating = document.createElement("span");
        rating.classList.add("top-game-rating");
        rating.textContent = `★ ${game.rating}`;

        info.append(title, rating);
        item.append(image, info);
        topGamesList.append(item);
    });
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

searchInput.addEventListener("input", loadGames);
platformFilter.addEventListener("change", loadGames);
statusFilter.addEventListener("change", loadGames);


addGameButton.addEventListener("click", () => {
    addGameForm.hidden = false;
});


cancelGameButton.addEventListener("click", () => {
    addGameForm.hidden = true;
});


gameForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const gameData = {
        title: document.querySelector("#game-title").value.trim(),
        description: document.querySelector("#game-description").value.trim() || null,
        genre: gameGenreInput.value.trim() || null,
        cover_url: document.querySelector("#game-cover-url").value || null,
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
    await loadTopGames();

} catch (error) {
    message.textContent = "Ошибка при сохранении игры";
}
});


logoutButton.addEventListener("click", async () => {
    await fetch("/api/auth/logout", {
        method: "POST"
    });

    window.location.href = "/static/login.html";
});


async function init() {
    try {
        const isLoggedIn = await loadUser();

        if (isLoggedIn) {
            await loadFilters();
            await loadGames();
            await loadStats();
            await loadTopGames();
        }
    } catch (error) {
        message.textContent = "Ошибка загрузки данных";
    }
}

init();
