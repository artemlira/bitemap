# Розгортання BiteMap на Hostinger

Сайт: `https://bitemap.artemlira.com/uk`. Для нього створено окремий сайт на
тарифі Hostinger Business; окремий платний домен для BiteMap не потрібен.
Хостинг з'єднаний із приватним репозиторієм `artemlira/bitemap` і збирає
Next.js 16 з гілки `main` на Node.js 22 командою `npm run build`.
Збірка використовує Webpack: стандартний Turbopack понад десять хвилин не
просувався далі етапу оптимізації під час першого деплою Hostinger, тоді як
Webpack-збірка пройшла локально. CI виконує ту саму команду, що й Hostinger.

## Шлях змін до сайту

1. Розробка ведеться в робочій гілці й потрапляє до `main` через pull request.
2. GitHub Actions виконує lint, unit-тести, перевірку TypeScript, production
   build, тести правил Firestore і браузерний сценарій для PR та push у `main`.
3. Після злиття PR новий коміт у `main` запускає автоматичну збірку Hostinger.
   У hPanel перевіряй стан збірки та її лог; зелений GitHub Actions сам по собі
   не підтверджує, що сайт успішно розгорнувся.

Hostinger запускає збірку відразу після push, незалежно від результату CI для
цього push. Тому перед злиттям PR перевіряй, що його CI успішний; для жорсткого
блокування злиття налаштуй required checks для `main` у GitHub. Ручний push у
`main` також запускає деплой і оминає перевірки PR.

## Середовище

Змінні з [`.env.example`](../.env.example) задані в налаштуваннях Node.js
сайту Hostinger. `NEXT_PUBLIC_FIREBASE_*` потрібні під час збірки Next.js;
`CLOUDINARY_API_SECRET` має лишатися тільки на сервері. Не додавай `.env.local`
або секрети до Git. Після зміни змінних збери застосунок повторно — один
перезапуск процесу не оновить значення `NEXT_PUBLIC_*` у вже зібраному коді.

Для входу через Firebase перевір у Firebase Console → Authentication →
Settings → Authorized domains, що там є `bitemap.artemlira.com`. Google-вхід
треба випробувати безпосередньо на розгорнутому сайті. Правила Firestore та
індекси розгортаються окремо від Node.js-сайту за інструкцією у
[`firestore-security.md`](firestore-security.md).

## Перевірка після деплою

Відкрий `/uk` і `/en`, перевір каталог та мапу, вхід через Google й email,
створення приватної водойми, публікацію звіту та завантаження фото. Окремо
перевір ці сценарії на вузькому екрані й переглянь логи Hostinger при помилці
серверного маршруту. Автоматичні тести використовують Firebase Emulator і не
замінюють перевірку production Firebase та Cloudinary.
