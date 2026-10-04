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
          {
            heading: "Польова шпаргалка: що перевірити на березі",
            contentHtml: `<p><img src="/articles/spot-checklist.svg" alt="Три кроки вибору водойми: доступ до берега, структура води та спостереження за рибою" /></p><p><img src="/articles/spot-bank.jpg" alt="Зарослий берег водойми з очеретом і стежкою до води" /></p><p>Фото: DS Pugh, <a href="https://commons.wikimedia.org/wiki/File:Reeds_along_the_lake_shore_-_geograph.org.uk_-_8174156.jpg" target="_blank" rel="noreferrer">Wikimedia Commons</a>, ліцензія <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noreferrer">CC BY-SA 2.0</a>.</p>`,
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
          {
            heading: "Bank-side checklist",
            contentHtml: `<p><img src="/articles/spot-checklist.svg" alt="Three steps for choosing a fishing spot: check bank access, read the water and watch for fish" /></p><p><img src="/articles/spot-bank.jpg" alt="A reed-lined lake bank with a path leading to the water" /></p><p>Photo by DS Pugh, <a href="https://commons.wikimedia.org/wiki/File:Reeds_along_the_lake_shore_-_geograph.org.uk_-_8174156.jpg" target="_blank" rel="noreferrer">Wikimedia Commons</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noreferrer">CC BY-SA 2.0</a>.</p>`,
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
          {
            heading: "Візуально: як повторювати закид",
            contentHtml: `<p><img src="/articles/feeder-accuracy.svg" alt="Три кроки точного фідерного закидання: орієнтир, кліпса котушки та плавне гальмування" /></p><p><img src="/articles/feeder-casting.jpg" alt="Фідерне вудилище на стійці біля річки" /></p><p>Фото: Pavel Kotrc, <a href="https://commons.wikimedia.org/wiki/File:Feeder_fishing.JPG" target="_blank" rel="noreferrer">Wikimedia Commons</a>, ліцензії <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noreferrer">CC BY-SA</a> та GFDL.</p>`,
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
          {
            heading: "At a glance: repeat an accurate cast",
            contentHtml: `<p><img src="/articles/feeder-accuracy.svg" alt="Three steps for accurate feeder casting: choose a marker, clip the reel line and feather the cast" /></p><p><img src="/articles/feeder-casting.jpg" alt="A feeder fishing rod resting on a bank beside a river" /></p><p>Photo by Pavel Kotrc, <a href="https://commons.wikimedia.org/wiki/File:Feeder_fishing.JPG" target="_blank" rel="noreferrer">Wikimedia Commons</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noreferrer">CC BY-SA</a> and GFDL.</p>`,
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
          {
            heading: "Перед виїздом: короткий чекліст",
            contentHtml: `<p><img src="/articles/weather-checklist.svg" alt="Чекліст погоди для риболовлі: вітер, опади та зміни температури" /></p><p><img src="/articles/fishing-weather.jpg" alt="Хмарне небо над гірським озером, відбите у воді" /></p><p>Фото: Caitlyn1289, <a href="https://commons.wikimedia.org/wiki/File:Clouds_over_a_lake.jpg" target="_blank" rel="noreferrer">Wikimedia Commons</a>, ліцензія <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</p>`,
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
          {
            heading: "Before you leave: a quick checklist",
            contentHtml: `<p><img src="/articles/weather-checklist.svg" alt="Fishing weather checklist: wind, rain and temperature changes" /></p><p><img src="/articles/fishing-weather.jpg" alt="Clouds reflected in a mountain lake" /></p><p>Photo by Caitlyn1289, <a href="https://commons.wikimedia.org/wiki/File:Clouds_over_a_lake.jpg" target="_blank" rel="noreferrer">Wikimedia Commons</a>, licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</p>`,
          },
        ],
      },
    },
  },
  {
    slug: "shock-leader-to-mainline",
    readMinutes: 5,
    tone: "lagoon",
    translations: {
      uk: {
        category: "Вузли та монтажі",
        title: "Як прив’язати шок-лідер до основного шнура",
        excerpt: "Покроково в’яжемо компактний FG-вузол для з’єднання плетеного шнура з товстішим шок-лідером.",
        sections: [
          {
            heading: "Підготуй шнури",
            contentHtml: `<p>Шок-лідер бере на себе навантаження під час силового закидання та захищає основний шнур від стирання. Для плетеного основного шнура й монофільного або флюорокарбонового лідера зручно використовувати компактний FG-вузол.</p><p>Залиш достатньо вільного кінця лідера. Основний шнур тримай під легким постійним натягом — наприклад, зафіксуй його між пальцями або натягни на невеликій відстані.</p>`,
          },
          {
            heading: "Зроби перехресні обмотки",
            contentHtml: `<p>Поклади лідер уздовж натягнутого плетеного шнура. Плетінкою по черзі обводь лідер з одного та іншого боку, формуючи рівні перехресні витки. Почни приблизно з 8–11 пар витків; для тонкої плетінки чи слизького лідера може знадобитися більше.</p><p>Витки мають прилягати один до одного, але не перекриватися грудкою. Злегка підтягни їх, зберігаючи натяг обох шнурів.</p><p><img src="/articles/shock-leader-fg-knot.svg" alt="Покрокова схема FG-вузла: натягнення, перехресні витки, фіксація та обрізання кінців" /></p><p><img src="/articles/fg-knot-closeup.svg" alt="Крупна схема FG-вузла з правильним перехресним плетінням двох шнурів" /></p>`,
          },
          {
            heading: "Зафіксуй вузол і перевір його",
            contentHtml: `<ol><li>Зроби кілька щільних піввузлів плетеним шнуром навколо обох кінців, щоб зафіксувати обмотки.</li><li>Поступово й упевнено підтягни з’єднання. Можна трохи змочити вузол, щоб зменшити тертя під час затягування.</li><li>Обріж кінець лідера якомога ближче до обмоток, не пошкодивши плетінку. Заверши ще кількома фіксувальними піввузлами.</li><li>Перед закиданням потягни за обидві волосіні та перевір, чи вузол не ковзає. Проведи його через кільця вудилища: надто об’ємний вузол може чіплятися.</li></ol><p>Кількість витків залежить від діаметра й матеріалу шнурів. Зроби пробне з’єднання та перевір його під навантаженням. Для дуже товстого лідера або якщо вузол не проходить крізь кільця, обери інше сумісне з’єднання.</p>`,
          },
        ],
      },
      en: {
        category: "Knots and rigs",
        title: "How to tie a shock leader to your main line",
        excerpt: "A step-by-step FG knot for joining braided main line to a thicker shock leader.",
        sections: [
          {
            heading: "Prepare the lines",
            contentHtml: `<p>A shock leader takes the strain of powerful casts and helps protect the main line from abrasion. The compact FG knot is a useful option for joining braided main line to a mono or fluorocarbon leader.</p><p>Leave enough tag end on the leader. Keep the braid under light, steady tension—for example, hold it between your fingers or tension it a short distance away.</p>`,
          },
          {
            heading: "Make alternating wraps",
            contentHtml: `<p>Lay the leader alongside the taut braid. Wrap the braid alternately over and under the leader, building neat crossed coils. Start with about 8–11 pairs of wraps; thin braid or a slick leader may need more.</p><p>Keep the wraps close without stacking them into a bulky lump. Gently snug them while maintaining tension on both lines.</p><p><img src="/articles/shock-leader-fg-knot.svg" alt="Step-by-step FG knot diagram: tension, crossed wraps, locking and trimming" /></p><p><img src="/articles/fg-knot-closeup.svg" alt="Close-up diagram of the correct crossed braid pattern around a leader" /></p>`,
          },
          {
            heading: "Lock the knot and test it",
            contentHtml: `<ol><li>Tie several tight half hitches with the braid around both ends to lock the wraps.</li><li>Pull the connection tight gradually and firmly. A little water can reduce friction while tightening.</li><li>Trim the leader tag close to the wraps without nicking the braid. Finish with a few more locking half hitches.</li><li>Pull both lines firmly to check for slipping. Run the knot through the rod guides; a bulky knot can catch.</li></ol><p>The number of wraps depends on line diameter and material. Tie a test knot and check it under load. For a very thick leader, or if the knot catches in the guides, choose another compatible connection.</p>`,
          },
        ],
      },
    },
  },
  {
    slug: "flat-feeder-hair-rig",
    readMinutes: 5,
    tone: "sunset",
    translations: {
      uk: {
        category: "Вузли та монтажі",
        title: "Як зв’язати повідець із волосом для флет-фідера",
        excerpt: "Формуємо волосяну оснастку без окремого вузла на гачку — із петлею, насадкою та безвузловим вузлом.",
        sections: [
          {
            heading: "Що знадобиться",
            contentHtml: `<p>Підготуй гачок із вушком, повідцевий матеріал, ножиці та насадку з волосинним стопором або байонетом. Для флет-фідера волос зазвичай роблять коротким і підбирають до розміру насадки та гачка.</p><p>Це базовий варіант безвузлового вузла. Перевір, чи повідцевий матеріал і гачок відповідають умовам водойми та правилам риболовлі.</p>`,
          },
          {
            heading: "Сформуй волос і прив’яжи гачок",
            contentHtml: `<ol><li>На кінці повідця зав’яжи невелику петлю. Протягни насадку на волос за допомогою голки та закріпи стопором.</li><li>Поклади волос уздовж цівки так, щоб насадка опинилася біля вигину гачка. Залиши між насадкою та гачком невеликий проміжок.</li><li>Вільним кінцем повідця зроби 6–8 щільних витків навколо цівки від вигину в напрямку вушка, утримуючи волос уздовж гачка.</li><li>Протягни кінець крізь вушко з боку жала назовні. Лінія має виходити з боку жала — так волос продовжує лінію гачка.</li></ol><p><img src="/articles/flat-feeder-hair-rig.svg" alt="Покрокова схема волосяної оснастки: петля, волос, безвузлові витки та готовий гачок" /></p><p><img src="/articles/hair-rig-closeup.svg" alt="Крупно показані волос із насадкою, стопор і вільне жало гачка" /></p>`,
          },
          {
            heading: "З’єднай повідець із монтажем",
            contentHtml: `<p>На іншому кінці повідця сформуй петлю для швидкої заміни. Її можна з’єднати з вертлюжком або конектором флет-годівниці відповідно до обраного монтажу.</p><p>Змочи вузол, плавно затягни його та перевір з’єднання натягом. Насадка має вільно лежати біля гачка, не затуляючи жало. Перед риболовлею перевір оснастку в мілкій воді: вона повинна розвертатися гачком донизу без заплутування.</p>`,
          },
        ],
      },
      en: {
        category: "Knots and rigs",
        title: "How to tie a hair rig for a flat feeder",
        excerpt: "Build a simple hair rig with a bait loop and knotless knot—without tying a separate knot at the hook eye.",
        sections: [
          {
            heading: "What you need",
            contentHtml: `<p>Prepare an eyed hook, hooklength material, scissors and bait with a hair stop or bait spike. For a flat feeder, the hair is usually short and matched to the bait and hook size.</p><p>This is a basic knotless-knot setup. Make sure the hook and hooklength material suit the water and local fishing rules.</p>`,
          },
          {
            heading: "Make the hair and tie the hook",
            contentHtml: `<ol><li>Tie a small loop at the end of the hooklength. Use a baiting needle to thread the bait onto the hair, then secure it with a stop.</li><li>Lay the hair along the shank so the bait sits near the bend. Leave a small gap between bait and hook.</li><li>Using the standing hooklength, make 6–8 neat turns around the shank from the bend toward the eye, holding the hair in place.</li><li>Pass the tag through the eye from the point side, so it exits toward the point. The hair should continue the line of the hook.</li></ol><p><img src="/articles/flat-feeder-hair-rig.svg" alt="Step-by-step hair rig: bait loop, hair, knotless turns and finished hook" /></p><p><img src="/articles/hair-rig-closeup.svg" alt="Close-up of the hair, bait stop and exposed hook point" /></p>`,
          },
          {
            heading: "Connect the hooklength to the feeder rig",
            contentHtml: `<p>Make a loop at the other end of the hooklength for quick changes. Connect it to a swivel or flat-feeder connector that matches your chosen rig.</p><p>Moisten and tighten the knot gradually, then test it with a firm pull. The bait should sit freely beside the hook without covering the point. Before fishing, test the rig in shallow water: it should settle with the hook pointing down and without tangling.</p>`,
          },
        ],
      },
    },
  },
  {
    slug: "feeder-paternoster-rig",
    readMinutes: 5,
    tone: "river",
    translations: {
      uk: {
        category: "Вузли та монтажі",
        title: "Як зробити оснастку для фідера «Патерностер»",
        excerpt: "Простий монтаж із відведенням для годівниці та окремим повідцем із гачком — і поради щодо безпеки риби.",
        sections: [
          {
            heading: "Принцип монтажу",
            contentHtml: `<p>Патерностер — це фідерна оснастка, у якій годівниця кріпиться на бічному відведенні, а повідець із гачком — на кінці основної лінії. Така схема допомагає рознести годівницю й насадку, але не гарантує відсутності заплутувань.</p><p>Для старту підготуй основну волосінь або окрему вставку, вертлюжок для годівниці, гачок і повідець. Довжини нижче орієнтовні: підлаштовуй їх під течію, дно, дистанцію та правила водойми.</p>`,
          },
          {
            heading: "Зв’яжи петлю та відвід",
            contentHtml: `<ol><li>На кінці основної волосіні зав’яжи подвійну петлю-вісімку, залишивши кінець приблизно 15–25 см.</li><li>За потреби розріж одну сторону петлі, щоб утворився короткий бічний відвід. До нього через вертлюжок або карабін приєднай годівницю.</li><li>На вільному кінці основної лінії зроби маленьку петлю або постав вертлюжок для повідця.</li><li>Приєднай повідець завдовжки приблизно 40–80 см способом «петля в петлю» або через вертлюжок, а до його кінця прив’яжи гачок.</li></ol><p><img src="/articles/feeder-paternoster-rig.svg" alt="Покрокова схема патерностера: петля у волосіні, відвід із годівницею та окремий повідець" /></p><p><img src="/articles/paternoster-closeup.svg" alt="Крупна схема вузла-відводу, вертлюжка та безпечного кріплення годівниці" /></p>`,
          },
          {
            heading: "Перевір роботу й безпеку",
            contentHtml: `<p>Перед закиданням розклади монтаж на землі: відвід годівниці та повідець мають вільно розходитися й не перехрещуватися. Якщо монтаж часто плутається, зміни довжину відводу або повідця та перевір, чи не надто різко виконуєш закид.</p><p><strong>Важливо для безпеки риби:</strong> не залишай рибу прив’язаною до важкої годівниці, якщо основна волосінь обірветься. Використовуй дозволений правилами безпечний монтаж — наприклад, годівницю на вільному відвідному з’єднанні або слабку ланку, яка відпустить її при зачепі. Перевіряй місцеві правила щодо типу монтажу та кількості гачків.</p>`,
          },
        ],
      },
      en: {
        category: "Knots and rigs",
        title: "How to make a feeder paternoster rig",
        excerpt: "A simple feeder branch and separate hooklength, with practical advice for fish-safe setup.",
        sections: [
          {
            heading: "How the rig works",
            contentHtml: `<p>A paternoster is a feeder rig with the feeder attached to a side branch and the hooklength tied to the end of the main line. Separating the feeder and bait can help reduce tangles, though no rig is completely tangle-proof.</p><p>Start with main line or a dedicated rig boom, a feeder swivel, a hook and hooklength. The lengths below are only a guide—adapt them to the flow, bottom, casting distance and local rules.</p>`,
          },
          {
            heading: "Tie the loop and feeder branch",
            contentHtml: `<ol><li>Tie a figure-of-eight loop at the end of the main line, leaving a loop about 15–25 cm long.</li><li>If needed, cut one side of the loop to make a short side branch. Attach the feeder to it with a swivel or snap.</li><li>Make a small loop or add a swivel at the free end of the main line for the hooklength.</li><li>Attach a hooklength of about 40–80 cm with a loop-to-loop connection or swivel, then tie a hook to its end.</li></ol><p><img src="/articles/feeder-paternoster-rig.svg" alt="Step-by-step paternoster: line loop, feeder branch and separate hooklength" /></p><p><img src="/articles/paternoster-closeup.svg" alt="Close-up of the branch knot, swivel and fish-safe feeder attachment" /></p>`,
          },
          {
            heading: "Test the rig and keep it fish-safe",
            contentHtml: `<p>Lay the rig out before casting. The feeder branch and hooklength should separate freely without crossing. If it tangles often, adjust the branch or hooklength and check that your casting motion is smooth.</p><p><strong>For fish safety:</strong> do not leave a fish tethered to a heavy feeder if the main line breaks. Use a fish-safe rig permitted by local rules—for example, a free-running feeder connection or a weak link that releases the feeder if it snags. Check local restrictions on rig types and hook counts.</p>`,
          },
        ],
      },
    },
  },
];
