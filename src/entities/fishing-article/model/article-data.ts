import type { FishingArticle } from "./types";

export const fishingArticles: readonly FishingArticle[] = [
  {
    slug: "choose-a-fishing-spot",
    readMinutes: 5,
    tone: "lagoon",
    translations: {
      uk: {
        category: "Планування виїзду",
        title: "Як обрати місце для риболовлі, якщо ти тут уперше",
        excerpt: "На що подивитися до закидання: доступ до берега, рельєф, вітер і сліди життя риби.",
        sections: [
          {
            heading: "Почни з берега та доступу",
            paragraphs: [
              "Навіть перспективна точка не варта ризику. Перевір, чи можна безпечно дістатися до води, де залишити авто та чи немає обмежень на в’їзд або риболовлю.",
              "Якщо місце описали інші рибалки, звір їхні нотатки з актуальними умовами. Рівень води, сезонні правила й доступ можуть змінитися.",
            ],
          },
          {
            heading: "Читай воду, а не лише карту",
            paragraphs: [
              "З карти помітні затоки, вигини русла та вузькі місця. На березі зверни увагу на очерет, зворотну течію, перепади глибини й ділянки, де вітер зносить корм.",
              "Не поспішай одразу розкладати всі снасті. Кілька хвилин спостереження часто підказують, де риба виходить годуватися.",
            ],
            tips: ["Шукай межу чистої води й рослинності.", "Спостерігай за сплесками та рухом малька.", "Враховуй напрямок і силу вітру."],
          },
          {
            heading: "Залишай корисні нотатки",
            paragraphs: [
              "Збережи координати, час, погоду та те, що спрацювало. Якщо ділитимешся точкою в BiteMap, додай тільки ті деталі, які допоможуть іншим підготуватися, і поважай приватність та правила водойми.",
            ],
          },
        ],
      },
      en: {
        category: "Trip planning",
        title: "How to choose a fishing spot when it’s your first visit",
        excerpt: "What to check before casting: bank access, underwater features, wind and signs of fish.",
        sections: [
          {
            heading: "Start with the bank and access",
            paragraphs: [
              "Even a promising spot is not worth taking a risk. Check whether you can reach the water safely, where to leave your car, and whether there are access or fishing restrictions.",
              "If other anglers have described the place, compare their notes with current conditions. Water levels, seasonal rules and access can change.",
            ],
          },
          {
            heading: "Read the water, not only the map",
            paragraphs: [
              "A map can reveal bays, bends and narrow channels. At the bank, look for reeds, back eddies, depth changes and areas where wind pushes food toward shore.",
              "Do not rush to unpack every rod. A few minutes of observation can show where fish come to feed.",
            ],
            tips: ["Look for the edge between open water and plants.", "Watch for surface activity and moving fry.", "Take wind direction and strength into account."],
          },
          {
            heading: "Keep useful notes",
            paragraphs: [
              "Save the coordinates, time, weather and what worked. When sharing a spot on BiteMap, include details that help others prepare, and respect privacy and local rules.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "accurate-feeder-groundbaiting",
    readMinutes: 6,
    tone: "sunset",
    translations: {
      uk: {
        category: "Фідерна риболовля",
        title: "Точність прикормлювання: як зібрати рибу в одній точці",
        excerpt: "Проста система з кліпсою, орієнтиром на березі та однаковим темпом закидання.",
        sections: [
          {
            heading: "Обери безпечну дистанцію",
            paragraphs: [
              "Знайди на протилежному березі або на горизонті виразний орієнтир. Працюй на дистанції, яку можеш стабільно повторювати, а не на межі дальності закидання.",
              "Перед риболовлею перевір дно маркерним вантажем або кількома контрольними закиданнями. Так легше знайти рівну ділянку чи край бровки.",
            ],
          },
          {
            heading: "Зафіксуй напрямок і дистанцію",
            paragraphs: [
              "Направляй вудилище на обраний орієнтир і зафіксуй волосінь кліпсою котушки. Після приводнення годівниці плавно гальмуй волосінь, щоб монтаж випрямився.",
            ],
            tips: ["Кліпсуй волосінь лише після перевірки вузла та шок-лідера.", "Для силового закидання використовуй шок-лідер.", "Якщо риба велика, продумай безпечне виведення до кліпсування."],
          },
          {
            heading: "Тримай ритм прикормлювання",
            paragraphs: [
              "На старті зроби кілька закидань із кормом у ту саму точку. Далі витримуй схожий інтервал: частіше перевіряй насадку на активній риболовлі й збільшуй паузу, коли клювання обережні.",
              "Якщо закидання розлітаються, спершу потренуй однаковий рух і контроль волосіні. Додавання більшої кількості корму не виправить неточний напрямок.",
            ],
          },
        ],
      },
      en: {
        category: "Feeder fishing",
        title: "Accurate feeder fishing: bring fish to one spot",
        excerpt: "A simple routine using the reel clip, a bank-side marker and a consistent casting rhythm.",
        sections: [
          {
            heading: "Choose a manageable distance",
            paragraphs: [
              "Pick a clear marker on the opposite bank or on the horizon. Fish at a distance you can repeat consistently, rather than at the limit of your casting range.",
              "Before fishing, check the bottom with a marker lead or a few test casts. This helps you find a flat area or the edge of a drop-off.",
            ],
          },
          {
            heading: "Set direction and distance",
            paragraphs: [
              "Point the rod at your marker and clip the line on the reel. As the feeder lands, slow the line smoothly so the rig straightens out.",
            ],
            tips: ["Clip the line only after checking your knot and shock leader.", "Use a shock leader for powerful casts.", "Plan how to play a large fish before clipping up."],
          },
          {
            heading: "Keep a steady feeding rhythm",
            paragraphs: [
              "Start with several feeder casts to the same spot. Then keep a similar interval: check the hookbait more often when fish are active and wait longer when bites are cautious.",
              "If casts land in different places, practise the same casting motion and line control first. More bait will not fix an inconsistent direction.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "weather-and-fishing-plan",
    readMinutes: 4,
    tone: "river",
    translations: {
      uk: {
        category: "Планування виїзду",
        title: "Погода для риболовлі: як читати прогноз без зайвих очікувань",
        excerpt: "Вітер, опади й тиск допомагають підготуватися, але не обіцяють гарантованого клювання.",
        sections: [
          {
            heading: "Дивись на умови разом",
            paragraphs: [
              "Температура сама по собі мало що вирішує. Враховуй напрямок вітру, хмарність, опади, зміну тиску та те, як довго тримається така погода.",
              "Стабільні умови часто передбачуваніші за різкі стрибки. Водночас різні види риби реагують по-різному, а особливості конкретної водойми мають значення.",
            ],
          },
          {
            heading: "Перевір точку й місцевий прогноз",
            paragraphs: [
              "Погода може відрізнятися навіть між сусідніми населеними пунктами. Перевір прогноз ближче до водойми, а перед виїздом онови його ще раз.",
            ],
            tips: ["Сильний вітер може зробити берег небезпечним.", "Підготуй одяг від дощу й запасний теплий шар.", "Використовуй календар клювання як підказку, а не обіцянку."],
          },
          {
            heading: "Записуй фактичні спостереження",
            paragraphs: [
              "Після виїзду занотуй погоду, час, активність риби та результат. Так власна історія спостережень стане кориснішою за загальний прогноз, а звіт допоможе спільноті BiteMap.",
            ],
          },
        ],
      },
      en: {
        category: "Trip planning",
        title: "Fishing weather: how to read a forecast without overpromising",
        excerpt: "Wind, rain and pressure help you prepare, but no forecast can guarantee a bite.",
        sections: [
          {
            heading: "Consider conditions together",
            paragraphs: [
              "Temperature alone does not tell the whole story. Consider wind direction, cloud cover, rain, pressure changes and how long the conditions have lasted.",
              "Stable conditions are often easier to plan around than sudden shifts. Different species still react differently, and each water body has its own patterns.",
            ],
          },
          {
            heading: "Check the spot and local forecast",
            paragraphs: [
              "Weather can differ even between nearby towns. Check the forecast close to the water and refresh it once more before setting off.",
            ],
            tips: ["Strong wind can make the bank unsafe.", "Pack rain gear and an extra warm layer.", "Use a bite calendar as a hint, not a promise."],
          },
          {
            heading: "Record what actually happened",
            paragraphs: [
              "After the trip, note the weather, time, fish activity and result. Your own observations become more useful than a general forecast, and your report can help the BiteMap community.",
            ],
          },
        ],
      },
    },
  },
];
