# Workshop Booking System — Django + DRF

Серверная часть системы бронирования мастер-классов. Проект реализован на **Django** и **Django REST Framework** в соответствии с домашним заданием 1 по дисциплине «Серверные фреймворки бэкенд-разработки».

## Что реализовано

- Регистрация пользователя.
- Авторизация пользователя с выдачей токена.
- Роли пользователей: `ADMIN` и `USER`.
- Публичный просмотр списка и деталей мастер-классов.
- CRUD мастер-классов только для администратора.
- Создание бронирования только авторизованным пользователем.
- Просмотр только своих бронирований.
- Отмена своего бронирования.
- Проверка вместимости мастер-класса.
- Защита от повторной записи на один мастер-класс.
- Защита от записи на мастер-класс с прошедшей датой.
- Сериализация ответов без паролей и хешей.
- Оптимизация ORM-запросов через `select_related` и `prefetch_related`.
- Docker-запуск.
- Postman-коллекция с переменными и автотестами.

> Для удобства проверки первый зарегистрированный пользователь автоматически получает роль `ADMIN`. Все следующие пользователи получают роль `USER`.

## Технологический стек

- Python 3.12
- Django 5
- Django REST Framework
- SQLite
- DRF Token Authentication
- Docker / Docker Compose
- Postman

## Архитектура проекта

```text
workshop-booking-django/
├── accounts/       # пользователь, регистрация, вход, роли
├── workshops/      # мастер-классы
├── bookings/       # бронирования
├── common/         # общие permissions
├── config/         # настройки и маршруты проекта
├── postman/        # коллекция для проверки API
├── data/           # локальная SQLite-база, не хранится в Git
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Быстрый запуск через Docker

```bash
docker compose up -d --build
```

После запуска API доступно по адресу:

```text
http://localhost:8000/api/
```

Проверка health endpoint:

```bash
curl http://localhost:8000/api/health/
```

Ожидаемый ответ:

```json
{
  "status": "ok",
  "service": "workshop-booking-system-django"
}
```

Остановить проект:

```bash
docker compose down
```

## Локальный запуск без Docker

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Git Bash:

```bash
source .venv/Scripts/activate
```

Установка зависимостей:

```bash
pip install -r requirements.txt
```

Миграции:

```bash
python manage.py migrate
```

Запуск сервера:

```bash
python manage.py runserver
```

## Основные endpoints

### Auth

```text
POST /api/auth/register/
POST /api/auth/login/
```

### Workshops

```text
GET    /api/workshops/
GET    /api/workshops/{id}/
POST   /api/workshops/       # ADMIN only
PUT    /api/workshops/{id}/   # ADMIN only
PATCH  /api/workshops/{id}/   # ADMIN only
DELETE /api/workshops/{id}/   # ADMIN only
```

### Bookings

```text
GET    /api/bookings/         # own bookings
GET    /api/bookings/{id}/     # own booking
POST   /api/bookings/         # authenticated user
DELETE /api/bookings/{id}/     # cancel own booking
```

## Авторизация

После регистрации или входа сервер возвращает токен:

```json
{
  "token": "...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "role": "ADMIN"
  }
}
```

Для защищённых запросов нужно передавать заголовок:

```text
Authorization: Token <token>
```

## Пример сценария проверки

1. Зарегистрировать первого пользователя — он станет администратором.
2. Войти под администратором.
3. Создать мастер-класс.
4. Зарегистрировать второго пользователя — он станет обычным пользователем.
5. Войти под обычным пользователем.
6. Посмотреть список мастер-классов.
7. Создать бронирование.
8. Посмотреть свои бронирования.
9. Проверить, что повторная запись запрещена.
10. Отменить бронирование.

## Postman

Коллекция находится в папке:

```text
postman/workshop-booking-django.postman_collection.json
```

В коллекции используются переменные:

- `baseUrl`
- `adminToken`
- `userToken`
- `workshopId`
- `bookingId`
- `futureStartsAt`

Также добавлены автотесты для проверки кодов ответа и сохранения токенов/id.

## Модели данных

### User

- `email`
- `username`
- `password`
- `role`: `ADMIN` / `USER`

### Workshop

- `title`
- `description`
- `starts_at`
- `duration_minutes`
- `capacity`
- `location`

### Booking

- `user`
- `workshop`
- `created_at`

На уровне БД задано ограничение уникальности пары:

```text
user + workshop
```

Это запрещает одному пользователю повторно бронировать один и тот же мастер-класс.

## Примечания для преподавателя

Проект использует SQLite для упрощённого локального запуска и демонстрации. Схема создаётся через Django migrations. Основная бизнес-логика вынесена в сериализаторы и ViewSet-классы, контроллерный слой не содержит лишней логики, а доступы регулируются через permission-классы.
