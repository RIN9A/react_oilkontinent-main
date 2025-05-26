# Запуск проекта
Установк node.js и npm https://nodejs.org/en/download/
Ubuntu: https://github.com/nvm-sh/nvm

Далее можно установить любую библиотеку от sequelize В данном случае postgres

## Postgres

### Создание пользователя, БД и пароля для конфигурационного файла
- CREATE USER <username> WITH PASSWORD 'password';
- CREATE DATABASE <database> OWNER <username>;

### Примеры Ubuntu:
- sudo -u postgres psql -c "CREATE USER test WITH PASSWORD 'test';"
- sudo -u postgres psql -c "CREATE DATABASE testDb OWNER test;"

### Настраиваем файл конфигурации (подключение к бд, порты и т.п.)
- расположение файла notes/server/.env
