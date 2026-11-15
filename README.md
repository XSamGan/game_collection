# Коллекция игр

Веб-приложение для хранения собственной коллекции игр.

## 1. Структура проекта

```text
game_collection/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   ├── deps.py
│   └── routers/
├── static/
├── migrations/
├── requirements.txt
├── alembic.ini
├── .gitignore
└── README.md
```

## 2. Что нужно установить

Для работы проекта нужны:

- Python 3.10 или новее;
- Git;
- VS Code (рекомендуется, но не обязателен).

На новом компьютере **не нужно переносить**:

- `venv/`;
- `.venv/`;
- `app.db`;
- `__pycache__/`.

Они создаются локально заново.

---

# 3. Запуск на Windows

## Шаг 1. Открыть терминал

Можно использовать терминал VS Code или PowerShell.

Перейдите в папку проекта:

```powershell
cd путь\к\game_collection
```

Например:

```powershell
cd C:\Users\User\Desktop\game_collection
```

## Шаг 2. Создать виртуальное окружение

```powershell
python -m venv venv
```

Если команда `python` не работает, попробуйте:

```powershell
py -m venv venv
```

## Шаг 3. Активировать виртуальное окружение

```powershell
venv\Scripts\activate
```

После успешной активации в начале строки терминала обычно появляется:

```text
(venv)
```

## Шаг 4. Установить зависимости

```powershell
pip install -r requirements.txt
```

## Шаг 5. Применить миграции базы данных

```powershell
alembic upgrade head
```

Эта команда создаст необходимые таблицы базы данных.

## Шаг 6. Запустить сервер

```powershell
uvicorn app.main:app --reload
```

Если всё запустилось правильно, появится сообщение примерно такого вида:

```text
Uvicorn running on http://127.0.0.1:8000
```

## Шаг 7. Открыть приложение

В браузере открыть:

```text
http://127.0.0.1:8000/static/login.html
```

Swagger API:

```text
http://127.0.0.1:8000/docs
```

## Шаг 8. Остановить сервер

В терминале нажать:

```text
Ctrl + C
```

---

# 4. Запуск на Linux

## Шаг 1. Открыть Terminal

Перейдите в папку проекта:

```bash
cd путь/к/game_collection
```

Например:

```bash
cd ~/Desktop/game_collection
```

## Шаг 2. Проверить Python

```bash
python3 --version
```

Если Python установлен, появится его версия.

## Шаг 3. Создать виртуальное окружение

```bash
python3 -m venv venv
```

Если система сообщает, что модуль `venv` не установлен, на Ubuntu/Debian обычно нужно установить пакет:

```bash
sudo apt update
sudo apt install python3-venv
```

После этого снова выполнить:

```bash
python3 -m venv venv
```

## Шаг 4. Активировать виртуальное окружение

```bash
source venv/bin/activate
```

После успешной активации в начале строки терминала обычно появляется:

```text
(venv)
```

## Шаг 5. Установить зависимости

```bash
pip install -r requirements.txt
```

## Шаг 6. Применить миграции

```bash
alembic upgrade head
```

## Шаг 7. Запустить сервер

```bash
uvicorn app.main:app --reload
```

Открыть в браузере:

