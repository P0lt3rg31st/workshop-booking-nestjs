# Workshop Booking System

Учебный монорепозиторий системы управления бронированием мастер-классов.

Одна и та же бизнес-логика реализована на двух серверных фреймворках:

- Django + Django REST Framework;
- NestJS + TypeORM.

Проект разработан в рамках дисциплины «Серверные фреймворки бэкенд-разработки».

## Структура репозитория

```text
.
├── django/        # Реализация на Django REST Framework
├── nestjs/        # Реализация на NestJS
├── .gitignore
└── README.md
```

## Функциональность

Обе реализации поддерживают:

- регистрацию и авторизацию пользователей;
- роли `ADMIN` и `USER`;
- публичный просмотр списка мастер-классов;
- публичный просмотр отдельного мастер-класса;
- создание, изменение и удаление мастер-классов администратором;
- создание бронирований авторизованным пользователем;
- просмотр пользователем только собственных бронирований;
- отмену собственных бронирований;
- запрет повторного бронирования;
- проверку вместимости мастер-класса;
- запрет записи на прошедший мастер-класс;
- валидацию входящих данных;
- автоматическое тестирование API через Postman;
- запуск через Docker.

---

# Django implementation

Расположение:

```text
django/
```

## Технологии

- Python;
- Django;
- Django REST Framework;
- Django ORM;
- Token Authentication;
- SQLite;
- Docker;
- Postman.

## Локальный запуск

```bash
cd django

python -m venv .venv
source .venv/Scripts/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Для PowerShell активация виртуального окружения выполняется командой:

```powershell
.venv\Scripts\Activate.ps1
```

API будет доступен по адресу:

```text
http://localhost:8000/api
```

Проверка состояния сервера:

```bash
curl http://localhost:8000/api/health/
```

## Запуск Django через Docker

```bash
cd django
docker compose up -d --build
```

Остановка:

```bash
docker compose down
```

## Postman

Коллекция находится в каталоге:

```text
django/postman/
```

Для Django все адреса API оканчиваются на `/`.

---

# NestJS implementation

Расположение:

```text
nestjs/
```

## Технологии

- TypeScript;
- NestJS;
- TypeORM;
- JWT;
- SQL.js / SQLite-compatible database;
- Docker;
- Postman.

## Локальный запуск

```bash
cd nestjs
npm install
npm run build
npm run start:dev
```

API будет доступен по адресу:

```text
http://localhost:3000/api
```

Проверка состояния сервера:

```bash
curl http://localhost:3000/api/health
```

## Запуск NestJS через Docker

```bash
cd nestjs
docker compose up -d --build
```

Остановка:

```bash
docker compose down
```

## Postman

Коллекция находится в каталоге:

```text
nestjs/postman/
```

---

# Основные API-операции

## Аутентификация

```text
POST /api/auth/register
POST /api/auth/login
```

В Django адреса оканчиваются на `/`:

```text
POST /api/auth/register/
POST /api/auth/login/
```

## Мастер-классы

```text
GET    /api/workshops
GET    /api/workshops/:id
POST   /api/workshops
PUT    /api/workshops/:id
PATCH  /api/workshops/:id
DELETE /api/workshops/:id
```

Просмотр доступен всем пользователям. Изменение данных доступно только администратору.

## Бронирования

```text
GET    /api/bookings
POST   /api/bookings
DELETE /api/bookings/:id
```

Работа с бронированиями доступна только авторизованным пользователям. Пользователь получает доступ только к собственным бронированиям.

---

# Роли пользователей

В системе используются две роли:

```text
ADMIN
USER
```

Первый зарегистрированный пользователь получает роль администратора. Последующие пользователи получают роль обычного пользователя.

---

# Проверка проекта

Для проверки рекомендуется:

1. запустить выбранную реализацию;
2. импортировать соответствующую Postman-коллекцию;
3. запустить коллекцию через Collection Runner;
4. убедиться, что все автоматические тесты завершились успешно.

---

Учебный проект по дисциплине «Серверные фреймворки бэкенд-разработки».
