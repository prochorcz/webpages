/*
 * KONFIGURACE AGENDY WORKSHOPU
 * -----------------------------------------------------------------
 * Toto je jediný soubor, který je potřeba upravit pro nasazení
 * reálné agendy. Žádná databáze, žádný build - jen tento objekt.
 *
 * Struktura:
 *  - startTime / endTimeTarget: "HH:MM", plánovaný začátek a CÍLOVÝ
 *    (ne vynucený) konec dne - slouží jen k zobrazení driftu.
 *  - blocks: pole hlavních bloků a přestávek v pořadí, jak jdou po sobě.
 *      type: "main"  -> může mít "subblocks" (podbloky), doba hlavního
 *            bloku se pak počítá automaticky jako součet podbloků.
 *            Pokud "subblocks" chybí/je prázdné, blok je ATOMICKÝ -
 *            žádné další rozpady, "duration" je jeho vlastní dotace
 *            a v agendě se zobrazí jako jediný řádek (bez vnořeného
 *            seznamu).
 *      type: "break" -> jednoduchý samostatný blok bez podbloků (mezi
 *            hlavními bloky), jen "duration".
 *
 *  - Pauza UPROSTŘED hlavního bloku (mezi dvěma podbloky): vlož do
 *    "subblocks" prostě další položku a přidej "break: true", např.:
 *      { id: "b2-break", title: "Kávová pauza", duration: 20, break: true }
 *    Nepotřebuje "owner". Zůstane vizuálně uvnitř karty hlavního bloku
 *    a započítá se do jeho celkové dotace (protože zabírá čas v jeho
 *    časovém rozpětí).
 *
 *  - "owner": iniciály osoby odpovědné za blok/podblok (jen vizuální,
 *    neovlivňuje žádnou logiku časování).
 *  - "duration": výchozí dotace v minutách (dá se v appce měnit
 *    tlačítky +5/-5, úpravy se ukládají do localStorage prohlížeče).
 *  - "title": krátký popis - jde do agendy (levý/pravý panel dle šířky).
 *  - "longDesc": delší popis/kontext - zobrazí se JEN v detailním
 *    panelu běžícího bloku, menším písmem pod hlavním nadpisem.
 *  - "tags": pole kódů tagů (viz tagMeta níže), 0-N na blok/podblok.
 *    V agendě se zobrazí jako malé piktogramy (ať se tabulka nenafoukne),
 *    v detailním panelu běžícího bloku jako větší chipy s popiskem.
 *
 *  - tagMeta: slovník kód -> {icon, label}. Přidáš nový tag do dat
 *    (např. "RISK") -> stačí sem přidat i jeho piktogram, jinak se
 *    použije záložní ikona 🏷️ s kódem jako popiskem.
 */