```text
http://127.0.0.1:8000/static/login.html
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Шаг 8. Остановить сервер

В терминале:

```text
Ctrl + C
```

---

# 5. Каждый следующий запуск проекта

После того как проект уже настроен, **не нужно каждый раз создавать `venv` и устанавливать библиотеки заново**.

## Windows

```powershell
cd путь\к\game_collection
venv\Scripts\activate
uvicorn app.main:app --reload
```

## Linux

```bash
cd путь/к/game_collection
source venv/bin/activate
uvicorn app.main:app --reload
```

---

# 6. Работа с Git

## Проверить состояние проекта

```bash
git status
```

## Посмотреть изменения

```bash
git diff
```

## Добавить изменения

```bash
git add .
```

## Создать коммит

```bash
git commit -m "описание изменений"
```

Например:

```bash
git commit -m "добавлена форма игры"
```

## Отправить изменения на GitHub

```bash
git push
```

## Получить изменения с GitHub

```bash
git pull
```

---

# 7. Как скачать проект на новый компьютер

Если проект хранится на GitHub:

```bash
git clone ССЫЛКА_НА_РЕПОЗИТОРИЙ
```

После этого:

```bash
cd game_collection
```

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Linux

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

---

# 8. Работа с базой данных

Проект использует SQLite.

Файл базы данных:

```text
app.db
```

Файл `app.db` не должен отправляться в Git.

Структура базы данных создаётся и изменяется через Alembic.

Для применения всех существующих миграций:

```bash
alembic upgrade head
```

При изменении моделей и необходимости новой миграции:

```bash
alembic revision --autogenerate -m "описание изменения"
```

Затем:

```bash
alembic upgrade head
```

---

# 9. Основные команды проекта

Запуск сервера:

```bash
uvicorn app.main:app --reload
```

Остановка сервера:

```text
Ctrl + C
```

Установка зависимостей:

```bash
pip install -r requirements.txt
```

Применение миграций:

```bash
alembic upgrade head
```

Текущая миграция:

```bash
alembic current
```

История миграций:

```bash
alembic history
```

Проверка Git:

```bash
git status
```

---

# 10. Если нужно установить новую Python-библиотеку

Сначала убедиться, что виртуальное окружение активировано.

Затем:

```bash
pip install название_библиотеки
```

После установки обновить список зависимостей:

```bash
pip freeze > requirements.txt
```

После этого сохранить изменения `requirements.txt` в Git.

---

# 11. Если сервер не запускается

Проверить, активировано ли виртуальное окружение.

В начале строки терминала должно быть:

```text
(venv)
```

Проверить Python.

Windows:

```powershell
python --version
```

Linux:

```bash
python3 --version
```

Проверить установленные библиотеки:

```bash
pip list
```

Если зависимости не установлены:

```bash
pip install -r requirements.txt
```

Если таблицы базы данных отсутствуют:

```bash
alembic upgrade head
```

Если порт `8000` уже занят:

```bash
uvicorn app.main:app --reload --port 8001
```

Тогда открыть:

```text
http://127.0.0.1:8001/static/login.html
```

---

# 12. Важные правила проекта

Не загружать в Git:

```text
venv/
.venv/
__pycache__/
*.pyc
*.db
.env
.vscode/
```

Это уже указано в `.gitignore`.

Не удалять папку `migrations/`, так как она содержит историю изменений базы данных.

Перед работой с проектом на новом компьютере:

1. получить актуальную версию проекта;
2. создать или активировать `venv`;
3. установить зависимости;
4. выполнить миграции;
5. запустить сервер.

---

# 13. Быстрый запуск

Если проект уже настроен:

### Windows

```powershell
cd путь\к\game_collection
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Linux

```bash
cd путь/к/game_collection
source venv/bin/activate
uvicorn app.main:app --reload
```

Затем открыть:

```text
http://127.0.0.1:8000/static/login.html
```

---

# 14. Полезные адреса

Страница входа:

```text
http://127.0.0.1:8000/static/login.html
```

Главная страница:

```text
http://127.0.0.1:8000/static/index.html
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 15. Главное

Для запуска проекта на другом компьютере достаточно иметь:

- исходный код проекта;
- `requirements.txt`;
- `migrations/`;
- `alembic.ini`;
- `.gitignore`;
- этот `README.md`.

`venv` и `app.db` переносить не нужно.

После переноса проекта:

```text
1. Создать venv
2. Активировать venv
3. Установить requirements.txt
4. Выполнить alembic upgrade head
5. Запустить uvicorn
6. Открыть страницу в браузере
```
