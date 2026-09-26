# Архітектура BiteMap

## Feature-Sliced Design

Проєкт дотримується Feature-Sliced Design (FSD). Структура організована за
продуктовою відповідальністю, а не за загальними папками на кшталт `components`
або `hooks`.

```text
src/
├── app/                     # конфігурація застосунку та Next.js entry points
│   ├── [locale]/            # локалізовані App Router-адаптери: /uk/* та /en/*
│   ├── styles/              # глобальні SCSS-токени, reset і типографіка
│   ├── layout.tsx
│   └── page.tsx             # тонкий адаптер маршруту → views/home
├── views/                   # FSD Pages layer: екрани продукту
│   ├── home/
│   │   ├── ui/
│   │   └── index.ts
│   ├── spots/
│   │   ├── ui/
│   │   └── index.ts
│   ├── spot-details/
│       ├── ui/
│       └── index.ts
│   └── favorites/
│       ├── ui/
│       └── index.ts
│   ├── my-spots/
│   │   ├── ui/
│   │   └── index.ts
│   └── user-spot-form/
│       ├── ui/
│       └── index.ts
│   ├── community/
│   │   ├── ui/
│   │   └── index.ts
│   └── community-spot-details/
│       ├── ui/
│       └── index.ts
├── widgets/                 # великі, самодостатні та повторно використовувані блоки
│   └── site-header/
│       ├── ui/
│       └── index.ts
├── features/                # дії користувача: favorite-spot, add-catch, sign-in
│   ├── authentication/
│   │   ├── api/
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   └── filter-spots/
│       ├── model/
│       ├── ui/
│       └── index.ts
│   └── favorite-spot/
│       ├── model/
│       ├── ui/
│       └── index.ts
│   └── manage-user-spot/
│       ├── api/
│       ├── model/
│       ├── ui/
│       └── index.ts
│   └── share-user-spot/
│       ├── ui/
│       └── index.ts
├── entities/                # доменні моделі: fishing-spot, catch, user, guide
│   ├── fishing-spot/
│       ├── model/
│       ├── ui/
│       └── index.ts
│   └── user/
│       ├── api/
│       ├── model/
│       └── index.ts
│   └── user-spot/
│       ├── model/
│       ├── ui/
│       └── index.ts
└── shared/                  # незалежний від домену код: UI-kit, config, api, lib
    ├── api/firebase/
    ├── lib/auth/
    ├── lib/i18n/             # routing і locale-aware navigation next-intl
    ├── lib/theme/
    │   ├── theme-provider.tsx
    │   └── index.ts
    └── styles/abstracts/    # SCSS-змінні, breakpoints і mixins
```

`messages/uk.json` і `messages/en.json` містять тексти інтерфейсу. `src/proxy.ts`
додає префікс локалі до URL, тому публічні маршрути мають вигляд `/uk/spots` і
`/en/spots`. Маршрути без префікса зберігаються лише як сумісні редиректи на
українську версію.

`src/views` — це фізична назва FSD-шару **Pages**. Її використано замість
`src/pages`, оскільки Next.js сприймає саме `src/pages` як окремий Pages Router,
що конфліктує з App Router. Семантика FSD при цьому не змінюється.

`entities/fishing-spot` містить типи, MVP-дані та перевикористовувану картку
водойми. `features/filter-spots` інкапсулює стан і UI взаємодії з фільтрами
каталогу, а також синхронізує активні фільтри з query-параметрами URL.
`features/authentication` містить email/password і Google-сценарії,
`features/favorite-spot` — дію зі збереження та live-читання обраних водойм.
`views/favorites` відображає персональну добірку. Глобальний клієнтський стан
авторизації розташовано у `shared/lib/auth`; `entities/user` синхронізує
приватний профіль з Firestore. `entities/user-spot` містить доменну модель і
картку приватної водойми, а `features/manage-user-spot` — створення,
редагування та live-читання лише власних документів. Firebase SDK ізольовано в
`shared/api/firebase`. `features/share-user-spot` відкриває системне поширення
або копіює публічне посилання на опубліковану водойму. `views/community` та
`views/community-spot-details` відображають тільки записи з видимістю
`published`.

## Правила

1. Залежності спрямовані лише вниз: `app → views (FSD Pages) → widgets → features → entities → shared`.
   Slice не імпортує інший slice того самого шару.
2. Кожен slice має публічний API — файл `index.ts`. Зовнішній код імпортує
   тільки його: `@/widgets/site-header`, а не `@/widgets/site-header/ui/site-header`.
3. У Next.js `src/app` містить лише маршрути, metadata, глобальні провайдери та
   стилі. Бізнесовий UI сторінок живе в `src/views`.
4. Локальні SCSS Modules розташовуються поруч із компонентом у сегменті `ui`.
   Глобальні стилі — у `src/app/styles`, а перевикористовувані Sass-змінні й
   mixins — у `src/shared/styles/abstracts`.
5. Не створюй абстрактні `components`, `hooks`, `utils` або `types` на рівні
   всього проєкту. Визначай конкретну відповідальність і обирай відповідний
   slice та сегмент (`ui`, `model`, `api`, `lib`, `config`).
6. Тексти інтерфейсу не дублюються між мовами в компонентах: додавай ключі до
   `messages/uk.json` і `messages/en.json`, а в React використовуй
   `useTranslations`. Для внутрішньої навігації імпортуй `Link` і `useRouter`
   з `@/shared/lib/i18n`, а не безпосередньо з Next.js — так URL зберігає
   поточну локаль.

## Шаблон нового slice

```text
src/features/favorite-spot/
├── ui/
│   ├── favorite-spot-button.tsx
│   └── favorite-spot-button.module.scss
├── model/
│   └── use-favorite-spot.ts
└── index.ts
```

Цей документ є частиною кодової бази: оновлюй його в тому ж коміті, якщо
додаєш новий шар, правило або суттєво змінюєш структуру.