window.AGENDA_CONFIG = {
  title: "Strategický workshop – DAY 1",
  startTime: "09:00",
  endTimeTarget: "17:30",

  tagMeta: {
    ORG:      { icon: "🗂️", label: "Organizační" },
    FYI:      { icon: "ℹ️",  label: "FYI / na vědomí" },
    DEBATE:   { icon: "💬",  label: "Otevřená debata" },
    DECISION: { icon: "☑️",  label: "Rozhodnutí" }
  },

  blocks: [
    {
      id: "b1",
      type: "main",
      title: "START - Timing, ways of co-working",
      owner: "PV",
      duration: 15,
      longDesc: "Úvod, nastavení pravidel spolupráce na workshopu, časový rámec, role AI pomocníků.",
      tags: ["ORG"]
    },
    {
      id: "b2",
      type: "main",
      title: "Trendy, SWOT, naše business okolí",
      owner: "JP",
      subblocks: [
        {
          id: "b2-1", title: "Co nás ovlivňuje a rámuje další debatu", owner: "JP", duration: 30,
          longDesc: "Výcuc věcí z rešerší, co bychom si měli zvědomit před debatou.",
          tags: ["FYI", "DEBATE"]
        },
        {
          id: "b2-2", title: "AI update — dopady na propozici i dovnitř", owner: "JP", duration: 20,
          longDesc: "AI jak biggest trend - nejen optikou CONS propozice, ale i dopady vývoje na nás vevnitř a na klienty/kolegy.",
          tags: ["FYI", "DEBATE"]
        }
      ]
    },
    {
      id: "b3",
      type: "main",
      title: "Goal O5 — rozvoj propozice",
      owner: "PV",
      subblocks: [
        {
          id: "b3-1", title: "Cílový stav, inovační cyklus, odpovědnosti", owner: "PV", duration: 20,
          longDesc: "Co je cílový stav O5, jak ho naplnit, inovační cyklus, odpovědnosti.",
          tags: ["FYI"]
        },
        {
          id: "b3-2", title: "Input: Revize key selling points, mise, uniqueness", owner: "PJ", duration: 30,
          longDesc: "Připomenutí a revize key selling points; mise, unique points.",
          tags: ["DEBATE"]
        },
        {
          id: "b3-break", title: "Coffee break, lets boost", duration: 15, break: true,
          longDesc: "Dopolední přestávka."
        },
        {
          id: "b3-3", title: "Diskuse k návrhu O5", owner: "PV", duration: 50,
          longDesc: "Diskuse: co jsou potřebné vstupy, co chybí. Odbočka k mission/uniqueness. Pozn.: NE vymýšlení propozic samotných.",
          tags: ["DEBATE", "DECISION"]
        }
      ]
    },
    {
      id: "b4",
      type: "main",
      title: "MARCOM a BO aktivity",
      owner: "PM",
      subblocks: [
        {
          id: "b4-1", title: "Vlastní research (→ brand → sales)", owner: "PM", duration: 15,
          longDesc: "Vlastní research jako nástroj získání vstupů pro O5 i mktg/sls tool.",
          tags: ["FYI", "DECISION"]
        },
        {
          id: "b4-2", title: "Account Based Marketing (→ sales)", owner: "PM", duration: 10,
          longDesc: "Account Based Marketing, jako efektivní metoda mktg/sls.",
          tags: ["FYI"]
        },
        {
          id: "b4-3", title: "Lead magnety: ksichty TOPu, AI audit", owner: "PM", duration: 10,
          longDesc: "Lead magnet „ksichty TOPu“; lead magnet „AI audit“ → sales, cons.",
          tags: ["FYI", "DEBATE"]
        },
        {
          id: "b4-4", title: "Lean BO aktivita", owner: "PM", duration: 10,
          longDesc: "Lean back-office - info k aktivitě a součinnosti.",
          tags: ["FYI"]
        }
      ]
    },
    {
      id: "break-lunch",
      type: "break",
      title: "Oběd, dobrou chuť",
      owner: "",
      duration: 60,
      longDesc: "Polední pauza (mezi blokem 4 a 5)."
    },
    {
      id: "b5",
      type: "main",
      title: "OUT témata (vyžadující cross debatu)",
      owner: "RP, JT",
      subblocks: [
        {
          id: "b5-1", title: "Kvalita OUT V1, ideál budoucího kontraktora", owner: "JT", duration: 20,
          longDesc: "Kvalita OUT V1, ideální budoucí podoba kontraktora.",
          tags: ["FYI", "DEBATE"]
        },
        {
          id: "b5-2", title: "Konverze + klesající PM poptávka, metriky", owner: "RP", duration: 15,
          longDesc: "Konverze + klesající PM poptávka. Vstup: as-is metriky (analýza) → debata/nápady.",
          tags: ["FYI"]
        },
        {
          id: "b5-3", title: "CARE 3.0 — AI rozvoj K1, ochrana, upsell", owner: "RP", duration: 45,
          longDesc: "CARE 3.0 — AI rozvoj K1, ochrana zakázek & upsell.",
          tags: ["FYI", "DEBATE", "DECISION"]
        },
        {
          id: "b5-break", title: "Coffee break, keep focused", duration: 15, break: true,
          longDesc: "Odpolední přestávka."
        },
        {
          id: "b5-4", title: "SLS rozměr - přifouknutí vršku funnelu", owner: "JT", duration: 25,
          longDesc: "Přifouknutí vršku funnelu jako nutná podmínka: 6 wins monthly + další SLS konsekvence.",
          tags: ["FYI"]
        }
      ]
    },
    {
      id: "b6",
      type: "main",
      title: "CONS výzvy a blockery — diskuse, support",
      owner: "JP",
      duration: 30,
      longDesc: "CONS výzvy a blockery — diskuse a support/součinnost.",
      tags: ["DEBATE"]
    },
    {
      id: "b7",
      type: "main",
      title: "Outside of BAU témata",
      owner: "PJ",
      subblocks: [
        {
          id: "b7-1", title: "Expanze zahraničí, Německo?", owner: "PeJa", duration: 30,
          longDesc: "Expanze do zahraničí (Německo?) = větší total addressable market. + lessons learned z Gerlachu/SK.",
          tags: ["DEBATE", "DECISION"]
        },
        {
          id: "b7-2", title: "Jiné formy expanze / zvětšení TAM", owner: "JP", duration: 30,
          longDesc: "Jiné formy expanze / zvětšení TAM a koláče — moderovaná diskuse.",
          tags: ["DEBATE"]
        }
      ]
    },
    {
      id: "b8",
      type: "main",
      title: "Quick WrapUp — ready for Golf & Fun?",
      owner: "PV",
      duration: 15,
      longDesc: "Rychlé shrnutí. Are we ready for Golf and Fun?",
      tags: ["ORG"]
    }
  ]
};
