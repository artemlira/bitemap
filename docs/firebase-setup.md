# Firebase Auth для BiteMap

Авторизація в коді використовує Firebase Authentication з Email/Password.

1. Створи проєкт у [Firebase Console](https://console.firebase.google.com/).
2. Додай Web app і скопіюй його Firebase configuration.
3. У **Authentication → Sign-in method** увімкни **Email/Password**.
4. Скопіюй `.env.example` у `.env.local` у корені проєкту й заповни всі значення
   з configuration. Не коміть `.env.local`.
5. Перезапусти `npm run dev`.

Після цього форми `/register` та `/login` створюватимуть користувачів і
виконуватимуть вхід через Firebase. Firebase web configuration є клієнтською
конфігурацією; приватні ключі сервісного акаунта сюди не додавай.
