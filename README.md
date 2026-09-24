# BiteMap

BiteMap — платформа для пошуку рибальських водойм, планування виїздів і збереження уловів.

## Архітектура

Проєкт використовує [Feature-Sliced Design](https://feature-sliced.design/).
Коротка карта шарів:

```text
src/
├── app/       # Next.js entry points, провайдери, глобальні стилі
├── views/     # FSD Pages layer: сторінки продукту
├── widgets/   # великі повторно використовувані UI-блоки
├── features/  # дії користувача (додається лише за потреби)
├── entities/  # доменні сутності (водойма, улов, користувач)
└── shared/    # перевикористовуваний UI та технічні утиліти
```

Правила імпортів і приклади для нових модулів — у [документі про структуру](docs/architecture.md).
Налаштування Firebase Auth — у [firebase-setup.md](docs/firebase-setup.md).

## Запуск локально

```bash
npm install
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

## Перевірки

```bash
npm run lint
npm run build
```
