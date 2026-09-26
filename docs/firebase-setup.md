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

## Cloudinary для фотографій

Фото зберігаються у Cloudinary, тому Firebase Storage і тариф Blaze не потрібні.
Створи безкоштовний Cloudinary-акаунт і додай до `.env.local` значення
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` та `CLOUDINARY_API_SECRET`.
Останнє значення не має префікса `NEXT_PUBLIC_`: воно використовується тільки
серверним маршрутом `/api/media/signature` для створення короткочасного підпису
завантаження. Для локальної розробки після зміни `.env.local` перезапусти
`npm run dev`.

У кожної фотографії є український підпис і необов’язковий англійський. Якщо
англійський не вказано, англомовний інтерфейс показує український. Для нових
фотографій не потрібно налаштовувати Firebase Storage чи додавати правила
Storage.

Під час деплою це також мають бути серверні environment variables на хостингу:
маршрут підпису не працюватиме в статичному export. Не використовуй префікс
`NEXT_PUBLIC_` для Cloudinary API Secret.
