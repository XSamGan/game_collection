
const form = document.querySelector("#register-form");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    if (password !== confirmPassword) {
        message.textContent = "Пароли не совпадают";
        return;
    }

    message.textContent = "Выполняется регистрация...";

    try {
        const response = await fetch("/api/auth/register", {
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
            message.textContent = data.detail || "Ошибка регистрации";
            return;
        }

        message.textContent = "Регистрация успешна!";

        window.location.href = "/static/login.html";

    } catch (error) {
        message.textContent = "Не удалось подключиться к серверу";
    }
});
