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

## Cloud Storage для фотографій

Щоб завантажувати фото водойм, у Firebase Console відкрий **Storage**, створи
default bucket і застосуй правила з [`storage.rules`](../storage.rules). Значення
`storageBucket` з Firebase configuration має бути в `.env.local` як
`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`.

У кожної фотографії є український підпис і необов’язковий англійський. Якщо
англійський не вказано, англомовний інтерфейс показує український. Для нових
Firebase-проєктів Cloud Storage потребує тариф Blaze; зміну тарифу виконуй лише
після того, як усвідомлено підтвердиш білінг.
