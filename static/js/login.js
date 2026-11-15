const form = document.querySelector("#login-form");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    message.textContent = "Выполняется вход...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.detail || "Ошибка входа";
            return;
        }

        message.textContent = "Вход выполнен!";

        window.location.href = "/static/index.html";
    } catch (error) {
        message.textContent = "Не удалось подключиться к серверу";
    }
});