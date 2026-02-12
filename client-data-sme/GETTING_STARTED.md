# Client Data SME - Быстрый старт

## 🚀 Запуск за 2 минуты

### Вариант 1: Локальная разработка

#### 1. Установка

```bash
cd client-data-sme
npm install
```

#### 2. Запуск

```bash
npm run dev
```

#### 3. Использование

Откройте http://localhost:5173

### Вариант 2: Docker (рекомендуется для продакшена)

#### 1. Запуск

```bash
cd client-data-sme
docker-compose up -d
```

#### 2. Использование

Откройте http://localhost

#### 3. Режим разработки с Docker

```bash
docker-compose -f docker-compose.dev.yml up
```

### Вариант 3: Docker Development (с hot-reload)

```bash
# Запуск с автоматической перезагрузкой
docker-compose -f docker-compose.dev.yml up

# Приложение доступно на http://localhost:5173
# Изменения в коде применяются автоматически
```

## 📋 Что готово

### ✅ Поиск клиентов

- Поиск по ИНН, ОГРН, названию, номеру клиента, счету, ФИО
- Краткий и расширенный набор данных
- Детали клиента
- Связанные лица

### ✅ Массовая выгрузка

- Загрузка файлов Excel/CSV
- Ручной ввод данных
- Генерация отчетов
- Прогресс выгрузки

## 🎯 Тестирование

### Примеры ИНН для тестирования:

- **ЮЛ**: 7713123456, 7713987654
- **ИП**: 123456789012, 987654321098

### Пример ручного ввода:

```
ИНН: 7713123456
ИНН: 123456789012, Счет: 40817810099910004312
ОГРН: 1027700132195, Краткое наименование: РОМАШКА
```

## 📚 Документация

- `README.md` - Полная документация
- `QUICK_START.md` - Быстрый старт
- `EXPORT_TEMPLATE.md` - Шаблон для выгрузки

## 🛠 Команды

### Локальная разработка

```bash
npm run dev      # Режим разработки
npm run build    # Сборка для продакшена
npm run preview  # Предварительный просмотр
npm run lint     # Проверка кода
```

### Docker

```bash
# Production
docker-compose up -d              # Запуск продакшен версии
docker-compose down               # Остановка контейнеров
docker-compose logs -f            # Просмотр логов
docker-compose build --no-cache   # Пересборка образа

# Development
docker-compose -f docker-compose.dev.yml up       # Запуск с hot-reload
docker-compose -f docker-compose.dev.yml down    # Остановка
docker-compose -f docker-compose.dev.yml logs -f # Логи

# Общие
docker ps                         # Статус контейнеров
docker stats client-data-sme      # Ресурсы контейнера
docker exec -it client-data-sme sh # Вход в контейнер
```

## ⚙️ Настройка

Файл `.env` содержит основные настройки:

```env
VITE_API_BASE_URL=https://srvap6229.rccf.ru:8090
VITE_ENABLE_MOCK_DATA=true
```

## 🐛 Проблемы?

### Не запускается?

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Ошибки lint?

```bash
npm run lint:fix
```

### Сборка не работает?

```bash
npm install
npm run build
```

## 📞 Поддержка

- Техническая поддержка: support@rencredit.ru
- Документация: https://dit.rencredit.ru/confluence

---

© 2026 АО «Ренессанс Кредит». Все права защищены.
