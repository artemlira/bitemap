# Firebase Auth для BiteMap

Авторизація в коді використовує Firebase Authentication з Email/Password і Google.

1. Створи проєкт у [Firebase Console](https://console.firebase.google.com/).
2. Додай Web app і скопіюй його Firebase configuration.
3. У **Authentication → Sign-in method** увімкни **Email/Password** і **Google**.
4. Скопіюй `.env.example` у `.env.local` у корені проєкту й заповни всі значення
   з configuration. Не коміть `.env.local`.
5. Перезапусти `npm run dev`.

Після цього форми `/register` та `/login` створюватимуть користувачів і
виконуватимуть вхід через Firebase. Після першої успішної авторизації сайт
створить профіль у Cloud Firestore. Перед цим застосуй правила з
[`firestore.rules`](../firestore.rules) за інструкцією у
[`firestore-security.md`](./firestore-security.md).

Firebase web configuration є клієнтською конфігурацією; приватні ключі
сервісного акаунта сюди не додавай.

## Локальна перевірка через Firebase Emulator

Щоб тестувати реєстрацію, вхід і створення водойм без записів у production:

1. Запусти `npm run emulators` в окремому терміналі. Він підніме лише локальні
   Firebase Auth (`127.0.0.1:9099`) і Firestore (`127.0.0.1:8080`). Якщо macOS
   не знаходить JDK 21, спершу встанови `JAVA_HOME` для Homebrew OpenJDK:

   ```sh
   export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
   export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
   ```

   Потім виконай `npm run emulators` у тому самому терміналі.
2. Створи `.env.development.local` у корені проєкту з рядками:

   ```env
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-bitemap
   NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
   ```

   Решта Firebase Web config береться з `.env.local`. Файл
   `.env.development.local` ігнорується Git.
3. Перезапусти `npm run dev`, щоб Next.js підхопив локальні змінні.
4. Зареєструй окремий тестовий акаунт на `/uk/register`. У режимі Emulator
   email і пароль обробляються локально; ці дані не створюють акаунт у
   Firebase Authentication production.

Клієнтський код навмисно відмовляється вмикати Emulator, якщо project ID не
`demo-bitemap`. Для повернення до звичайного Firebase прибери ці два рядки з
`.env.development.local` і перезапусти dev-сервер. Не вмикай Emulator-прапорець
у production build.

## Cloudinary для фотографій

Фото зберігаються у Cloudinary, тому Firebase Storage і тариф Blaze не потрібні.
Створи безкоштовний Cloudinary-акаунт і додай до `.env.local` значення
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` та `CLOUDINARY_API_SECRET`.
Останнє значення не має префікса `NEXT_PUBLIC_`: воно використовується тільки
серверним маршрутом `/api/media/signature` для створення короткочасного підпису
завантаження. Для локальної розробки після зміни `.env.local` перезапусти
`npm run dev`.

У **Settings → API Keys** використай product-environment API key з правом
створювати файли. У новому інтерфейсі Cloudinary для навчального MVP найпростіше
створити окремий ключ `bitemap-local` і вибрати роль **Master Admin**. Не
обирай **Media Library User**: він не має права на Upload API `create`.

У кожної фотографії є український підпис і необов’язковий англійський. Якщо
англійський не вказано, англомовний інтерфейс показує український. Для нових
фотографій не потрібно налаштовувати Firebase Storage чи додавати правила
Storage.

Під час деплою це також мають бути серверні environment variables на хостингу:
маршрут підпису не працюватиме в статичному export. Не використовуй префікс
`NEXT_PUBLIC_` для Cloudinary API Secret.
