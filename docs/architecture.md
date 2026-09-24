# Архітектура BiteMap

## Feature-Sliced Design

Проєкт дотримується Feature-Sliced Design (FSD). Структура організована за
продуктовою відповідальністю, а не за загальними папками на кшталт `components`
або `hooks`.

```text
src/
├── app/                     # конфігурація застосунку та Next.js entry points
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
│   └── spot-details/
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
├── entities/                # доменні моделі: fishing-spot, catch, user, guide
│   ├── fishing-spot/
│       ├── model/
│       ├── ui/
│       └── index.ts
│   └── user/
│       ├── api/
│       ├── model/
│       └── index.ts
└── shared/                  # незалежний від домену код: UI-kit, config, api, lib
    ├── api/firebase/
    ├── lib/theme/
    │   ├── theme-provider.tsx
    │   └── index.ts
    └── styles/abstracts/    # SCSS-змінні, breakpoints і mixins
```

`src/views` — це фізична назва FSD-шару **Pages**. Її використано замість
`src/pages`, оскільки Next.js сприймає саме `src/pages` як окремий Pages Router,
що конфліктує з App Router. Семантика FSD при цьому не змінюється.

`entities/fishing-spot` містить типи, MVP-дані та перевикористовувану картку
водойми. `features/filter-spots` інкапсулює стан і UI взаємодії з фільтрами
каталогу, а також синхронізує активні фільтри з query-параметрами URL.
`features/authentication` містить email/password і Google-сценарії, а також
глобальний клієнтський стан авторизації. `entities/user` синхронізує приватний
профіль з Firestore. Firebase SDK ізольовано в `shared/api/firebase`.

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
