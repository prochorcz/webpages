(function(){

  var DIMS = {
    A:{label:"Ambice", gen:"ambice", intro:"Strategická čitelnost, priority a peníze.", strongAdj:"Vizionáři", weakPattern:"bez kompasu",
       strongText:"Firma ví, proč AI dělá — to je základ, který mnohým chybí.",
       leverText:"Ukotvěte AI ambici k byznys cílům jedním facilitovaným workshopem s vedením — ať je jasné, k čemu AI firmě slouží a jak to poznáte.",
       service:"Strategický AI kickoff / Portfolio & OKR alignment"},
    L:{label:"Lidé", gen:"lidí", intro:"Adopce, dovednost a to, jestli AI přežije první nezdar.", strongAdj:"Nadšenci", weakPattern:"bez armády",
       strongText:"Lidé AI skutečně používají, ne jen mluví o tom, že by měli.",
       leverText:"Jmenujte AI ambasadory a rozjeďte čtyřtýdenní úvodní seznámení. Bez lidí, kteří AI skutečně používají, žádná licence nic nezmění.",
       service:"Change Management & AI vzdělávání (ambasadoři, EDU program)"},
    D:{label:"Data", gen:"dat", intro:"Jestli má AI z čeho čerpat — a jestli přitom neuvidí víc, než má.", strongAdj:"Datoví mistři", weakPattern:"na vodě",
       strongText:"Data jsou připravená sloužit jako palivo, ne jako brzda.",
       leverText:"Zmapujte, kde reálně leží klíčová data, kdo je jejich vlastník a jaká práva k nim AI dědí. Bez toho narazí na stejnou zeď každý další use case.",
       service:"Data Management & Readiness"},
    R:{label:"Řízení", gen:"řízení", intro:"Pravidla, kontrola výstupů a to, co obhájíte před dozorovým orgánem i auditorem.", strongAdj:"Opatrní stratégové", weakPattern:"bez pojistky",
       strongText:"Rizika máte pod kontrolou dřív, než se stanou problémem.",
       leverText:"Sepište minimální AI politiku — co smí/nesmí, kdo schvaluje nástroje, kdo kontroluje výstup. Podpoří to rozjezd, nezpomalí ho.",
       service:"AI Governance & Automation"}
  };
  var DIM_ORDER = ["A","L","D","R"];
  var PER_DIM = 4;
  var TOTAL_Q = 16;

  var QUESTIONS = [
    {id:"A1", dim:"A", short:"zapsaná AI ambice", text:"Existuje dokument, který říká, k čemu má AI vaší firmě sloužit — a kdy jste ho naposledy otevřeli?",
     fix:"Zapište AI ambici na jednu stránku, dejte jí majitele a datum příští revize.",
     opts:[["Ano, revidovali jsme ho během posledního půl roku.",3],["Ano, ale je starší než rok.",2],["Je to v hlavách vedení, není nikde zapsané.",1],["Zatím jsme si tuhle otázku nepoložili.",0]]},
    {id:"A2", dim:"A", short:"priority příležitostí", text:"Kolik AI příležitostí máte sepsaných a seřazených podle přínosu?",
     fix:"Sepište příležitosti do jednoho seznamu, seřaďte je podle přínosu a každé přidělte vlastníka.",
     opts:[["Máme prioritizovaný seznam s vlastníky a rozhodujeme se podle něj.",3],["Existuje seznam, ale priority určuje, kdo je hlasitější.",2],["Běží jednotlivé nápady, ale souhrn nikde není.",1],["Zatím nic konkrétního neběží.",0]]},
    {id:"A3", dim:"A", short:"rozpočet na AI", text:"Má AI ve firemním rozpočtu vlastní řádek?",
     fix:"Vyčleňte AI samostatnou rozpočtovou položku. Bez ní zůstane vždy až po zbytku.",
     opts:[["AI má vlastní schválený rozpočet na tento rok.",3],["Když je potřeba, platí se ad hoc z IT rozpočtu.",2],["Nástroje si lidé platí sami.",1],["Nepoužíváme placené služby.",0]]},
    {id:"A4", dim:"A", short:"měření přínosu", text:"Dokážete jasně vyčíslit poslední přínos AI, který uzná i Váš finanční ředitel?",
     fix:"Definujte, jak se přínos projeví v rozpočtu, ještě než spustíte další pilot.",
     opts:[["Ano, je dohledatelný ve výkazech.",3],["Máme spočítané ušetřené hodiny, dál se s nimi nepracuje.",2],["Zlepšení cítíme, číslo za ním nemáme.",1],["Zatím nemáme co měřit.",0]]},

    {id:"L1", dim:"L", short:"šíře adopce", text:"Kolik lidí u vás minulý týden použilo AI na reálný pracovní úkol — skutečně použilo, ne vyzkoušelo?",
     fix:"Vyberte jeden tým a jeden opakovaný úkol a doveďte ho k dennímu používání, než začnete škálovat.",
     opts:[["Většina lidí, napříč odděleními.",3],["Jedno dvě oddělení, jinde skoro nikdo.",2],["Několik jednotlivců, každý sám za sebe.",1],["Prakticky nikdo.",0]]},
    {id:"L2", dim:"L", short:"střední management", text:"Používají AI i vaši střední manažeři na vlastní práci — nebo ji hlavně doporučují svým lidem?",
     fix:"Začněte u středního managementu. Dokud AI nepoužívají oni, jejich lidé ji používat nebudou.",
     opts:[["Používají ji sami a je to vidět na jejich výstupech.",3],["Někteří ano, záleží na osobním zájmu.",2],["Mluví o ní, sami ji nepoužívají.",1],["Spíš ji vnímají jako riziko pro svůj tým.",0]]},
    {id:"L3", dim:"L", short:"práce s chybou", text:"Když AI výstup naposledy selhal — chyba, která se dostala dál — co se stalo pak?",
     fix:"Zaveďte místo, kam se hlásí nepovedené AI výstupy, bez následků pro toho, kdo je nahlásí.",
     opts:[["Otevřeně jsme to probrali a provedli jsme nápravu.",3],["Vyřešilo se to potichu mezi zúčastněnými.",2],["Zvedla se nedůvěra a někteří lidé AI odložili.",1],["Zatím AI nepoužíváme natolik, aby se to stalo.",0]]},
    {id:"L4", dim:"L", short:"změna procesu", text:"Změnili jste kvůli AI nějaký proces — nebo AI zatím jen zrychluje kroky, které jste dělali stejně i předtím?",
     fix:"Vyberte jeden proces a přestavte ho kolem AI. Zrychlování starých kroků se v číslech neprojeví.",
     opts:[["Aspoň jeden proces jsme kvůli AI přestavěli.",3],["Upravili jsme dílčí kroky, celek zůstal stejný.",2],["Zatím jen zrychlujeme to, co jsme dělali dřív.",1],["K tomuhle jsme se ještě nedostali.",0]]},

    {id:"D1", dim:"D", short:"oprávnění k datům", text:"Když AI pustíte k firemním datům, uvidí uživatel jen to, na co má právo i bez ní?",
     fix:"Otestujte na jednom uživateli, co mu AI ukáže, a porovnejte to s tím, na co má práva bez ní.",
     flagOn:[1], flagText:"AI u vás vidí víc dat, než na co má nárok uživatel, kterému odpovídá. Nejčastější příčina úniku uvnitř firmy.",
     opts:[["Ano, oprávnění se dědí a ověřovali jsme to.",3],["Mělo by to tak fungovat, netestovali jsme to.",2],["AI vidí víc než běžný uživatel.",1],["K firemním datům jsme AI zatím nepustili.",0]]},
    {id:"D2", dim:"D", short:"dostupnost dat", text:"Kdyby dnes někdo potřeboval kompletní historii jednoho klienta nebo projektu, za jak dlouho ji má?",
     fix:"Zmapujte, kde leží data o klientech a projektech, a určete jim vlastníky.",
     opts:[["Během minut, z jednoho místa.",3],["Během hodin, poskládá se z několika systémů.",2],["Trvalo by to dny a musel by obvolat další kolegy.",1],["Část by se nedohledala vůbec.",0]]},
    {id:"D3", dim:"D", short:"vlastník kvality dat", text:"Má někdo jmenovitě na starost kvalitu dat, ze kterých by AI čerpala?",
     fix:"Jmenujte vlastníka kvality u datových sad, které chcete AI otevřít jako první.",
     opts:[["Je jmenovaný vlastník a nastavená pravidelná kontrola.",3],["Vykonává to někdo nad rámec své práce.",2],["Řeší se to, až když něco nesedí.",1],["Nikdo — použijí se data tak jak jsou.",0]]},
    {id:"D4", dim:"D", short:"údržba dokumentů", text:"Vaše metodiky, směrnice a lessons learned — kolik z nich má vlastníka a revizi za poslední rok?",
     fix:"Vyberte pět klíčových dokumentů, dejte jim vlastníka a revizi — a teprve pak je pusťte do AI.",
     opts:[["Většina, udržujeme to průběžně.",3],["Ty klíčové ano, zbytek zastarává.",2],["Existují, ale nikdo je neaktualizuje.",1],["Většina know-how je v hlavách lidí.",0]]},

    {id:"R1", dim:"R", short:"psané pravidlo", text:"Ví člověk, který u vás nastoupil minulý měsíc, co smí do AI vložit a co ne?",
     fix:"Sepište jednostránkové pravidlo (co smí, co ne, na čem) a zařaďte ho do onboardingu.",
     flagOn:[0], flagText:"Nemáte psané pravidlo, co do AI smí a nesmí. V praxi to znamená, že tam může jít cokoli včetně klientských dat.",
     opts:[["Pravidlo je psané a je součástí onboardingu.",3],["Pravidlo existuje, ale musel by ho sám najít.",2],["Řekneme mu, ať je opatrný; konkrétní pravidlo nemáme.",1],["Nijak to neřešíme.",0]]},
    {id:"R2", dim:"R", short:"inventář nástrojů", text:"Lidé si AI nástroje obstarávají i sami. Jak to u vás chodí?",
     fix:"Udělejte inventuru používaných nástrojů a zaveďte krok, kde se ptáte, kde končí vaše data.",
     flagOn:[0], flagText:"Neznáte vlastní inventář AI nástrojů. Nelze řídit ani zabezpečit to, o čem nevíte.",
     opts:[["Máme schválené nástroje a kdo potřebuje jiný, řekne si — vyřešíme to.",3],["Placené nákupy jdou přes IT, bezplatné nástroje neřešíme.",2],["Neschválené nástroje jsou plošně zakázané.",1],["Nevíme, co všechno se u nás dnes používá.",0]]},
    {id:"R3", dim:"R", short:"kontrola výstupů", text:"Může AI-generovaný obsah odejít ke klientovi, aniž by ho jmenovitě někdo zkontroloval?",
     fix:"Zaveďte povinnou kontrolu jmenovaným člověkem u všeho, co jde ke klientovi.",
     flagOn:[0,1], flagText:"Ke klientovi může odejít AI výstup, který nikdo jmenovitě nezkontroloval. Chybí human-in-the-loop na posledním kroku.",
     opts:[["Ne — u klientských výstupů je kontrola povinná a je jasné, kdo ji dělá.",3],["Záleží na typu výstupu, plošné pravidlo nemáme.",2],["Spoléháme na to, že si každý po sobě zkontroluje.",1],["Nevíme, kolik našich výstupů dnes tvoří AI.",0]]},
    {id:"R4", dim:"R", short:"evidence a AI Act", text:"Máte seznam AI nástrojů a systémů, které u vás běží — a víte, které spadají pod přísnější režim EU AI Actu?",
     fix:"Založte evidenci AI systémů a klasifikujte je podle rizika. Je to vstupní podmínka pro AI Act.",
     flagOn:[0], flagText:"Nemáte evidenci AI systémů ani jejich rizikovou klasifikaci — první věc, na kterou se ptá auditor i dozorový orgán.",
     opts:[["Evidence i riziková klasifikace existuje a někdo ji udržuje.",3],["Seznam nástrojů máme, rizikovou klasifikaci ne.",2],["Víme, že AI Act existuje, do praxe jsme ho zatím nepromítli.",1],["Tohle jsme zatím neřešili.",0]]}
  ];

  var answers = {}; // id -> {score, text, dim, question}
  var startedAt = null; // pro meta.duration_sec v payloadu
  var assessmentEl = document.getElementById('assessment');
  var lastDim = null;

  QUESTIONS.forEach(function(q){
    if(q.dim !== lastDim){
      var dimInfo = DIMS[q.dim];
      var dimIndex = DIM_ORDER.indexOf(q.dim) + 1;
      var intro = document.createElement('div');
      intro.className = 'dim-intro';
      intro.setAttribute('data-dim', q.dim);
      intro.hidden = true;
      intro.innerHTML = '<span class="eyebrow"><span class="dim-badge">'+dimIndex+'</span>ČÁST '+dimIndex+' / 4</span><h2>'+dimInfo.label+'</h2>';
      assessmentEl.appendChild(intro);
      lastDim = q.dim;
    }
    var card = document.createElement('div');
    card.className = 'q-card';
    card.id = 'card-'+q.id;
    card.setAttribute('data-qid', q.id);
    card.hidden = true;
    var optsHtml = q.opts.map(function(o){
      return '<label class="q-option" data-score="'+o[1]+'" data-text="'+o[0].replace(/"/g,'&quot;')+'">'+
             '<input type="radio" name="q-'+q.id+'" />'+o[0]+'</label>';
    }).join('');
    card.innerHTML =
      '<div class="q-text">'+q.text+'</div>'+
      '<div class="q-options">'+optsHtml+'</div>'+
      '<div class="q-answered-summary"><span class="check-dot">✓</span><span>Odpovězeno — <span class="qtext-mini"></span></span>'+
      '<button type="button" class="q-edit">změnit</button></div>';
    assessmentEl.appendChild(card);
  });

  function revealNext(afterId){
    var idx = QUESTIONS.findIndex(function(q){return q.id===afterId;});
    var next = QUESTIONS[idx+1];
    if(!next){ finishAssessment(); return; }
    var nextIntro = document.querySelector('.dim-intro[data-dim="'+next.dim+'"]');
    var target = null;
    if(nextIntro && nextIntro.hidden){
      nextIntro.hidden = false;
      target = nextIntro;
    }
    var nextCard = document.getElementById('card-'+next.id);
    nextCard.hidden = false;
    target = target || nextCard;
    setTimeout(function(){ target.scrollIntoView({behavior:'smooth', block:'center'}); }, 60);
    updateProgress(next.dim);
  }

  function updateProgress(currentDim){
    var answeredCount = Object.keys(answers).length;
    document.getElementById('progress-fill').style.width = Math.round(answeredCount/TOTAL_Q*100)+'%';
    document.getElementById('progress-current').textContent = Math.min(answeredCount+1,TOTAL_Q);
    document.getElementById('progress-dim').textContent = DIMS[currentDim] ? DIMS[currentDim].label.toUpperCase() : '';
  }

  assessmentEl.addEventListener('change', function(e){
    if(e.target.tagName !== 'INPUT') return;
    var card = e.target.closest('.q-card');
    var qid = card.getAttribute('data-qid');
    var label = e.target.closest('.q-option');
    var q = QUESTIONS.find(function(x){return x.id===qid;});
    var isFirstAnswer = !answers[qid];

    answers[qid] = {
      score: parseFloat(label.getAttribute('data-score')),
      text: label.getAttribute('data-text'),
      dim: q.dim,
      question: q.text
    };

    card.querySelectorAll('.q-option').forEach(function(o){o.classList.remove('selected');});
    label.classList.add('selected');
    card.querySelector('.qtext-mini').textContent = answers[qid].text;
    card.classList.add('answered');

    if(isFirstAnswer){
      revealNext(qid);
    } else {
      // Změna dřívější odpovědi nesmí odscrollovat ani znovu odkrývat další otázku.
      if(Object.keys(answers).length === TOTAL_Q) finishAssessment();
    }
  });

  // Rozklikávání již zodpovězené otázky (dřív nešlo odpověď pohodlně změnit).
  assessmentEl.addEventListener('click', function(e){
    if(!e.target.classList.contains('q-edit')) return;
    e.target.closest('.q-card').classList.remove('answered');
  });

  document.getElementById('start-btn').addEventListener('click', function(){
    if(startedAt === null) startedAt = Date.now();
    document.querySelectorAll('.dim-intro')[0].hidden = false;
    document.getElementById('card-A1').hidden = false;
    document.querySelectorAll('.dim-intro')[0].scrollIntoView({behavior:'smooth', block:'start'});
    updateProgress('A');
  });

  /* ---------- SCORING: čtyři pojmenované úrovně místo tří pásem ---------- */
  var LEVELS = [
    {min:2.25, cls:'lvl-3', label:'Škálujeme',       color:'var(--pjm-good)'},
    {min:1.50, cls:'lvl-2', label:'Řízeno',          color:'var(--pjm-blue-deep)'},
    {min:0.75, cls:'lvl-1', label:'Experimentujeme', color:'var(--pjm-warn)'},
    {min:-1,   cls:'lvl-0', label:'Nezačato',        color:'var(--pjm-red)'}
  ];
  function scoreLevel(v){
    for(var i=0;i<LEVELS.length;i++){ if(v >= LEVELS[i].min) return LEVELS[i]; }
    return LEVELS[LEVELS.length-1];
  }

  function buildRadar(scores){
    var cx=200, cy=155, maxR=110, labelR=maxR+28;
    var angles = {A:0, L:90, D:180, R:270};
    function pt(r, deg){
      var rad = (deg-90)*Math.PI/180;
      return [cx + r*Math.cos(rad), cy + r*Math.sin(rad)];
    }
    function ring(r){
      return DIM_ORDER.map(function(d){ return pt(r, angles[d]).join(','); }).join(' ');
    }
    var grid = [1,2,3].map(function(step){
      return '<polygon points="'+ring(maxR/3*step)+'" fill="none" stroke="#e2e7ee" stroke-width="1"/>';
    }).join('');
    var axisLines = DIM_ORDER.map(function(d){
      var p = pt(maxR, angles[d]);
      return '<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#e2e7ee" stroke-width="1"/>';
    }).join('');
    var dataPoints = DIM_ORDER.map(function(d){ return pt(scores[d]/3*maxR, angles[d]); });
    var dataPoly = dataPoints.map(function(p){return p.join(',');}).join(' ');
    var dots = DIM_ORDER.map(function(d,i){
      var p = dataPoints[i];
      return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.5" fill="#FF525F" stroke="#fff" stroke-width="1.5"/>';
    }).join('');
    // Popisky bez desetinného čísla — přesnost, kterou 4 odpovědi neunesou.
    var labels = DIM_ORDER.map(function(d){
      var p = pt(labelR, angles[d]);
      var anchor = d==='A'?'middle':d==='L'?'start':d==='D'?'middle':'end';
      var dy = d==='A'?-2:d==='D'?14:5;
      return '<text x="'+p[0]+'" y="'+(p[1]+dy)+'" text-anchor="'+anchor+'" font-size="13" font-weight="600" fill="#1a1a1a" font-family="Poppins,Helvetica,Arial,sans-serif">'+DIMS[d].label+'</text>';
    }).join('');
    return '<svg viewBox="0 0 400 330" width="400" height="330" role="img" aria-label="Radar graf zralosti">'+
      grid + axisLines +
      '<polygon points="'+dataPoly+'" fill="rgba(255,82,95,.18)" stroke="#FF525F" stroke-width="2.5"/>'+
      dots + labels +
      '</svg>';
  }

  function buildLevelLegend(scores){
    return DIM_ORDER.map(function(d){
      var lvl = scoreLevel(scores[d]);
      return '<div class="ll-item"><span class="ll-dim">'+DIMS[d].label+'</span>'+
             '<span class="level-chip '+lvl.cls+'">'+lvl.label+'</span></div>';
    }).join('');
  }

  // Nejnižší jednotlivá odpověď v dimenzi — rozhoduje při shodě průměrů.
  function dimMinItem(d){
    return Math.min.apply(null, QUESTIONS.filter(function(q){return q.dim===d;})
      .map(function(q){ return answers[q.id] ? answers[q.id].score : 0; }));
  }

  function buildArchetype(scores){
    var vals = DIM_ORDER.map(function(d){return scores[d];});
    var maxV = Math.max.apply(null, vals), minV = Math.min.apply(null, vals);
    // Tiebreak: dřív vyhrávala vždy Ambice jako síla a Řízení jako slabina (pořadí pole).
    // Nejdřív páka (řídí doporučenou službu), pak opora z toho, co zbylo — jinak by při
    // plné shodě skóre vyšla stejná dimenze jako opora i jako páka.
    var minDim = DIM_ORDER.filter(function(d){return scores[d]===minV;})
      .sort(function(a,b){ return dimMinItem(a)-dimMinItem(b) || DIM_ORDER.indexOf(a)-DIM_ORDER.indexOf(b); })[0];
    var maxCand = DIM_ORDER.filter(function(d){return scores[d]===maxV && d!==minDim;});
    if(!maxCand.length) maxCand = DIM_ORDER.filter(function(d){return d!==minDim;});
    var maxDim = maxCand.sort(function(a,b){ return dimMinItem(b)-dimMinItem(a) || DIM_ORDER.indexOf(a)-DIM_ORDER.indexOf(b); })[0];
    var avgAll = vals.reduce(function(a,b){return a+b;},0)/4;
    var name, sub;
    // Práh 0,5 = archetyp se pojmenuje až při rozdílu dvou kroků, ne jednoho kliknutí.
    if(maxV - minV < 0.5){
      if(avgAll >= 2.25){ name = 'Škálovatelně připraveni'; sub = 'Všechny čtyři oblasti drží podobně vysokou úroveň — vzácná pozice. Otázka teď není „jestli“, ale jak rychle škálovat, aniž byste tuhle rovnováhu ztratili.'; }
      else if(avgAll <= 0.75){ name = 'Na startovní čáře'; sub = 'Přesně tady začíná většina firem, než se do AI opřou pořádně — nejste pozadu, jen ještě nezačali. Další krok je jasný a zvládnutelný.'; }
      else { name = 'Rovnoměrně na cestě'; sub = 'Žádná oblast výrazně nevede ani nezaostává — postupujete konzistentně. Teď se vyplatí vybrat si jednu oblast a záměrně ji posunout napřed.'; }
    } else {
      name = DIMS[maxDim].strongAdj + ' ' + DIMS[minDim].weakPattern;
      sub = 'Nejdál jste v oblasti ' + DIMS[maxDim].gen + ' — a přesně to je páka, o kterou se můžete opřít při řešení ' + DIMS[minDim].gen + '.';
    }
    return {name:name, sub:sub, maxDim:maxDim, minDim:minDim, avgAll:avgAll};
  }

  // Červené vlajky — nově je vidí i klient, ne jen interní sales pohled.
  function redFlags(){
    return QUESTIONS.filter(function(q){
      return q.flagOn && answers[q.id] && q.flagOn.indexOf(answers[q.id].score) !== -1;
    });
  }

  // České skloňování počtu vlajek (1 / 2–4 / 5+).
  var NUMERALS = {1:'jedna',2:'dvě',3:'tři',4:'čtyři',5:'pět'};
  function flagLede(n){
    if(n === 1) return 'Tohle není bod ve skóre — je to jedna odpověď, u které se problém projeví dřív než přínos.';
    var word = NUMERALS[n] || n;
    if(n >= 5) return 'Tohle nejsou body ve skóre — je to '+word+' odpovědí, u kterých se problém projeví dřív než přínos.';
    return 'Tohle nejsou body ve skóre — jsou to '+word+' odpovědi, u kterých se problém projeví dřív než přínos.';
  }

  var leadData = null, computedScores = null, computedArchetype = null;

  function finishAssessment(){
    document.getElementById('progress-shell').classList.add('done');
    var scores = {};
    DIM_ORDER.forEach(function(d){
      var qs = QUESTIONS.filter(function(q){return q.dim===d;});
      var sum = qs.reduce(function(acc,q){ return acc + (answers[q.id] ? answers[q.id].score : 0); },0);
      scores[d] = sum/qs.length;
    });
    computedScores = scores;
    var arch = buildArchetype(scores);
    computedArchetype = arch;

    document.getElementById('archetype-name').textContent = arch.name;
    document.getElementById('archetype-sub').textContent = arch.sub;
    document.getElementById('radar-wrap').innerHTML = buildRadar(scores);
    document.getElementById('level-legend').innerHTML = buildLevelLegend(scores);
    // Když je i nejsilnější oblast na úrovni „Nezačato“, nelze o ní tvrdit, že je oporou.
    var topLevel = scoreLevel(scores[arch.maxDim]);
    if(topLevel.cls === 'lvl-0'){
      document.querySelector('.callout.support .tag').textContent = 'Vaše výchozí pozice';
      document.getElementById('support-title').textContent = 'Čistý stůl';
      document.getElementById('support-text').textContent = 'Zatím nemáte oblast, o kterou byste se opřeli — ale ani zátěž v podobě špatně rozjetých iniciativ. Začínat je levnější než opravovat.';
    } else {
      document.getElementById('support-title').textContent = DIMS[arch.maxDim].label;
      document.getElementById('support-text').textContent = DIMS[arch.maxDim].strongText;
    }

    // A naopak: u firmy, která všude škáluje, nedává smysl radit „sepište politiku“.
    var lowLevel = scoreLevel(scores[arch.minDim]);
    document.getElementById('lever-title').textContent = DIMS[arch.minDim].label;
    if(lowLevel.cls === 'lvl-3'){
      document.getElementById('lever-text').textContent = 'I nejslabší oblast máte na úrovni škálování. Páka už není v nápravě, ale v tempu — nejmenší náskok máte v oblasti ' + DIMS[arch.minDim].gen + ', tam se vyplatí přidat dřív, než se rozdíl projeví.';
    } else {
      document.getElementById('lever-text').textContent = DIMS[arch.minDim].leverText;
    }

    var flags = redFlags();
    var rfEl = document.getElementById('redflags');
    if(flags.length){
      rfEl.innerHTML = '<span class="rf-tag">Vyžaduje pozornost hned</span>'+
        '<p class="rf-lede">'+flagLede(flags.length)+'</p>'+
        '<ul class="rf-list">'+flags.map(function(q){
          return '<li><b>'+DIMS[q.dim].label+'</b>'+q.flagText+'</li>';
        }).join('')+'</ul>';
      rfEl.hidden = false;
    } else {
      rfEl.hidden = true;
    }

    var results = document.getElementById('results');
    results.hidden = false;
    setTimeout(function(){ results.scrollIntoView({behavior:'smooth', block:'start'}); }, 300);
  }

  document.getElementById('gate-form').addEventListener('submit', function(e){
    e.preventDefault();
    leadData = {
      name: document.getElementById('f-name').value.trim(),
      email: document.getElementById('f-email').value.trim(),
      company: document.getElementById('f-company').value.trim(),
      role: document.getElementById('f-role').value,
      size: document.getElementById('f-size').value,
      consent: !!document.getElementById('f-consent').checked
    };
    document.querySelector('.gate-box').style.display = 'none';
    renderDetail();
    document.getElementById('detail').hidden = false;
    // Report se odemkne hned. Odeslani kontaktu dobiha na pozadi a hlasi se ve stavovem bloku —
    // uzivatel necekaz na sit a pri chybe neztraci to, za co nam dal kontakt.
    trySend(buildPayload());
    setTimeout(function(){ statusEl.scrollIntoView({behavior:'smooth', block:'start'}); }, 100);
  });

  /* ---------- DETAIL: souhrn po oblastech + tři kroky ----------
     Dřív se tu vypisovalo až šest karet (otázka + odpověď + první krok).
     Bylo to 300+ slov, opakovalo to znění otázek z průchodu i červené vlajky
     nad gate boxem a šest „prvních kroků“ znamenalo, že první krok nebyl žádný.
     Teď: přehled po oblastech se štítky témat, nejvýš tři kroky v pořadí
     a plný výpis odpovědí sbalený v <details>.
     ------------------------------------------------------------- */

  // Pod hranicí = dvě nejslabší volby (skóre 0–1). Bez ořezu na šest.
  function weakQuestions(d){
    return QUESTIONS.filter(function(q){
      return (!d || q.dim === d) && answers[q.id] && answers[q.id].score <= 1;
    });
  }

  function isFlag(q){
    return !!(q.flagOn && answers[q.id] && q.flagOn.indexOf(answers[q.id].score) !== -1);
  }

  // Skloňování počtu odpovědí ve sbaleném seznamu (1 / 2–4 / 5+).
  function plWeak(n){
    if(n === 1) return '1 odpověď pod hranicí';
    if(n < 5) return n + ' odpovědi pod hranicí';
    return n + ' odpovědí pod hranicí';
  }

  // Oblasti od nejslabší — v detailu je to řazení podle užitku, ne podle pořadí v dotazníku.
  function areaRows(){
    return DIM_ORDER.slice()
      .sort(function(a,b){ return computedScores[a]-computedScores[b] || DIM_ORDER.indexOf(a)-DIM_ORDER.indexOf(b); })
      .map(function(d){
        var lvl = scoreLevel(computedScores[d]);
        var weak = weakQuestions(d);
        var tags = weak.length
          ? '<span class="gap-count">'+weak.length+' ze '+PER_DIM+' pod hranicí</span>'+
            weak.map(function(q){
              return '<span class="tag-chip'+(isFlag(q)?' is-flag':'')+'">'+q.short+'</span>';
            }).join('')
          : '<span class="area-ok">Žádná odpověď pod hranicí</span>';
        return '<div class="area-row">'+
          '<div class="area-head">'+
            '<div class="dname">'+DIMS[d].label+'</div>'+
            '<div class="bar-track"><div class="bar-fill" style="width:'+(computedScores[d]/3*100)+'%;background:'+lvl.color+'"></div></div>'+
            '<div class="level-chip '+lvl.cls+'">'+lvl.label+'</div>'+
          '</div>'+
          '<div class="area-gaps">'+tags+'</div>'+
        '</div>';
      }).join('');
  }

  // Plné znění odpovědí pod hranicí — sbalené, aby zeď textu byla volba, ne default.
  function weakDetails(){
    var weak = weakQuestions().slice().sort(function(a,b){
      return DIM_ORDER.indexOf(a.dim)-DIM_ORDER.indexOf(b.dim)
          || answers[a.id].score-answers[b.id].score
          || QUESTIONS.indexOf(a)-QUESTIONS.indexOf(b);
    });
    if(!weak.length) return '';
    return '<details class="gap-details"><summary>Zobrazit '+plWeak(weak.length)+' — otázka po otázce</summary>'+
      weak.map(function(q){
        return '<div class="gap-item">'+
          '<span class="gap-dim">'+DIMS[q.dim].label+'</span>'+
          '<div class="gap-q">'+q.text+'</div>'+
          '<div class="gap-a">Vaše odpověď: '+answers[q.id].text+'</div>'+
        '</div>';
      }).join('')+'</details>';
  }

  // Tři kroky, ne šest. Červené vlajky mají přednost před nízkým skóre a z každé
  // oblasti jde do seznamu nejvýš jedna věc — jinak se stejné téma zopakuje
  // třikrát jinými slovy a priorita se ztratí.
  function firstSteps(){
    var picked = [], usedDims = {};
    weakQuestions().slice().sort(function(a,b){
      return ((isFlag(b)?1:0)-(isFlag(a)?1:0))
          || (answers[a.id].score-answers[b.id].score)
          || (computedScores[a.dim]-computedScores[b.dim])
          || (QUESTIONS.indexOf(a)-QUESTIONS.indexOf(b));
    }).forEach(function(q){
      if(usedDims[q.dim] || picked.length >= 3) return;
      usedDims[q.dim] = true;
      picked.push(q);
    });
    return picked;
  }

  function stepsHtml(){
    var steps = firstSteps();
    if(!steps.length){
      return '<p class="steps-empty">Žádná odpověď neklesla pod hranici, kde by šlo o zjevnou mezeru. '+
        'Váš prostor je v dotažení, ne v nápravě — nejmenší náskok máte v oblasti '+
        DIMS[computedArchetype.minDim].gen+'. Co konkrétně dotáhnout, dává smysl probrat na hovoru.</p>';
    }
    return '<ol class="steps">'+steps.map(function(q){
      return '<li class="step-item"><div class="step-fix">'+q.fix+'</div>'+
        '<div class="step-meta">'+DIMS[q.dim].label+' · '+q.short+
        (isFlag(q)?' · <b class="step-flag">vyžaduje pozornost hned</b>':'')+'</div></li>';
    }).join('')+'</ol>';
  }

  function renderDetail(){
    var arch = computedArchetype;

    // Regulatorní poznámka se ZOBRAZUJE podle velikosti firmy (velikost známe až po odemčení).
    // Povinnosti samotné na počtu zaměstnanců nezávisí — je to jen filtr relevance, ne právní hranice.
    var bigCo = (leadData.size === '250–1000' || leadData.size === '1000+');
    var r4 = answers['R4'].score;
    var actNote = (bigCo && r4 <= 1)
      ? '<div class="detail-block act-note"><h3>Poznámka k regulaci</h3>'+
        '<p style="font-size:14px;margin:0;">Podle vaší odpovědi u evidence AI systémů se vás povinnosti EU AI Actu týkají už teď — nezávisí na počtu zaměstnanců. Orientačně: AI gramotnost (čl. 4) od února 2025, transparentnost u chatbotů a AI obsahu (čl. 50) od srpna 2026, vysoce rizikové systémy po odkladu z Digital Omnibusu až od prosince 2027. Bez seznamu systémů nezjistíte, která z těch lhůt se vás vlastně týká.</p></div>'
      : '';

    // Firmě bez jediné slabé odpovědi nelze nadepsat blok „Kde ztrácíte body“.
    var weakAll = weakQuestions();
    var hasFlags = weakAll.some(isFlag);
    var head1 = weakAll.length ? 'Kde ztrácíte body' : 'Zralost podle oblastí';
    var lede1 = weakAll.length
      ? 'Oblasti od nejslabší. Štítky jsou konkrétní otázky, ve kterých jste ztratili body'+
        (hasFlags ? ' — červeně ty, které se vyplatí řešit dřív než přínosy.' : '.')
      : 'Ani v jedné oblasti vám odpověď neklesla pod hranici. Níž je vidět, kde máte největší a kde nejmenší náskok.';
    var lede2 = weakAll.length
      ? '<p class="detail-lede">Seřazeno podle vašich odpovědí, nejvýš jedna věc z každé oblasti. Víc než tři věci najednou stejně nikdo nerozjede.</p>'
      : '';

    document.getElementById('detail').innerHTML =
      '<div class="detail-block"><h3>'+head1+'</h3>'+
        '<p class="detail-lede">'+lede1+'</p>'+
        areaRows()+
        weakDetails()+
        '<p class="detail-fine">Úrovně: Nezačato · Experimentujeme · Řízeno · Škálujeme. Každá oblast stojí na čtyřech odpovědích, pod hranicí jsou dvě nejslabší volby.</p></div>'+
      '<div class="detail-block"><h3>Čím začít</h3>'+lede2+
        stepsHtml()+'</div>'+
      actNote+
      '<div class="cta-card">'+
        '<div><div class="who">Jan Procházka · Head of Consultancy, Projectman</div>'+
        '<h3>Proberme, jak z nejslabší sféry vytvořit příležitost.</h3>'+
        '<p>20 minut, žádná prezentace — jen rozbor vašeho výsledku a co by dávalo smysl udělat jako první.</p></div>'+
        '<a class="cta-btn" href="mailto:jan.prochazka@projectman.cz?subject=AI%20Readiness%20-%20'+encodeURIComponent(leadData.company)+'&body=Dobr%C3%BD%20den%2C%20cht%C4%9Bl%20bych%20probrat%20v%C3%BDsledek%20AI%20Readiness%20assessmentu%20('+encodeURIComponent(arch.name)+').">Domluvit 20min call</a>'+
      '</div>';
  }


  /* ================= ODESLANI NA WEBHOOK (Make) =================
     Hook vraci 200 pri prijeti. CORS je na strane Make otevreny
     (access-control-allow-origin: *, povoleny content-type), takze
     jde poslat JSON a zaroven precist navratovy kod — zadny no-cors.

     Chovani pri chybe (zvoleno):
       1. dva automaticke pokusy (1 s, 3 s) u chyb, kde ma retry smysl
          (sit, timeout, 5xx, 429). U 4xx retry nema smysl — tam je
          vypnuty scenar nebo spatna URL, opakovani nic nezmeni.
       2. report zustava odemceny; nad nim se ukaze lista s tlacitkem
          Zkusit znovu.
       3. payload lezi v localStorage a odesle se pri dalsim pokusu
          nebo pri dalsi navsteve stranky. submission_id se pritom
          nemeni, takze scenar v Make umi duplicitu poznat.
     ============================================================== */

  var WEBHOOK_URL = 'https://hook.eu1.make.com/9xpyyge67ujpbm2s4v43e9avjxh3f9z3';
  var SEND_TIMEOUT_MS = 15000;      // Make pri "wait until scenario completes" odpovida i par sekund
  var RETRY_DELAYS = [1000, 3000];
  var PENDING_KEY = 'pjm-air-pending';
  var PENDING_MAX_AGE_MS = 7 * 24 * 3600 * 1000;

  var statusEl = document.getElementById('send-status');
  var pendingPayload = null;


  function esc(v){
    return String(v == null ? '' : v)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function uuid(){
    if(window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'air-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,10);
  }

  function utmParams(){
    var out = {};
    try{
      var p = new URLSearchParams(location.search);
      ['source','medium','campaign','term','content'].forEach(function(k){
        var v = p.get('utm_'+k);
        if(v) out[k] = v;
      });
    }catch(e){}
    return out;
  }

  function pct(v){ return Math.round(v/3*100); }      // skore 0-3 -> 0-100 %
  function round2(v){ return Math.round(v*100)/100; }

  /* ---------- PAYLOAD ---------- */
  function buildPayload(){
    var arch = computedArchetype;
    var flags = redFlags();
    var bigCo = (leadData.size === '250–1000' || leadData.size === '1000+');
    var steps = firstSteps();

    return {
      meta: {
        form: 'ai-readiness-assessment',
        version: '1.0',
        submission_id: uuid(),
        submitted_at: new Date().toISOString(),
        duration_sec: startedAt ? Math.round((Date.now()-startedAt)/1000) : null,
        page_url: location.href.split('#')[0],
        referrer: document.referrer || null,
        utm: utmParams()
      },
      lead: {
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        role: leadData.role,
        company_size: leadData.size
      },
      result: {
        archetype: arch.name,
        archetype_sub: arch.sub,
        score_avg: round2(arch.avgAll),
        score_pct: pct(arch.avgAll),
        support_dim: DIMS[arch.maxDim].label,
        // *_dim_key je stabilni klic bez diakritiky (A/L/D/R). Scenar v Make podle
        // lever_dim_key vybira, ktery one-pager prilozit — labely se daji prepsat, klice ne.
        support_dim_key: arch.maxDim,
        lever_dim: DIMS[arch.minDim].label,
        lever_dim_key: arch.minDim,
        recommended_service: DIMS[arch.minDim].service,
        dimensions: DIM_ORDER.map(function(d){
          return {
            key: d,
            label: DIMS[d].label,
            score: round2(computedScores[d]),
            pct: pct(computedScores[d]),
            level: scoreLevel(computedScores[d]).label
          };
        })
      },
      red_flags: flags.map(function(q){
        return {id:q.id, dim:DIMS[q.dim].label, topic:q.short, text:q.flagText,
                answer:answers[q.id] ? answers[q.id].text : null};
      }),
      first_steps: steps.map(function(q,i){
        return {order:i+1, id:q.id, dim:DIMS[q.dim].label, topic:q.short, fix:q.fix, is_flag:isFlag(q)};
      }),
      answers: QUESTIONS.map(function(q){
        var a = answers[q.id];
        return {id:q.id, dim:DIMS[q.dim].label, topic:q.short, question:q.text,
                answer: a ? a.text : null, score: a ? a.score : null};
      }),
      flags_count: flags.length,
      ai_act_relevant: !!(bigCo && answers['R4'] && answers['R4'].score <= 1),
      consent_newsletter: !!leadData.consent
    };
  }

  /* ---------- PENDING (prezije zavreni karty) ---------- */
  function savePending(payload){
    try{ localStorage.setItem(PENDING_KEY, JSON.stringify({savedAt:Date.now(), payload:payload})); }catch(e){}
  }
  function clearPending(){
    try{ localStorage.removeItem(PENDING_KEY); }catch(e){}
  }

  /* ---------- HTTP ---------- */
  function postPayload(payload){
    var ctrl = (typeof AbortController === 'function') ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function(){ ctrl.abort(); }, SEND_TIMEOUT_MS) : null;
    var opts = {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload),
      keepalive: true       // odeslani dobehne i kdyz uzivatel zavre kartu (payload je ~6 kB, limit 64 kB)
    };
    if(ctrl) opts.signal = ctrl.signal;

    return fetch(WEBHOOK_URL, opts).then(function(res){
      if(timer) clearTimeout(timer);
      if(res.ok) return true;                       // 2xx — Make prijal
      var err = new Error('HTTP '+res.status);
      err.code = 'HTTP '+res.status;
      err.retryable = (res.status >= 500 || res.status === 429);
      throw err;
    }, function(e){
      if(timer) clearTimeout(timer);
      var aborted = e && e.name === 'AbortError';
      var err = new Error(aborted ? 'timeout' : 'network');
      err.code = aborted ? 'timeout po '+(SEND_TIMEOUT_MS/1000)+' s' : 'sit nedostupna';
      err.uncertain = aborted;                      // data mohla dorazit, jen nemame potvrzeni
      err.retryable = true;
      throw err;
    });
  }

  function sendWithRetry(payload, attempt){
    attempt = attempt || 0;
    return postPayload(payload).catch(function(err){
      if(err.retryable && attempt < RETRY_DELAYS.length){
        return new Promise(function(res){ setTimeout(res, RETRY_DELAYS[attempt]); })
          .then(function(){ return sendWithRetry(payload, attempt+1); });
      }
      throw err;
    });
  }

  function trySend(payload){
    pendingPayload = payload;
    savePending(payload);
    renderStatus('sending');
    return sendWithRetry(payload, 0).then(function(){
      clearPending();
      renderStatus('ok');
    }, function(err){
      renderStatus('error', err);
    });
  }

  /* ---------- STAVOVY BLOK ---------- */
  function renderStatus(state, err){
    if(state === 'sending'){
      statusEl.className = 'send-status is-sending';
      statusEl.innerHTML =
        '<span class="ss-spinner" aria-hidden="true"></span>' +
        '<div><b>Odesíláme váš kontakt…</b>' +
        '<p>Detailní report máte odemčený níž, tohle už jen dobíhá na pozadí.</p></div>';
    } else if(state === 'ok'){
      statusEl.className = 'send-status is-ok';
      statusEl.innerHTML =
        '<span class="ss-icon" aria-hidden="true">✓</span>' +
        '<div><b>Děkujeme — příjem potvrzujeme.</b>' +
        '<p>Vaše odpovědi i vyhodnocení jsme přijali. Detailní report je odemčený níž a kopii pošleme na <b class="ss-mail">' +
        esc(leadData.email) + '</b>.</p></div>';
    } else {
      statusEl.className = 'send-status is-error';
      var lede = (err && err.uncertain)
        ? 'nedostali jsme potvrzení, že se váš kontakt uložil'
        : 'váš kontakt se k nám nedostal';
      statusEl.innerHTML =
        '<span class="ss-icon" aria-hidden="true">!</span>' +
        '<div><b>Report je odemčený, ale ' + lede + '.</b>' +
        '<p>Zkuste to prosím ještě jednou. Pokud to nepomůže, napište na ' +
        '<a href="mailto:jan.prochazka@projectman.cz?subject=AI%20Readiness%20-%20' +
        encodeURIComponent(leadData.company) + '">jan.prochazka@projectman.cz</a> a report vám pošleme i tak.</p>' +
        '<button type="button" class="ss-retry">Zkusit znovu</button>' +
        (err && err.code ? '<span class="ss-code">Technický detail: ' + esc(err.code) + '</span>' : '') +
        '</div>';
    }
    statusEl.hidden = false;
  }

  statusEl.addEventListener('click', function(e){
    if(!e.target.classList.contains('ss-retry')) return;
    if(pendingPayload) trySend(pendingPayload);
  });

  /* ---------- DOBEH NEODESLANEHO ODESLANI Z DRIVEJSI NAVSTEVY ---------- */
  (function resumePending(){
    var raw = null;
    try{ raw = localStorage.getItem(PENDING_KEY); }catch(e){ return; }
    if(!raw) return;
    var rec = null;
    try{ rec = JSON.parse(raw); }catch(e){ clearPending(); return; }
    if(!rec || !rec.payload || !rec.savedAt || (Date.now()-rec.savedAt) > PENDING_MAX_AGE_MS){
      clearPending(); return;
    }
    // Jeden tichy pokus, bez UI — uzivatel uz svuj report videl.
    postPayload(rec.payload).then(clearPending, function(){});
  })();


})();
