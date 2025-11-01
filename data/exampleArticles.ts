
/**
 * Defines the structure for an example article object.
 */
export interface ExampleArticle {
  /** The short title of the article, used for the button text. */
  title: string;
  /** The full text content of the article. */
  text: string;
}

/**
 * A collection of pre-defined example F1 news articles.
 * This data is used to populate the "Or try an example article" buttons in the UI,
 * allowing users to quickly test the application without needing to find an article themselves.
 */
export const exampleArticles: ExampleArticle[] = [
  {
    title: "Verstappen vs. Norris in Spain",
    text: `Max Verstappen claimed a hard-fought victory at the Spanish Grand Prix, holding off a charging Lando Norris in a strategic thriller. Verstappen's brilliant start saw him take the lead from the pole-sitting McLaren driver, but Norris's superior pace in the final stint made for a tense finish. The gap between them was just 2.2 seconds at the chequered flag. "What made the race was the beginning," Verstappen said. "I took the lead and then had to manage the tyres. Lando was catching fast at the end, but we just managed to hang on." Lewis Hamilton secured his first podium of the season for Mercedes in third place, a welcome result for the Silver Arrows.`
  },
  {
    title: "Sainz's Future Decision",
    text: `Carlos Sainz has confirmed he will make a decision on his 2025 Formula 1 destination very soon, with Williams and Sauber (soon to be Audi) as the front-running contenders for his signature. After being replaced by Lewis Hamilton at Ferrari for next season, the Spaniard has been a key player in the driver market. "A decision will be taken very soon," Sainz stated in Barcelona. "I don't want to wait any longer." Williams has been publicly courting Sainz, with team boss James Vowles making it clear he is their number one target. Meanwhile, Audi's long-term project presents a compelling, albeit different, opportunity.`
  },
  {
    title: "Ocon to Part Ways with Alpine",
    text: `Esteban Ocon and Alpine have announced they will part ways at the end of the 2024 F1 season, concluding a five-year partnership. The decision comes in the wake of a controversial collision between Ocon and his team mate Pierre Gasly in Monaco, though both sides state the decision was mutual and made ahead of the incident. Ocon, a Grand Prix winner with the team in Hungary 2021, is now a key player in the driver market, with potential openings at Haas and Sauber/Audi for 2025.`
  },
  {
    title: "Perez Signs New Red Bull Deal",
    text: `Red Bull Racing has confirmed a two-year contract extension for Sergio Perez, securing the Mexican driver's seat alongside Max Verstappen until the end of 2026. The team cited a desire for continuity and stability as a key reason for the renewal. Perez, who joined Red Bull in 2021, has played a crucial role in securing two constructors' championships, and despite a recent dip in form, his strong start to the 2024 campaign helped finalize the deal.`
  },
  {
    title: "Norris's Maiden Win in Miami",
    text: `Lando Norris claimed an emotional maiden victory in Formula 1 at the Miami Grand Prix, capitalizing on a timely Safety Car period that vaulted him into the lead. Driving a significantly upgraded McLaren, Norris showed formidable pace, pulling away from world champion Max Verstappen after the restart to win by over seven seconds. The breakthrough victory was a hugely popular one in the paddock and marked a significant milestone for both Norris and the resurgent McLaren team.`
  },
  {
    title: "Verstappen's Canadian GP Masterclass",
    text: `Max Verstappen delivered a masterful performance in treacherous conditions to win a thrilling and chaotic Canadian Grand Prix. The race, which started on a wet track, featured multiple lead changes and two Safety Car interventions. Verstappen, however, remained composed, expertly managing his tyres through the changing conditions to fend off McLaren's Lando Norris and the pole-sitting Mercedes of George Russell, further extending his championship lead.`
  },
  {
    title: "Tsunoda Stays with RB for 2025",
    text: `The RB Formula 1 team has officially triggered an option in Yuki Tsunoda's contract to retain the Japanese driver for the 2025 season. The announcement came ahead of the Canadian Grand Prix, rewarding Tsunoda for his impressively strong and consistent start to the year. He has consistently scored points and has largely outperformed his highly-regarded teammate, Daniel Ricciardo, securing his future with the Red Bull sister team.`
  },
  {
    title: "Antonelli's F1 Test Program",
    text: `Mercedes junior driver Andrea 'Kimi' Antonelli is undergoing an extensive private testing programme as the team evaluates him for a potential 2025 race seat. The 17-year-old Italian prodigy has been testing older Mercedes F1 cars at various circuits, including Silverstone and Imola. With Lewis Hamilton departing for Ferrari, Antonelli is considered a frontrunner to partner George Russell, provided he continues to impress the team with his speed and feedback.`
  },
  {
    title: "Hamilton's Shock Ferrari Move",
    text: `In one of the biggest driver transfer shocks in F1 history, Lewis Hamilton will leave Mercedes at the end of 2024 to join Scuderia Ferrari on a multi-year contract. The move will see the seven-time world champion partner Charles Leclerc from 2025 onwards, bringing an end to his hugely successful 12-season tenure with the Brackley-based team. Hamilton activated a release clause in his contract to pursue his long-held dream of racing for the iconic Italian marque.`
  },
  {
    title: "F1's 2026 Engine Regulations",
    text: `Formula 1 is gearing up for a major technical overhaul with the introduction of new engine regulations for the 2026 season. The new power units will feature a greater emphasis on electrical power, with the MGU-K's output nearly tripling, and the complex MGU-H being removed entirely. A key objective is sustainability, with the regulations mandating the use of 100% sustainable fuels. This has attracted new manufacturers like Audi and Ford to the sport.`
  },
  {
    title: "FIA Unveils 'Nimble' 2026 Cars",
    text: `The FIA has provided a first look at the 2026 Formula 1 regulations, which are designed to create smaller, lighter, and more "nimble" cars. The new machines will be 30kg lighter and slightly narrower, featuring active aerodynamics with movable front and rear wings to reduce drag on straights. A new 'Manual Override' mode will grant drivers an on-demand electrical power boost to aid overtaking, aiming to create more exciting racing alongside the new 100% sustainable-fuelled power units.`
  },
  {
    title: "Doohan's FP1 Opportunity",
    text: `Alpine reserve driver Jack Doohan is set to drive in the opening practice session for the Canadian Grand Prix, taking over Esteban Ocon's A524 for FP1. This marks the Australian's first of two mandated rookie practice outings for the 2024 season. With Ocon's departure confirmed for the end of the year, this session provides a crucial opportunity for Doohan to stake his claim for a full-time race seat with the French team in 2025.`
  },
  {
    title: "Leclerc's Monaco Pole",
    text: `Charles Leclerc secured a stunning pole position for the Monaco Grand Prix, delighting the home crowd with a blistering final lap in Q3. The Ferrari driver narrowly beat out McLaren's Oscar Piastri, who will start alongside him on the front row. Max Verstappen, struggling with the balance of his Red Bull, could only manage sixth place, a major setback on a track where overtaking is notoriously difficult. Leclerc's teammate, Carlos Sainz, qualified third, putting Ferrari in a strong position.`
  },
  {
    title: "Remembering Senna: 30 Years On",
    text: `The Formula 1 community paid tribute to Ayrton Senna on the 30th anniversary of his death at the 1994 San Marino Grand Prix. Senna, a three-time world champion, is remembered as one of the sport's most iconic and transcendent figures, revered for his raw speed, intense rivalries, and profound impact on F1. Events at Imola and across the globe celebrated his life and legacy, which continues to inspire drivers and fans three decades after his tragic passing.`
  },
  {
    title: "Gasly's Frustration with Alpine",
    text: `Pierre Gasly voiced his frustration with Alpine's strategy during the Spanish Grand Prix, believing a different approach could have yielded a better result for the team. The Frenchman was engaged in a tight midfield battle but felt a sub-optimal pit strategy compromised his race. The comments come amid a challenging season for the Enstone squad and highlight the internal pressures as both Gasly and teammate Esteban Ocon fight to maximize results in an uncompetitive car.`
  }
];
