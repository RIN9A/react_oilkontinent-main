# OilKontinent — Корпоративный портал

Веб-приложение для топливной компании: управление АЗС, топливными картами, договорами, транзакциями и платежами. Интерактивная карта с точками АЗС, работа с большими таблицами, экспорт данных, ролевой доступ.

## Стек

| Слой | Технология |
|---|---|
| Frontend | React, JavaScript |
| State | MobX (observable, actions, computed) |
| Роутинг | React Router |
| HTTP | Axios |
| Карты | Yandex Maps API |
| Таблицы | react-window (виртуализация) |
| Экспорт | SheetJS (xlsx) |
| Backend | Node.js + Express |
| ORM | Sequelize |
| БД | PostgreSQL |
| Auth | JWT |

## Функциональность

### Бизнес-домен
- **АЗС** — управление автозаправочными станциями, отображение на карте
- **Карты** — выпуск и учёт топливных карт клиентов
- **Договоры** — работа с контрактами
- **Транзакции** — учёт операций по картам
- **Платежи** — обработка платежей
- **Пользователи** — администрирование, роли

### Технически
- Интерактивная карта Yandex Maps с маркерами АЗС
- Таблицы с большим объёмом данных (10k+ строк) с виртуализацией через react-window
- Серверная пагинация и фильтрация
- JWT авторизация, защищённые маршруты, работа с ролями
- Экспорт таблиц в Excel (xlsx) через SheetJS
- Загрузка и хранение файлов на сервере
- Централизованная обработка ошибок

## Производительность

Виртуализация таблиц позволила работать с датасетами 10k+ записей без задержек интерфейса. Экспорт 10k строк в Excel — около 2 секунд.

## Запуск

### Требования

- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd server
npm install
```

Создать `.env` в `server/`:

```env
PORT=5000
DB_NAME=oilkontinent
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_jwt_secret
```

Создание пользователя и БД (Ubuntu):

```bash
sudo -u postgres psql -c "CREATE USER your_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "CREATE DATABASE oilkontinent OWNER your_user;"
```

Запуск:

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

Открыть [http://localhost:3000](http://localhost:3000).

## Структура

```
react_oilkontinent-main/
├── client/                       # React приложение
│   ├── src/
│   │   ├── UI/                   # Базовые UI компоненты
│   │   ├── components/           # Компоненты приложения
│   │   ├── page/                 # Страницы
│   │   ├── modules/              # Бизнес-модули
│   │   ├── store/                # MobX stores
│   │   ├── http/                 # Axios инстансы и API
│   │   ├── hooks/                # Кастомные хуки
│   │   ├── hoc/                  # HOC обёртки
│   │   ├── utils/                # Утилиты (Excel экспорт и др.)
│   │   ├── assets/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── routes.js
│   └── public/
│
└── server/                       # Express API
    ├── controllers/              # AZS, cards, contracts, payments,
    │                             #   transactions, files, users и др.
    ├── models/                   # Sequelize модели
    ├── routes/                   # Маршруты
    ├── middleware/               # JWT middleware
    ├── error/                    # Обработка ошибок
    ├── helpers/
    ├── static/                   # Статика и загрузки
    ├── utils/
    ├── db.js                     # Конфиг БД
    └── index.js
```
