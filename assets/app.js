/* ---------------- I18N ---------------- */
const translations = {
  fr: {
    'nav.close':"Fermer",'nav.apercu':"Aperçu",'nav.ministres':"Députés",'nav.cabinet':"Ministres",'h.cabinet':"Le Cabinet fédéral",'cabinet.sub':"Qui décide quoi, depuis quand, et comment iel vote.",'nav.projets':"Projets de loi",
    'nav.votes':"Votes",'nav.quoideneuf':"Quoi de neuf",'nav.compte':"Compte & à propos",'nav.trouve':"Trouvez votre député",
    'nav.lexique':"Lexique",'nav.personnes':"Qui gravite autour",'nav.lobby':"Registre des lobbyistes",'nav.petitions':"Pétitions",'nav.apropos':"D'où viennent ces données",
    'stat.ministres':"Députés",'stat.projets':"Projets de loi",'stat.votes':"Votes enregistrés",
    'h.composition':"Composition de la Chambre des communes",
    'h.billsrecent':"Projets de loi récemment actifs",
    'h.ministres':"Députés",
    'h.projets':"Projets de loi",
    'h.votes':"Registre des votes",
    'h.compte':"Compte et suivi",
    'h.trouve':"Trouvez votre député",
    'h.quoideneuf':"Quoi de neuf",
    'h.quoideneuf.sub':"Dernières activités réelles à la Chambre des communes",
    'h.lexique':"Lexique du jargon parlementaire",
    'h.lexique.sub':"Pour comprendre le reste du site sans avoir fait un cours de science politique",
    'brand.tagline':"Qui siège, qui légifère, qui vote quoi",
    'a3.tagline':"Le Parlement, réorganisé par personne et traduit en langage clair — sans jugement ni verdict.",
    'a3.stats':"En chiffres",'a3.deputes':"députés",'a3.ministres':"ministres",'a3.projets':"projets de loi",'a3.votes':"votes",
    'a3.explore':"Explorer les dossiers →",'a3.seeall':"Tout voir →",'a3.hiw':"Comment ça marche",
    'a3.tileVotes':"Chaque vote nominal — qui a voté quoi, et par quelle marge.",
    'a3.tileLex':"Le jargon parlementaire traduit en langage clair, sans cours de science po.",
    'a3.step1':"Un projet de loi vous semble opaque ? Demandez une explication.",
    'a3.step2':"Les demandes s'additionnent — les plus demandés passent en priorité.",
    'a3.step3':"On pousse pour une explication en langage clair, sourcée.",
    'proj.bandsub':"Chaque loi résumée en clair. Pas assez clair ? Demandez une explication.",'proj.challenge':"Challenger un projet",
    'chexp.h':"✋ C'est quoi, « challenger » ?",
    'chexp.p1':"Un clic sur « Demander une explication » = une demande citoyenne pour que le parrain du projet l'explique en langage clair, et pour qu'on le garde à l'œil ensemble.",
    'chexp.p2':"<b>Un compte (courriel) est requis</b> — une demande par personne, aucune demande anonyme. 🔥 À <b>1 000</b> demandes pour un même projet, une publication publique est faite, dans l'espoir qu'un·e élu·e accepte de parrainer une pétition à la Chambre.",
    'chexp.p3':"Ça marche sur n'importe quel projet, y compris une loi déjà sanctionnée : c'est souvent celle-là qu'on veut comprendre.",
    'votes.bandsub':"Chaque vote nominatif — qui a voté quoi, et par quelle marge.",
    'lire.h':"Comment lire un vote",'seo.h1':"DossierCanada — qui siège et qui vote au Parlement du Canada",'meta.title':"DossierCanada — Qui siège et qui vote au Parlement du Canada",'meta.desc':"Le Parlement du Canada sans jargon : qui siège aux Communes, ce que change chaque projet de loi fédéral, qui a voté quoi.",
    'lire.1.h':"Vote nominal",'lire.1.p':"Chaque élu·e vote un par un et son choix est inscrit au registre public. C'est ce qui permet de dire exactement qui a voté quoi — sans interprétation.",
    'lire.2.h':"Adopté n'est pas loi",'lire.2.p':"Un vote adopté fait franchir UNE étape. Un projet doit passer les deux chambres puis recevoir la sanction royale avant de devenir une loi.",
    'lire.3.h':"Pairé n'est pas absent",'lire.3.p':"Aux Communes, deux élu·e·s de camps opposés peuvent s'entendre pour ne pas voter : leurs voix s'annulent. Ce n'est ni une absence ni une abstention.",
    'lex.bandsub':"Le jargon parlementaire, traduit en français de tous les jours.",'lex.ph':"Chercher un terme…",
    'h.personnes':"Qui gravite autour du Parlement",
    'h.petitions':"Pétitions électroniques ouvertes à la Chambre des communes",
    'h.apropos':"D'où viennent ces données, et comment aller plus loin",
    'ph.searchMinistres':"Chercher un nom, une circonscription, un code postal…",
    'deputes.bandsub':"Qui vous représente, comment iel vote, à quelle fréquence iel siège.",'deputes.legend':"Légende",'deputes.senate':"Sénat",
    'trouve.info':"Cette liste reprend, telle quelle, la liste officielle et bilingue des député·e·s en poste à la Chambre des communes (noscommunes.ca). Une démission ou une élection partielle peut la changer entre deux rafraîchissements : elle montre la Chambre telle qu'elle était à la dernière mise à jour du site, faite chaque jour.",
    'ph.searchBills':"Mot-clé : logement, justice, un lobby…",
    'filter.statuts':"Statuts", 'filter.etapes':"Chambre",
    'ph.searchDeputes':"Nom, circonscription ou région…",
    'ph.searchVotes':"Mot-clé : sujet, numéro de scrutin ou de projet de loi…",
    'btn.follow':"+ Suivre",'btn.following':"✓ Suivi",
    'btn.viewSummary':"+ Voir le résumé",'btn.hideSummary':"− Masquer le résumé",
    'btn.viewFull':"Voir le texte complet →",
    'footer.left':"Site non officiel — données publiques du Parlement du Canada : <a href=\"https://www.parl.ca/legisinfo/fr\" rel=\"noopener\">LEGISinfo</a>, <a href=\"https://www.noscommunes.ca/fr\" rel=\"noopener\">Chambre des communes</a>, <a href=\"https://sencanada.ca/fr\" rel=\"noopener\">Sénat</a>, <a href=\"https://lobbycanada.gc.ca/fr/\" rel=\"noopener\">Commissariat au lobbying</a>. Site lié : <a href=\"https://dossierquebec.ca/\" rel=\"noopener\">DossierQuébec</a>",
    'footer.right':"Construit avec Claude",
    'footer.source':"Code source",
    'footer.coffee':"Offre-moi un café",
    'aria.back':"Retour à l'aperçu",
    'aria.fontMinus':"Réduire le texte",
    'aria.fontPlus':"Agrandir le texte",
    'aria.challengeMore':"Voir un autre projet challengé",
    'aria.fb':"DossierCanada sur Facebook",
    'aria.coffee':"Offre-moi un café — soutenir le projet",
    'aria.menu':"Ouvrir le menu",
    'aria.menuClose':"Fermer le menu",
    'aria.crumbs':"Fil d'Ariane",
    'aria.top':"Remonter en haut",
    'cb.title':"Projets challengés",
    'cb.cta':"Challenger un projet",
    'maj.h':"Mises à jour du site",
    'maj.h1':"Mises à jour de DossierCanada",
    'maj.sub':"Ce qui a changé sur le site, du plus récent au plus ancien",
    'min.incomplete.b':"Liste à jour.",
    'min.incomplete.pre':"Les ",
    'min.incomplete.post':" ministres viennent directement de la page officielle du Cabinet sur pm.gc.ca, scrapée en direct — pas une liste maintenue à la main.",
    'pet.sub':"Les pétitions électroniques actuellement ouvertes à la signature, les plus signées d'abord — instantané de la liste officielle",
    'pet.info':"Chaque pétition ci-dessus est reproduite telle quelle depuis la liste publique des pétitions de la Chambre des communes (ourcommons.ca), avec un lien direct vers la page où la signer. Le nombre de signatures est celui relevé au moment de l'instantané — pour le décompte exact et à jour, ou pour signer, utilisez le lien de chaque carte. Seules les plus récentes sont affichées ici ; la liste complète est sur ourcommons.ca.",
    'votes.info.b':"D'où vient le « qui a voté quoi »",
    'votes.info.text':"— pour chaque vote par appel nominal, la Chambre des communes publie le choix de chaque député·e : Pour, Contre ou pairé. Le détail derrière le bouton « + » de chaque vote reprend cette liste officielle (noscommunes.ca) telle quelle, sans estimation. Le parti indiqué est celui de la liste actuelle des député·e·s ; les personnes qui ont quitté la Chambre depuis sont regroupées à part, sous « Ancien·ne·s député·e·s ».",
    'bd.back':"← Retour à l'aperçu",
    'temoins.titre':"Témoins",
    'temoins.texte':"DossierCanada aimerait utiliser <strong>Google Analytics</strong> pour compter les visites. Il dépose des témoins (cookies). Rien d’autre ne change si vous refusez.",
    'footer.temoins':"Témoins",
    'temoins.accepter':"Accepter",
    'temoins.refuser':"Refuser",
    'bd.intro1':"Bonjour, moi c'est",
    'bd.intro3':"j'ai 45 ans et dossiercanada.ca, c'est votre premier pas vers la démocratie !",
    'bd.mot1':"Si on veut que les gens comprennent la politique, il faut la ramener à leur niveau.",
    'bd.mot2':"Quand j'ai voulu m'y intéresser, en plus de ne pas connaître le jargon, les projets de loi tenaient en deux lignes… et cinquante PDF. Le commun des mortels passait son chemin.",
    'bd.mot3':"J'ai eu l'idée de me servir de l'intelligence artificielle pour, d'abord, analyser tout ça, et ensuite le vulgariser. C'est comme ça que DossierCanada est né.",
    'bd.mot4':"En plus du récapitulatif écrit par l'IA, j'ai mis à la disposition des gens un lexique qui explique les fondements du jargon politique. Je suis l'Éducaloi de la politique !",
    'footer.etmoi':"et moi",
  },
  en: {
    'nav.close':"Close",'nav.apercu':"Overview",'nav.ministres':"MPs",'nav.cabinet':"Ministers",'h.cabinet':"The federal Cabinet",'cabinet.sub':"Who decides what, since when, and how they vote.",'nav.projets':"Bills",
    'nav.votes':"Votes",'nav.quoideneuf':"What's new",'nav.compte':"Account & about",'nav.trouve':"Find your MP",
    'nav.lexique':"Glossary",'nav.personnes':"Who's involved",'nav.lobby':"Lobbyist registry",'nav.petitions':"Petitions",'nav.apropos':"Where this data comes from",
    'stat.ministres':"MPs",'stat.projets':"Bills",'stat.votes':"Votes recorded",
    'h.composition':"Composition of the House of Commons",
    'h.billsrecent':"Recently active bills",
    'h.ministres':"Members of Parliament",
    'h.ministres2':"Cabinet",
    'min.merged.sub':"All Members of the House of Commons, every party — one search box",
    'min.sub2b':" ministers, complete official list",
    'min.restTitle':"Members of the House of Commons — every party",
    'h.comparateur':"MP comparator",
    'comp.sub':"Pick two MPs (ministers included) to see their facts side by side",
    'h.projets':"Bills",
    'h.votes':"Vote registry",
    'h.compte':"Account and follows",
    'h.trouve':"Find your MP",
    'h.quoideneuf':"What's new",
    'h.quoideneuf.sub':"Real, recent activity from the House of Commons",
    'h.lexique':"Parliamentary glossary",
    'h.lexique.sub':"To understand the rest of the site without a political science degree",
    'brand.tagline':"Who sits, who legislates, who votes how",
    'a3.tagline':"Parliament, reorganized by person and translated into plain language — no judgment, no verdict.",
    'a3.stats':"By the numbers",'a3.deputes':"MPs",'a3.ministres':"ministers",'a3.projets':"bills",'a3.votes':"votes",
    'a3.explore':"Explore the files →",'a3.seeall':"See all →",'a3.hiw':"How it works",
    'a3.tileVotes':"Every recorded vote — who voted what, and by what margin.",
    'a3.tileLex':"Parliamentary jargon translated into plain language, no poli-sci degree needed.",
    'a3.step1':"A bill seems opaque? Ask for an explanation.",
    'a3.step2':"Requests add up — the most requested move to the top.",
    'a3.step3':"We push for a plain-language, sourced explanation.",
    'proj.bandsub':"Every bill summarized in plain language. Not clear enough? Ask for an explanation.",'proj.challenge':"Challenge a bill",
    'chexp.h':"✋ What does “challenging” mean?",
    'chexp.p1':"Clicking “Ask for an explanation” is a citizen request for the bill's sponsor to explain it in plain language — and for us to keep an eye on it together.",
    'chexp.p2':"<b>An account (email) is required</b> — one request per person, no anonymous requests. 🔥 At <b>1,000</b> requests on the same bill, a public post is made, in the hope an MP agrees to sponsor a petition to the House.",
    'chexp.p3':"It works on any bill, including one that has already received royal assent — that is often the one people want to understand.",
    'votes.bandsub':"Every recorded vote — who voted what, and by what margin.",
    'lire.h':"How to read a vote",'seo.h1':"DossierCanada — who sits and votes in Canada's Parliament",'meta.title':"DossierCanada — Who sits and votes in Canada's Parliament",'meta.desc':"Canada's Parliament without the jargon: who sits in the House of Commons, what each federal bill changes and who voted how.",
    'lire.1.h':"Recorded vote",'lire.1.p':"Members vote one by one and each choice is entered in the public record. That is what lets us say exactly who voted what — no interpretation.",
    'lire.2.h':"Passed is not law",'lire.2.p':"A passed vote clears ONE stage. A bill must pass both chambers and then receive royal assent before it becomes law.",
    'lire.3.h':"Paired is not absent",'lire.3.p':"In the Commons, two members from opposing sides can agree not to vote: their voices cancel out. It is neither an absence nor an abstention.",
    'lex.bandsub':"Parliamentary jargon, translated into everyday language.",'lex.ph':"Search a term…",
    'h.personnes':"Who's involved around Parliament",
    'h.petitions':"E-petitions open at the House of Commons",
    'h.apropos':"Where this data comes from, and how to go further",
    'ph.searchMinistres':"Search a name, a riding, a postal code…",
    'deputes.bandsub':"Who represents you, how they vote, how often they sit.",'deputes.legend':"Legend",'deputes.senate':"Senate",
    'ph.searchBills':"Keyword: housing, justice, a lobby group…",
    'filter.statuts':"Statuses", 'filter.etapes':"Chamber",
    'ph.searchDeputes':"Name, riding, or region…",
    'ph.searchVotes':"Keyword: subject, vote or bill number…",
    'findmp.label':"Find your MP by postal code",
    'findmp.ph':"e.g. K1A 0A6",
    'findmp.btn':"Search",
    'bd.back':"← Back to overview",
    'temoins.titre':"Cookies",
    'temoins.texte':"DossierCanada would like to use <strong>Google Analytics</strong> to count visits. It sets cookies. Nothing else changes if you decline.",
    'footer.temoins':"Cookies",
    'temoins.accepter':"Accept",
    'temoins.refuser':"Decline",
    'bd.intro1':"Hi! My name is",
    'bd.intro3':"I'm 45, and dossiercanada.ca is your first step into democracy!",
    'bd.mot1':"If we want people to understand politics, it has to be brought down to their level.",
    'bd.mot2':"When I first tried to take an interest in it, on top of not knowing the jargon, bills came as two lines… and fifty PDFs. Most people would simply walk away.",
    'bd.mot3':"So I had an idea: use artificial intelligence first to read through all of it, then to put it in plain words. That's how DossierCanada was born.",
    'bd.mot4':"Alongside the AI recap, I've given people a lexicon that explains the basics of political jargon. Plain-language law exists — think of this as its equivalent for politics!",
    'footer.etmoi':"and me",
    'btn.follow':"+ Follow",'btn.following':"✓ Following",
    'btn.viewSummary':"+ View summary",'btn.hideSummary':"− Hide summary",
    'btn.viewFull':"View full text →",
    'footer.left':"Unofficial site — public data from the Parliament of Canada: <a href=\"https://www.parl.ca/legisinfo/en\" rel=\"noopener\">LEGISinfo</a>, <a href=\"https://www.ourcommons.ca/en\" rel=\"noopener\">House of Commons</a>, <a href=\"https://sencanada.ca/en\" rel=\"noopener\">Senate</a>, <a href=\"https://lobbycanada.gc.ca/en/\" rel=\"noopener\">Commissioner of Lobbying</a>. Related site: <a href=\"https://dossierquebec.ca/\" rel=\"noopener\">DossierQuébec</a>",
    'footer.right':"Built with Claude",
    'footer.source':"Source code",
    'footer.coffee':"Buy me a coffee",
    'aria.back':"Back to overview",
    'aria.fontMinus':"Decrease text size",
    'aria.fontPlus':"Increase text size",
    'aria.challengeMore':"See another challenged bill",
    'aria.fb':"DossierCanada on Facebook",
    'aria.coffee':"Buy me a coffee — support the project",
    'aria.menu':"Open menu",
    'aria.menuClose':"Close menu",
    'aria.crumbs':"Breadcrumb",
    'aria.top':"Back to top",
    'cb.title':"Challenged bills",
    'cb.cta':"Challenge a bill",
    'maj.h':"Site updates",
    'maj.h1':"DossierCanada updates",
    'maj.sub':"What changed on the site, newest first",

    // Ministers
    'min.incomplete.b':"Up to date.",
    'min.incomplete.pre':"These ",
    'min.incomplete.post':" ministers come directly from the official Cabinet page on pm.gc.ca, scraped live — not a hand-maintained list.",
    // Bills
    'proj.sub':"45th Parliament (1st session) — real status of bills",
    // Votes
    'votes.sub':"45th Parliament (1st session) — official counts and by-MP recorded-vote breakdown",
    'votes.info.b':"On the \u201cwho voted what\u201d detail",
    'votes.info.text':"— the House of Commons publishes each member's name for every recorded (nominal) vote (Yea / Nay / paired). The by-member breakdown above (the \"+\" button on each row) comes directly from that official source (ourcommons.ca), not an estimate. The party shown next to each name is taken from the current House roster; people who have since left the House appear separately under \"Former members\".",
    // Find your MP
    'trouve.sub':"343 ridings — full list, real House of Commons data",
    'trouve.info':"These entries come directly from the House of Commons official list of sitting members (ourcommons.ca), bilingual. Some seats may change between updates (resignation, by-election) — this list is a snapshot taken at the last update, not an automatically updated feed.",
    // What's new / calendar
    'news.sub':"The most recent parliamentary activity",
    // Lexicon
    'lex.1.t':"Bill (C- / S-)", 'lex.1.d':"The text a member or the government introduces in Parliament to become law. Numbers starting with \"C-\" come from the House of Commons, \"S-\" from the Senate. It becomes law only after both chambers pass it and it receives royal assent.",
    'lex.2.t':"First, second and third reading", 'lex.2.d':"The three main votes a bill clears in each chamber: first reading introduces it, second approves it in principle, third adopts the final text. A bill must clear all three in BOTH chambers (Commons and Senate).",
    'lex.3.t':"Committee stage", 'lex.3.d':"Between second and third reading, a committee (a small group of members) examines the bill clause by clause, hears witnesses and can propose amendments.",
    'lex.4.t':"Report stage", 'lex.4.d':"After committee, the whole chamber studies the committee's report and can vote on further amendments before third reading.",
    'lex.5.t':"Royal assent", 'lex.5.d':"The very last step: the Governor General (or a deputy) gives the Crown's official assent, and the bill formally becomes a law of Canada.",
    'lex.6.t':"Committee", 'lex.6.d':"A smaller group of members that studies a bill or a topic in depth and hears witnesses before it goes back to the full chamber. Each chamber has its own committees.",
    'lex.7.t':"Recorded vote", 'lex.7.d':"A vote where each member's name and choice (Yea / Nay / paired) are officially recorded — as opposed to a voice vote, where only the overall result is noted.",
    'lex.8.t':"Paired vote", 'lex.8.d':"An arrangement where a member abstains from voting to offset an absent opponent, so the result isn't skewed. Counted separately: it is neither a Yea, nor a Nay, nor an absence.",
    'lex.9.t':"Bicameral (Commons + Senate)", 'lex.9.d':"The Parliament of Canada has two chambers: the House of Commons (elected members) and the Senate (appointed senators). A bill must be passed by both.",
    'lex.10.t':"House leader", 'lex.10.d':"The member responsible for organizing their party's business in the House — the conductor of the schedule and debates for their group.",
    'lex.11.t':"Whip", 'lex.11.d':"The member responsible for making sure their party's members show up for votes and follow the party line.",
    'lex.12.t':"Sponsor", 'lex.12.d':"The member or minister who introduces a bill and shepherds it through the parliamentary stages.",
    'lex.13.t':"Attendance (%)", 'lex.13.d':"The figure shown under each MP (e.g. \"attendance: 98% (169/173)\"): of the recorded votes held since they took office, the share in which the person appears as Yea, Nay or paired — i.e. present to vote, whatever their choice. The House does not publish official attendance; this is a proxy, not an official measure.",
    // Petitions
    'pet.sub':"The e-petitions currently open for signature, most-signed first — a snapshot of the official list",
    'pet.info':"Each petition above is reproduced as-is from the House of Commons public petitions list (ourcommons.ca), with a direct link to the page where you can sign it. The signature count is the one recorded at the snapshot — for the exact, current count, or to sign, use each card's link. Only the most recent are shown here; the full list is on ourcommons.ca.",
    // Where this data comes from
    'apropos.sources.h':"Public sources used here",
    'apropos.sources.p':"<b style=\"color:var(--ink)\">Bills</b> — LEGISinfo (parl.ca), the Parliament of Canada's official tool, bilingual, with the dates of each reading and of royal assent in both chambers.<br><b style=\"color:var(--ink)\">Members of Parliament</b> — House of Commons (ourcommons.ca), the official list of sitting members (name, riding, province, party), bilingual.<br><b style=\"color:var(--ink)\">Votes</b> — House of Commons (ourcommons.ca), the by-member breakdown of every recorded vote (Yea / Nay / paired), linked to each MP by their official identifier (PersonId).<br><b style=\"color:var(--ink)\">Attendance (%)</b> — computed from the votes above (see the Glossary); no external source.<br><b style=\"color:var(--ink)\">Licences</b> — Open Government Licence – Canada; OpenParliament terms for cross-checks.",
    'apropos.claude.p':"I can write this backend and help you deploy it when you're ready — this is exactly the kind of project where <b style=\"color:var(--ink)\">Claude Code</b> is especially useful, because it can work directly inside a repository, run sync scripts, and iterate on deployment with you.",
    // Overview page
    'apercu.composition.sub':"343 seats — live breakdown from the official roster",
    'apercu.recent.sub':"↓ Click anywhere in the white square to see the summary ↓",
    'h.petitionsrecent':"Petitions open right now",
    'apercu.petitions.sub':"Click the \u201cPetitions\u201d tab for the full list",
    'quicknav.label':"Jump to:",
    'quicknav.mission':"Our mission",
    'quicknav.composition':"Composition",
    'quicknav.projets':"Bills",
    'quicknav.quoideneuf':"What's new",
    'quicknav.petitions':"Petitions",
    'quicknav.personnes':"Who's involved",
    'quicknav.lexiqueitem':"Glossary",
    'quicknav.apropos':"Where this data comes from",
    'quicknav.ministres':"Cabinet",
    'quicknav.comparateur':"MP comparator",
    'snooze.label':"😴 Collapse",
    'mission.h':"Our mission — why this isn't just a copy of Parliament's website",
    'mission.intro':"<b>This is an independent citizen-run site built with real public data from the Parliament of Canada (LEGISinfo and the House of Commons).</b>",
    'mission.p':"Parliament's official sites (parl.ca, ourcommons.ca) are the most reliable source that exists, and this site never tries to replace them — only to make them easier to follow for someone who doesn't have time to dig through parliamentary procedure menus.",
    'mission.site.tag':"What this site tries to do",
    'mission.site.1':"Organizes everything by person: one profile, all their files",
    'mission.site.2':"Translates the jargon into plain language (see the Glossary)",
    'mission.site.3':"Lets you follow what affects you, with no judgment or verdict",
    'intro.compact.text':"Independent citizen-run site · Our mission",
    'intro.show':"😴 Show",
    'intro.hide':"😴 Collapse",
  }
};
function langFromPath(){
  try {
    const parts = location.pathname.replace(/\.html$/, '').split('/').filter(Boolean);
    return parts[0] === 'en' ? 'en' : 'fr';
  } catch (e) { return 'fr'; }
}
let currentLang = langFromPath();

function t(key){ return (translations[currentLang] && translations[currentLang][key]) || key; }

// Mémorise le HTML français d'origine de chaque élément traduit, une seule fois.
// Sans ça, un aller-retour FR→EN→FR laissait en anglais tout élément qui n'a
// pas d'entrée française explicite (le français venait du HTML inline, écrasé
// par l'anglais et jamais restauré). On restaure maintenant cet original.
const i18nOriginals = new WeakMap();
function applyLanguage(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(!i18nOriginals.has(el)) i18nOriginals.set(el, el.innerHTML);
    const entry = translations[currentLang] && translations[currentLang][key];
    el.innerHTML = (entry !== undefined) ? entry : i18nOriginals.get(el);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    const entry = translations[currentLang] && translations[currentLang][key];
    if(entry !== undefined){ el.placeholder = entry; }
  });
  syncNavHrefs();
  if(typeof appliqueTheme === 'function') appliqueTheme(); // l'infobulle du thème est bilingue
  document.body.classList.toggle('lang-en', currentLang === 'en');
  document.documentElement.lang = currentLang === 'en' ? 'en' : 'fr';
  if(typeof renderHeaderDate === 'function') renderHeaderDate(currentLang);
  if(typeof syncHead === 'function') syncHead(viewFromPath()); else document.title = t('meta.title');
  // Aria-labels that live outside data-i18n (buttons with icon-only content).
  const ariaMap = [
    ['.crumbs', 'aria.crumbs'],
    ['#backToTop', 'aria.top'],
    ['#fontMinus', 'aria.fontMinus'],
    ['#fontPlus', 'aria.fontPlus'],
    ['#challengeMoreBtn', 'aria.challengeMore'],
    ['a.footer-gh[href*="facebook"]', 'aria.fb'],
    ['a.footer-coffee', 'aria.coffee'],
  ];
  ariaMap.forEach(([sel, key])=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.setAttribute('aria-label', t(key));
      if (el.hasAttribute('title') && (key === 'aria.challengeMore' || key === 'aria.top')) el.setAttribute('title', t(key));
    });
  });
  const ham = document.getElementById('hamburgerBtn');
  if (ham) {
    const open = ham.getAttribute('aria-expanded') === 'true';
    ham.setAttribute('aria-label', t(open ? 'aria.menuClose' : 'aria.menu'));
  }

  // Re-render dynamic lists so their JS-generated buttons pick up the new language
  // Chaque rendu est isolé : une donnée inattendue qui casse l'un n'empêche plus les
  // autres (ni la traduction du reste de la page). L'erreur reste visible en console.
  const essai = (f) => { try { f(); } catch (e) { console.error('[applyLanguage]', e); } };
  essai(() => renderHemicycle());
  essai(() => renderPartyFilters());
  essai(() => renderMinistres(document.getElementById('searchMinistres').value));
  essai(() => renderStatusFilters());
  essai(() => renderStepFilters());
  essai(() => updateSortToggleLabel());
  essai(() => updateMotionsToggleLabel()); essai(() => updatePetitionsToggleLabel());
  essai(() => updateMinistresSortLabel());
  essai(() => renderAccountBox());
  essai(() => renderFlagBox());
  essai(() => renderAdminFlagCounts());
  essai(() => renderComparateurSelects());
  essai(() => renderComparateurTable());
  essai(() => renderBills());
  essai(() => renderDeputes(document.getElementById('searchMinistres').value));
  essai(() => renderVotes());
  essai(() => renderApercuBills()); essai(() => renderApercuStats()); essai(() => renderPageBandCounts());
  essai(() => renderApercuPetitions());
  essai(() => renderNews());
  essai(() => renderSittings());
  essai(() => renderChallenged());
  essai(() => renderProvinceNetwork());
  essai(() => renderTicker());
  essai(() => renderLexique());
  essai(() => updateChamberLabels());
  essai(() => setChamber(chamberView));
  essai(() => setVoteChamber(voteChamber));
  essai(() => renderJournal());
  document.querySelectorAll('.snooze-pill').forEach(pill=>{
    // La pastille de l'intro compacte (#introCompact) n'a pas de <span> imbriqué
    // comme les autres — sans ce repli, ça plantait ici et bloquait tout le
    // reste du chargement de la page (y compris l'authentification).
    const isCollapsed = pill.classList.contains('snoozed');
    const labelSpan = pill.querySelector('span') || pill;
    labelSpan.textContent = isCollapsed ? (currentLang==='en' ? '😴 Show' : '😴 Afficher') : (currentLang==='en' ? '😴 Collapse' : '😴 Réduire');
  });
}

// La bascule FR/EN est un vrai lien (href = la page équivalente dans l'autre
// langue, lisible par les robots). Clic simple : on bascule sans recharger ;
// Ctrl/Cmd/Maj-clic : le navigateur ouvre le lien normalement.
document.getElementById('langToggle').addEventListener('click', (e)=>{
  if(!isPlainLeftClick(e)) return;
  e.preventDefault();
  const view = viewFromPath();
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  const url = pathForView(view, currentLang) + location.search;
  history.pushState({ view, lang: currentLang }, '', url);
  applyLanguage();
});

/* ---------------- DATA ---------------- */

// Couleurs des partis fédéraux (teintes usuelles associées à chaque parti).
const partyColors = { LPC:'#D71920', CPC:'#1A4782', BQ:'#33B2CC', NDP:'#F58220', GPC:'#3D9B35', IND:'#8a8f99', VAC:'#d4d0c8' };

/* ÉTIQUETTES RÉPÉTÉES — « Projet de loi émanant d'un député », les partis, les
   provinces : les mêmes objets bilingues, recopiés 187 ou 337 fois dans les
   données. Le build ne garde qu'un rang par ligne et met les valeurs dans DICTS
   (scrapers/build-frontend-data.js, `dictify`). On les remet en place ICI, une
   fois, avant tout rendu : le reste du script voit les objets comme avant. */
function rehydrate(name){
  if(typeof DICTS === 'undefined') return;
  const put = (rows, field, table) => {
    if(!rows || !table) return;
    for(const r of rows) if(typeof r[field] === 'number') r[field] = table[r[field]];
  };
  if(name === 'bills'){
    put(bills, 'type', DICTS.types);
    put(bills, 'latestActivity', DICTS.activities);
    put(bills, 'sponsorParty', DICTS.parties);
  }
  if(name === 'people'){
    put(deputes, 'party', DICTS.parties);
    put(deputes, 'province', DICTS.provinces);
    put(senators, 'group', DICTS.groups);
    put(senators, 'province', DICTS.senateProvinces);
    put(senators, 'appointedBy', DICTS.appointers);
  }
}

/* TÉMOINS (« cookies ») — Google Analytics en dépose, donc il ne part qu'après un
   oui explicite (Loi 25). Le chargeur est dans le <head> de la page ; ici on ne
   fait que poser la question et retenir la réponse, sur l'appareil seulement.
   Refuser n'enlève rien au site : la mesure de Vercel, elle, est sans témoin. */
const TEMOINS_CLE = 'dossiercanada:temoins';
function reponseTemoins(){
  try{ return localStorage.getItem(TEMOINS_CLE); }catch(e){ return null; }
}
function afficherBandeTemoins(){
  const el = document.getElementById('temoinsBande');
  if(!el) return;
  // Écouteurs posés ICI, en JavaScript : un attribut onclick dépend d'une
  // fonction globale et se tait sans rien dire si quoi que ce soit l'empêche.
  const oui = document.getElementById('temoinsOui');
  const non = document.getElementById('temoinsNon');
  if(oui && !oui.dataset.lie){ oui.dataset.lie = '1'; oui.addEventListener('click', () => repondreTemoins(true)); }
  if(non && !non.dataset.lie){ non.dataset.lie = '1'; non.addEventListener('click', () => repondreTemoins(false)); }
  // Pas de réponse = on demande. Une réponse, quelle qu'elle soit = on se tait.
  el.hidden = !!reponseTemoins();
}
// Refuser ne doit pas seulement empêcher la suite : les témoins déjà déposés
// (visite précédente où on avait accepté) sont effacés, sur le domaine et sur
// son parent — c'est là que Google Analytics les pose.
function effacerTemoinsMesure(){
  const hote = location.hostname;
  const domaines = ['', hote, '.' + hote, '.' + hote.split('.').slice(-2).join('.')];
  for(const c of document.cookie.split(';')){
    const nom = c.split('=')[0].trim();
    if(!/^_ga/.test(nom)) continue;
    for(const d of domaines){
      document.cookie = nom + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
    }
  }
}
function repondreTemoins(oui){
  try{ localStorage.setItem(TEMOINS_CLE, oui ? 'oui' : 'non'); }catch(e){}
  if(oui && typeof window.chargerMesure === 'function') window.chargerMesure();
  else if(!oui) effacerTemoinsMesure();
  const el = document.getElementById('temoinsBande');
  if(el) el.hidden = true;
}
// Retirer son accord doit être aussi simple que de le donner : un lien en pied
// de page repose la question. Un « oui » déjà chargé ne s'annule qu'au prochain
// chargement de page — on le dit plutôt que de faire semblant.
function rouvrirTemoins(){
  try{ localStorage.removeItem(TEMOINS_CLE); }catch(e){}
  const el = document.getElementById('temoinsBande');
  if(el){ el.hidden = false; el.scrollIntoView({ block: 'nearest' }); }
}

/* DONNÉES PAR ONGLET — le noyau data/site-data.js (34 Ko) est chargé par toutes
   les pages ; les jeux lourds attendent l'onglet qui les affiche. Un visiteur du
   lexique ne télécharge plus les 187 projets ni les 174 votes.
   Les fichiers REMPLISSENT les tableaux déclarés vides par le noyau : `bills`,
   `deputes`… gardent leur identité, donc rien d'autre dans ce script ne change. */
const DATA_FILES = { bills: '/data/d-bills.js', people: '/data/d-people.js', votes: '/data/d-votes.js' };
const VIEW_DATA = {
  apercu: ['bills'], projets: ['bills'], ministres: ['people'],
  cabinet: ['people', 'bills'], votes: ['votes'], lexique: [], bd: [],
};
const dataLoaded = {}, dataLoading = {};
const hasData = (name) => dataLoaded[name] === true;
function ensureData(names){
  return Promise.all((names || []).map(name => {
    if(dataLoaded[name]) return Promise.resolve();
    if(!dataLoading[name]) dataLoading[name] = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = DATA_FILES[name];
      el.onload = () => { dataLoaded[name] = true; rehydrate(name); buildIndexes(); resolve(); };
      el.onerror = () => { dataLoading[name] = null; reject(new Error('données « ' + name + ' » indisponibles')); };
      document.head.appendChild(el);
    });
    return dataLoading[name];
  }));
}
// Charge ce qu'un onglet affiche, puis redessine. Sans effet s'il est déjà chargé.
function ensureViewData(view){
  const needs = VIEW_DATA[view] || [];
  if(needs.every(hasData)) return Promise.resolve(false);
  return ensureData(needs).then(() => { renderAll(); return true; })
    .catch(e => { console.error('[données]', e); return false; });
}

/* ADRESSES OFFICIELLES — LEGISinfo et la Chambre les forment à partir de
   l'identifiant et de la session : on les déduit au lieu de recopier 76 Ko de
   liens dans les données. Le build vérifie la déduction lien par lien et garde
   l'adresse en donnée dès qu'elle s'en écarte : `url` passée = toujours elle. */
const urlLang = () => (currentLang === 'en' ? 'en' : 'fr');
const pickUrl = (o) => (o ? (currentLang === 'en' ? (o.en ?? o.fr) : (o.fr ?? o.en)) : null);
const memberUrl = (id, url) => pickUrl(url) || `https://www.ourcommons.ca/members/${urlLang()}/${id}`;
const billUrl = (b) => pickUrl(b.url)
  || `https://www.parl.ca/legisinfo/${currentLang === 'en' ? 'en/bill' : 'fr/projet-de-loi'}/${SESSION}/${String(b.num).toLowerCase()}`;
const senatorUrl = (s) => pickUrl(s.url)
  || `https://sencanada.ca/${currentLang === 'en' ? 'en/senators' : 'fr/senateurs'}/${s.slug}/`;
const voteUrl = (v) => pickUrl(v.url)
  || `https://www.ourcommons.ca/members/${urlLang()}/votes/${String(SESSION).replace('-', '/')}/${v.number}`;
// Texte lisible sur une bulle colorée : noir si le fond est clair, blanc s'il est foncé.
// Couleur de texte lisible sur un fond donné (couleurs de parti, de groupe…).
// ⚠️ Renvoyait var(--ink) pour les fonds clairs. Ça marchait tant que --ink était
// noir ; en thème sombre --ink s'éclaircit et l'orange néo-démocrate se retrouvait
// avec du texte crème dessus, à 2,25 de contraste. Le fond, lui, ne change pas
// avec le thème : sa couleur de texte ne doit pas en changer non plus. D'où
// --on-candy, sombre dans les deux thèmes.
function textOn(hex){
  if(!hex || hex[0] !== '#') return 'var(--on-candy)';
  let c = hex.slice(1);
  if(c.length === 3) c = c.split('').map(x=>x+x).join('');
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16);
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 150 ? 'var(--on-candy)' : '#fff';
}

// Hémicycle : les effectifs viennent du roster `deputes` (ourcommons.ca),
// pas d'un tableau figé — sinon le graphique diverge dès qu'un siège change.
// 343 = nombre de sièges de la Chambre (redécoupage 2023) ; les vacances
// apparaissent comme « Vacant » quand occupied < 343.
const HOUSE_SEATS = 343;
const SEAT_PARTY_META = {
  LPC: { label:'Parti libéral du Canada (gouvernement)', labelEn:'Liberal Party of Canada (government)' },
  CPC: { label:'Parti conservateur du Canada (opposition officielle)', labelEn:'Conservative Party of Canada (official opposition)' },
  BQ:  { label:'Bloc Québécois', labelEn:'Bloc Québécois' },
  NDP: { label:'Nouveau Parti démocratique', labelEn:'New Democratic Party' },
  GPC: { label:'Parti vert du Canada', labelEn:'Green Party of Canada' },
  IND: { label:'Indépendant·e·s', labelEn:'Independents' },
  VAC: { label:'Sièges vacants', labelEn:'Vacant seats' },
};
function buildSeatsFromDeputes(){
  const counts = {};
  (typeof deputes !== 'undefined' && deputes ? deputes : []).forEach(d=>{
    const code = (d.party && d.party.code) || d.partyCode || 'IND';
    counts[code] = (counts[code] || 0) + 1;
  });
  const order = ['LPC','CPC','BQ','NDP','GPC','IND'];
  const seats = order.filter(p => counts[p]).map(p => ({
    party: p,
    label: (SEAT_PARTY_META[p] || {}).label || p,
    labelEn: (SEAT_PARTY_META[p] || {}).labelEn || p,
    n: counts[p],
  }));
  // Autres codes de parti imprévus
  Object.keys(counts).forEach(p=>{
    if (!order.includes(p)) seats.push({
      party: p,
      label: (SEAT_PARTY_META[p] || {}).label || p,
      labelEn: (SEAT_PARTY_META[p] || {}).labelEn || p,
      n: counts[p],
    });
  });
  const occupied = seats.reduce((a,s)=>a+s.n, 0);
  const vacant = Math.max(0, HOUSE_SEATS - occupied);
  if (vacant) seats.push({ party:'VAC', label:SEAT_PARTY_META.VAC.label, labelEn:SEAT_PARTY_META.VAC.labelEn, n:vacant });
  return seats;
}


/* Les données (bills, votes, deputes, ministers, senators, senateVotes, petitions,
   lobbying, sittingDays, officeholderNames) ne sont PLUS inline : elles vivent dans
   data/site-data.js, chargé juste avant ce script et partagé (en cache) par toutes
   les pages. Voir scrapers/build-frontend-data.js. */

/* ---------------- STORAGE (favoris) ---------------- */
// `window.storage` était une API propre à l'environnement Claude.ai, pas une vraie
// fonction de navigateur — elle n'existe plus une fois le site hébergé ailleurs.
// Remplacée ici par un vrai stockage local (localStorage), avec la même interface
// (.get(key) -> {value} | null, .set(key, value)) pour ne pas toucher aux appels
// existants plus bas. Préfixe pour éviter les collisions avec d'autres clés.
window.storage = {
  async get(key){
    let value = localStorage.getItem('dossiercanada:' + key);
    if (value === null) {
      const legacy = localStorage.getItem('dossierquebec:' + key);
      if (legacy !== null) {
        localStorage.setItem('dossiercanada:' + key, legacy);
        value = legacy;
      }
    }
    return value === null ? null : { value };
  },
  async set(key, value){
    localStorage.setItem('dossiercanada:' + key, value);
  }
};

let followed = {};
async function loadFollowed(){
  try{
    const res = await window.storage.get('followed-ministers');
    followed = res ? JSON.parse(res.value) : {};
  }catch(e){ followed = {}; }
}
async function toggleFollow(name){
  followed[name] = !followed[name];
  if(currentUser){
    await upsertFollow('minister', name, followed[name]);
  } else {
    try{ await window.storage.set('followed-ministers', JSON.stringify(followed)); }catch(e){}
  }
  // En vue combinée (voir toggleMinistresSort), un ministre peut être affiché
  // dans la même grille qu'un·e député·e — les deux fonctions de rendu doivent
  // donc rafraîchir ensemble, peu importe qui a déclenché le suivi.
  const kw = document.getElementById('searchMinistres').value;
  renderMinistres(kw);
  renderDeputes(kw);
}

let followedDeputes = {};
async function loadFollowedDeputes(){
  try{
    const res = await window.storage.get('followed-deputes');
    followedDeputes = res ? JSON.parse(res.value) : {};
  }catch(e){ followedDeputes = {}; }
}
async function toggleFollowDepute(id){
  followedDeputes[id] = !followedDeputes[id];
  if(currentUser){
    await upsertFollow('depute', id, followedDeputes[id]);
  } else {
    try{ await window.storage.set('followed-deputes', JSON.stringify(followedDeputes)); }catch(e){}
  }
  const kw = document.getElementById('searchMinistres').value;
  renderMinistres(kw);
  renderDeputes(kw);
}

// Suivi des projets de loi — même mécanique que ministres/députés (localStorage
// pour les visiteurs anonymes, Supabase pour les comptes). Sert de fondation
// aux alertes courriel : la liste de qui suit quoi est ce qui permet, plus tard,
// d'envoyer un digest hebdomadaire aux bonnes personnes. Clé = l'id stable du
// projet de loi (bills[].id), stocké comme texte côté Supabase.
let followedBills = {};
async function loadFollowedBills(){
  try{
    const res = await window.storage.get('followed-bills');
    followedBills = res ? JSON.parse(res.value) : {};
  }catch(e){ followedBills = {}; }
}
async function toggleFollowBill(billId){
  followedBills[billId] = !followedBills[billId];
  if(currentUser){
    await upsertFollow('bill', String(billId), followedBills[billId]);
  } else {
    try{ await window.storage.set('followed-bills', JSON.stringify(followedBills)); }catch(e){}
  }
  renderBills();
  renderApercuBills(); renderApercuStats(); renderPageBandCounts();
}

/* ---------------- COMPTES (Supabase) ---------------- */
// Auth par lien magique (courriel) — voir scripts/supabase-schema.sql pour la
// table `follows` et ses règles de sécurité (chaque compte ne voit que ses
// propres suivis). Tant que personne n'est connecté, le suivi reste dans
// localStorage comme avant (comportement inchangé pour les visiteurs anonymes).
// ⚠️ Le client peut être NULL : si le script Supabase (CDN jsdelivr) ne charge pas,
// « supabase.createClient » levait une ReferenceError au chargement et TOUT le script
// s'arrêtait — page vide, pour les visiteurs comme pour le robot de Google. Les
// comptes sont un plus : le site doit s'afficher sans eux. Chaque usage est gardé.
const supabaseClient = (() => {
  try {
    if (typeof supabase === 'undefined' || !supabase.createClient) return null;
    return supabase.createClient(
      'https://vbxhwckbnanhuvrotnwo.supabase.co',
      'sb_publishable_7KyGACnQnNY1Wn6Yyv96TA_yglSTHGO'
    );
  } catch (e) { console.error('Supabase indisponible :', e); return null; }
})();
let currentUser = null;

async function upsertFollow(personType, personKey, isFollowed){
  if(!currentUser) return;
  // Supabase ne "throw" pas pour une erreur de requête (RLS refusée, etc.) —
  // elle revient dans `error` sur la réponse normale. Le try/catch seul ne
  // suffit donc pas : il faut vérifier `error` explicitement, sinon un échec
  // silencieux laisse croire que le suivi a été enregistré alors que non.
  try{
    let error;
    if(isFollowed){
      ({ error } = await supabaseClient.from('follows').upsert(
        { user_id: currentUser.id, person_type: personType, person_key: personKey },
        { onConflict: 'user_id,person_type,person_key' }
      ));
    } else {
      ({ error } = await supabaseClient.from('follows').delete()
        .eq('user_id', currentUser.id).eq('person_type', personType).eq('person_key', personKey));
    }
    if(error) console.error('Supabase follow sync error:', error);
  }catch(e){ console.error('Supabase follow sync failed:', e); }
}

async function loadFollowsFromSupabase(){
  if(!currentUser) return;
  const { data, error } = await supabaseClient.from('follows')
    .select('person_type, person_key').eq('user_id', currentUser.id);
  if(error){ console.error(error); return; }
  followed = {};
  followedDeputes = {};
  followedBills = {};
  for(const row of (data || [])){
    if(row.person_type === 'minister') followed[row.person_key] = true;
    else if(row.person_type === 'depute') followedDeputes[row.person_key] = true;
    else if(row.person_type === 'bill') followedBills[row.person_key] = true;
  }
}

// Demandes d'explication de la personne connectée (pour l'état ✓ sur les fiches).
let myFlaggedBills = {};
async function loadMyFlagsFromSupabase(){
  if(!currentUser){ myFlaggedBills = {}; return; }
  const { data, error } = await supabaseClient.from('bill_flags').select('bill_id').eq('user_id', currentUser.id);
  if(error){ console.error(error); return; }
  myFlaggedBills = {};
  for(const row of (data || [])) myFlaggedBills[row.bill_id] = true;
}

async function signInWithMagicLink(email){
  if(!supabaseClient) return { code: 'unavailable' };
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname }
  });
  return error;
}

async function signOutUser(){
  if(!supabaseClient) return;
  await supabaseClient.auth.signOut();
}

async function handleMagicLinkClick(){
  const input = document.getElementById('accountEmailInput');
  const note = document.getElementById('accountStatusNote');
  const btn = document.getElementById('magicLinkBtn');
  const isEn = currentLang === 'en';
  const email = input ? input.value.trim() : '';
  if(!email || !note || !btn) return;
  // Désactivé tout de suite pour éviter les clics multiples (donc plusieurs
  // courriels envoyés) pendant que la requête est en cours.
  btn.disabled = true;
  note.textContent = isEn ? 'Sending…' : 'Envoi en cours…';
  const error = await signInWithMagicLink(email);
  if(error){
    btn.disabled = false;
    if(error.code === 'unavailable'){
      note.textContent = isEn
        ? 'Sign-in is temporarily unavailable. What you follow stays saved on this device.'
        : 'Connexion momentanément indisponible. Vos suivis restent enregistrés sur cet appareil.';
    } else if(error.code === 'over_email_send_rate_limit'){
      note.textContent = isEn
        ? 'A link was already sent recently — check your inbox, or wait a bit before trying again.'
        : 'Un lien a déjà été envoyé récemment — vérifiez votre boîte courriel, ou attendez un peu avant de réessayer.';
    } else {
      note.textContent = isEn ? 'Something went wrong. Try again.' : 'Une erreur est survenue. Réessayez.';
    }
  } else {
    btn.textContent = isEn ? '✓ Link sent' : '✓ Lien envoyé';
    note.textContent = isEn ? `Check your inbox (${email}) for the sign-in link.` : `Vérifiez votre boîte courriel (${email}) pour le lien de connexion.`;
  }
}

function renderAccountBox(){
  const box = document.getElementById('accountBox');
  if(!box) return;
  const isEn = currentLang === 'en';
  if(currentUser){
    const displayName = (currentUser.email || '').split('@')[0] || currentUser.email;
    box.innerHTML = `
      <div class="account-row">
        <span>${isEn ? 'Signed in as' : 'Connecté·e comme'} <span class="account-email">${displayName}</span></span>
        <button class="account-btn" onclick="signOutUser()">${isEn ? 'Sign out' : 'Se déconnecter'}</button>
      </div>
      <div class="account-note">${isEn ? 'The ministers and MPs you follow are now synced to your account, across devices.' : 'Les ministres et député·e·s que vous suivez sont maintenant synchronisés à votre compte, entre tous vos appareils.'}</div>
    `;
  } else {
    box.innerHTML = `
      <div class="account-row">
        <input type="email" id="accountEmailInput" placeholder="${isEn ? 'Your email' : 'Votre courriel'}">
        <button class="account-btn" id="magicLinkBtn" onclick="handleMagicLinkClick()">${isEn ? 'Send magic link' : 'Envoyer un lien de connexion'}</button>
      </div>
      <div class="account-note" id="accountStatusNote">${isEn ? 'Sign in to sync the ministers and MPs you follow across devices.' : 'Connectez-vous pour synchroniser les ministres et député·e·s que vous suivez entre vos appareils.'}</div>
    `;
  }
}

async function initAuth(){
  if(!supabaseClient){ renderAccountBox(); renderFlagBox(); renderAdminFlagCounts(); return; }
  // `renderAccountBox()` est toujours appelé dans un `finally` — si le
  // chargement des suivis échoue (réseau, etc.), la barre de compte doit
  // quand même s'afficher plutôt que de rester vide.
  try{
    const { data: { session } } = await supabaseClient.auth.getSession();
    currentUser = session?.user ?? null;
    if(currentUser){ await loadFollowsFromSupabase(); await loadMyFlagsFromSupabase(); }
  }catch(e){
    console.error('initAuth failed:', e);
  }finally{
    renderAccountBox();
    renderFlagBox();
    renderAdminFlagCounts();
  }

  supabaseClient.auth.onAuthStateChange(async (event, newSession) => {
    try{
      currentUser = newSession?.user ?? null;
      if(currentUser){ await loadFollowsFromSupabase(); await loadMyFlagsFromSupabase(); }
    }catch(e){
      console.error('onAuthStateChange failed:', e);
    }finally{
      renderAccountBox();
      renderFlagBox();
      renderAdminFlagCounts();
    }
    const kw = document.getElementById('searchMinistres')?.value || '';
    renderMinistres(kw);
    renderDeputes(kw);
    renderBills();
    renderApercuBills(); renderApercuStats(); renderPageBandCounts();
  });
}

/* ---------------- DEMANDES D'EXPLICATIONS (bill_flags) ---------------- */
// Voir scripts/supabase-schema-flags.sql. Contrainte unique côté base de
// données : un compte ne peut demander qu'une fois par projet de loi. Le
// numéro entré est toujours vérifié contre les vraies données `bills` avant
// d'accepter la demande — jamais de projet de loi deviné ou inventé.

const FLAG_MONTHLY_LIMIT = 10; // même limite appliquée côté serveur (RLS) — voir scripts/supabase-schema-flags.sql

async function checkMonthlyFlagCount(){
  if(!currentUser) return 0;
  const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString();
  const { count, error } = await supabaseClient.from('bill_flags')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', currentUser.id)
    .gte('created_at', thirtyDaysAgo);
  if(error){ console.error('checkMonthlyFlagCount failed:', error); return 0; }
  return count ?? 0;
}

async function renderFlagBox(){
  const box = document.getElementById('flagBox');
  if(!box) return;
  const isEn = currentLang === 'en';
  if(!currentUser){
    box.innerHTML = `
      <div class="account-note">${isEn
        ? `Sign in (Account tab) to ask a bill's sponsor for an explanation (up to ${FLAG_MONTHLY_LIMIT} requests per month, to prevent abuse). At 1,000 requests for the same bill, a public post goes up — hoping an MP agrees to open a petition.`
        : `Connectez-vous (onglet Compte) pour demander des explications sur un projet de loi (jusqu'à ${FLAG_MONTHLY_LIMIT} demandes par mois, pour éviter les abus). À 1000 demandes pour un même projet, une publication publique sera faite — dans l'espoir qu'un·e élu·e accepte d'ouvrir une pétition.`}</div>
    `;
    return;
  }

  // Vérifié côté navigateur pour un message clair — la vraie limite est
  // appliquée par une règle de sécurité côté serveur, impossible à contourner.
  const usedThisMonth = await checkMonthlyFlagCount();
  if(usedThisMonth >= FLAG_MONTHLY_LIMIT){
    box.innerHTML = `
      <div class="account-note">${isEn
        ? `You've reached your limit of ${FLAG_MONTHLY_LIMIT} requests this month. Come back later to ask about another bill.`
        : `Vous avez atteint votre limite de ${FLAG_MONTHLY_LIMIT} demandes ce mois-ci. Revenez plus tard pour demander des explications sur un autre projet de loi.`}</div>
    `;
    return;
  }

  const remaining = FLAG_MONTHLY_LIMIT - usedThisMonth;
  box.innerHTML = `
    <div class="account-note">${isEn
      ? `Enter the number of an active bill (not yet enacted) to ask its sponsor for an explanation. At 1,000 requests for the same bill, a public Facebook post goes up — hoping an MP agrees to open a petition. (${remaining} of ${FLAG_MONTHLY_LIMIT} requests left this month.)`
      : `Entrez le numéro d'un projet de loi actif (pas encore sanctionné) pour demander des explications à son parrain. À 1000 demandes pour un même projet, une publication publique sera faite sur Facebook — dans l'espoir qu'un·e élu·e accepte d'ouvrir une pétition. (${remaining} demande${remaining>1?'s':''} sur ${FLAG_MONTHLY_LIMIT} restante${remaining>1?'s':''} ce mois-ci.)`}</div>
    <div class="account-row" style="margin-top:10px;">
      <input type="text" id="flagBillNumberInput" inputmode="numeric" placeholder="${isEn ? 'Bill number (e.g. 24)' : 'Numéro du projet de loi (ex. 24)'}" oninput="checkBillNumberInput()">
      <button class="account-btn" id="flagSubmitBtn" onclick="submitBillFlag()" disabled>${isEn ? 'Ask for an explanation' : 'Demander des explications'}</button>
    </div>
    <div class="account-note" id="flagPreview"></div>
  `;
}

function checkBillNumberInput(){
  const input = document.getElementById('flagBillNumberInput');
  const preview = document.getElementById('flagPreview');
  const btn = document.getElementById('flagSubmitBtn');
  if(!input || !preview || !btn) return;
  const isEn = currentLang === 'en';
  const num = parseInt(input.value, 10);
  if(!input.value.trim() || Number.isNaN(num)){
    preview.textContent = '';
    btn.disabled = true;
    delete btn.dataset.billId;
    return;
  }
  const candidates = bills.filter(b => b.num === num && b.status !== 'sanctionne');
  if(candidates.length === 1){
    const b = candidates[0];
    preview.textContent = (isEn ? 'Bill found: ' : 'Projet de loi trouvé : ') + (isEn ? (b.titleEn || b.title) : b.title);
    btn.disabled = false;
    btn.dataset.billId = b.id;
  } else {
    preview.textContent = isEn
      ? 'No active (not yet enacted) bill found with this number.'
      : 'Aucun projet de loi actif (pas encore sanctionné) trouvé avec ce numéro.';
    btn.disabled = true;
    delete btn.dataset.billId;
  }
}

async function submitBillFlag(){
  const btn = document.getElementById('flagSubmitBtn');
  const preview = document.getElementById('flagPreview');
  const input = document.getElementById('flagBillNumberInput');
  if(!btn || !preview || !input || !currentUser) return;
  const isEn = currentLang === 'en';
  const billId = Number(btn.dataset.billId);
  if(!billId) return;
  btn.disabled = true;
  const { error } = await supabaseClient.from('bill_flags').insert({ user_id: currentUser.id, bill_id: billId });
  if(error){
    if(error.code === '23505'){
      preview.textContent = isEn ? "You've already asked for an explanation on this bill." : "Vous avez déjà demandé des explications sur ce projet de loi.";
      btn.disabled = false;
    } else {
      // Inclut le cas où la limite mensuelle est atteinte (refusée par la
      // règle de sécurité côté serveur) — on ne devine pas le message précis,
      // on relaisse renderFlagBox() vérifier le vrai décompte et l'afficher.
      console.error('bill flag insert error:', error);
      await renderFlagBox();
      return;
    }
  } else {
    preview.textContent = isEn ? '✓ Request recorded. Thanks!' : '✓ Demande enregistrée. Merci !';
    input.value = '';
    setTimeout(renderFlagBox, 1200);
  }
}

// Demande d'explication depuis la fiche d'un projet (remplace l'ancien « Suivre »).
// Demander = être averti par courriel des moments qui comptent + faire monter le
// compteur public. Une seule demande par personne et par projet (contrainte base).
async function requestExplanation(billId, btnId){
  const isEn = currentLang === 'en';
  const btn = btnId ? document.getElementById(btnId) : null;
  if(!currentUser){ goToTab('lexique'); return; } // se connecter d'abord
  if(btn) btn.disabled = true;
  const { error } = await supabaseClient.from('bill_flags').insert({ user_id: currentUser.id, bill_id: billId });
  if(error && error.code !== '23505'){
    // On ne DEVINE pas la cause : la règle RLS refuse aussi bien une session
    // expirée (auth.uid() nul) qu'un dépassement de quota. On vérifie ce qui est
    // vrai avant d'afficher un message, sinon on accuse à tort la limite.
    console.error('requestExplanation insert error:', error);
    let msg;
    try{
      const { data: s } = await supabaseClient.auth.getSession();
      if(!s || !s.session){
        msg = isEn ? 'Session expired — sign in again' : 'Session expirée — reconnectez-vous';
      } else {
        const used = await checkMonthlyFlagCount();
        msg = (used >= FLAG_MONTHLY_LIMIT)
          ? (isEn ? 'Monthly limit reached (' + used + '/' + FLAG_MONTHLY_LIMIT + ')'
                  : 'Limite mensuelle atteinte (' + used + '/' + FLAG_MONTHLY_LIMIT + ')')
          : (isEn ? 'Request failed — try again' : 'Échec de la demande — réessayez');
      }
    }catch(e){
      msg = isEn ? 'Request failed — try again' : 'Échec de la demande — réessayez';
    }
    if(btn){
      btn.disabled = false;
      btn.textContent = msg;
      btn.title = (error.message || error.code || '');   // vraie cause au survol
    }
    return;
  }
  // Succès OU doublon (23505) → dans les deux cas la demande existe bien.
  myFlaggedBills[billId] = true;
  if(btn){ btn.disabled = true; btn.classList.add('on'); btn.textContent = isEn ? '✓ Explanation requested' : '✓ Explication demandée'; }
  challengedCache = null;
  try{ renderChallenged(); }catch(e){}
}

// Réservé aux comptes listés dans la table `admins` (voir
// scripts/supabase-schema-flags.sql) — les vrais chiffres de demandes par
// projet de loi, rien d'autre que ça. Compté côté navigateur à partir des
// lignes que la politique de sécurité autorise un·e admin à voir en entier
// (tout le monde d'autre ne voit que ses propres demandes).
async function checkIsAdmin(){
  if(!currentUser) return false;
  const { data, error } = await supabaseClient.from('admins').select('user_id').eq('user_id', currentUser.id).maybeSingle();
  if(error){ console.error('checkIsAdmin failed:', error); return false; }
  return !!data;
}

// Paliers de pétition (le seuil monte via le bouton admin « Resend »).
const PETITION_TIERS = [1000, 5000, 25000];

async function renderAdminFlagCounts(){
  const container = document.getElementById('adminFlagCounts');
  if(!container) return;
  const isAdmin = await checkIsAdmin();
  if(!isAdmin){ container.innerHTML = ''; return; }

  const { data, error } = await supabaseClient.from('bill_flags').select('bill_id');
  if(error){ console.error('renderAdminFlagCounts failed:', error); container.innerHTML = ''; return; }
  // État de campagne (seuil courant + escalade en attente) — table bill_campaign.
  const { data: campData } = await supabaseClient.from('bill_campaign').select('bill_id, threshold, escalation_pending');
  const camp = {}; for(const r of (campData || [])) camp[r.bill_id] = r;

  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const counts = {};
  for(const row of (data || [])) counts[row.bill_id] = (counts[row.bill_id] || 0) + 1;
  const entries = Object.entries(counts).sort((a,b) => b[1] - a[1]);

  const rowsHtml = entries.length ? entries.map(([billId, count]) => {
    const bill = bills.find(b => b.id === Number(billId));
    const title = bill ? L(bill.title) : `#${billId}`;
    const c = camp[billId];
    const threshold = c ? c.threshold : PETITION_TIERS[0];
    const pending = c && c.escalation_pending;
    return `<div class="account-row" style="flex-wrap:wrap; gap:8px;">
      <span style="flex:1 1 180px;">${title}</span>
      <b>${count} / ${threshold}</b>
      <button class="account-btn" style="padding:4px 10px; font-size:11px;" onclick="adminResend(${billId})">${pending ? (isEn ? '↑ queued' : '↑ en file') : 'Resend ↑'}</button>
      <button class="account-btn" style="padding:4px 10px; font-size:11px;" onclick="adminReset(${billId})">Reset</button>
    </div>`;
  }).join('') : `<div class="account-note">${isEn ? 'No requests yet.' : 'Aucune demande pour l\'instant.'}</div>`;

  container.innerHTML = `
    <div class="account-box">
      <div class="account-note" style="margin-bottom:10px;"><b>${isEn ? 'Explanation requests (admin only)' : "Demandes d'explications (réservé aux admins)"}</b> — ${isEn ? 'Resend raises the petition threshold and queues an escalation email in the next digest; Reset clears the campaign.' : "Resend monte le seuil de pétition et met un courriel d'escalade dans le prochain digest ; Reset remet la campagne à zéro."}</div>
      ${rowsHtml}
    </div>
  `;
}

// Escalade (admin) : monte le seuil au palier suivant + escalation_pending → le prochain
// digest annonce « le parrain a répondu mais insuffisant ». Mutation via la RLS admin.
async function adminResend(billId){
  if(!supabaseClient) return;
  const { data } = await supabaseClient.from('bill_campaign').select('threshold').eq('bill_id', billId).maybeSingle();
  const cur = data ? data.threshold : PETITION_TIERS[0];
  const next = PETITION_TIERS.find(t => t > cur) ?? cur;
  if(next === cur && !confirm('Seuil déjà au maximum. Renvoyer quand même un courriel d\'escalade au prochain digest ?')) return;
  const { error } = await supabaseClient.from('bill_campaign').upsert(
    { bill_id: billId, threshold: next, escalation_pending: true, updated_at: new Date().toISOString() },
    { onConflict: 'bill_id' }
  );
  if(error){ alert('Erreur : ' + error.message); return; }
  alert(`Escalade posée (seuil ${cur} → ${next}). Le prochain digest l'annoncera.`);
  renderAdminFlagCounts();
}

// Reset (admin) : efface la campagne de ce projet — repart à zéro.
async function adminReset(billId){
  if(!supabaseClient) return;
  if(!confirm('Réinitialiser la campagne de ce projet (repart à zéro) ?')) return;
  const { error } = await supabaseClient.from('bill_campaign').delete().eq('bill_id', billId);
  if(error){ alert('Erreur : ' + error.message); return; }
  renderAdminFlagCounts();
}

/* ---------------- RENDER ---------------- */
const mailIconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>';
const deputesDirectoryUrl = 'https://www.ourcommons.ca/members/en/search';

let partyFilter = '';
const partyOrder = ['LPC','CPC','BQ','NDP','GPC','IND'];

function renderPartyFilters(){
  const el = document.getElementById('partyFilters');
  if(!el) return;
  const allLabel = currentLang==='en' ? 'All' : 'Tous';
  // En vue Sénat, ce ne sont pas des partis mais des groupes parlementaires.
  if(typeof chamberView !== 'undefined' && chamberView === 'senate'){
    const counts = {};
    (typeof senators !== 'undefined' ? senators : []).forEach(s => { const c = s.group.code || 'Non-affiliated'; counts[c] = (counts[c] || 0) + 1; });
    const order = ['ISG','CSG','PSG','C','GRO','Non-affiliated'].filter(c => counts[c]);
    el.innerHTML = `<span class="party-chip ${!senateGroupFilter?'active':''}" style="${!senateGroupFilter ? 'background:var(--strong); border-color:var(--strong);' : 'border-color:var(--line); color:var(--slate);'}" onclick="setSenateGroup('')">${allLabel}</span>`
      + order.map(c => {
          const col = groupColors[c] || '#8a8f99';
          const on = senateGroupFilter === c;
          return `<span class="party-chip ${on?'active':''}" style="${on ? 'background:' + col + '; border-color:' + col + ';' : '--pc:' + col + '; border-color:' + col + '66; color:var(--pc);'}" onclick="setSenateGroup('${c}')">${c} · ${counts[c]}</span>`;
        }).join('');
    return;
  }
  el.innerHTML = `<span class="party-chip ${!partyFilter?'active':''}" style="${!partyFilter ? 'background:var(--strong); border-color:var(--strong);' : 'border-color:var(--line); color:var(--slate);'}" onclick="setPartyFilter('')">${allLabel}</span>` +
    partyOrder.map(p => `
    <span class="party-chip ${partyFilter===p?'active':''}" style="${partyFilter===p ? `background:${partyColors[p]}; border-color:${partyColors[p]};` : `--pc:${partyColors[p]}; border-color:${partyColors[p]}66; color:var(--pc);`}" onclick="setPartyFilter('${p}')">${p}</span>
  `).join('');
}

function setPartyFilter(p){
  partyFilter = (partyFilter === p) ? '' : p;
  renderPartyFilters();
  // Filtre de parti actif → on retire le bloc « Conseil des ministres » (redondant :
  // les ministres sont des député·e·s et figurent déjà dans la grille) et on montre
  // simplement tous les député·e·s du parti, en ordre alphabétique.
  const showMin = !partyFilter;
  ['ministresTitle','ministresGrid','ministresInfoBox'].forEach(id => {
    const e = document.getElementById(id);
    if(e) e.style.display = showMin ? '' : 'none';
  });
  renderMinistres(document.getElementById('searchMinistres').value);
  renderDeputes(document.getElementById('searchMinistres').value);
}

let introCollapsed = false;
async function loadIntroState(){
  try{
    const res = await window.storage.get('apercu-intro-collapsed');
    introCollapsed = res ? JSON.parse(res.value) : false;
  }catch(e){ introCollapsed = false; }
  applyIntroState();
}
function applyIntroState(){
  const ib = document.getElementById('introBlock');
  const ic = document.getElementById('introCompact');
  if(ib) ib.classList.toggle('collapsed', introCollapsed);
  if(ic) ic.classList.toggle('open', introCollapsed);
}
async function toggleIntro(){
  introCollapsed = !introCollapsed;
  applyIntroState();
  try{ await window.storage.set('apercu-intro-collapsed', JSON.stringify(introCollapsed)); }catch(e){}
}

document.querySelectorAll('.quick-nav a').forEach(a=>{
  a.addEventListener('click', ()=>{
    const targetId = a.getAttribute('data-jump');
    const introTargets = ['sec-mission','sec-composition'];
    if(introTargets.includes(targetId) && introCollapsed){
      introCollapsed = false;
      applyIntroState();
      window.storage.set('apercu-intro-collapsed', JSON.stringify(false)).catch(()=>{});
    }
    requestAnimationFrame(()=>{
      const el = document.getElementById(targetId);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
});

let fontZoom = 100;
async function loadFontZoom(){
  try{
    const res = await window.storage.get('font-zoom');
    fontZoom = res ? JSON.parse(res.value) : 100;
  }catch(e){ fontZoom = 100; }
  applyFontZoom();
}
function applyFontZoom(){
  document.body.style.zoom = fontZoom + '%';
  document.getElementById('fontPct').textContent = fontZoom + '%';
  document.getElementById('fontMinus').disabled = fontZoom <= 80;
  document.getElementById('fontPlus').disabled = fontZoom >= 150;
}
async function changeFontZoom(delta){
  fontZoom = Math.max(80, Math.min(150, fontZoom + delta));
  applyFontZoom();
  try{ await window.storage.set('font-zoom', JSON.stringify(fontZoom)); }catch(e){}
}
document.getElementById('fontMinus').addEventListener('click', ()=> changeFontZoom(-10));
document.getElementById('fontPlus').addEventListener('click', ()=> changeFontZoom(10));

// THÈME SOMBRE — DÉSACTIVÉ
// La palette existe (voir :root[data-theme="sombre"] dans le CSS) mais rien ne
// la déclenche : pas de bouton, pas de suivi de la préférence système. On garde
// seulement de quoi poser l'attribut, pour pouvoir l'essayer ou le rallumer plus
// tard sans tout refaire. Tant qu'aucun choix n'est enregistré, le site est clair.
let themeChoisi = null;
function appliqueTheme(){
  const r = document.documentElement;
  if(themeChoisi) r.setAttribute('data-theme', themeChoisi);
  else r.removeAttribute('data-theme');
}
async function loadTheme(){
  try{
    const res = await window.storage.get('theme');
    const v = res ? JSON.parse(res.value) : null;
    themeChoisi = (v === 'clair' || v === 'sombre') ? v : null;
  }catch(e){ themeChoisi = null; }
  appliqueTheme();
}

let snoozedSections = {};
async function loadSnoozedSections(){
  try{
    const res = await window.storage.get('snoozed-sections');
    snoozedSections = res ? JSON.parse(res.value) : {};
  }catch(e){ snoozedSections = {}; }
  Object.keys(snoozedSections).forEach(key=>{
    if(snoozedSections[key]){
      const body = document.getElementById('body-'+key);
      const pill = document.getElementById('snooze-'+key);
      if(body && pill){
        body.classList.add('collapsed');
        pill.classList.add('snoozed');
        const labelSpan = pill.querySelector('span');
        labelSpan.textContent = currentLang==='en' ? '😴 Show' : '😴 Afficher';
      }
    }
  });
}

async function toggleSnooze(key, persist){
  const body = document.getElementById('body-'+key);
  const pill = document.getElementById('snooze-'+key);
  const isCollapsed = body.classList.toggle('collapsed');
  pill.classList.toggle('snoozed', isCollapsed);
  const labelSpan = pill.querySelector('span');
  const isEn = currentLang === 'en';
  labelSpan.textContent = isCollapsed ? (isEn ? '😴 Show' : '😴 Afficher') : (isEn ? '😴 Collapse' : '😴 Réduire');
  if(persist){
    snoozedSections[key] = isCollapsed;
    try{ await window.storage.set('snoozed-sections', JSON.stringify(snoozedSections)); }catch(e){}
  }
}

function initials(name){
  return name.split(' ').filter(w=>w[0]===w[0].toUpperCase()).slice(0,2).map(w=>w[0]).join('');
}

// Fil d'actualité fédéral : généré à partir des dernières activités RÉELLES des
// projets de loi (LEGISinfo, via data/bills.json), triées par date décroissante.
// Rien n'est inventé : chaque entrée est la dernière activité datée d'un projet.
let newsShown = 2;

// Projets « challengés » : ceux qui ont atteint le seuil de demandes d'explications.
// La source est un agrégat Supabase (fonction flag_counts) qui n'expose QUE le
// total public par projet — jamais qui a demandé quoi. Tant qu'aucun projet n'a
// atteint le seuil (ou que l'agrégat n'est pas encore activé), un état vide invite
// à participer. Mis en cache pour ne pas re-frapper Supabase à chaque rendu.
// Réseau des « Dossier{Province} » — un rond cliquable par province, sous le logo.
// Pour ajouter une province (après un fork du dépôt) : ajouter une entrée ici.
// code = texte du rond ; name = infobulle ; url = site ; color = couleur du rond.
// Réseau « Dossier » : 10 provinces d'ouest en est, 5 de chaque côté du logo.
// url = null tant que le site n'existe pas — la pastille reste éteinte et inerte
// (on n'annonce jamais un site qui n'est pas en ligne). Seule QC est active.
const provinceNetwork = [
  { code: 'BC', name: 'Colombie-Britannique', url: null, color: null },
  { code: 'AB', name: 'Alberta',              url: null, color: null },
  { code: 'SK', name: 'Saskatchewan',         url: null, color: null },
  { code: 'MB', name: 'Manitoba',             url: null, color: null },
  { code: 'ON', name: 'DossierOntario', url: 'https://www.dossierontario.ca/', color: '#C8102E' },
  { code: 'QC', name: 'DossierQuébec', url: 'https://dossierquebec.ca/', color: '#0B3D91' },
  { code: 'NB', name: 'Nouveau-Brunswick',        url: null, color: null },
  { code: 'NS', name: 'Nouvelle-Écosse',          url: null, color: null },
  { code: 'PE', name: 'Île-du-Prince-Édouard',    url: null, color: null },
  { code: 'NL', name: 'Terre-Neuve-et-Labrador',  url: null, color: null }
];
function renderTicker(){
  const el = document.getElementById('tickerTrack');
  if(!el) return;
  const isEn = currentLang === 'en';
  const items = isEn
    ? [['--yellow','45th Parliament — 1st session'],['--pink','recorded nominal votes'],['--cyan','bills tracked'],['--lime','bills challenged by citizens'],['--yellow','independent citizen-run site · real public data']]
    : [['--yellow','45e législature — 1re session'],['--pink','votes nominatifs enregistrés'],['--cyan','projets de loi suivis'],['--lime','projets challengés par les citoyen·ne·s'],['--yellow','site citoyen indépendant · vraies données publiques']];
  const seq = '&nbsp;' + items.map(([c,t]) => '<span style="color:var(' + c + ')">●</span> ' + t).join('&nbsp;&nbsp;&nbsp;') + '&nbsp;&nbsp;&nbsp;';
  el.innerHTML = '<span>' + seq + '</span><span>' + seq + '</span>';
}
function renderProvinceNetwork(){
  const elL = document.getElementById('provinceNetwork');
  const elR = document.getElementById('provinceNetworkR');
  if(!elL) return;
  const isEn = currentLang === 'en';
  const soon = isEn ? 'coming soon' : 'à venir';
  const dot = (p, cls) => p.url
    ? `<a class="pn-dot pn-live${cls}" href="${p.url}" target="_blank" rel="noopener" title="${p.name}" style="background:${p.color}" onclick="event.stopPropagation()">${p.code}</a>`
    : `<span class="pn-dot pn-off${cls}" title="${p.name} — ${soon}" aria-disabled="true">${p.code}</span>`;
  // Desktop : 5 à gauche du logo, 5 à droite. Mobile : les 10 sous le logo. Le balisage
  // est le MÊME aux deux largeurs (la 2e moitié est aussi dans la rangée de gauche,
  // marquée .pn-2) et c'est le CSS qui choisit : le pré-rendu, fait en largeur desktop,
  // correspond donc aussi au téléphone et l'en-tête ne saute plus au chargement.
  const half = Math.ceil(provinceNetwork.length / 2);
  elL.innerHTML = provinceNetwork.map((p, i) => dot(p, i >= half ? ' pn-2' : '')).join('');
  if(elR) elR.innerHTML = provinceNetwork.slice(half).map(p => dot(p, '')).join('');
}

// Paliers de challenge : compteur CONTINU (une demande par personne, à vie) — il
// ne se remet jamais à zéro. Chaque palier franchi déclenche un challenge public
// au parrain, puis le compteur poursuit sa montée vers le palier suivant.
const CHALLENGE_TIERS = [500, 1000, 2500, 5000, 25000];
const CHALLENGE_THRESHOLD = 1; // apparaît dès la 1re demande (paliers/flammes restent sur CHALLENGE_TIERS)
const PETITION_THRESHOLD = 1000; // seuil où l'on pousse pour une pétition
const nextTier = cnt => CHALLENGE_TIERS.find(t => cnt < t) ?? null; // null = tous franchis
const topTierReached = cnt => { let r = 0; for(const t of CHALLENGE_TIERS) if(cnt >= t) r = t; return r; };
let challengedCache = null;

// Partage social d'un projet challengé — accès DIRECT en un clic. X et « Copier »
// portent le texte complet ; Facebook n'affiche que l'aperçu du lien (règle FB, pas
// contournable) — le bouton reste direct quand même.
function shareChallenge(billId, count, platform, evt){
  if(evt) evt.stopPropagation();
  const isEn = currentLang === 'en';
  const b = bills.find(x => x.id === Number(billId));
  const num = b ? b.num : '';
  const title = b ? (isEn ? (b.title.en ?? b.title.fr) : (b.title.fr ?? b.title.en)) : '';
  const n = Number(count).toLocaleString(isEn ? 'en-CA' : 'fr-CA');
  const url = SITE_ORIGIN + (currentLang === 'en' ? '/en' : '/');
  const text = isEn
    ? `${n} people are challenging Bill ${num} — ${title}. Sign in to support this request:`
    : `${n} personnes contestent le projet de loi ${num} — ${title}. Connectez-vous pour appuyer cette demande :`;
  if(platform === 'x'){
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'noopener,width=600,height=520');
  } else if(platform === 'fb'){
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'noopener,width=600,height=520');
  } else {
    const full = text + ' ' + url;
    const bouton = boutonDeLEvenement(evt);
    copierTexte(full)
      .then(() => clignoteCopie(bouton, isEn, true))
      .catch(() => clignoteCopie(bouton, isEn, false));
  }
}

// ACCUSÉ DE RÉCEPTION DU COPIER-COLLER
// C'était une alert() du navigateur : une boîte modale qu'il faut fermer, pour
// annoncer la réussite d'un geste d'une demi-seconde. Le bouton se charge
// maintenant de le dire lui-même. On garde le glyphe à ✓ plutôt qu'un mot : la
// rangée ne doit pas s'élargir sous le curseur juste après un clic.
function boutonDeLEvenement(evt){
  const cible = evt && (evt.currentTarget || evt.target);
  return (cible && cible.closest) ? cible.closest('button, a') : null;
}
// L'API moderne refuse dans plusieurs cas ordinaires (permission, contexte non
// sécurisé, navigateur ancien). Le repli d'origine était un prompt() — donc une
// deuxième boîte modale, exactement ce qu'on voulait supprimer. execCommand est
// obsolète mais fonctionne là où l'autre renonce, et sans rien interrompre.
function copieDeSecours(texte){
  return new Promise((ok, ko) => {
    const ta = document.createElement('textarea');
    ta.value = texte;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed; top:-1000px; left:0; opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    let reussi = false;
    try { reussi = document.execCommand('copy'); } catch(e) { reussi = false; }
    ta.remove();
    reussi ? ok() : ko(new Error('copie impossible'));
  });
}
function copierTexte(texte){
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(texte).catch(() => copieDeSecours(texte));
  }
  return copieDeSecours(texte);
}
function clignoteCopie(btn, isEn, reussi){
  if(!btn || btn.dataset.retablir !== undefined) return; // déjà en train de clignoter
  btn.dataset.retablir = btn.innerHTML;
  btn.dataset.retablirNom = btn.getAttribute('aria-label') || '';
  btn.classList.add(reussi ? 'copie' : 'copie-echec');
  btn.innerHTML = reussi ? '✓' : '✗';
  // Le changement de nom accessible fait annoncer « Lien copié » au lecteur
  // d'écran : sans ça, le retour visuel ne serait perceptible que par la vue.
  btn.setAttribute('aria-label', reussi
    ? (isEn ? 'Link copied' : 'Lien copié')
    : (isEn ? 'Copy failed — use your browser’s address bar' : 'Copie impossible — utilisez la barre d’adresse'));
  setTimeout(() => {
    btn.innerHTML = btn.dataset.retablir;
    if(btn.dataset.retablirNom) btn.setAttribute('aria-label', btn.dataset.retablirNom);
    else btn.removeAttribute('aria-label');
    delete btn.dataset.retablir; delete btn.dataset.retablirNom;
    btn.classList.remove('copie', 'copie-echec');
  }, 1500);
}
let challengeOffset = 0;
let challengeRotating = false;
function rotateChallenged(){
  const track = document.querySelector('.challenge-track');
  if(!track || challengeRotating){ challengeOffset++; renderChallenged(); return; }
  challengeRotating = true;
  const card = track.querySelector('.challenge-card');
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
  const dist = card ? card.getBoundingClientRect().width + gap : 0;
  let finished = false;
  const done = () => {
    if(finished) return; finished = true;
    challengeOffset++;
    renderChallenged();                // nouvelle piste à translateX(0)
    challengeRotating = false;
  };
  track.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1)';
  track.style.transform = 'translateX(-' + dist + 'px)';
  track.addEventListener('transitionend', done, { once:true });
  setTimeout(done, 650);               // filet de sécurité
}
async function renderChallenged(){
  const el = document.getElementById('challengedList');
  if(!el) return;
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const seuil = CHALLENGE_THRESHOLD.toLocaleString(isEn ? 'en-CA' : 'fr-CA');
  const titleEl = document.getElementById('challengedTitle');
  const subEl = document.getElementById('challengedSub');
  if(titleEl) titleEl.textContent = isEn ? 'Challenged bills' : 'Projets challengés';
  const cbCta = document.getElementById('cbCtaLabel');
  if(cbCta) cbCta.textContent = isEn ? 'Challenge a bill' : 'Challenger un projet';
  if(subEl) subEl.textContent = isEn
    ? 'Requested by citizens — more requests = more plain-language explanations'
    : "Demandé par les citoyen·ne·s — plus de demandes = plus d'explications en clair";

  if(challengedCache === null){
    try{
      const { data, error } = await supabaseClient.rpc('flag_counts');
      challengedCache = (!error && Array.isArray(data)) ? data : [];
    }catch(e){ challengedCache = []; }
    // Le compte du filtre et les flammes des rangées dépendent de cet agrégat :
    // il arrive après le premier rendu, alors on redessine une fois.
    try{ renderStepFilters(); renderBills(); renderApercuBills(); }catch(e){}
  }

  // Projets à partir du 1er palier (500 demandes), triés par nombre décroissant.
  const ranked = challengedCache
    .map(c => ({ cnt: Number(c.cnt), bill: bills.find(b => b.id === Number(c.bill_id)) }))
    .filter(c => c.bill && c.cnt >= CHALLENGE_THRESHOLD)
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 12);

  const moreBtn = document.getElementById('challengeMoreBtn');
  if(moreBtn) moreBtn.style.display = ranked.length > 3 ? '' : 'none';
  if(ranked.length){
    const badgeColors = ['var(--cyan)','var(--lime)','var(--pink)','var(--yellow)'];
    const N = ranked.length;
    const win = [];
    for(let i = 0; i < Math.min(4, N); i++){ win.push(ranked[(challengeOffset % N + i) % N]); }
    const cards = win.map((c, i) => {
      const b = c.bill;
      const n = c.cnt.toLocaleString(isEn ? 'en-CA' : 'fr-CA');
      const nt = nextTier(c.cnt);
      const goal = nt ? nt.toLocaleString(isEn ? 'en-CA' : 'fr-CA') : null;
      const state = L(b.latestActivity) || '';
      const foot = goal
        ? (isEn ? `next tier: ${goal}` : `prochain palier : ${goal}`)
        : (isEn ? 'top tier reached' : 'dernier palier atteint');
      return `<div class="challenge-card" onclick="goToTab('projets')">
        <div class="cc-top">
          <span class="cc-num" style="background:${badgeColors[i % badgeColors.length]};">${b.num}</span>
          <span class="cc-count">🔥 ${n} ${isEn ? 'requests' : 'demandes'}</span>
        </div>
        <div class="cc-title">${L(b.title)}</div>
        <div class="cc-share">
          <button onclick="event.stopPropagation(); shareChallenge(${b.id}, ${c.cnt}, 'x', event)" aria-label="X">𝕏</button>
          <button onclick="event.stopPropagation(); shareChallenge(${b.id}, ${c.cnt}, 'fb', event)" aria-label="Facebook">FB</button>
          <button onclick="event.stopPropagation(); shareChallenge(${b.id}, ${c.cnt}, 'copy', event)">⧉</button>
        </div>
        <div class="cc-foot">${state ? state + ' · ' : ''}${foot}</div>
      </div>`;
    }).join('');
    el.innerHTML = `<div class="challenge-viewport"><div class="challenge-track">${cards}</div></div>`;
  } else {
    el.innerHTML = `<div style="background:#fff; border:3px solid var(--ink); box-shadow:5px 5px 0 var(--ink); padding:22px 18px; text-align:center; color:var(--ink);">
      <div style="font-size:26px; margin-bottom:8px;">🔎</div>
      <div style="font-size:14px; line-height:1.65; max-width:580px; margin:0 auto;">${isEn
        ? `No one has asked for explanations yet. This is where the bills the most citizens want explained will show up, ranked live. Be the first to ask for one.`
        : `Personne n'a encore demandé d'explications. C'est ici qu'apparaîtront, classés en direct, les projets que le plus de citoyen·ne·s veulent voir expliqués. Soyez la première personne à en demander une.`}</div>
      <button class="sort-toggle" style="margin-top:14px; cursor:pointer;" onclick="goToTab('projets')">${isEn ? 'Ask for an explanation →' : 'Demander une explication →'}</button>
    </div>`;
  }
}
// Prochaines séances de la Chambre des communes — depuis le calendrier officiel
// adopté (sittingDays, injecté au build). Le calendrier PRÉVU peut changer.
function renderSittings(){
  const el = document.getElementById('sittingBox');
  if(!el) return;
  if(typeof sittingDays === 'undefined' || !sittingDays.length){ el.innerHTML=''; return; }
  const isEn = currentLang === 'en';
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const upcoming = sittingDays.filter(d => d >= todayISO);
  if(!upcoming.length){ el.innerHTML=''; return; }
  const sittingToday = upcoming[0] === todayISO;

  // Regroupe les jours consécutifs en « blocs de séance » (lun–jeu/ven).
  const runs = [];
  for(const d of upcoming){
    const last = runs[runs.length-1];
    if(last && (new Date(d) - new Date(last.end)) <= 86400000*1) last.end = d;
    else runs.push({ start: d, end: d });
  }
  const loc = isEn ? 'en-CA' : 'fr-CA';
  const fmtDM = iso => new Date(iso + 'T12:00:00').toLocaleDateString(loc, { day:'numeric', month:'short' });
  const fmtFull = iso => new Date(iso + 'T12:00:00').toLocaleDateString(loc, { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const runTxt = r => r.start === r.end ? fmtDM(r.start) : `${fmtDM(r.start)}–${fmtDM(r.end)}`;
  const runsTxt = runs.slice(0, 4).map(runTxt).join(' · ');

  const headline = sittingToday
    ? (isEn ? 'The House is sitting today.' : 'La Chambre siège aujourd’hui.')
    : (isEn ? `Next sitting of the House: <b>${fmtFull(upcoming[0])}</b>` : `Prochaine séance de la Chambre : <b>${fmtFull(upcoming[0])}</b>`);
  const weeksLabel = isEn ? 'Upcoming sitting days' : 'Prochains jours de séance';
  const note = isEn
    ? 'Official calendar adopted by the House — subject to change. Committees and the Senate are not covered.'
    : 'Calendrier officiel adopté par la Chambre — sujet à changement. Les comités et le Sénat ne sont pas couverts.';
  const srcUrl = isEn ? 'https://www.ourcommons.ca/en/sitting-calendar' : 'https://www.ourcommons.ca/fr/calendrier-seances';

  el.innerHTML = `
    <div style="background:var(--card); border:3px solid var(--line); border-radius:var(--radius); padding:12px 16px; margin-bottom:14px;">
      <div style="font-size:13.5px;">📅 ${headline}</div>
      <div style="font-size:12.5px; color:var(--slate); margin-top:4px;">${weeksLabel} : ${runsTxt}</div>
      <div style="font-size:11px; color:var(--slate); opacity:.8; margin-top:4px;">${note} <a href="${srcUrl}" target="_blank" rel="noopener" style="color:var(--gold);">${isEn?'Source':'Source'}</a></div>
    </div>`;
}

function renderNews(){
  const isEn = currentLang === 'en';
  const el = document.getElementById('newsList');
  if(!el) return;
  const items = bills
    .filter(b => b.lastActivity && b.latestActivity && (b.latestActivity.fr || b.latestActivity.en))
    .slice()
    .sort((a, b) => (b.lastActivity || '').localeCompare(a.lastActivity || ''));
  const shown = items.slice(0, newsShown);
  const hasMore = newsShown < items.length;
  const moreBtn = isEn ? '+ Show more' : '+ Voir plus';
  el.innerHTML = shown.map(b => {
    const txt = isEn ? (b.latestActivity.en || b.latestActivity.fr) : (b.latestActivity.fr || b.latestActivity.en);
    return `
    <div class="news-item">
      <div class="news-date">${b.lastActivity}</div>
      <div class="news-body"><p><b>${b.num}</b> — ${txt}</p></div>
    </div>`;
  }).join('') + (hasMore ? `<button class="bill-more" style="margin-top:14px; border:none; cursor:pointer;" onclick="loadMoreNews()">${moreBtn}</button>` : '');
}
function loadMoreNews(){ newsShown += 2; renderNews(); }

// Vraies pétitions électroniques ouvertes pour signature — ourcommons.ca
// Confirmées deux fois : une première fois par un fetch direct, une seconde fois
// indépendamment par l'utilisateur qui les a copiées depuis son propre navigateur.
// (données `petitions` : data/site-data.js)

// Lobbying déclaré, par projet de loi — Commissariat au lobbying du Canada.
// (données `lobbying` : data/site-data.js)
// Chaque entrée est une communication RÉELLEMENT déclarée au registre officiel :
// on ne compte que celles dont la description nomme à la fois le numéro du projet
// ET son titre, faute de quoi on confondrait les législatures (les numéros sont
// recyclés). Détail de la méthode : scrapers/lobbying.js.

function daysBetween(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }

let petitionsShown = 3;

function renderPetitions(targetId){
  targetId = targetId || 'petitionsList';
  const el = document.getElementById(targetId);
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const fullListUrl = isEn ? 'https://www.ourcommons.ca/petitions/en/Home/Index' : 'https://www.ourcommons.ca/petitions/fr/Home/Index';
  const fullListLabel = isEn ? 'See all open petitions on ourcommons.ca →' : 'Voir toutes les pétitions ouvertes sur ourcommons.ca →';
  if(!petitions || petitions.length === 0){
    el.innerHTML = `<a class="bill-more" href="${fullListUrl}" target="_blank" rel="noopener">${fullListLabel}</a>`;
    return;
  }
  const sponsorLabel = isEn ? 'Sponsoring MP' : 'Député·e parrain';
  const signLabel = isEn ? 'View and sign on ourcommons.ca →' : 'Voir et signer sur ourcommons.ca →';
  const moreLabel = isEn ? '+ Show 3 more' : '+ Voir 3 de plus';
  const sorted = petitions.slice().sort((a,b) => b.signatures - a.signatures);
  const list = sorted.slice(0, petitionsShown);
  const hasMore = petitionsShown < sorted.length;
  el.innerHTML = list.map(p => {
    const title = L(p.keywords) || L(p.topic) || p.code;
    const cat = L(p.topic);
    const localeCount = (p.signatures || 0).toLocaleString(isEn ? 'en-CA' : 'fr-CA');
    return `
    <div class="petition-card">
      <h3>${esc(title)}</h3>
      <div class="petition-meta">
        <span style="font-family:'IBM Plex Mono',monospace; color:var(--gold)">${p.code}</span>
        ${cat ? `<span>${esc(cat)}</span>` : ''}
        <span>${sponsorLabel} : <b>${esc(p.sponsor || '—')}</b></span>
        <span>${esc(L(p.status) || '')}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; gap:10px; flex-wrap:wrap;">
        <span class="petition-count">${localeCount} signature${p.signatures === 1 ? '' : 's'}</span>
        <a class="bill-more" href="${L(p.url)}" target="_blank" rel="noopener">${signLabel}</a>
      </div>
    </div>
  `;}).join('')
    + (hasMore ? `<button class="bill-more" style="margin-top:6px; border:none; cursor:pointer;" onclick="loadMorePetitions('${targetId}')">${moreLabel}</button>` : '')
    + `<div style="margin-top:12px;"><a class="bill-more" href="${fullListUrl}" target="_blank" rel="noopener">${fullListLabel}</a></div>`;
}

function loadMorePetitions(targetId){
  petitionsShown += 3;
  renderPetitions(targetId);
}

function renderApercuPetitions(){
  renderPetitions('apercuPetitions');
}

function norm(s){
  return String(s ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[-–—']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Recherche tolérante aux traits d'union. norm() remplace « - » par une espace :
// « C-5 » devient « c 5 », si bien que taper « c5 » ne trouvait rien alors que
// « c-5 » marchait. On retente donc la comparaison sur les deux chaînes privées
// de leurs espaces — « c5 » retrouve « C-5 », « troisrivieres » retrouve
// « Trois-Rivières », « jeanpierre » retrouve « Jean-Pierre ».
// Purement additif : tout ce qui trouvait déjà trouve encore.
function matchesSearch(haystack, kw){
  if(!kw) return true;
  const h = norm(haystack);
  return h.includes(kw) || h.replace(/ /g, '').includes(kw.replace(/ /g, ''));
}

// « Trouver mon député » — code postal → circonscription (API Represent d'OpenNorth,
// CORS ouvert) → correspondance avec notre roster par nom de circonscription
// normalisé. Fonctionnalité optionnelle : si le réseau échoue, le reste du site
// (autonome, sans fetch) fonctionne quand même — la liste complète reste dessous.
// Aucune donnée inventée : on n'affiche que le·la député·e réellement associé·e.
async function findMyMp(){
  const isEn = currentLang === 'en';
  const out = document.getElementById('findMpResult');
  const raw = (document.getElementById('postalInput').value || '').toUpperCase().replace(/\s+/g,'');
  const msg = t => `<p style="font-size:12.5px; color:var(--slate); margin:4px 0 0;">${t}</p>`;
  if(!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(raw)){
    out.innerHTML = msg(isEn ? 'Please enter a valid postal code (e.g. K1A 0A6).' : 'Entrez un code postal valide (ex. K1A 0A6).');
    return;
  }
  out.innerHTML = msg(isEn ? 'Searching…' : 'Recherche…');
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  try{
    const res = await fetch(`https://represent.opennorth.ca/postcodes/${raw}/`);
    if(!res.ok) throw new Error('http ' + res.status);
    const j = await res.json();
    const reps = [...(j.representatives_centroid || []), ...(j.representatives_concordance || [])]
      .filter(r => /House of Commons/i.test(r.representative_set_name || ''));
    if(!reps.length){
      out.innerHTML = msg(isEn ? 'No MP found for this postal code.' : 'Aucun·e député·e trouvé·e pour ce code postal.');
      return;
    }
    const riding = reps[0].district_name;
    const dep = deputes.find(d => norm(d.constituency.en) === norm(riding) || norm(d.constituency.fr) === norm(riding));
    if(!dep){
      out.innerHTML = msg((isEn ? 'Riding: ' : 'Circonscription : ') + riding + (isEn ? ' — not found in the current roster.' : ' — introuvable dans le roster courant.'));
      return;
    }
    out.innerHTML = msg((isEn ? 'Your riding: ' : 'Votre circonscription : ') + '<b style="color:var(--ink)">' + L(dep.constituency) + '</b>')
      + '<div class="grid" style="margin-top:10px;">' + deputeCardFed(dep, isEn, L) + '</div>';
  }catch(e){
    out.innerHTML = msg(isEn
      ? 'Lookup unavailable (offline?). The full list of MPs is below.'
      : 'Recherche indisponible (hors ligne ?). La liste complète des député·e·s est ci-dessous.');
  }
}

let deputePage = 0, deputeLastKey = '', deputesShowAll = false;
function showAllDeputes(){ deputesShowAll = true; renderDeputes(); }
function deputeGo(delta){
  deputePage += delta;
  renderDeputes();
  const el = document.getElementById('deputesList');
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}
function toggleLegend(){
  const box = document.getElementById('deputesInfoBox');
  if(!box) return;
  const hidden = getComputedStyle(box).display === 'none';
  box.style.display = hidden ? 'block' : 'none';
  const btn = document.getElementById('legendBtn');
  if(btn) btn.classList.toggle('active', hidden);
}
function renderDeputes(filter){
  if(chamberView === 'senate') return renderSenators(filter);
  // En mode trié (fusion ministres+députés) cette grille reste vide — non utilisé
  // pour l'instant côté fédéral (le tri fusionné est masqué avec les ministres).
  if(ministresSortMode){ document.getElementById('deputesList').innerHTML = ''; return; }
  filter = filter !== undefined ? filter : (document.getElementById('searchMinistres')?.value || '');
  const f = norm(filter);
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const list = deputes.filter(d =>
    (!partyFilter || d.party.code === partyFilter) &&
    matchesSearch([d.name, L(d.constituency), d.constituency.en, L(d.province)].join(' '), f)
  ).sort((a,b) => a.name.localeCompare(b.name, 'fr'));
  // Titre : avec un filtre de parti, annoncer le parti et le compte (ministres
  // compris — ce sont des député·e·s) ; sinon le titre générique habituel.
  const titleEl = document.getElementById('deputesTitle');
  if(titleEl){
    if(partyFilter){
      const sample = deputes.find(d => d.party.code === partyFilter);
      const pName = sample ? L(sample.party) : partyFilter;
      titleEl.textContent = isEn
        ? `MPs — ${pName} (${list.length})`
        : `Les député·e·s — ${pName} (${list.length})`;
    } else {
      titleEl.textContent = isEn
        ? 'Members of the House of Commons — all parties'
        : 'Les député·e·s de la Chambre des communes — tous les partis';
    }
  }
  const el = document.getElementById('deputesList');
  const LIMIT = 11;
  const key = f + '|' + (partyFilter || '');
  if(key !== deputeLastKey){ deputesShowAll = false; deputeLastKey = key; }
  const total = list.length;
  const shown = (!deputesShowAll && total > LIMIT) ? list.slice(0, LIMIT) : list;
  const remaining = total - shown.length;
  const moreTile = remaining > 0
    ? `<a class="min-more" onclick="showAllDeputes()"><span class="min-more-n">+${remaining}</span><span class="min-more-t">${isEn ? 'See all ' + total + ' MPs →' : 'Voir les ' + total + ' députés →'}</span></a>`
    : '';
  el.innerHTML = total
    ? shown.map(d => deputeCardFed(d, isEn, L)).join('') + moreTile
    : `<div class="no-results">${isEn ? 'No results for this search.' : 'Aucun résultat pour cette recherche.'}</div>`;
  const pager = document.getElementById('deputesPager');
  if(pager) pager.innerHTML = '';
}

// Carte d'un·e député·e fédéral·e (roster ourcommons + bilan de votes précalculé
// par build-frontend-data.js). Bilingue ; le taux de présence est la part des
// scrutins auxquels la personne a pris part depuis son entrée en fonction (proxy
// d'assiduité — la Chambre ne publie pas l'assiduité directement).
function deputeCardFed(d, isEn, L){
  const color = partyColors[d.party.code] || '#8a8f99';
  const riding = L(d.constituency);
  const prov = L(d.province);
  const vr = d.votingRecord;
  const pct = (vr && vr.participationRate != null) ? Math.round(vr.participationRate * 100) : null;
  const attTxt = pct != null
    ? (isEn ? `attendance: ${pct}% (${vr.cast}/${vr.eligible})` : `présence : ${pct} % (${vr.cast}/${vr.eligible})`)
    : (isEn ? 'attendance: not available' : 'présence : non disponible');
  const attTitle = isEn
    ? 'Share of recorded votes this MP took part in (Yea/Nay/paired) since taking office — a proxy for attendance; the House does not publish attendance directly.'
    : "Part des votes nominaux auxquels ce·tte député·e a pris part (Pour/Contre/pairé) depuis son entrée en fonction — un indicateur de présence, la Chambre ne publiant pas l'assiduité directement.";
  const followKey = 'mp-' + d.id;
  const isFollowed = !!followedDeputes[followKey];
  const url = memberUrl(d.id, d.url);
  const ini = d.name.split(/\s+/).map(w => w[0] || '').slice(0,2).join('').toUpperCase();
  const profileTitle = isEn ? 'Official profile on ourcommons.ca' : 'Fiche officielle sur ourcommons.ca';
  // Avatar = icône courriel cliquable (adresse parlementaire officielle, lue sur la
  // fiche ourcommons, jamais devinée). Sans courriel : initiales → fiche officielle.
  // aria-label obligatoire : le contenu du lien est une icône SVG, donc sans nom
  // accessible un lecteur d'écran n'annonce que « lien ». Le title ne suffit pas.
  const avatar = d.email
    ? `<a class="avatar" href="mailto:${d.email}" onclick="event.stopPropagation()" title="${d.email}" aria-label="${isEn ? 'Email' : 'Écrire à'} ${d.name}">${mailIconSvg}</a>`
    : `<a class="avatar" href="${url}" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="${profileTitle}">${ini}</a>`;
  const profileLink = `<a class="vp-note" href="${url}" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="${profileTitle}">${isEn ? 'profile' : 'fiche'} ↗</a>`;
  return `
    <div class="m-card">
      <div class="top-row">
        ${avatar}
        <button class="follow-btn ${isFollowed?'on':''}" onclick="toggleFollowDepute('${followKey}')">${isFollowed ? t('btn.following') : t('btn.follow')}</button>
      </div>
      <h3>${d.honorific ? d.honorific + ' ' : ''}${d.name}</h3>
      <div class="role">${riding}${prov ? ' · ' + prov : ''}</div>
      <div class="meta-row">
        <span class="depute-party" style="background:${color}; color:${textOn(color)}">${d.party.code || '—'}</span>
        <span class="vp-note" title="${attTitle}">${attTxt}</span>
        ${profileLink}
      </div>
    </div>
  `;
}

function personCard(p){
  const isEn = currentLang === 'en';
  const isMin = p.type === 'minister';
  const name = isMin ? p.m.name : p.d.name;
  // Dans la vue combinée (classement par présence), on affiche circonscription
  // — région pour tout le monde, ministres compris, pour rester cohérent sur
  // un même pied d'égalité plutôt que de garder le titre de portefeuille.
  const minDep = isMin && p.combined ? resolveDepute(name) : null;
  const subtitle = isMin
    ? (p.combined ? (minDep ? `${minDep.riding} — ${minDep.region}` : '') : (isEn ? (p.m.roleEn||p.m.role) : p.m.role))
    : `${p.d.riding} — ${p.d.region}`;
  const party = isMin ? p.m.party : p.d.party;
  const emailDep = isMin ? (minDep || resolveDepute(name)) : p.d;
  const email = emailDep && emailDep.email;
  const mailHref = email ? 'mailto:'+email : deputesDirectoryUrl;
  const mailTitle = email ? email : (isEn ? 'Find the official contact on ourcommons.ca' : 'Trouver le contact officiel sur ourcommons.ca');
  const followKey = isMin ? name : (p.d.name + '|' + p.d.riding);
  const isFollowed = isMin ? !!followed[name] : !!followedDeputes[followKey];
  const followOnclick = isMin
    ? `toggleFollow('${name.replace(/'/g,"\\'")}')`
    : `toggleFollowDepute('${followKey.replace(/'/g,"\\'")}')`;
  const presidingNote = presidingRoleNote(name, isEn);
  const attNote = presidingNote ? presidingNote : p.att
    ? (isEn ? `attendance: ${p.att.rate}% (${p.att.participated}/${p.att.total})` : `présence : ${p.att.rate} % (${p.att.participated}/${p.att.total})`)
    : (isEn ? 'attendance: not available' : 'présence : non disponible');
  const attTitle = presidingNote
    ? (isEn ? 'The Speaker and Deputy Speakers generally do not vote while presiding a sitting, to preserve their neutrality — so a low or absent vote count does not mean they were absent.' : 'La présidence et les vice-présidences ne votent généralement pas quand elles président une séance, pour préserver leur neutralité — un faible taux ou une absence de vote ne veut donc pas dire qu\'elles étaient absentes.')
    : isEn
    ? 'Share of recorded votes this MP appears in (Yea/Nay/paired), counted since their first recorded vote — a proxy for attendance, since the House does not publish attendance directly.'
    : "Part des votes nominaux enregistrés où cette personne apparaît (Pour/Contre/pairé), comptée depuis son premier vote enregistré — un indicateur de présence, la Chambre ne publiant pas l'assiduité directement.";
  return `
    <div class="m-card">
      <div class="top-row">
        <a class="avatar" href="${mailHref}" ${email ? '' : 'target="_blank" rel="noopener"'} onclick="event.stopPropagation()" title="${mailTitle}" aria-label="${email ? (isEn ? 'Email' : 'Écrire à') : (isEn ? 'Official profile of' : 'Fiche officielle de')} ${name}">${mailIconSvg}</a>
        <button class="follow-btn ${isFollowed?'on':''}" onclick="${followOnclick}">${isFollowed ? t('btn.following') : t('btn.follow')}</button>
      </div>
      <h3>${name}</h3>
      <div class="role">${subtitle}</div>
      <div class="meta-row">
        <span class="depute-party" style="background:${partyColors[party]}; color:${textOn(partyColors[party])}">${party}</span>
        <span class="vp-note" title="${attTitle}">${attNote}</span>
      </div>
    </div>
  `;
}

function renderHemicycle(){
  const svg = document.getElementById('hemicycleSvg');
  if(!svg) return;
  const seats = buildSeatsFromDeputes();
  const total = seats.reduce((a,s)=>a+s.n,0);
  const cx=210, cy=210, rOuter=195, rInner=70, rows=10;
  // Liste ordonnée des sièges, parti par parti.
  let seatList = [];
  seats.forEach(s=>{ for(let i=0;i<s.n;i++) seatList.push(s.party); });

  // Répartit TOUS les sièges (occupés + vacants) sur les rangées, proportionnellement au
  // rayon (les rangées extérieures, plus longues, en portent davantage). L'arrondi
  // est corrigé pour que la somme égale exactement le nombre de sièges.
  const radii = [];
  for(let row=0; row<rows; row++) radii.push(rInner + (rOuter-rInner) * (row/(rows-1)));
  const wSum = radii.reduce((a,r)=>a+r,0);
  let perRow = radii.map(r=>Math.max(1, Math.round(total * r/wSum)));
  let diff = total - perRow.reduce((a,b)=>a+b,0);
  for(let k=rows-1; diff!==0; k=(k-1+rows)%rows){ const d=Math.sign(diff); perRow[k]+=d; diff-=d; }

  // Positionne chaque siège, puis trie par angle (gauche→droite) pour regrouper
  // les partis en secteurs contigus, comme dans un vrai hémicycle.
  let positions = [];
  for(let row=0; row<rows; row++){
    const r = radii[row], n = perRow[row];
    for(let i=0;i<n;i++){
      const ang = n>1 ? Math.PI*(i/(n-1)) : Math.PI/2;
      positions.push({ ang, x: cx - r*Math.cos(ang), y: cy - r*Math.sin(ang) });
    }
  }
  positions.sort((a,b)=>a.ang-b.ang);
  const seatEls = positions.map((p,i)=>{
    const color = partyColors[seatList[i]] || '#999';
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.1" fill="${color}"/>`;
  }).join('');
  svg.innerHTML = seatEls;

  const legend = document.getElementById('hemicycleLegend');
  const isEn = currentLang === 'en';
  const footNote = isEn ? 'Real count, drawn from the official list of members of the House of Commons.' : 'Décompte réel, tiré de la liste officielle des députés de la Chambre des communes.';
  legend.innerHTML = seats.map(s=>`
    <div class="row"><span class="dot" style="background:${partyColors[s.party]}"></span>${isEn ? (s.labelEn||s.label) : s.label} <b style="margin-left:auto">${s.n}</b></div>
  `).join('') + `<div style="font-size:11px; color:var(--slate); margin-top:6px; max-width:220px;">${footNote}</div>`;
}

let ministresSortMode = null; // null (ordre par défaut) | 'desc' (+ actif) | 'asc' (- actif)
function toggleMinistresSort(){
  ministresSortMode = ministresSortMode === null ? 'desc' : (ministresSortMode === 'desc' ? 'asc' : null);
  updateMinistresSortLabel();
  renderMinistres(document.getElementById('searchMinistres').value);
  renderDeputes(document.getElementById('searchMinistres').value);
}
function updateMinistresSortLabel(){
  const btn = document.getElementById('ministresSortToggle');
  if(!btn) return;
  const isEn = currentLang === 'en';
  if(ministresSortMode === 'desc') btn.textContent = isEn ? '↓ Most active first' : '↓ + actif d\'abord';
  else if(ministresSortMode === 'asc') btn.textContent = isEn ? '↑ Least active first' : '↑ - actif d\'abord';
  else btn.textContent = isEn ? 'Sort: default order' : 'Trier : ordre par défaut';
}

function sortByAttendance(list, dir){
  // La présidence et les 3 vice-présidences (voir presidingRoles) ont parfois
  // un vrai pourcentage très bas (ex. un vice-président qui vote rarement en
  // dehors de ses rares remplacements), pas juste `null` — les exclure du
  // classement seulement quand `att` est absent laissait ces personnes-là
  // se glisser dans le tri normal, tandis que celles à 0 vote (att=null)
  // étaient poussées « à la fin » peu importe la direction : en ordre
  // ascendant, ça les faisait atterrir à la position des PLUS actif·ves.
  // Il faut exclure les 4 rôles de présidence du classement au complet, pas
  // seulement selon qu'ils ont ou non une donnée calculable.
  return list.slice().sort((a,b)=>{
    const nameA = a.type === 'minister' ? a.m.name : a.d.name;
    const nameB = b.type === 'minister' ? b.m.name : b.d.name;
    const excludedA = !!presidingRoleNote(nameA, false);
    const excludedB = !!presidingRoleNote(nameB, false);
    if(excludedA && excludedB) return 0;
    if(excludedA) return 1; // toujours en dernier, peu importe la direction
    if(excludedB) return -1;
    const ra = a.att ? a.att.rate : null;
    const rb = b.att ? b.att.rate : null;
    if(ra === null && rb === null) return 0;
    if(ra === null) return 1; // pas de donnée : toujours en dernier, peu importe la direction
    if(rb === null) return -1;
    return dir === 'desc' ? rb - ra : ra - rb;
  });
}

// Carte d'un·e ministre fédéral·e (cabinet pm.gc.ca, rapproché·e du roster pour
// le parti/PersonId — voir scrapers/ministers.js). Montre le portefeuille bilingue.
function ministerCardFed(m, isEn, L, idx){
  const color = partyColors[m.party] || '#8a8f99';
  const role = L(m.role);
  const url = m.personId ? memberUrl(m.personId, m.url) : (m.url ? L(m.url) : null);
  const ini = m.name.split(/\s+/).map(w => w[0] || '').slice(0,2).join('').toUpperCase();
  const followKey = m.personId ? 'mp-' + m.personId : null;
  const isFollowed = followKey ? !!followedDeputes[followKey] : false;
  const followBtn = followKey
    ? `<button class="follow-btn ${isFollowed?'on':''}" onclick="toggleFollowDepute('${followKey}')">${isFollowed ? t('btn.following') : t('btn.follow')}</button>`
    : '';
  const minDep = (typeof deputeById !== 'undefined' && m.personId) ? deputeById.get(m.personId) : null;
  const minEmail = minDep && minDep.email ? minDep.email : null;
  const candy = ['var(--cyan)','var(--lime)','var(--pink)','var(--yellow)'][(idx || 0) % 4];
  const avatar = url
    ? `<a class="avatar" style="background:${candy}" href="${url}" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="${isEn?'Official profile on ourcommons.ca':'Fiche officielle sur ourcommons.ca'}">${ini}</a>`
    : `<span class="avatar" style="background:${candy}">${ini}</span>`;
  const emailHtml = minEmail
    ? `<a class="depute-email" href="mailto:${minEmail}" onclick="event.stopPropagation()" title="${minEmail}">${minEmail}</a>`
    : `<span class="depute-email" style="opacity:.55">${isEn?'no public email':'courriel non publié'}</span>`;
  const pmTag = m.isPM ? (isEn ? 'Prime Minister' : 'Premier ministre') : '';
  const attDep = (typeof deputeById !== 'undefined' && m.personId) ? deputeById.get(m.personId) : null;
  const attVr = attDep && attDep.votingRecord ? attDep.votingRecord : null;
  const attPct = (attVr && attVr.participationRate != null) ? Math.round(attVr.participationRate * 100) : null;
  const attTxt = attPct != null ? (isEn ? `attendance: ${attPct}% (${attVr.cast}/${attVr.eligible})` : `présence : ${attPct} % (${attVr.cast}/${attVr.eligible})`) : (isEn ? 'attendance: not available' : 'présence : non disponible');
  const attTitle = isEn ? 'Share of recorded votes this minister took part in as an MP since taking office — a proxy for attendance; ministers often pair or are away on government business.' : "Part des votes nominaux auxquels ce·tte ministre a pris part comme député·e depuis son entrée en fonction — indicateur de présence ; les ministres se font souvent pairer ou sont en fonction gouvernementale.";
  return `
    <div class="m-card">
      <div class="top-row">${avatar}${followBtn}</div>
      <h3>${m.name}</h3>
      <div class="mc-role-wrap"><span class="mc-role" style="background:${m.isPM ? 'var(--ink)' : candy}; color:${m.isPM ? 'var(--yellow)' : 'var(--ink)'}">${role}</span></div>
      <div class="meta-row">
        ${emailHtml}
        <span class="vp-note" title="${attTitle}">${attTxt}</span>
      </div>
    </div>
  `;
}

let ministresShowAll = false;
function showAllMinistres(){
  ministresShowAll = true;
  renderMinistres(document.getElementById('searchMinistres') ? document.getElementById('searchMinistres').value : '');
}
function renderMinistres(filter){
  const grid = document.getElementById('ministresGrid');
  const isEn = currentLang === 'en';
  document.getElementById('statMinistres').textContent = deputes.length;

  if(ministresSortMode){
    // Vue combinée : plus de priorité "Conseil des ministres" — tout le monde
    // (ministres + reste de l'Assemblée) sur un même pied d'égalité, classé
    // par présence. Voir toggleMinistresSort().
    document.getElementById('ministresInfoBox').style.display = 'none';
    document.getElementById('deputesTitle').style.display = 'none';
    document.getElementById('deputesInfoBox').style.display = 'none';
    const combinedTitle = document.getElementById('combinedTitle');
    combinedTitle.style.display = '';

    const f = norm(filter);
    const minList = ministers
      .filter(m => (!partyFilter || m.party===partyFilter) && matchesSearch([m.name, m.role, m.roleEn||''].join(' '), f))
      .map(m => ({ type:'minister', m, att: computeAttendance(m.name), combined: true }));
    const ministerNames = new Set(ministers.map(m => norm(m.name.replace(/\s*\([^)]*\)\s*/g,''))));
    const depList = deputes
      .filter(d => !ministerNames.has(norm(d.name)) && (!partyFilter || d.party===partyFilter)
        && matchesSearch([d.name, d.riding, d.region].join(' '), f))
      .map(d => ({ type:'depute', d, att: attendanceFromRecord(d) }));
    const combined = sortByAttendance([...minList, ...depList], ministresSortMode);

    combinedTitle.textContent = isEn
      ? `All elected members — sorted by attendance (${combined.length} shown)`
      : `Tou·te·s les élu·e·s — triés par présence (${combined.length} affiché·e·s)`;
    grid.innerHTML = combined.length
      ? combined.map(personCard).join('')
      : `<div class="no-results">${isEn ? 'No results for this search.' : 'Aucun résultat pour cette recherche.'}</div>`;
    return;
  }

  // Conseil des ministres fédéral (source pm.gc.ca — voir scrapers/ministers.js).
  // Avec un filtre de parti actif, le bloc ministres reste masqué (les ministres
  // figurent déjà dans la grille des député·e·s du parti) — voir setPartyFilter.
  const hideMin = !!partyFilter;
  document.getElementById('ministresInfoBox').style.display = hideMin ? 'none' : '';
  document.getElementById('ministresGrid').style.display = hideMin ? 'none' : '';

  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const f = norm(filter);
  const list = ministers.filter(m => (!partyFilter || m.party === partyFilter) && matchesSearch([m.name, L(m.role)].join(' '), f));
  const shown = (!ministresShowAll && list.length > 8) ? list.slice(0, 8) : list;
  const remaining = list.length - shown.length;
  const moreTile = remaining > 0
    ? `<a class="min-more" onclick="showAllMinistres()"><span class="min-more-n">+${remaining}</span><span class="min-more-t">${isEn ? 'See all ' + list.length + ' ministers →' : 'Voir les ' + list.length + ' ministres →'}</span></a>`
    : '';
  grid.innerHTML = list.length
    ? shown.map((m, i) => ministerCardFed(m, isEn, L, i)).join('') + moreTile
    : `<div class="no-results">${isEn ? 'No minister matches this search.' : 'Aucun ministre ne correspond à cette recherche.'}</div>`;
  { const ct = document.getElementById('cabinetTitle'); if(ct) ct.textContent = isEn ? `The federal Cabinet — ${ministers.length} ministers` : `Le Cabinet fédéral — ${ministers.length} ministres`; }
  document.getElementById('ministresCount2').textContent = ministers.length;
}

// Comparateur de deux ministres (voir onglet 5, item réglé une fois la
// présence réelle disponible). Pas de ligne "postes précédents" — cet item a
// été volontairement écarté (LinkedIn et les bios officielles couvrent déjà
// ça), donc pas de donnée inventée ici pour remplir cette case.
// Comparateur fédéral : deux député·e·s (ministres compris) côte à côte, choisis
// parmi tout le roster. Toutes les jointures par PersonId (jamais par nom) :
// rôle au cabinet via ministers[].personId, projets parrainés via bills[].sponsorPersonId.
// Des faits, jamais un classement.
function renderComparateurSelects(){
  const selA = document.getElementById('compareA');
  const selB = document.getElementById('compareB');
  if(!selA || !selB) return;
  const isEn = currentLang === 'en';
  const placeholder = isEn ? '— Choose an MP —' : '— Choisir un·e député·e —';
  const sorted = deputes.slice().sort((a,b) => a.name.localeCompare(b.name, 'fr'));
  const options = `<option value="">${placeholder}</option>` + sorted.map(d => `<option value="${d.id}">${d.name} (${d.party.code || '—'})</option>`).join('');
  const prevA = selA.value, prevB = selB.value;
  selA.innerHTML = options;
  selB.innerHTML = options;
  if([...selA.options].some(o=>o.value===prevA)) selA.value = prevA;
  if([...selB.options].some(o=>o.value===prevB)) selB.value = prevB;
}

function billsSponsoredBy(personId){
  return bills.filter(b => b.sponsorPersonId === personId);
}

function renderComparateurTable(){
  const container = document.getElementById('comparateurTable');
  if(!container) return;
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const idA = Number(document.getElementById('compareA').value);
  const idB = Number(document.getElementById('compareB').value);
  if(!idA || !idB){
    container.innerHTML = '';
    return;
  }
  const dA = deputeById.get(idA);
  const dB = deputeById.get(idB);
  if(!dA || !dB){ container.innerHTML = ''; return; }
  // Le tableau nomme les projets parrainés : ils ne sont pas chargés sur cette
  // page tant qu'on ne compare personne. On les demande ici, puis on redessine.
  if(!hasData('bills')) ensureData(['bills']).then(renderComparateurTable).catch(e => console.error('[données]', e));

  const roleOf = (id) => {
    const m = ministers.find(x => x.personId === id);
    if(!m) return isEn ? 'MP' : 'Député·e';
    return L(m.role);
  };
  const attCell = (d) => {
    const vr = d.votingRecord;
    if(!vr || vr.participationRate == null) return isEn ? 'Not available' : 'Non disponible';
    return `${Math.round(vr.participationRate*100)} % (${vr.cast}/${vr.eligible})`;
  };
  const billsCell = (id) => {
    if(!hasData('bills')) return isEn ? 'Loading…' : 'Chargement…';
    const list = billsSponsoredBy(id);
    if(list.length === 0) return isEn ? 'None this session' : 'Aucun cette session';
    const nums = list.slice(0,4).map(b => `<b>${b.num}</b>`).join(', ');
    return `${list.length} — ${nums}${list.length > 4 ? '…' : ''}`;
  };
  const sinceCell = (d) => d.memberSince || (isEn ? 'Not available' : 'Non disponible');
  const profileCell = (d) => `<a href="${memberUrl(d.id, d.url)}" target="_blank" rel="noopener">ourcommons.ca</a>`;
  const emailCell = (d) => d.email ? `<a href="mailto:${d.email}">${d.email}</a>` : (isEn ? 'Not available' : 'Non disponible');

  const rows = [
    [isEn?'Role':'Rôle', roleOf(idA), roleOf(idB)],
    [isEn?'Party':'Parti', `${dA.party.code || '—'} — ${L(dA.party)}`, `${dB.party.code || '—'} — ${L(dB.party)}`],
    [isEn?'Riding — province':'Circonscription — province', `${L(dA.constituency)} — ${L(dA.province)}`, `${L(dB.constituency)} — ${L(dB.province)}`],
    [isEn?'In office since':'En fonction depuis', sinceCell(dA), sinceCell(dB)],
    [isEn?'Attendance (recorded votes)':'Présence (votes nominaux)', attCell(dA), attCell(dB)],
    [isEn?'Bills sponsored':'Projets de loi parrainés', billsCell(idA), billsCell(idB)],
    [isEn?'Official email':'Courriel officiel', emailCell(dA), emailCell(dB)],
    [isEn?'Official profile':'Fiche officielle', profileCell(dA), profileCell(dB)],
  ];

  const foot = isEn
    ? 'Facts only, from official sources (ourcommons.ca, LEGISinfo) — never a ranking or a verdict.'
    : 'Des faits seulement, tirés des sources officielles (ourcommons.ca, LEGISinfo) — jamais un classement ni un verdict.';
  container.innerHTML = `
    <div class="compare-table-wrap"><table class="compare-table">
      <tr><th></th><th>${dA.name}</th><th>${dB.name}</th></tr>
      ${rows.map(([label,a,b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`).join('')}
    </table></div>
    <div style="font-size:11.5px; color:var(--slate); margin-top:8px;">${foot}</div>
  `;
}

function statusLabel(s){
  if(currentLang === 'en'){
    return s==='loi' ? 'Assented to' : s==='rejete' ? 'Defeated' : s==='proforma' ? 'Pro forma' : 'In progress';
  }
  return s==='loi' ? 'Sanctionnée' : s==='rejete' ? 'Rejetée' : s==='proforma' ? 'Pro forma' : 'En cours';
}
function statusClass(s){
  return s==='loi' ? 'status-sanctionne' : s==='rejete' ? 'status-glace' : s==='proforma' ? 'status-proforma' : 'status-encours';
}

// Fait correspondre le nom du parrain (format "Prénom Nom", voir build-frontend-data.js)
// avec les listes ministers/deputes déjà présentes sur la page, pour afficher son parti.
// Retourne null si aucune correspondance fiable n'est trouvée (jamais de supposition).
function sponsorParty(sponsorName){
  if(!sponsorName) return null;
  const target = norm(sponsorName);
  const minister = ministers.find(m => norm(m.name.replace(/\s*\([^)]*\)\s*/g,'')) === target);
  if(minister) return minister.party;
  const depute = deputes.find(d => norm(d.name) === target);
  return depute ? depute.party : null;
}

// Étapes canoniques du cycle fédéral bicaméral, dans l'ordre où un projet les
// franchit selon sa chambre d'origine (voir scrapers/bills.js). Bilingue.
const FED_STAGE_LABELS = {
  commons_first_reading:  {fr:'Communes · 1re',  en:'Commons · 1st'},
  commons_second_reading: {fr:'Communes · 2e',   en:'Commons · 2nd'},
  commons_third_reading:  {fr:'Communes · 3e',   en:'Commons · 3rd'},
  senate_first_reading:   {fr:'Sénat · 1re',     en:'Senate · 1st'},
  senate_second_reading:  {fr:'Sénat · 2e',      en:'Senate · 2nd'},
  senate_third_reading:   {fr:'Sénat · 3e',      en:'Senate · 3rd'},
  royal_assent:           {fr:'Sanction royale', en:'Royal assent'},
};
function billStages(chamber, isEn){
  const commons = ['commons_first_reading','commons_second_reading','commons_third_reading'];
  const senate  = ['senate_first_reading','senate_second_reading','senate_third_reading'];
  const seq = chamber === 'senate' ? [...senate, ...commons, 'royal_assent'] : [...commons, ...senate, 'royal_assent'];
  return seq.map(s => ({ stage: s, label: isEn ? FED_STAGE_LABELS[s].en : FED_STAGE_LABELS[s].fr }));
}

// Rendu du sommaire d'un projet de loi. On PRÉFÈRE le résumé « langage clair »
// généré par IA à partir du texte OFFICIEL (bill-ai-summaries.js), clairement
// étiqueté ; à défaut, on affiche le sommaire officiel brut (Bibliothèque du
// Parlement ou clause SOMMAIRE du texte de loi), avec un étiquetage honnête de
// la source. Partagé par la fiche de projet (billCard) et l'onglet Votes.
// TEXTES DES PROJETS, CHARGÉS À LA DEMANDE
// Le sommaire officiel et le résumé IA des 185 projets, dans les deux langues,
// pesaient 1 035 Ko sur les 3 Mo de la page — pour qu'un visiteur en lise un ou
// deux. Ils vivent maintenant dans data/bill-texts.json, récupéré au premier
// dépliage d'une fiche. Tant qu'il n'est pas là, l'emplacement affiche un mot
// d'attente ; il se remplit ensuite sans reconstruire la fiche (sinon le bloc
// lobbying qu'on vient d'ouvrir se refermerait).
let billTexts = null;
let billTextsPromise = null;
function ensureBillTexts(){
  if(billTexts) return Promise.resolve(billTexts);
  if(!billTextsPromise){
    billTextsPromise = fetch('/data/bill-texts.json')
      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)))
      .catch(() => ({}))            // hors ligne ou fichier absent : on dégrade, on ne casse pas
      .then(d => { billTexts = d || {}; return billTexts; });
  }
  return billTextsPromise;
}
function fillPendingSummaries(){
  const isEn = currentLang === 'en';
  document.querySelectorAll('.bill-sum-slot[data-pending]').forEach(el => {
    const b = bills.find(x => String(x.id) === el.dataset.bill);
    if(!b) return;
    el.innerHTML = billSummaryHtml(b, isEn);
    el.removeAttribute('data-pending');
  });
}
// Enveloppe posée par billCard : garde une cible stable à remplir plus tard.
function billSummarySlot(b, isEn){
  const attenteUtile = billTexts === null && b.state !== 'proforma';
  return `<div class="bill-sum-slot" data-bill="${b.id}"${attenteUtile ? ' data-pending="1"' : ''}>${billSummaryHtml(b, isEn)}</div>`;
}

function billSummaryHtml(b, isEn){
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const toParas = txt => txt.split(/\n\n+/).map(p => `<p>${esc(p.replace(/\n/g,' '))}</p>`).join('');
  // Rendu à puces : une ligne qui commence par « - » ou « • » devient une puce
  // (bien plus lisible qu'un pavé) ; les autres lignes restent des paragraphes.
  const toBulleted = txt => {
    const lines = txt.split(/\n+/).map(l => l.trim()).filter(Boolean);
    let html = '', bullets = [], dansPartie = false;
    const flush = () => { if(bullets.length){ html += '<ul class="bill-sum-list">' + bullets.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>'; bullets = []; } };
    // Un projet omnibus se lit partie par partie : chaque partie forme son propre bloc,
    // détaché du précédent, plutôt qu'une longue coulée de puces où l'œil se perd.
    const fermerPartie = () => { flush(); if(dansPartie){ html += '</section>'; dansPartie = false; } };
    for(const line of lines){
      if(/^[-•]\s+/.test(line)) bullets.push(line.replace(/^[-•]\s+/, ''));
      // « ## Partie 2 — Loi sur les douanes » : tête d'une partie. Le numéro passe en
      // pastille, les lois touchées restent en toutes lettres (comme les annexes d'Ontario).
      else if(/^##\s+/.test(line)) {
        fermerPartie();
        const t = line.replace(/^##\s+/, '');
        const m = t.match(/^((?:Partie|Part)\s+[\dIVX]+)\s*[—–-]\s*(.+)$/i);
        html += '<section class="bill-part">' + (m
          ? `<h5 class="bill-sum-part"><span>${esc(m[1])}</span>${esc(m[2])}</h5>`
          : `<h5 class="bill-sum-part">${esc(t)}</h5>`);
        dansPartie = true;
      }
      else { flush(); html += `<p>${esc(line)}</p>`; }
    }
    fermerPartie();
    return html;
  };

  // 0) Projet PRO FORMA : il n'y a pas de sommaire parce qu'il n'y a pas de
  //    contenu. Sans cette note, le lecteur reste devant une « Loi concernant les
  //    chemins de fer » vide et croit à un trou dans nos données — alors que le
  //    trou est dans la réalité. C'est la question qui a motivé ce bloc.
  if(b.state === 'proforma'){
    const head = `<div class="bill-sum-head">${isEn ? 'Why this bill is empty' : 'Pourquoi ce projet est vide'}</div>`;
    const body = isEn
      ? `<p>A <b>pro forma bill</b> is an opening ritual, not legislation. Before hearing the Speech from the Throne, each chamber introduces a token bill to assert that it legislates of its own accord and not at the Crown's bidding. It is never printed, never debated, never voted on.</p><p>Its title is traditional and has nothing to do with any content — there is none. The Senate's is always about railways; the Commons' is always about oaths of office.</p>`
      : `<p>Un <b>projet de loi pro forma</b> est un rituel d'ouverture, pas une loi. Avant d'écouter le discours du Trône, chaque chambre dépose un projet symbolique pour affirmer qu'elle légifère de son propre chef et non sur commande de la Couronne. Il n'est jamais imprimé, jamais débattu, jamais mis aux voix.</p><p>Son titre est traditionnel et n'a aucun rapport avec un contenu — il n'y en a pas. Au Sénat c'est toujours les chemins de fer ; aux Communes, les serments d'office.</p>`;
    return head + body;
  }

  // Textes pas encore arrivés : mot d'attente, remplacé par fillPendingSummaries().
  if(billTexts === null){
    return `<p class="src-note">${isEn ? 'Loading the summary…' : 'Chargement du résumé…'}</p>`;
  }
  const txt = billTexts[b.id] || {};

  // 1) Résumé IA (ancré dans le texte officiel), s'il existe. Format : en-tête
  //    « Ce que ça fait, en clair » + liste à puces courtes (style DossierQuébec).
  const ai = L(txt.ai);
  if(ai){
    const head = `<div class="bill-sum-head">${isEn ? 'What it does, in plain language' : 'Ce que ça fait, en clair'}</div>`;
    const note = `<p class="src-note">🤖 ${isEn
      ? 'AI-generated from the bill’s official text as introduced — may not reflect amendments adopted since.'
      : 'Généré par IA à partir du texte officiel tel que déposé — peut ne pas refléter les amendements adoptés depuis.'}</p>`;
    return head + toBulleted(ai) + note;
  }

  // 2) Repli : sommaire officiel brut.
  const st = L(txt.s);
  if(!st) return `<p><em>${isEn ? 'No official summary available for this bill.' : 'Sommaire officiel non disponible pour ce projet de loi.'}</em></p>`;
  const MAX = 900;
  let body = st, cut = false;
  if(st.length > MAX){ let i = st.lastIndexOf('\n\n', MAX); if(i < 400) i = st.lastIndexOf('. ', MAX) + 1; if(i < 400) i = MAX; body = st.slice(0, i).trim(); cut = true; }
  const srcName = txt.src === 'bill' ? (isEn ? "the bill's own text (official)" : 'le texte de loi (officiel)') : (isEn ? 'Library of Parliament, via LEGISinfo' : 'Bibliothèque du Parlement, via LEGISinfo');
  const excerpt = cut ? (isEn ? ' (excerpt; full text at the link below)' : ' (extrait ; texte complet au lien ci-dessous)') : '';
  return toParas(body) + `<p class="src-note">📘 ${isEn ? 'Official summary' : 'Sommaire officiel'} — ${srcName}${excerpt}.</p>`;
}

// Lobbying déclaré sur un projet de loi.
// Parti pris de ton, assumé : le lobbying est une activité LÉGALE et déclarée
// publiquement. On rapporte le registre officiel, on ne qualifie personne — pas
// de « pression », pas de verdict. Chaque ligne pointe vers sa fiche officielle
// pour que le lecteur vérifie lui-même. Le bloc est replié par défaut : la fiche
// de projet doit rester lisible.
// Bascule du bloc de lobbying. Toujours stopPropagation : sans ça le clic
// remonte à la fiche de projet et referme le sommaire sous les doigts du lecteur.
// On ne bascule PAS depuis le corps déplié ni depuis un lien — sinon on referme
// le bloc en plein milieu d'une lecture, ou en visant une fiche du registre.
function toggleLobbying(el, evt){
  evt.stopPropagation();
  if(evt.target.closest('a') || evt.target.closest('.lob-body')) return;
  el.classList.toggle('open');
}

function lobbyingBlock(b, isEn){
  const src = (typeof lobbying !== 'undefined' && lobbying && lobbying.bills) ? lobbying.bills[b.num] : null;
  if(!src || !src.total) return '';
  const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const id = 'lob-' + b.id;
  const nOrg = src.orgTotal || (src.orgs||[]).length;

  // Replié, on ne montre que les 5 premières organisations : sur mobile les dix
  // pastilles passaient à la ligne et le bloc fermé faisait 360 px de haut.
  // MAIS si une recherche est en cours, les organisations qui correspondent
  // passent devant et sont surlignées — sans ça, chercher « Google » sortait des
  // projets sans qu'on voie ce que Google vient y faire.
  const hit = o => billsKeyword && matchesSearch(typeof o.name === 'string' ? o.name : [o.name.fr, o.name.en].join(' '), billsKeyword);
  const chip = o => `<span class="lob-org${hit(o) ? ' match' : ''}">${esc(L(o.name))}<b>${o.n}</b></span>`;
  const ordered = (src.orgs||[]).slice().sort((a, z) => (hit(z) ? 1 : 0) - (hit(a) ? 1 : 0));
  const orgs = ordered.slice(0, 5).map(chip).join('');
  const orgsRest = ordered.slice(5).map(chip).join('');

  const items = (src.recent||[]).map(r => {
    const met = (r.dpoh||[]).map(p => esc(p.name) + (p.title ? ' — ' + esc(p.title) : '')).join(' · ');
    const inst = (r.dpoh||[]).map(p => p.institution).filter(Boolean)[0];
    const href = 'https://lobbycanada.gc.ca/app/secure/ocl/lrs/do/cmmLgPblcVw?comlogId=' + encodeURIComponent(r.comlogId);
    return `<a class="lob-item" href="${href}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
      <div class="lob-when">${esc(r.date)}${inst ? ' · ' + esc(inst) : ''}</div>
      <div class="lob-who">${esc(L(r.org))}</div>
      ${met ? `<div class="lob-met">${isEn ? 'Met with' : 'A rencontré'} : ${met}</div>` : ''}
    </a>`;
  }).join('');

  const shown = (src.recent||[]).length;
  const title = isEn ? 'Registered lobbying' : 'Lobbying déclaré';

  // Date des données, TOUJOURS visible — pas seulement une fois le bloc déplié.
  // Ce jeu est le seul que la machine ne rafraîchit pas seule : afficher « 157
  // communications » sans dire de quand ça date reviendrait à laisser croire que
  // c'est d'hier. Forme courte dans l'en-tête, date pleine dans la note.
  const stamp = (typeof lobbying !== 'undefined' && lobbying.updatedAt) ? new Date(lobbying.updatedAt) : null;
  const loc = isEn ? 'en-CA' : 'fr-CA';
  const asOfShort = stamp ? stamp.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const asOfLong = stamp ? stamp.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }) : null;
  const asOfChip = asOfShort ? `<span class="lob-asof">${isEn ? 'as of' : 'au'} ${esc(asOfShort)}</span>` : '';
  const count = isEn
    ? `${src.total} communication${src.total>1?'s':''} · ${nOrg} organization${nOrg>1?'s':''}`
    : `${src.total} communication${src.total>1?'s':''} · ${nOrg} organisation${nOrg>1?'s':''}`;
  const toggle = isEn
    ? `the ${shown} most recent +`
    : `les ${shown} plus récentes +`;
  const freshness = asOfLong
    ? (isEn
        ? ` Registry archive read on ${asOfLong}; the Commissioner republishes it about monthly, and we refresh it by hand.`
        : ` Archive du registre lue le ${asOfLong} ; le Commissariat la republie environ tous les mois, et on la rafraîchit à la main.`)
    : '';
  const note = isEn
    ? `Communications reported to the Office of the Commissioner of Lobbying that name this bill. Lobbying is a lawful, publicly registered activity — this count is a fact, not a verdict. Only communications whose description names both the bill number and its title are counted, so the real total may be higher.`
    : `Communications déclarées au Commissariat au lobbying du Canada qui nomment ce projet de loi. Le lobbying est une activité légale et publiquement enregistrée — ce décompte est un fait, pas un verdict. On ne compte que les communications dont la description nomme le numéro <em>et</em> le titre du projet : le total réel peut être plus élevé.`;

  // Le clic est capté par TOUTE la boîte, pas seulement l'en-tête : cliquer sur
  // une pastille d'organisation remontait jusqu'à la fiche de projet et refermait
  // le sommaire. On arrête donc systématiquement la propagation. Une fois ouvert,
  // un clic dans le corps (ou sur un lien) ne referme rien : on lit tranquille.
  return `<div class="lob" id="${id}" onclick="toggleLobbying(this, event)">
    <div class="lob-head">
      <span class="lob-title">${title}</span>
      <span class="lob-count">${count}</span>
      ${asOfChip}
      <span class="lob-toggle">${toggle}</span>
    </div>
    <div class="lob-orgs">${orgs}</div>
    <div class="lob-body">
      ${orgsRest ? `<div class="lob-orgs" style="margin:0 0 10px;">${orgsRest}</div>` : ''}
      ${items}
      <p class="lob-note">${note}${freshness}</p>
    </div>
  </div>`;
}

function billCard(b, ctx){
  ctx = ctx || 'full';
  const isEn = currentLang === 'en';
  // Sélecteur bilingue tolérant : accepte un objet {en,fr} ou une chaîne simple.
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const domId = 'bill-details-' + ctx + '-' + b.id;

  const title = L(b.title);
  const url = billUrl(b);
  const typeTxt = L(b.type);
  const sponsor = L(b.sponsor);
  const billLabel = isEn ? 'BILL' : 'PROJET DE LOI';
  const sponsorLabel = isEn ? 'Sponsor' : 'Parrain';
  const lastActivityLabel = isEn ? 'Last activity' : 'Dernière activité';
  const lastActivity = L(b.latestActivity) || b.lastActivity || '—';
  // « 2025-06-26 — Sanction royale » : la date ET ce qui s'est passé.
  const lastActivityFull = (b.lastActivity && L(b.latestActivity)) ? `${b.lastActivity} — ${L(b.latestActivity)}` : lastActivity;
  const chamberLabel = b.chamber === 'senate' ? (isEn ? 'Senate' : 'Sénat') : (isEn ? 'House of Commons' : 'Chambre des communes');

  const isFlagged = !!myFlaggedBills[b.id];
  // On peut demander une explication sur N'IMPORTE QUEL projet, y compris une loi
  // déjà sanctionnée : c'est souvent celle qui s'applique déjà qu'on veut
  // comprendre. Sur un projet actif, demander veut dire en plus être averti des
  // moments qui comptent (vote, adoption, rejet, sanction) ; sur un dossier clos,
  // il n'y a plus de moment à venir, alors on ne le promet pas.
  // Trois états : déconnecté (connexion requise, aucune demande anonyme possible —
  // c'est bloqué côté serveur par RLS), connecté (demander), déjà demandé.
  const canFlag = true;
  const enCours = b.state === 'encours';
  const flagBtnId = 'demand-' + ctx + '-' + b.id;
  const flagMailHint = enCours
    ? (isEn ? 'Emailed on the moments that matter (a vote, passed, defeated, enacted)' : 'Un courriel aux moments qui comptent (vote, adoption, rejet, sanction)')
    : (isEn ? 'A public explanation once enough people ask' : 'Une explication publique quand assez de personnes la demandent');
  let flagHint, flagLabel, flagOnclick = '', flagDisabled = '';
  if(!currentUser){
    flagHint = isEn ? 'Sign-in required — one request per person, no anonymous requests' : 'Connexion requise — une demande par personne, aucune demande anonyme';
    flagLabel = isEn ? '🔒 Sign in to ask' : '🔒 Se connecter pour demander';
    flagOnclick = `goToTab('lexique')`;
  } else if(isFlagged){
    flagHint = flagMailHint;
    flagLabel = isEn ? '✓ Explanation requested' : '✓ Explication demandée';
    flagDisabled = 'disabled';
  } else {
    flagHint = flagMailHint;
    flagLabel = isEn ? 'Ask for an explanation' : 'Demander une explication';
    flagOnclick = `requestExplanation(${b.id}, '${flagBtnId}')`;
  }
  const followRow = canFlag ? `<div class="bill-follow-row">
    <span class="follow-hint">${flagHint}</span>
    <button class="follow-btn ${isFlagged?'on':''}" id="${flagBtnId}" ${flagDisabled} onclick="event.stopPropagation(); ${flagOnclick}">${flagLabel}</button>
  </div>` : '';

  // Partage du projet : 𝕏 / Facebook / copier, sauf sur un appareil tactile où la
  // feuille de partage native est la bonne réponse.
  // ⚠️ `navigator.share` NE VEUT PAS DIRE « mobile ». Edge et Chrome l'exposent
  // aussi sous Windows : le seul bouton « ↗ Partager » y ouvrait le gros panneau
  // de partage de l'OS (Nearby Sharing, Teams, Outlook…) au milieu de la page.
  // Le vrai critère, c'est le pointeur : grossier + du multitouch = un doigt.
  const canNativeShare = (typeof navigator !== 'undefined' && !!navigator.share
    && typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
    && (navigator.maxTouchPoints || 0) > 0);
  const shareCtrls = canNativeShare
    ? `<button class="bill-share-btn" onclick="event.stopPropagation(); shareBill(${b.id}, 'native', event)">${isEn ? '↗ Share' : '↗ Partager'}</button>`
    : `<button class="bill-share-btn ic" onclick="event.stopPropagation(); shareBill(${b.id}, 'x', event)" aria-label="${isEn ? 'Share on X' : 'Partager sur X'}">𝕏</button>`
      + `<button class="bill-share-btn ic" onclick="event.stopPropagation(); shareBill(${b.id}, 'fb', event)" aria-label="${isEn ? 'Share on Facebook' : 'Partager sur Facebook'}">FB</button>`
      + `<button class="bill-share-btn ic" onclick="event.stopPropagation(); shareBill(${b.id}, 'copy', event)" aria-label="${isEn ? 'Copy the link' : 'Copier le lien'}">⧉</button>`;
  const shareRow = `<div class="bill-share-row">
    <span class="bill-share-label">${isEn ? 'Share:' : 'Partager :'}</span>
    ${shareCtrls}
  </div>`;

  // Timeline bicamérale : toutes les étapes canoniques, celles franchies portent
  // leur date réelle (issue de b.milestones), les autres restent en attente.
  const doneByStage = new Map((b.milestones||[]).map(m => [m.stage, m.date]));
  const timeline = billStages(b.chamber, isEn).map(s => {
    const date = doneByStage.get(s.stage);
    const style = date
      ? 'background:var(--green-soft); color:var(--on-candy);'
      : 'background:var(--paper-2); color:var(--slate); opacity:.7;';
    return `<span style="display:inline-flex; gap:5px; align-items:baseline; font-family:'IBM Plex Mono',monospace; font-size:10.5px; padding:2px 7px; border-radius:2px; ${style}">${s.label}${date?`<b>${date}</b>`:''}</span>`;
  }).join('');

  // NOTE : un bloc « votes sur ce projet » (Communes et Sénat, avec le détail
  // nominatif) vivait ici. Il était calculé pour les 185 fiches à chaque rendu et
  // JAMAIS inséré dans le HTML retourné — perdu lors de la conversion QC→fédéral,
  // comme la feuille de route. Retiré le 2026-09-10. Les votes restent visibles
  // dans la section Votes. À reconstruire ici si on veut les remettre sur la fiche.

  const reinstatedNote = b.reinstated ? ` · ${isEn ? 'reinstated from a previous session' : 'réinscrit d\'une session précédente'}` : '';

  // Pastille du parti (ou groupe du Sénat) du parrain, résolue au build par une
  // vraie clé (PersonId / roster) — absente si non résolue, jamais devinée.
  const sp = b.sponsorParty;
  let sponsorChip = '';
  if (sp) {
    const spColor = (sp.kind === 'party' ? partyColors[sp.code] : groupColors[sp.code]) || '#8a8f99';
    const spAbbr = (isEn ? sp.abbr.en : sp.abbr.fr) || sp.code;
    const spFull = (isEn ? sp.name.en : sp.name.fr) || sp.code;
    const spTip = `${spFull}${sponsor ? ` — ${sponsor}` : ''}`;
    sponsorChip = `<span class="depute-party" style="background:${spColor}; color:${textOn(spColor)}" title="${spTip.replace(/"/g, '&quot;')}">${spAbbr}</span>`;
  }

  return `
    <div class="bill" onclick="toggleBillSummary('${domId}', event)">
      <div class="head">
        <div>
          <div class="num">${billLabel} ${b.num}</div>
          <h3>${title}</h3>
          <div class="last-activity">${lastActivityLabel} : <b>${lastActivity}</b></div>
          <div class="meta">${typeTxt}${sponsor ? ` · ${sponsorLabel} : ${sponsor}` : ''}</div>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex:none; flex-wrap:wrap; justify-content:flex-end;">
          ${sponsorChip}
          <span class="status-pill ${statusClass(b.state)}">${statusLabel(b.state)}</span>
        </div>
      </div>
      ${b.omnibus ? `<div class="bill-omni-note">${isEn
        ? `<b>Omnibus bill.</b> It changes several different acts, one per part (${b.omnibus.parts} parts${b.omnibus.divisions ? `, ${b.omnibus.divisions} divisions` : ''}). The title names only some of them, so the summary below goes part by part.`
        : `<b>Projet omnibus.</b> Il modifie plusieurs lois différentes, une par partie (${b.omnibus.parts} parties${b.omnibus.divisions ? `, ${b.omnibus.divisions} sections` : ''}). Le titre n'en nomme qu'une partie : le résumé ci-dessous va donc partie par partie.`}</div>` : ''}
      <div class="bill-meta-top">${sponsor ? `${sponsorLabel} : ${sponsor} · ` : ''}${chamberLabel} · ${typeTxt}${reinstatedNote}</div>
      <div class="bill-stages">${timeline}</div>
      ${followRow}
      <div class="expand-hint" id="hint-${domId}">${isEn ? 'View summary & details' : 'Voir le sommaire et les détails'}</div>
      <div class="bill-summary" id="${domId}">
        <div class="bill-cols">
          <div class="bill-col-main">${billSummarySlot(b, isEn)}</div>
          <aside class="bill-col-side">
            <div class="bill-side-label">${lastActivityLabel}</div>
            <div class="bill-side-box">${lastActivityFull}</div>
            <a class="bill-cta" href="${url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${isEn ? 'Read the full text on LEGISinfo →' : 'Voir le texte complet sur LEGISinfo →'}</a>
            ${shareRow}
          </aside>
        </div>
        ${lobbyingBlock(b, isEn)}
      </div>
    </div>
  `;
}

// Bascule des votes d'un projet : vue compacte (par défaut) ↔ vue détaillée avec
// les + pour voir qui a voté quoi. Un seul + en haut, plutôt qu'un + par ligne.
function toggleBillVotes(id){
  const compact = document.getElementById(id + '-compact');
  const detailed = document.getElementById(id + '-detailed');
  const plus = document.getElementById('plus-' + id);
  if(!compact || !detailed) return;
  const opening = detailed.style.display === 'none';
  detailed.style.display = opening ? '' : 'none';
  compact.style.display = opening ? 'none' : '';
  if(plus) plus.textContent = opening ? '−' : '+';
}

// Bascule le détail d'un vote dans l'onglet Votes (liste compacte) : montre/cache
// la ventilation « qui a voté quoi » sous la ligne du vote.
function toggleVoteDetail(id){
  const d = document.getElementById(id + '-detail');
  const plus = document.getElementById('plus-' + id);
  if(!d) return;
  const opening = d.style.display === 'none';
  d.style.display = opening ? '' : 'none';
  if(plus) plus.textContent = opening ? '−' : '+';
}

function toggleBillSummary(domId, evt){
  if(evt) evt.stopPropagation();
  const el = document.getElementById(domId);
  const hint = document.getElementById('hint-'+domId);
  const isOpen = el.classList.toggle('open');
  hint.textContent = isOpen ? t('btn.hideSummary') : t('btn.viewSummary');
}

let billsStatusFilter = '';
let billsStepFilter = null;
// Ne garder que les projets sur lesquels du lobbying est déclaré (50 sur 185 au
// 2026-09). Vit à côté du filtre de chambre : c'est une autre façon de trancher
// la même liste.
let billsLobbyFilter = false;
let billsOmnibusFilter = false;
let billsChallengeFilter = false;
// Projets challengés = ceux qui ont au moins une demande d'explication. La source
// est l'agrégat Supabase flag_counts (challengedCache), chargé par renderChallenged :
// tant qu'il n'est pas là, le filtre ne s'affiche pas plutôt que d'annoncer 0.
function challengedIds(){
  const ids = new Set();
  for(const c of (challengedCache || [])) if(Number(c.cnt) >= CHALLENGE_THRESHOLD) ids.add(Number(c.bill_id));
  return ids;
}
// Nombre de demandes par projet — sert la flamme de la rangée.
function challengeCount(billId){
  for(const c of (challengedCache || [])) if(Number(c.bill_id) === Number(billId)) return Number(c.cnt);
  return 0;
}
let billsKeyword = '';
let billsSortDir = 'desc';

// Noms des organisations ayant déclaré du lobbying sur un projet — sert à la fois
// à la recherche par mot-clé et à la mise en avant dans la fiche.
function lobbyOrgNames(num){
  const src = (typeof lobbying !== 'undefined' && lobbying.bills) ? lobbying.bills[num] : null;
  if(!src) return [];
  return (src.orgs || []).map(o => o.name);
}
const billsStatusOrder = ['encours','rejete','loi'];

function renderStatusFilters(){
  const el = document.getElementById('statusFilters');
  if(!el) return;
  const allLabel = currentLang==='en' ? 'All statuses' : 'Tous les statuts';
  el.innerHTML = `<span class="status-chip ${!billsStatusFilter?'active':''}" onclick="setBillsStatusFilter('')">${allLabel}</span>` +
    billsStatusOrder.map(s=>`<span class="status-chip ${billsStatusFilter===s?'active':''}" onclick="setBillsStatusFilter('${s}')">${statusLabel(s)}</span>`).join('');
}
function toggleFilterPanel(which){
  const panelId = which === 'status' ? 'statusFilters' : 'stepFilters';
  const btnId = which === 'status' ? 'statusFilterBtn' : 'stepFilterBtn';
  const panel = document.getElementById(panelId);
  const btn = document.getElementById(btnId);
  const isOpen = panel.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);
}
function closeFilterPanelsOnMobile(){
  if(window.innerWidth > 640) return;
  ['statusFilters','stepFilters'].forEach(id=>{
    document.getElementById(id).classList.remove('open');
  });
  ['statusFilterBtn','stepFilterBtn'].forEach(id=>{
    document.getElementById(id).setAttribute('aria-expanded','false');
  });
}

function setBillsStatusFilter(s){
  billsStatusFilter = (billsStatusFilter===s) ? '' : s;
  renderStatusFilters();
  renderBills();
  closeFilterPanelsOnMobile();
}

function renderStepFilters(){
  const el = document.getElementById('stepFilters');
  if(!el) return;
  const opts = currentLang==='en'
    ? [['commons','House of Commons'],['senate','Senate']]
    : [['commons','Chambre des communes'],['senate','Sénat']];
  const isEn = currentLang === 'en';
  // Le compteur est calculé, jamais codé en dur : il suit les données du mois.
  const n = (typeof lobbying !== 'undefined' && lobbying.bills)
    ? bills.filter(b => lobbying.bills[b.num]).length : 0;
  const lobChip = n ? `<span class="step-chip lob-chip ${billsLobbyFilter?'active':''}" onclick="setBillsLobbyFilter()" title="${isEn?'Bills with communications reported to the Commissioner of Lobbying':'Projets avec des communications déclarées au Commissariat au lobbying'}">${isEn?'Lobbying':'Lobbying'} <b>${n}</b></span>` : '';
  // Omnibus : projets qui modifient plusieurs lois à la fois. Compte calculé.
  const nOm = bills.filter(b => b.omnibus).length;
  const omChip = nOm ? `<span class="step-chip om-chip ${billsOmnibusFilter?'active':''}" onclick="setBillsOmnibusFilter()" title="${isEn?'Bills that change several different acts at once, one per part':'Projets qui modifient plusieurs lois différentes à la fois, une par partie'}">Omnibus <b>${nOm}</b></span>` : '';
  // Challengés : projets pour lesquels au moins une explication a été demandée.
  const nCh = challengedIds().size;
  const chChip = nCh ? `<span class="step-chip ch-chip ${billsChallengeFilter?'active':''}" onclick="setBillsChallengeFilter()" title="${isEn?'Bills citizens have asked to have explained':'Projets dont des citoyen·ne·s ont demandé l’explication'}">🔥 ${isEn?'Challenged':'Challengés'} <b>${nCh}</b></span>` : '';
  el.innerHTML = opts.map(([val,label])=>`<span class="step-chip ${billsStepFilter===val?'active':''}" onclick="setBillsStepFilter('${val}')">${label}</span>`).join('') + lobChip + omChip + chChip;
}

function setBillsStepFilter(n){
  billsStepFilter = (billsStepFilter===n) ? null : n;
  renderStepFilters();
  renderBills();
  closeFilterPanelsOnMobile();
}

// Omnibus : le même filtre est atteignable par le chip de la barre et par la
// pastille verte d'une rangée (« Omnibus · 3 »), qui répond à la même question.
function setBillsChallengeFilter(on){
  billsChallengeFilter = (on === undefined) ? !billsChallengeFilter : !!on;
  renderStepFilters();
  renderBills();
  closeFilterPanelsOnMobile();
}

function setBillsOmnibusFilter(on){
  billsOmnibusFilter = (on === undefined) ? !billsOmnibusFilter : !!on;
  renderStepFilters();
  renderBills();
  closeFilterPanelsOnMobile();
}

function setBillsLobbyFilter(){
  billsLobbyFilter = !billsLobbyFilter;
  renderStepFilters();
  updateSortToggleLabel();
  renderBills();
  closeFilterPanelsOnMobile();
}

function updateSortToggleLabel(){
  const btn = document.getElementById('sortToggle');
  if(!btn) return;
  const isEn = currentLang==='en';
  // Le filtre lobbying change ce qu'on trie : le bouton doit le dire, sinon il
  // annonce « activité la plus récente » alors que la liste classe des rencontres.
  const asc = billsLobbyFilter
    ? (isEn ? '↑ Least lobbied first' : '↑ Le moins de lobbying')
    : (isEn ? '↑ Oldest activity first' : '↑ Activité la plus ancienne');
  const desc = billsLobbyFilter
    ? (isEn ? '↓ Most lobbied first' : '↓ Le plus de lobbying')
    : (isEn ? '↓ Most recent activity first' : '↓ Activité la plus récente');
  btn.textContent = billsSortDir === 'desc' ? desc : asc;
}
function toggleBillsSort(){
  billsSortDir = billsSortDir === 'desc' ? 'asc' : 'desc';
  updateSortToggleLabel();
  renderBills();
}

let showMotions = false;
function updateMotionsToggleLabel(){
  const btn = document.getElementById('motionsToggle');
  if(!btn) return;
  const motionCount = votes.filter(v=>!v.billNumber).length;
  const show = currentLang==='en' ? `Show motions (${motionCount})` : `Afficher les motions (${motionCount})`;
  const hide = currentLang==='en' ? 'Hide motions' : 'Masquer les motions';
  btn.textContent = showMotions ? hide : show;
}
function toggleShowMotions(){
  showMotions = !showMotions;
  updateMotionsToggleLabel(); updatePetitionsToggleLabel();
  renderVotes();
}
let showPetitions = false;
function updatePetitionsToggleLabel(){
  const btn = document.getElementById('petitionsToggle');
  if(!btn) return;
  const n = (typeof petitions !== 'undefined' && petitions) ? petitions.length : 0;
  const show = currentLang === 'en' ? 'Petitions (' + n + ')' : 'Pétitions (' + n + ')';
  const hide = currentLang === 'en' ? 'Hide petitions' : 'Masquer les pétitions';
  btn.textContent = showPetitions ? hide : show;
}
function togglePetitions(){
  showPetitions = !showPetitions;
  const box = document.getElementById('petitionsBlock');
  if(box) box.style.display = showPetitions ? 'block' : 'none';
  updatePetitionsToggleLabel();
}

// Liste paginée : 10 projets d'abord, puis 20 de plus à chaque clic. Le compte revient
// à 10 dès que la recherche, un filtre ou le tri change (mais pas pour un simple
// re-rendu : changement de langue, connexion…), d'où la « signature » ci-dessous.
const BILLS_FIRST = 10, BILLS_STEP = 20;
let billsShown = BILLS_FIRST, billsSignature = '';
function loadMoreBills(){ billsShown += BILLS_STEP; renderBills(); }
function renderBills(keyword){
  keyword = keyword !== undefined ? keyword : (document.getElementById('searchBills')?.value || '');
  const kw = norm(keyword);
  const signature = [kw, billsStatusFilter, billsStepFilter, billsLobbyFilter, billsOmnibusFilter, billsChallengeFilter, billsSortDir].join('|');
  if(signature !== billsSignature){ billsSignature = signature; billsShown = BILLS_FIRST; }
  // Mémorisé pour que le bloc de lobbying puisse mettre en avant l'organisation
  // cherchée : trouver un projet sans voir pourquoi serait pire que ne rien trouver.
  billsKeyword = kw;
  const list = bills.filter(b => {
    const statusOk = !billsStatusFilter || b.state === billsStatusFilter;
    const chamberOk = billsStepFilter === null || b.chamber === billsStepFilter;
    const lobbyOk = !billsLobbyFilter || !!(typeof lobbying !== 'undefined' && lobbying.bills && lobbying.bills[b.num]);
    const omnibusOk = !billsOmnibusFilter || !!b.omnibus;
    const challengeOk = !billsChallengeFilter || challengedIds().has(b.id);
    // Les noms d'organisations entrent dans l'index : chercher « Google » ou
    // « pétroliers » sort les projets sur lesquels ils ont déclaré du lobbying.
    const orgs = lobbyOrgNames(b.num).map(n => typeof n === 'string' ? n : [n.fr, n.en].join(' ')).join(' ');
    const haystack = [b.title && b.title.fr, b.title && b.title.en, 'projet de loi ' + b.num, 'bill ' + b.num, b.sponsor && (b.sponsor.fr||b.sponsor.en), orgs].join(' ');
    const kwOk = matchesSearch(haystack, kw);
    return statusOk && chamberOk && lobbyOk && omnibusOk && challengeOk && kwOk;
  }).sort((a,b)=>{
    // Filtre lobbying actif : on classe du plus lobbyé au moins lobbyé — c'est
    // la question qu'on pose en cliquant. Le sens du tri reste celui du bouton.
    if(billsLobbyFilter && typeof lobbying !== 'undefined' && lobbying.bills){
      const na = (lobbying.bills[a.num]||{}).total || 0;
      const nb = (lobbying.bills[b.num]||{}).total || 0;
      if(na !== nb) return billsSortDir === 'desc' ? nb - na : na - nb;
    }
    const da = a.lastActivity || '', db = b.lastActivity || '';
    if(!da && !db) return 0;
    if(!da) return 1;
    if(!db) return -1;
    return billsSortDir === 'desc' ? db.localeCompare(da) : da.localeCompare(db);
  });
  const el = document.getElementById('billsList');
  // Mémorise les projets déjà dépliés pour les rouvrir après reconstruction :
  // sinon un re-render asynchrone (événement d'auth INITIAL_SESSION, changement
  // de langue…) referme la carte que l'utilisateur — ou un lien profond ?pl= —
  // venait d'ouvrir.
  const openIds = new Set([...el.querySelectorAll('.ab-row.open')].map(r => r.id));
  const isEn = currentLang === 'en';
  const shown = list.slice(0, billsShown);
  let more = '';
  if(list.length > shown.length){
    const step = Math.min(BILLS_STEP, list.length - shown.length);
    more = `<button class="votes-more" onclick="loadMoreBills()">${isEn
      ? 'See ' + step + ' more — ' + shown.length + ' of ' + list.length + ' shown'
      : 'Voir ' + step + ' de plus — ' + shown.length + ' sur ' + list.length + ' affichés'}</button>`;
  } else if(list.length > BILLS_FIRST){
    more = `<div class="votes-more-note">${isEn ? 'All ' + list.length + ' shown' : 'Les ' + list.length + ' affichés'}</div>`;
  }
  // La bande « c'est quoi, challenger ? » vit hors de la liste : on la sort avant
  // de réécrire celle-ci (sinon innerHTML la détruirait), puis on la replace.
  const expl = document.getElementById('challengeExplainer');
  if(expl && expl.parentNode === el) el.parentNode.appendChild(expl);
  el.innerHTML = list.length ? shown.map(b=>apercuBillRow(b,'pr')).join('') + more : `<div class="no-results">${isEn ? 'No bill matches this search.' : 'Aucun projet de loi ne correspond à cette recherche.'}</div>`;
  placerExplainer(el);
  openIds.forEach(id => { const r = document.getElementById(id); if(r && !r.classList.contains('open')) toggleApercuBill(id); });
  document.getElementById('statProjets').textContent = bills.length;
}

// La bande explicative s'intercale APRÈS le 2e projet : on la croise en lisant,
// au lieu d'avoir à descendre toute la liste. Liste plus courte que 3 : elle
// reste en dessous.
function placerExplainer(liste){
  const expl = document.getElementById('challengeExplainer');
  if(!expl || !liste) return;
  const rangees = [...liste.children].filter(n => n.id !== 'challengeExplainer');
  if(rangees.length >= 3) liste.insertBefore(expl, rangees[2]);
  else liste.parentNode.appendChild(expl);
}

function renderPageBandCounts(){
  const isEn = currentLang === 'en';
  const loc = isEn ? 'en-CA' : 'fr-CA';
  // COUNTS (noyau) et non la longueur des tableaux : sur une page dont l'onglet
  // n'est pas chargé, ceux-ci sont vides et le titre afficherait « 0 ».
  const n = arr => (typeof arr === 'number' ? arr : (arr ? arr.length : 0)).toLocaleString(loc);
  const C = typeof COUNTS !== 'undefined' ? COUNTS : {};
  const set = (id, txt) => { const e = document.getElementById(id); if(e) e.textContent = txt; };
  // Titres de bande = le H1 de chaque page : toujours ancrés au fédéral (Communes,
  // Parlement…) pour ne pas se confondre avec DossierQuébec dans les résultats.
  set('projetsCountTitle', isEn ? n(C.bills) + ' federal bills' : n(C.bills) + ' projets de loi fédéraux');
  const senate = typeof voteChamber !== 'undefined' && voteChamber === 'senate';
  set('votesCountTitle', senate
    ? (isEn ? n(C.senateVotes) + ' votes in the Senate' : n(C.senateVotes) + ' votes au Sénat')
    : (isEn ? n(C.votes) + ' votes in the Commons' : n(C.votes) + ' votes aux Communes'));
  set('lexiqueCountTitle', isEn ? 'Parliament glossary — ' + n(typeof lexiconTerms!=='undefined'?lexiconTerms:[]) + ' terms' : 'Lexique du Parlement — ' + n(typeof lexiconTerms!=='undefined'?lexiconTerms:[]) + ' termes');
}
function renderApercuStats(){
  const isEn = currentLang === 'en';
  const loc = isEn ? 'en-CA' : 'fr-CA';
  // Phrase d'intro de l'accueil, avec les vrais comptes du jour (pré-rendue au build :
  // les robots lisent ce que couvre le site sans exécuter le JavaScript).
  const intro = document.getElementById('a3intro');
  if(intro){
    const C = typeof COUNTS !== 'undefined' ? COUNTS : {};
    const n = (x) => `<b>${(x || 0).toLocaleString(loc)}</b>`;
    intro.innerHTML = isEn
      ? `Canada's Parliament without the jargon: ${n(C.deputes)} MPs, ${n(C.bills)} federal bills and ${n(C.votes)} recorded votes in the House of Commons, straight from official sources.`
      : `Le Parlement du Canada sans jargon : ${n(C.deputes)} député·e·s, ${n(C.bills)} projets de loi fédéraux et ${n(C.votes)} votes nominaux aux Communes, tirés des sources officielles.`;
  }
}
function apercuBillRow(b, ctx){
  ctx = ctx || 'ap';
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const rowId = 'abrow-' + ctx + '-' + b.id;
  const title = L(b.title);
  let partyBadge = '';
  const sp = b.sponsorParty;
  if(sp){
    const c = (sp.kind === 'party' ? partyColors[sp.code] : groupColors[sp.code]) || '#8a8f99';
    const ab = (isEn ? sp.abbr.en : sp.abbr.fr) || sp.code;
    partyBadge = `<span class="depute-party" style="background:${c}; color:${textOn(c)}">${ab}</span>`;
  }
  const statusP = `<span class="status-pill ${statusClass(b.state)}">${statusLabel(b.state)}</span>`;
  // Compteur de lobbying à même la rangée : sans lui, une liste filtrée « Lobbying »
  // ne dit pas lesquels pèsent lourd. Absent quand rien n'est déclaré.
  const lobN = (typeof lobbying !== 'undefined' && lobbying.bills && lobbying.bills[b.num]) ? lobbying.bills[b.num].total : 0;
  const lobBadge = lobN ? `<span class="ab-lob" title="${lobN} ${isEn ? 'reported lobbying communications' : 'communications de lobbying déclarées'}">${lobN}</span>` : '';
  // Omnibus : le titre ne nomme qu'une des lois touchées — la rangée le dit.
  const om = b.omnibus;
  const omniBadge = om ? `<button type="button" class="ab-omni" onclick="event.stopPropagation(); setBillsOmnibusFilter(true)" title="${isEn
    ? `Omnibus bill — ${om.parts} parts${om.divisions ? `, ${om.divisions} divisions` : ''}: it changes several different acts. Click to show only omnibus bills`
    : `Projet omnibus — ${om.parts} parties${om.divisions ? `, ${om.divisions} sections` : ''} : il modifie plusieurs lois différentes. Cliquer pour ne voir que les omnibus`}">Omnibus · ${om.parts} ${isEn ? (om.parts > 1 ? 'parts' : 'part') : (om.parts > 1 ? 'parties' : 'partie')}</button>` : '';
  // Challengé : au moins une explication demandée. La flamme le dit sur la rangée,
  // et mène au filtre — comme la pastille Omnibus.
  const chN = challengeCount(b.id);
  const chBadge = chN >= CHALLENGE_THRESHOLD ? `<button type="button" class="ab-flamme" onclick="event.stopPropagation(); setBillsChallengeFilter(true)" title="${isEn
    ? `Challenged — ${chN} explanation ${chN > 1 ? 'requests' : 'request'}. Click to show only challenged bills`
    : `Challengé — ${chN} demande${chN > 1 ? 's' : ''} d'explication. Cliquer pour ne voir que les projets challengés`}"><span aria-hidden="true">🔥</span><b>${chN}</b></button>` : '';
  const full = billCard(b, ctx + b.id);
  return `<div class="ab-row" id="${rowId}">
    <div class="ab-head" onclick="toggleApercuBill('${rowId}')">
      <span class="ab-num">${b.num}</span>
      <span class="ab-title">${title}</span>
      ${chBadge}
      ${omniBadge}
      ${lobBadge}
      ${partyBadge}
      ${statusP}
      <span class="ab-caret">▾</span>
    </div>
    <div class="ab-detail">${full}</div>
  </div>`;
}
function toggleApercuBill(rowId){
  const r = document.getElementById(rowId);
  if(!r) return;
  const opened = r.classList.toggle('open');
  // À l'ouverture on déplie aussi le résumé : sinon la description restait
  // cachée derrière un second clic, ce qui n'était pas devinable.
  if(opened){
    // Premier dépliage de la session : c'est ici qu'on va chercher les textes.
    ensureBillTexts().then(fillPendingSummaries);
    // Un seul projet ouvert à la fois — une fiche dépliée fait plusieurs écrans
    // de haut, et en empiler trois rendait la liste impraticable au défilement.
    // On se limite à la MÊME liste : l'aperçu et la page Projets sont deux
    // listes distinctes, fermer dans l'une en ouvrant dans l'autre serait
    // incompréhensible.
    const liste = r.parentElement;
    let ferme = 0;
    // Position du projet cliqué AVANT de refermer les autres : si l'une d'elles
    // était au-dessus, la page se contracte et la fiche qu'on vient d'ouvrir
    // saute sous le curseur. On rattrape le décalage plus bas.
    const avant = r.getBoundingClientRect().top;
    if(liste){
      liste.querySelectorAll(':scope > .ab-row.open').forEach(autre => {
        if(autre === r) return;
        autre.classList.remove('open');
        const s = autre.querySelector('.bill-summary');
        if(s) s.classList.remove('open');
        const h = autre.querySelector('.expand-hint');
        if(h) h.textContent = t('btn.viewSummary');
        ferme++;
      });
    }
    const sum = r.querySelector('.bill-summary');
    if(sum && !sum.classList.contains('open')){
      sum.classList.add('open');
      const hint = r.querySelector('.expand-hint');
      if(hint) hint.textContent = t('btn.hideSummary');
    }
    if(ferme){
      const delta = r.getBoundingClientRect().top - avant;
      if(delta) window.scrollBy(0, delta);
    }
  } else {
    // Fermeture symétrique de ce qu'on fait aux autres : sans ça, la rangée
    // refermée gardait son résumé déplié en mémoire, dans un état différent de
    // ses voisines pour un résultat visuel identique.
    const sum = r.querySelector('.bill-summary');
    if(sum) sum.classList.remove('open');
    const hint = r.querySelector('.expand-hint');
    if(hint) hint.textContent = t('btn.viewSummary');
  }
}
function renderApercuBills(){
  const el = document.getElementById('apercuBills');
  if(!el) return;
  el.innerHTML = bills.slice(0,4).map(b => apercuBillRow(b, 'ap')).join('');
}

// Partage d'un projet de loi. Message neutre + lien profond /projets-de-loi?pl=NUM
// qui ouvre directement le projet à l'arrivée (voir openBillFromQuery).
function shareBill(billId, platform, evt){
  if(evt) evt.stopPropagation();
  const isEn = currentLang === 'en';
  const b = bills.find(x => x.id === Number(billId));
  if(!b) return;
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const title = L(b.title);
  const url = `${SITE_ORIGIN}${pathForView('projets', currentLang)}?pl=${encodeURIComponent(b.num)}`;
  const text = isEn
    ? `Bill ${b.num} — ${title}. Plain-language summary on DossierCanada:`
    : `Projet de loi ${b.num} — ${title}. Résumé en clair sur DossierCanada :`;
  if(platform === 'native' && navigator.share){
    navigator.share({ title: 'DossierCanada', text, url }).catch(() => {});
    return;
  }
  if(platform === 'x'){
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'noopener,width=600,height=520');
  } else if(platform === 'fb'){
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'noopener,width=600,height=520');
  } else { // copier (et repli si le partage natif échoue)
    const full = text + ' ' + url;
    const bouton = boutonDeLEvenement(evt);
    copierTexte(full)
      .then(() => clignoteCopie(bouton, isEn, true))
      .catch(() => clignoteCopie(bouton, isEn, false));
  }
}

// Lien profond : /projets-de-loi?pl=NUM → ouvre directement ce projet à l'arrivée.
function openBillFromQuery(){
  const pl = new URLSearchParams(location.search).get('pl');
  if(!pl) return;
  const b = bills.find(x => String(x.num) === String(pl));
  if(!b) return;
  // S'assurer qu'on est sur l'onglet Projets (ex. si le lien arrive en /?pl=NUM).
  if(typeof viewFromPath === 'function' && viewFromPath() !== 'projets'){ goToTab('projets', { fromHistory: true, noScroll: true }); }
  // Le projet doit passer le filtre courant : « tous » + recherche vide.
  billsStatusFilter = ''; billsStepFilter = null; billsLobbyFilter = false;
  const sb = document.getElementById('searchBills'); if(sb) sb.value = '';
  if(typeof renderStatusFilters === 'function') renderStatusFilters();
  if(typeof renderStepFilters === 'function') renderStepFilters();
  if(typeof updateSortToggleLabel === 'function') updateSortToggleLabel();
  renderBills();
  const rowId = 'abrow-pr-' + b.id;
  // La liste est paginée : on l'allonge jusqu'à ce que le projet visé y soit.
  while(!document.getElementById(rowId) && billsShown < bills.length){ billsShown += BILLS_STEP; renderBills(); }
  const row = document.getElementById(rowId);
  if(row){
    if(!row.classList.contains('open')) toggleApercuBill(rowId);
    setTimeout(() => row.scrollIntoView({ behavior: 'smooth', block: 'start' }), 90);
  }
}

/* Index des données : vides au départ, refaits quand le fichier de l'onglet
   arrive (buildIndexes, appelée par ensureData). */
const deputeById = new Map();
const voteById = new Map();
const senatorBySlug = new Map();
const senateVoteById = new Map();
// Votes du Sénat regroupés par projet de loi (pour les afficher dans la carte du
// projet, comme les votes des Communes). Triés du plus récent au plus ancien.
const senateVotesByBillId = new Map();
function buildIndexes(){
  deputeById.clear(); for(const d of deputes) deputeById.set(d.id, d);
  voteById.clear(); for(const v of votes) voteById.set(v.number, v);
  senatorBySlug.clear(); for(const s of senators) senatorBySlug.set(s.slug, s);
  senateVoteById.clear(); for(const v of senateVotes) senateVoteById.set(v.id, v);
  senateVotesByBillId.clear();
  for(const v of senateVotes){
    if(v.billId == null) continue;
    if(!senateVotesByBillId.has(v.billId)) senateVotesByBillId.set(v.billId, []);
    senateVotesByBillId.get(v.billId).push(v);
  }
  for(const arr of senateVotesByBillId.values()) arr.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id - a.id);
}
// Couleurs des groupes parlementaires du Sénat (le C = caucus conservateur, même
// bleu que les Communes ; les autres groupes sont non partisans).
const groupColors = { ISG:'#6D5BA6', CSG:'#0E7C7B', PSG:'#B0568C', C:'#1A4782', GRO:'#5B6B7A', 'Non-affiliated':'#8a8f99' };
let senateGroupFilter = '', senatorsShowAll = false;
function setSenateGroup(c){
  senateGroupFilter = (senateGroupFilter === c) ? '' : c;
  senatorsShowAll = false;
  renderPartyFilters();
  renderDeputes();
}
function showAllSenators(){ senatorsShowAll = true; renderDeputes(); }
let chamberView = 'commons';   // onglet « Députés » : 'commons' | 'senate'
let voteChamber = 'commons';   // onglet « Votes »  : 'commons' | 'senate'

// Carte d'un·e sénateur·rice (roster sencanada + bilan de votes précalculé).
// Pas de bouton « Suivre » ici (le suivi côté serveur ne couvre pas encore le
// Sénat) ni de photo — comme les député·e·s : initiales + lien officiel.
function senatorCardFed(s, isEn, L){
  const color = groupColors[s.group.code] || '#8a8f99';
  const region = L(s.province);
  const groupShort = (isEn ? s.group.en : s.group.fr) || s.group.code || '—';
  const groupFull = (isEn ? s.group.enName : s.group.frName) || '';
  const vr = s.votingRecord;
  const pct = (vr && vr.participationRate != null) ? Math.round(vr.participationRate * 100) : null;
  const attTxt = pct != null
    ? (isEn ? `attendance: ${pct}% (${vr.cast}/${vr.eligible})` : `présence : ${pct} % (${vr.cast}/${vr.eligible})`)
    : (isEn ? 'attendance: not available' : 'présence : non disponible');
  const attTitle = isEn
    ? 'Share of recorded Senate votes this senator took part in (yea/nay/abstention) since being appointed — a proxy for attendance; the Senate does not publish attendance directly.'
    : "Part des votes du Sénat auxquels ce·tte sénateur·rice a pris part (pour/contre/abstention) depuis sa nomination — un indicateur de présence, le Sénat ne publiant pas l'assiduité directement.";
  const yr = s.appointedOn ? s.appointedOn.slice(0, 4) : null;
  const apptTxt = yr ? (isEn ? `appointed ${yr}` : `nommé·e en ${yr}`) : '';
  const url = senatorUrl(s);
  const ini = s.name.split(/\s+/).map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
  const profileTitle = isEn ? 'Official profile on sencanada.ca' : 'Fiche officielle sur sencanada.ca';
  return `
    <div class="m-card">
      <div class="top-row">
        <a class="avatar" href="${url}" target="_blank" rel="noopener" title="${profileTitle}">${ini}</a>
        ${apptTxt ? `<span class="vp-note" style="align-self:center">${apptTxt}</span>` : ''}
      </div>
      <h3>${s.name}</h3>
      <div class="role">${region}</div>
      <div class="meta-row">
        <span class="depute-party" style="background:${color}; color:${textOn(color)}" title="${groupFull}">${groupShort}</span>
        <span class="vp-note" title="${attTitle}">${attTxt}</span>
      </div>
    </div>`;
}

function renderSenators(filter){
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const f = norm(filter !== undefined ? filter : (document.getElementById('searchMinistres')?.value || ''));
  const list = senators.filter(s =>
    (!senateGroupFilter || (s.group.code || 'Non-affiliated') === senateGroupFilter) &&
    matchesSearch([s.name, L(s.province), s.group.code || '', L({ en: s.group.enName, fr: s.group.frName })].join(' '), f)
  ).sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
  const el = document.getElementById('deputesList');
  const LIMIT = 11;
  const total = list.length;
  const shown = (!senatorsShowAll && total > LIMIT) ? list.slice(0, LIMIT) : list;
  const remaining = total - shown.length;
  const moreTile = remaining > 0
    ? `<a class="min-more" onclick="showAllSenators()"><span class="min-more-n">+${remaining}</span><span class="min-more-t">${isEn ? 'See all ' + total + ' senators →' : 'Voir les ' + total + ' sénateur·rice·s →'}</span></a>`
    : '';
  el.innerHTML = total
    ? shown.map(s => senatorCardFed(s, isEn, L)).join('') + moreTile
    : `<div class="no-results">${isEn ? 'No results for this search.' : 'Aucun résultat pour cette recherche.'}</div>`;
  const pg = document.getElementById('deputesPager');
  if(pg) pg.innerHTML = '';
}

// Hémicycle du Sénat : 105 sièges, colorés par groupe parlementaire, les sièges
// vacants en gris. Mêmes maths que l'hémicycle des Communes, avec la légende en
// noms complets bilingues (pour expliquer les groupes, pas juste les sigles).
const SENATE_SEATS_TOTAL = 105;
function renderSenateHemicycle(){
  const svg = document.getElementById('senateHemicycleSvg');
  if(!svg) return;
  const isEn = currentLang === 'en';
  const by = {}, info = {};
  for(const s of senators){ const c = s.group.code || 'Non-affiliated'; by[c] = (by[c] || 0) + 1; info[c] = s.group; }
  const order = ['ISG', 'CSG', 'PSG', 'C', 'GRO', 'Non-affiliated'].filter(c => by[c]);
  const filled = order.reduce((a, c) => a + by[c], 0);
  const vacant = Math.max(0, SENATE_SEATS_TOTAL - filled);

  const seatList = [];
  order.forEach(c => { for(let i = 0; i < by[c]; i++) seatList.push(c); });
  for(let i = 0; i < vacant; i++) seatList.push('VACANT');
  const total = seatList.length;

  const cx = 210, cy = 210, rOuter = 195, rInner = 82, rows = 8;
  const radii = [];
  for(let row = 0; row < rows; row++) radii.push(rInner + (rOuter - rInner) * (row / (rows - 1)));
  const wSum = radii.reduce((a, r) => a + r, 0);
  let perRow = radii.map(r => Math.max(1, Math.round(total * r / wSum)));
  let diff = total - perRow.reduce((a, b) => a + b, 0);
  for(let k = rows - 1; diff !== 0; k = (k - 1 + rows) % rows){ const d = Math.sign(diff); perRow[k] += d; diff -= d; }
  let positions = [];
  for(let row = 0; row < rows; row++){
    const r = radii[row], n = perRow[row];
    for(let i = 0; i < n; i++){ const ang = n > 1 ? Math.PI * (i / (n - 1)) : Math.PI / 2; positions.push({ ang, x: cx - r * Math.cos(ang), y: cy - r * Math.sin(ang) }); }
  }
  positions.sort((a, b) => a.ang - b.ang);
  svg.innerHTML = positions.map((p, i) => {
    const c = seatList[i];
    const color = c === 'VACANT' ? '#D8DAE0' : (groupColors[c] || '#999');
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.6" fill="${color}"/>`;
  }).join('');

  const legend = document.getElementById('senateHemicycleLegend');
  const rowsHtml = order.map(c => {
    const g = info[c];
    const name = (isEn ? (g.enName || g.en) : (g.frName || g.fr)) || c;
    return `<div class="row"><span class="dot" style="background:${groupColors[c]}"></span>${name} <b style="margin-left:auto">${by[c]}</b></div>`;
  }).join('');
  const vacantRow = vacant ? `<div class="row"><span class="dot" style="background:#D8DAE0"></span>${isEn ? 'Vacant seats' : 'Sièges vacants'} <b style="margin-left:auto">${vacant}</b></div>` : '';
  const foot = isEn
    ? 'Real count from the official list of senators. The Senate has 105 seats; senators are appointed (not elected), and mostly non-partisan groups — not parties — organize the chamber since the 2016 reforms.'
    : 'Décompte réel tiré de la liste officielle des sénateur·rice·s. Le Sénat compte 105 sièges ; les sénateur·rice·s sont nommé·e·s (non élu·e·s), et depuis les réformes de 2016 ce sont surtout des groupes non partisans — pas des partis — qui organisent la chambre.';
  legend.innerHTML = rowsHtml + vacantRow + `<div style="font-size:11px; color:var(--slate); margin-top:6px; max-width:250px;">${foot}</div>`;

  const tEl = document.getElementById('senateCompoTitle');
  const sEl = document.getElementById('senateCompoSub');
  if(tEl) tEl.textContent = isEn ? 'Senate composition' : 'Composition du Sénat';
  if(sEl) sEl.textContent = isEn ? `${SENATE_SEATS_TOTAL} seats — by parliamentary group (appointed senators)` : `${SENATE_SEATS_TOTAL} sièges — répartition par groupe parlementaire (sénateur·rice·s nommé·e·s)`;
}

/* ---------------- LEXIQUE (glossaire parlementaire fédéral) ---------------- */
// Catégories du lexique — classement validé avec Martin (2026-07). On garde une map
// séparée (clé = terme FR) plutôt que de modifier les entrées : si un terme change,
// il perd juste son badge au lieu de casser quoi que ce soit.
const LEX_CATS = {
  proc:  { fr:'Procédure',          en:'Procedure',      color:'var(--yellow)' },
  votes: { fr:'Votes',              en:'Votes',          color:'var(--cyan)'   },
  roles: { fr:'Personnes et rôles', en:'People & roles', color:'var(--lime)'   }
};
const lexiconCatByTerm = {
  "Projet de loi (C- / S-)": 'proc',
  "Première, deuxième, troisième lecture": 'proc',
  "Étape du comité / du rapport": 'proc',
  "Sanction royale": 'proc',
  "Vote par appel nominal": 'votes',
  "Pairé (Communes)": 'votes',
  "Parrain / marraine d'un projet": 'roles',
  "Sénateur·rice": 'roles',
  "Groupes parlementaires du Sénat": 'roles',
  "Caucus": 'roles',
  "Législature et session": 'proc',
  "Prorogation / dissolution": 'proc',
  "Cabinet (conseil des ministres)": 'roles'
};
let lexCatFilter = null;
function setLexCat(c){ lexCatFilter = (lexCatFilter === c) ? null : c; renderLexique(); }
const lexiconTerms = [
  { term: { fr: "Projet de loi (C- / S-)", en: "Bill (C- / S-)" }, def: {
    fr: "Un texte proposé qui doit franchir les deux chambres puis recevoir la sanction royale pour devenir loi. Les projets numérotés <b>C-</b> commencent à la Chambre des communes, les <b>S-</b> au Sénat. Les numéros sous 200 sont des projets du gouvernement ; à partir de C-200 / S-200, ce sont des projets émanant d'un·e député·e ou sénateur·rice.",
    en: "A proposed text that must clear both chambers and then receive royal assent to become law. Bills numbered <b>C-</b> start in the House of Commons, <b>S-</b> in the Senate. Numbers below 200 are government bills; from C-200 / S-200 on, they are private members' or senators' bills." } },
  { term: { fr: "Projet de loi pro forma", en: "Pro forma bill" }, def: {
    fr: "Le tout premier projet déposé dans chaque chambre à l'ouverture d'une session — <b>C-1</b> aux Communes, <b>S-1</b> au Sénat. C'est un rituel, pas une loi : avant d'écouter le discours du Trône, la chambre dépose un texte symbolique pour affirmer qu'elle légifère de son propre chef et non sur commande de la Couronne. Il n'est jamais imprimé, jamais débattu, jamais mis aux voix. Son titre est traditionnel et n'a aucun rapport avec un contenu — il n'y en a pas : les chemins de fer au Sénat, les serments d'office aux Communes.",
    en: "The very first bill introduced in each chamber when a session opens — <b>C-1</b> in the Commons, <b>S-1</b> in the Senate. It is a ritual, not legislation: before hearing the Speech from the Throne, the chamber introduces a token text to assert that it legislates of its own accord and not at the Crown's bidding. It is never printed, never debated, never voted on. Its title is traditional and unrelated to any content — there is none: railways in the Senate, oaths of office in the Commons." } },
  { term: { fr: "Première, deuxième, troisième lecture", en: "First, second, third reading" }, def: {
    fr: "Les trois grandes étapes d'un projet dans chaque chambre. <b>1re</b> : dépôt (pas de débat). <b>2e</b> : vote sur le principe. <b>3e</b> : vote final de la chambre. Un projet fait ce parcours <i>deux fois</i> — une fois par chambre.",
    en: "The three main stages of a bill in each chamber. <b>1st</b>: introduction (no debate). <b>2nd</b>: vote on the principle. <b>3rd</b>: the chamber's final vote. A bill runs this course <i>twice</i> — once per chamber." } },
  { term: { fr: "Étape du comité / du rapport", en: "Committee / report stage" }, def: {
    fr: "Entre la 2e et la 3e lecture, un comité étudie le projet article par article et peut proposer des amendements ; l'étape du rapport ramène le résultat (et d'éventuels amendements) devant la chambre.",
    en: "Between 2nd and 3rd reading, a committee studies the bill clause by clause and may propose amendments; report stage brings the result (and any amendments) back before the chamber." } },
  { term: { fr: "Sanction royale", en: "Royal assent" }, def: {
    fr: "La dernière étape : une fois adopté à l'identique par les deux chambres, le projet reçoit l'accord formel de la Couronne (le gouverneur général) et devient loi.",
    en: "The final step: once passed in identical form by both chambers, the bill receives the Crown's formal agreement (the Governor General) and becomes law." } },
  { term: { fr: "Vote par appel nominal", en: "Recorded (standing) vote" }, def: {
    fr: "Un vote où le nom et la position de chaque parlementaire sont consignés. C'est la source du détail « qui a voté quoi » sur ce site — aux Communes (Pour / Contre / pairé) comme au Sénat (Pour / Contre / abstention).",
    en: "A vote where each member's name and position are recorded. It is the source of the \"who voted what\" detail on this site — in the Commons (yea / nay / paired) and in the Senate (yea / nay / abstention)." } },
  { term: { fr: "Pairé (Communes)", en: "Paired (Commons)" }, def: {
    fr: "Aux Communes, deux député·e·s de camps opposés peuvent convenir de s'abstenir ensemble pour un vote : leurs voix s'annulent. « Pairé » est donc une position enregistrée, pas une absence.",
    en: "In the Commons, two MPs on opposite sides may agree to abstain together for a vote: their votes cancel out. \"Paired\" is therefore a recorded position, not an absence." } },
  { term: { fr: "Parrain / marraine d'un projet", en: "Bill sponsor" }, def: {
    fr: "Le·la parlementaire (ministre, député·e ou sénateur·rice) qui présente le projet et le porte à travers les étapes.",
    en: "The member (minister, MP or senator) who introduces the bill and carries it through the stages." } },
  { term: { fr: "Sénateur·rice", en: "Senator" }, def: {
    fr: "Membre du Sénat, la deuxième chambre (105 sièges). Les sénateur·rice·s ne sont <b>pas élu·e·s</b> : ils et elles sont <b>nommé·e·s</b> par le gouverneur général sur recommandation du premier ministre. Depuis 2016, un <b>comité consultatif indépendant</b> évalue les candidatures au mérite, de façon non partisane, et propose des noms au premier ministre. Conditions : avoir au moins <b>30 ans</b>, résider dans la province ou le territoire représenté et y posséder des biens. Le mandat dure jusqu'à <b>75 ans</b> (il n'y a pas d'élection ni de durée fixe).",
    en: "A member of the Senate, the second chamber (105 seats). Senators are <b>not elected</b>: they are <b>appointed</b> by the Governor General on the Prime Minister's recommendation. Since 2016, an <b>independent advisory board</b> assesses applications on merit, in a non-partisan way, and recommends names to the Prime Minister. Requirements: be at least <b>30 years old</b>, reside in the province or territory represented and own property there. The term runs until age <b>75</b> (there is no election and no fixed length)." } },
  { term: { fr: "Groupes parlementaires du Sénat", en: "Senate parliamentary groups" }, def: {
    fr: "Depuis les réformes de 2016, le Sénat s'organise surtout en groupes <b>non partisans</b>, pas en partis : <b>GSI</b> (Groupe des sénateurs indépendants), <b>GSC</b> (Groupe des sénateurs canadiens), <b>GPS</b> (Groupe progressiste du Sénat). S'y ajoutent le <b>C</b> (caucus conservateur, le seul parti restant), le <b>BRG</b> (Bureau du représentant du gouvernement, qui pilote le programme du gouvernement) et les sénateur·rice·s <b>non affilié·e·s</b>.",
    en: "Since the 2016 reforms, the Senate is organized mostly into <b>non-partisan</b> groups rather than parties: <b>ISG</b> (Independent Senators Group), <b>CSG</b> (Canadian Senators Group), <b>PSG</b> (Progressive Senate Group). Alongside them sit the <b>C</b> (Conservative caucus, the only remaining party), the <b>GRO</b> (Government Representative Office, which steers the government's agenda) and <b>non-affiliated</b> senators." } },
  { term: { fr: "Caucus", en: "Caucus" }, def: {
    fr: "L'ensemble des parlementaires d'un même parti. Aux Communes : LPC (libéral), CPC (conservateur), BQ (Bloc), NPD, PVC (Vert).",
    en: "All the members of a given party. In the Commons: LPC (Liberal), CPC (Conservative), BQ (Bloc), NDP, GPC (Green)." } },
  { term: { fr: "Législature et session", en: "Parliament and session" }, def: {
    fr: "Une <b>législature</b> couvre la période entre deux élections générales (la 45e a débuté en 2025). Elle se divise en <b>sessions</b> ; « 45-1 » désigne la 1re session de la 45e législature — la période couverte par ce site.",
    en: "A <b>Parliament</b> spans the period between two general elections (the 45th began in 2025). It is divided into <b>sessions</b>; \"45-1\" means the 1st session of the 45th Parliament — the period this site covers." } },
  { term: { fr: "Prorogation / dissolution", en: "Prorogation / dissolution" }, def: {
    fr: "La <b>prorogation</b> met fin à une session (les projets non adoptés meurent, sauf rétablissement) ; la <b>dissolution</b> met fin à la législature et déclenche des élections.",
    en: "<b>Prorogation</b> ends a session (bills not yet passed die, unless reinstated); <b>dissolution</b> ends the Parliament and triggers an election." } },
  { term: { fr: "Cabinet (conseil des ministres)", en: "Cabinet" }, def: {
    fr: "L'équipe de ministres, dirigée par le premier ministre, qui oriente le gouvernement et propose la plupart des projets de loi. Les ministres sont presque toujours des député·e·s.",
    en: "The team of ministers, led by the Prime Minister, that directs the government and proposes most bills. Ministers are almost always MPs." } },
];
// Qui gravite autour du Parlement — les acteurs qu'on croise dans l'actualité
// parlementaire, au-delà des député·e·s et sénateur·rice·s. Faits vérifiables,
// jamais de jugement sur les personnes qui occupent ces rôles.
const lexiconPeople = [
  { group: { fr: "À l'intérieur du Parlement", en: "Inside Parliament" }, entries: [
    { role: { fr: "Président de la Chambre des communes", en: "Speaker of the House of Commons" }, name: "Francis Scarpaleggia", key: "house_speaker", tag: { fr: "Élu par les député·e·s · neutralité", en: "Elected by MPs · neutral" }, desc: {
      fr: "Préside les séances des Communes et applique le Règlement. Élu par les député·e·s le 26 mai 2025 ; député libéral de Lac-Saint-Louis, mais la présidence exige la neutralité — il ne vote qu'en cas d'égalité, ce qui explique son taux de présence très bas sur ce site.",
      en: "Presides over Commons sittings and applies the rules. Elected by MPs on May 26, 2025; a Liberal MP for Lac-Saint-Louis, but the role demands neutrality — he only votes to break a tie, which is why his attendance figure on this site looks very low." } },
    { role: { fr: "Présidente du Sénat", en: "Speaker of the Senate" }, name: "Raymonde Gagné", tag: { fr: "Nommée", en: "Appointed" }, desc: {
      fr: "Préside les séances du Sénat. Sénatrice du Manitoba, à la présidence depuis mai 2023.",
      en: "Presides over Senate sittings. A senator from Manitoba, Speaker since May 2023." } },
  ] },
  { group: { fr: "La représentante de la Couronne", en: "The Crown's representative" }, entries: [
    { role: { fr: "Gouverneure générale du Canada", en: "Governor General of Canada" }, name: "Louise Arbour", key: "governor_general", tag: { fr: "Cérémoniel + sanction des lois", en: "Ceremonial + royal assent" }, desc: {
      fr: "31e titulaire du poste, assermentée le 8 juin 2026. Ancienne juge de la Cour suprême du Canada et haut-commissaire des Nations Unies aux droits de l'homme. C'est elle qui accorde la sanction royale mentionnée sur les fiches de projets de loi du site.",
      en: "31st holder of the office, sworn in on June 8, 2026. A former justice of the Supreme Court of Canada and UN High Commissioner for Human Rights. She grants the royal assent cited on every bill card on this site." } },
  ] },
  { group: { fr: "Agents du Parlement — chiens de garde indépendants du gouvernement", en: "Officers of Parliament — watchdogs independent from the government" }, entries: [
    { role: { fr: "Vérificatrice générale du Canada", en: "Auditor General of Canada" }, name: "Karen Hogan", tag: { fr: "Agente du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Audite les dépenses et la gestion de l'État fédéral, et fait rapport au Parlement.",
      en: "Audits federal spending and management, and reports to Parliament." } },
    { role: { fr: "Directeur général des élections", en: "Chief Electoral Officer" }, name: "Stéphane Perrault", tag: { fr: "Agent du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Dirige Élections Canada : supervise les scrutins fédéraux et le découpage des circonscriptions. En poste depuis 2018.",
      en: "Heads Elections Canada: oversees federal elections and electoral boundaries. In office since 2018." } },
    { role: { fr: "Commissaire aux conflits d'intérêts et à l'éthique", en: "Conflict of Interest and Ethics Commissioner" }, name: "Konrad von Finckenstein", tag: { fr: "Agent du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Conseille et enquête sur la conduite des parlementaires en matière de conflits d'intérêts et d'éthique.",
      en: "Advises and investigates parliamentarians on conflict-of-interest and ethics matters." } },
    { role: { fr: "Commissaire au lobbying", en: "Commissioner of Lobbying" }, name: "Nancy Bélanger", tag: { fr: "Agente du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Administre le registre des lobbyistes et le Code de déontologie des lobbyistes — le lien direct avec le bloc « Registre des lobbyistes » ci-dessous.",
      en: "Administers the lobbyist registry and the Lobbyists' Code of Conduct — the direct link to the \"Lobbyist registry\" block below." } },
    { role: { fr: "Commissaire aux langues officielles", en: "Commissioner of Official Languages" }, name: "Kelly Burke", tag: { fr: "Agente du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Veille au respect de la Loi sur les langues officielles. 8e commissaire, en poste depuis le 30 mars 2026.",
      en: "Oversees compliance with the Official Languages Act. 8th commissioner, in office since March 30, 2026." } },
    { role: { fr: "Commissaire à la protection de la vie privée", en: "Privacy Commissioner" }, name: "Philippe Dufresne", tag: { fr: "Agent du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Protège les renseignements personnels des citoyens face au gouvernement et aux entreprises. En poste depuis 2022.",
      en: "Protects citizens' personal information from government and business. In office since 2022." } },
    { role: { fr: "Commissaire à l'information", en: "Information Commissioner" }, name: "Caroline Maynard", tag: { fr: "Agente du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Tranche les plaintes sur l'accès à l'information détenue par le gouvernement fédéral.",
      en: "Resolves complaints about access to information held by the federal government." } },
    { role: { fr: "Directrice parlementaire du budget", en: "Parliamentary Budget Officer" }, name: "Annette Ryan", tag: { fr: "Agente du Parlement", en: "Officer of Parliament" }, desc: {
      fr: "Chiffre de façon indépendante le coût des lois et des mesures du gouvernement. Nommée le 22 avril 2026.",
      en: "Independently costs bills and government measures. Appointed April 22, 2026." } },
  ] },
  { group: { fr: "Autres rôles et institutions", en: "Other roles and institutions" }, entries: [
    { role: { fr: "Les comités parlementaires", en: "Parliamentary committees" }, tag: { fr: "Étude des projets", en: "Bill study" }, desc: {
      fr: "De petits groupes de parlementaires qui étudient les projets de loi article par article entre la 2e et la 3e lecture, entendent des témoins et proposent des amendements.",
      en: "Small groups of parliamentarians that study bills clause by clause between 2nd and 3rd reading, hear witnesses and propose amendments." } },
    { role: { fr: "Leaders parlementaires et whips", en: "House leaders and whips" }, tag: { fr: "Discipline de vote", en: "Vote discipline" }, desc: {
      fr: "Dans chaque parti, le leader parlementaire négocie le déroulement des travaux et le whip s'assure que les député·e·s votent selon la ligne du parti — ce qui explique que « qui a voté quoi » suive presque toujours les lignes de parti.",
      en: "In each party, the House leader negotiates the flow of business and the whip ensures MPs vote the party line — which is why \"who voted what\" almost always follows party lines." } },
    { role: { fr: "La fonction publique et les ministères", en: "The public service and departments" }, tag: { fr: "Application des lois", en: "Implements laws" }, desc: {
      fr: "Les fonctionnaires qui appliquent concrètement les lois, sous la direction des ministres. Le Bureau du Conseil privé appuie directement le premier ministre et le Cabinet.",
      en: "The civil servants who implement laws, under the ministers' direction. The Privy Council Office directly supports the Prime Minister and Cabinet." } },
    { role: { fr: "La Cour suprême du Canada", en: "The Supreme Court of Canada" }, tag: { fr: "Pouvoir judiciaire", en: "Judicial branch" }, desc: {
      fr: "Le plus haut tribunal du pays : il peut invalider une loi contraire à la Constitution (dont la Charte), et le gouvernement peut lui demander un avis sur un projet (un « renvoi »).",
      en: "The country's highest court: it can strike down a law that violates the Constitution (including the Charter), and the government can ask it for an opinion on a question (a \"reference\")." } },
    { role: { fr: "L'huissier du bâton noir et le sergent d'armes", en: "The Usher of the Black Rod and the Sergeant-at-Arms" }, tag: { fr: "Cérémoniel", en: "Ceremonial" }, desc: {
      fr: "Figures de cérémonie : l'huissier du bâton noir (Sénat) frappe à la porte des Communes pour convoquer les député·e·s à la sanction royale ; le sergent d'armes porte la masse, symbole de l'autorité de la Chambre.",
      en: "Ceremonial figures: the Usher of the Black Rod (Senate) knocks on the Commons' door to summon MPs to royal assent; the Sergeant-at-Arms carries the mace, symbol of the House's authority." } },
  ] },
];
// Saut « D'où viennent ces données » depuis le lexique : bascule vers l'onglet
// Compte, déplie la section si elle est réduite (😴), puis défile jusqu'à elle
// (saut instantané après l'animation de changement d'onglet).
function jumpToApropos(){
  // La section vit maintenant au bas de l'onglet Lexique : saut interne direct.
  const body = document.getElementById('body-apropos');
  if(body && body.classList.contains('collapsed')) toggleSnooze('apropos', true);
  const e = document.getElementById('sec-apropos');
  if(!e) return;
  e.scrollIntoView({ behavior: 'auto', block: 'start' });
  // Dernière section de l'onglet : elle ne peut pas toujours atteindre le haut de
  // l'écran. Un flash de surbrillance guide l'œil vers elle.
  e.classList.remove('jump-highlight');
  void e.offsetWidth; // relance l'animation si déjà jouée
  e.classList.add('jump-highlight');
  setTimeout(() => e.classList.remove('jump-highlight'), 2000);
}

// Rendu riche de « Qui gravite » : groupes avec en-tête, chaque entrée = rôle,
// nom réel (vérifié), description, et une petite étiquette. Les entrées sans nom
// (comités, whips, Cour suprême…) sont des rôles collectifs/institutionnels.
// `q` : mot-clé déjà normalisé. La recherche du lexique ne filtrait que le jargon
// et laissait les seize cartes « Qui gravite » affichées telles quelles — chercher
// un terme laissait donc l'écran plein de résultats non pertinents.
function renderPeopleGroups(isEn, q){
  const L = o => isEn ? (o.en || o.fr) : (o.fr || o.en);
  // Même présentation que les termes du lexique : grille 2 colonnes, cartes néo,
  // badge coloré = le groupe. On coupe la partie explicative après le tiret cadratin
  // pour garder un badge court (le texte complet reste dans la donnée).
  const colors = ['var(--yellow)','var(--cyan)','var(--lime)','var(--pink)'];
  const shortGroup = s => String(s || '').split(' — ')[0];
  const cards = [];
  lexiconPeople.forEach((g, gi) => {
    const color = colors[gi % colors.length];
    const groupLabel = shortGroup(L(g.group));
    g.entries.forEach(e => {
      const name = (typeof officeholderNames !== 'undefined' && e.key && officeholderNames[e.key]) || e.name;
      const title = name || L(e.role);
      const roleLine = name ? `<div class="ppl-role">${L(e.role)}</div>` : '';
      const tagHtml = e.tag ? `<div class="ppl-tag">${L(e.tag)}</div>` : '';
      // On cherche dans tout ce que la carte montre : nom, fonction, groupe,
      // description, mention. Chercher « vérificatrice » doit sortir Karen Hogan.
      if(!matchesSearch([title, name, L(e.role), groupLabel, L(e.desc), e.tag ? L(e.tag) : ''].join(' '), q)) return;
      cards.push(`<div class="lexique-item">
          <div class="lex-head"><dt>${title}</dt><span class="lex-badge ppl-badge" style="background:${color}">${groupLabel}</span></div>
          <dd>${roleLine}${L(e.desc)}${tagHtml}</dd>
        </div>`);
    });
  });
  // Chaîne vide, pas une grille vide : l'appelant décide alors de retirer aussi
  // le titre de section et son texte d'introduction.
  return cards.length ? `<div class="lexique-grid">${cards.join('')}</div>` : '';
}

function renderLexique(){
  const el = document.getElementById('lexiqueList');
  if(!el) return;
  const isEn = currentLang === 'en';
  const L = o => isEn ? (o.en || o.fr) : (o.fr || o.en);
  const catOf = t => lexiconCatByTerm[t.term && t.term.fr] || null;
  const item = t => {
    const c = catOf(t);
    const badge = (c && LEX_CATS[c])
      ? `<span class="lex-badge" style="background:${LEX_CATS[c].color}">${isEn ? LEX_CATS[c].en : LEX_CATS[c].fr}</span>`
      : '';
    return `<div class="lexique-item"><div class="lex-head"><dt>${L(t.term)}</dt>${badge}</div><dd>${L(t.def)}</dd></div>`;
  };
  const lexQ = norm(document.getElementById('searchLexique') ? document.getElementById('searchLexique').value : '');
  let lexTerms = lexiconTerms;
  if(lexCatFilter) lexTerms = lexTerms.filter(t => catOf(t) === lexCatFilter);
  if(lexQ) lexTerms = lexTerms.filter(t => matchesSearch([L(t.term), L(t.def)].join(' '), lexQ));
  const lexChips = `<div class="lex-cats">
      <span class="lex-chip${!lexCatFilter ? ' active' : ''}" onclick="setLexCat(null)">${isEn ? 'All' : 'Tout'}</span>
      ${Object.keys(LEX_CATS).map(k => `<span class="lex-chip${lexCatFilter === k ? ' on' : ''}" style="${lexCatFilter === k ? 'background:' + LEX_CATS[k].color + ';' : ''}" onclick="setLexCat('${k}')">${isEn ? LEX_CATS[k].en : LEX_CATS[k].fr} (${lexiconTerms.filter(t => catOf(t) === k).length})</span>`).join('')}
    </div>`;
  const peopleTitle = isEn ? 'Who’s involved around Parliament' : 'Qui gravite autour du Parlement';
  const termsTitle = isEn ? 'Parliamentary jargon' : 'Le jargon parlementaire';
  const peopleIntro = `<div style="font-size:12.5px; line-height:1.6; color:var(--slate); margin:-4px 0 8px; max-width:680px;">${isEn ? "The real people around Parliament, beyond the elected members. These names live on a dozen scattered official sites, so — unlike the rest of this daily-refreshed site — they're hard to keep automatic: the two that change most often (House Speaker, Governor General) update on their own; the others are verified by hand and may lag briefly after a change." : "Les vraies personnes qui gravitent autour du Parlement, au-delà des élu·e·s. Ces noms sont éparpillés sur une dizaine de sites officiels différents : contrairement au reste du site (rafraîchi chaque jour), ils sont difficiles à garder automatiques. Les deux qui changent le plus souvent (présidence des Communes, gouverneure générale) se mettent à jour tout seuls ; les autres sont vérifiés à la main et peuvent accuser un court délai après un changement."}</div>`;

  // Sous recherche, une section vide ne garde ni son titre ni son texte
  // d'introduction : sinon chercher « vote » laissait un en-tête « Qui gravite »
  // suivi de rien, et le paragraphe explicatif poussait les vrais résultats
  // hors de l'écran.
  const people = renderPeopleGroups(isEn, lexQ);
  const lobby = lobbyRegistryBlock(isEn, lexQ);
  const peopleSection = people
    ? `<div class="role-group-title" id="sec-lexique-people">${peopleTitle}</div>` + (lexQ ? '' : peopleIntro) + people
    : '';
  // Le jargon garde son titre s'il a des résultats, ou s'il est seul à pouvoir
  // porter le message « rien ne correspond ».
  const termsSection = lexTerms.length
    ? `<div class="role-group-title" id="sec-lexique-terms" style="margin-top:${peopleSection || lobby ? '26px' : '0'};">${termsTitle}</div>`
      + (lexQ ? '' : lexChips)
      + '<div class="lexique-grid">' + lexTerms.map(item).join('') + '</div>'
    : (peopleSection || lobby)
      ? '' // d'autres sections répondent déjà : pas la peine d'annoncer un vide
      : `<div class="role-group-title" id="sec-lexique-terms">${termsTitle}</div>`
        + (lexQ ? '' : lexChips)
        + `<div class="no-results">${isEn ? 'Nothing in the glossary matches this search.' : 'Rien dans le lexique ne correspond à cette recherche.'}</div>`;

  el.innerHTML = peopleSection + lobby + termsSection;
}

// Registre des lobbyistes — bloc de RÉFÉRENCE (pas de donnée ingérée). Les fichiers
// ouverts du Commissariat au lobbying ne sont distribués que via un hôte qui refuse
// tout accès automatisé (curl, node, et même un vrai navigateur headless obtiennent
// une réponse vide), et il n'existe pas d'API interrogeable — impossible de garantir
// un flux fiable et à jour comme le reste du site. On oriente donc honnêtement vers
// les outils publics officiels (qui, eux, s'ouvrent dans le navigateur du visiteur).
function lobbyRegistryBlock(isEn, q){
  const title = isEn ? 'The lobbyist registry' : 'Le registre des lobbyistes';
  const body = isEn
    ? `Anyone paid to communicate with federal <b>public office holders</b> about laws, policies, grants or contracts must register in a <b>public registry</b>, overseen by the independent <b>Commissioner of Lobbying</b>. Registered lobbyists must also file <b>monthly reports</b> of their arranged communications with designated office holders (ministers, senior officials, MPs, senators).`
    : `Toute personne payée pour communiquer avec des <b>titulaires de charge publique</b> fédéraux au sujet de lois, politiques, subventions ou contrats doit s'inscrire à un <b>registre public</b>, supervisé par le <b>Commissaire au lobbying</b> (indépendant). Les lobbyistes inscrits doivent aussi déposer des <b>rapports mensuels</b> de leurs communications organisées avec les titulaires désignés (ministres, hauts fonctionnaires, député·e·s, sénateur·rice·s).`;
  // ⚠️ Cette note disait « on ne reproduit pas ce registre » — c'est devenu faux le
  // 2026-09-10, quand chaque fiche de projet s'est mise à afficher le lobbying
  // déclaré qui la nomme. Une page qui contredit le reste du site vaut moins que
  // pas de page du tout.
  const note = isEn
    ? `On each bill's page, DossierCanada shows the reported communications that <b>name that bill</b> — count, most active organizations, and recent meetings, each linked to its official record. Two limits we own: the Commissioner's files have no queryable API, so we refresh the archive by hand about once a month; and because bill numbers are reused from one Parliament to the next, we only count communications whose description names both the number and the bill's title. The figure shown is a floor. For everything else — a person, a company, a subject — the official tools below are the source.`
    : `Sur chaque fiche de projet de loi, DossierCanada affiche les communications déclarées qui <b>nomment ce projet</b> : compteur, organisations les plus actives, rencontres récentes, chacune liée à sa fiche officielle. Deux limites assumées : les fichiers du Commissariat n'ont pas d'API interrogeable, donc l'archive est rafraîchie à la main environ une fois par mois ; et comme les numéros de projets sont recyclés d'une législature à l'autre, on ne compte que les communications dont la description nomme le numéro <i>et</i> le titre. Le chiffre affiché est un plancher. Pour tout le reste — une personne, une entreprise, un sujet — les outils officiels ci-dessous font foi.`;
  const lg = isEn ? '' : '?lang=fra';
  // « Données ouvertes » → le portail officiel open.canada.ca (bilingue, fiable,
  // hors du pare-feu de lobbycanada.gc.ca) : le jeu « Rapports de communication ».
  const odUrl = isEn
    ? 'https://open.canada.ca/data/en/dataset/a34eb330-7136-4f5e-9f5f-3ba41df58b06'
    : 'https://open.canada.ca/data/fr/dataset/a34eb330-7136-4f5e-9f5f-3ba41df58b06';
  const links = [
    [isEn ? 'Search the registry ↗' : 'Rechercher dans le registre ↗', 'https://lobbycanada.gc.ca/app/secure/ocl/lrs/do/guest' + lg],
    [isEn ? 'Recent communications ↗' : 'Communications récentes ↗', 'https://lobbycanada.gc.ca/app/secure/ocl/lrs/do/rcntCmLgs' + lg],
    [isEn ? 'Open data ↗' : 'Données ouvertes ↗', odUrl],
  ];
  const linksHtml = links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener" style="color:var(--gold); white-space:nowrap;">${t}</a>`).join('<span style="color:var(--line); margin:0 8px;">·</span>');
  // Sous recherche, ce bloc n'a pas à rester planté là s'il ne répond pas.
  if(!matchesSearch([title, body, note, links.map(l => l[0]).join(' ')].join(' ').replace(/<[^>]+>/g, ' '), q)) return '';
  return `
    <div id="sec-lobby" style="background:var(--card); border:3px solid var(--line); border-radius:var(--radius); padding:14px 16px; margin:14px 0 4px; scroll-margin-top:12px;">
      <div style="font-family:'IBM Plex Mono',monospace; font-size:15px; font-weight:600; margin-bottom:6px;">🏢 ${title}</div>
      <p style="font-size:13px; line-height:1.65; color:var(--ink); margin:0 0 8px; max-width:680px;">${body}</p>
      <p style="font-size:12px; line-height:1.6; color:var(--slate); margin:0 0 10px; max-width:680px;">${note}</p>
      <div style="font-size:12.5px; display:flex; flex-wrap:wrap; align-items:center; row-gap:6px;">${linksHtml}</div>
    </div>`;
}

function updateChamberLabels(){
  const isEn = currentLang === 'en';
  const set = (id, fr, en) => { const e = document.getElementById(id); if(e) e.textContent = isEn ? en : fr; };
  set('chamberCommonsBtn', 'Chambre des communes', 'House of Commons');
  set('chamberSenateBtn', 'Sénat', 'Senate');
  set('voteCommonsBtn', 'Communes', 'Commons');
  set('voteSenateBtn', 'Sénat', 'Senate');
}

// Bascule Communes / Sénat de l'onglet « Députés » : masque le décor propre aux
// Communes (hémicycle, cabinet, recherche par code postal) et échange la grille.
function toggleChamberChip(){
  setChamber(chamberView === 'senate' ? 'commons' : 'senate');
}
function setChamber(c){
  chamberView = c;
  const isEn = currentLang === 'en';
  const senate = c === 'senate';
  document.getElementById('chamberCommonsBtn')?.classList.toggle('on', !senate);
  document.getElementById('chamberSenateBtn')?.classList.toggle('on', senate);
  const show = (id, on) => { const e = document.getElementById(id); if(e) e.style.display = on ? '' : 'none'; };
  show('commonsChrome', !senate);
  show('senateComposition', senate);
  show('senateInfoBox', senate);
  // Le comparateur compare des député·e·s — sans objet en vue Sénat.
  show('sec-comparateur', !senate);
  show('compareToolbar', !senate);
  show('comparateurTable', !senate);
  if(senate) renderSenateHemicycle();
  // La légende (bouton « Légende ») décrit la source de la liste affichée — elle
  // doit donc changer avec la chambre, sinon on annonce les député·e·s alors qu'on
  // affiche des sénateur·rice·s. L'état ouvert/fermé, lui, est conservé.
  const legendBox = document.getElementById('deputesInfoBox');
  if(legendBox) legendBox.innerHTML = senate
    ? (isEn
      ? 'These cards come from the official list of senators (sencanada.ca), bilingual. Senators are <b>appointed</b> (not elected) and serve until age 75; the parliamentary group, region, appointment date and attendance rate come from the official source. The Senate has 105 seats; vacant seats are not shown. No "Follow" button here for now.'
      : "Ces fiches viennent de la liste officielle des sénateur·rice·s (sencanada.ca), bilingue. Les sénateur·rice·s sont <b>nommé·e·s</b> (non élu·e·s) et siègent jusqu'à 75 ans ; le groupe parlementaire, la région, la date de nomination et le taux de présence proviennent de la source officielle. Le Sénat compte 105 sièges ; les sièges vacants n'apparaissent pas. Pas de bouton « Suivre » ici pour l'instant.")
    : t('trouve.info');
  const bandTitle = document.getElementById('deputesCountTitle');
  const nSen = (typeof senators !== 'undefined' && senators) ? senators.length : 0;
  if(bandTitle) bandTitle.textContent = senate
    ? (isEn ? nSen + ' senators' : nSen + ' sénateur·rice·s')
    : (isEn ? deputes.length + ' federal MPs' : deputes.length + ' députés fédéraux');
  const chip = document.getElementById('senateChip');
  if(chip) chip.classList.toggle('active', senate);
  senatorsShowAll = false;
  if(!senate) senateGroupFilter = '';
  renderPartyFilters();
  const pg = document.getElementById('deputesPager');
  if(pg && senate) pg.innerHTML = '';
  renderDeputes();
}

function setVoteChamber(c){
  votesShown = 6;
  voteChamber = c;
  const isEn = currentLang === 'en';
  const senate = c === 'senate';
  document.getElementById('voteCommonsBtn')?.classList.toggle('on', !senate);
  document.getElementById('voteSenateBtn')?.classList.toggle('on', senate);
  const show = (id, on) => { const e = document.getElementById(id); if(e) e.style.display = on ? '' : 'none'; };
  show('votesInfoBox', !senate);
  show('votesSummaryHint', !senate);
  show('senateVotesInfoBox', senate);
  const sBox = document.getElementById('senateVotesInfoBox');
  if(sBox) sBox.innerHTML = isEn
    ? '<b>On the Senate "who voted what" detail</b> — the Senate publishes each senator\'s name for every standing vote (yea / nay / abstention). The nominal detail above (the « + » button) comes straight from that official source (sencanada.ca), grouped by parliamentary group. Senators who have since left the chamber still appear under their group as recorded at the time. Senate votes are far fewer than in the Commons and often carry over the same bills.'
    : '<b>D\'où vient le « qui a voté quoi » du Sénat</b> — le Sénat publie le nom de chaque sénateur·rice pour chaque vote par appel nominal (Pour / Contre / abstention). Le détail nominatif ci-dessus (bouton « + ») vient directement de cette source officielle (sencanada.ca), groupé par groupe parlementaire. Les sénateur·rice·s ayant quitté la Chambre depuis apparaissent tel qu\'enregistré au moment du vote. Les votes du Sénat sont bien moins nombreux qu\'aux Communes et portent souvent sur les mêmes projets de loi.';
  renderVotes();
  renderPageBandCounts(); // le titre suit la chambre (Communes / Sénat)
}

/* Listes nominatives (qui a voté quoi) : un fichier par vote, chargé au clic.
   Recopiées dans site-data.js, elles ajoutaient 1 Mo à CHAQUE page pour un
   détail qui ne s'ouvre qu'à la demande. Restent partagés les décomptes par
   parti (v.per), eux nécessaires dès l'affichage de la carte. */
const ballotCache = new Map();
function loadBallots(key){
  if(ballotCache.has(key)) return Promise.resolve(ballotCache.get(key));
  return fetch('/data/votes/' + key + '.json')
    .then(r => { if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(j => { ballotCache.set(key, j); return j; });
}
function ballotsError(){
  return `<p style="font-size:12px; color:var(--slate); margin:8px 0 0;">${currentLang === 'en'
    ? 'The list of names could not be loaded. Try again.'
    : 'La liste des noms n’a pas pu être chargée. Réessayez.'}</p>`;
}
// Noms d'une catégorie, groupés par parti ou par groupe parlementaire.
function nominalGroupsHtml(rows, colors){
  const by = {};
  for(const r of rows) (by[r.c] = by[r.c] || []).push(r.n);
  const order = Object.keys(colors);
  const keys = Object.keys(by).sort((a, z) => (order.indexOf(a) + 99) - (order.indexOf(z) + 99));
  return keys.map(g => `
        <div class="nominal-party-group">
          <div class="nominal-party-header" style="color:${colors[g] || 'var(--slate)'}">${g} (${by[g].length})</div>
          <div class="nominal-grid">${by[g].map(n => `<div class="nominal-row"><span>${n}</span></div>`).join('')}</div>
        </div>`).join('');
}
// Remplit une zone nominale au premier dépliage : charge, puis dessine.
function fillNominal(el, key, group, colors){
  if(el.dataset.built) return;
  el.dataset.built = '1';
  el.innerHTML = `<p style="font-size:12px; color:var(--slate); margin:8px 0 0;">${currentLang === 'en' ? 'Loading names…' : 'Chargement des noms…'}</p>`;
  loadBallots(key)
    .then(names => {
      const rows = names[group] || [];
      el.innerHTML = rows.length ? nominalGroupsHtml(rows, colors)
        : `<p style="font-size:12px; color:var(--slate); margin:8px 0 0;">${currentLang === 'en' ? 'No one in this category.' : 'Personne dans cette catégorie.'}</p>`;
    })
    .catch(() => { el.innerHTML = ballotsError(); delete el.dataset.built; });
}

// Décompte compact par groupe, à partir des totaux par groupe du vote (v.per).
function senateGroupBreakdown(per, group){
  const by = {};
  for(const g in per) if(per[g][group]) by[g] = per[g][group];
  const order = Object.keys(groupColors);
  return Object.keys(by)
    .sort((a, z) => (order.indexOf(a) + 99) - (order.indexOf(z) + 99))
    .map(g => `<span style="color:${groupColors[g] || '#8a8f99'}">${g} ${by[g]}</span>`)
    .join(' · ');
}

// Liste compacte de votes du Sénat (utilisée pour les votes sur MOTIONS du Sénat).
function senateVotePanel(list, isEn, L){
  const yeaL = isEn ? 'Yea' : 'Pour', nayL = isEn ? 'Nay' : 'Contre', absL = isEn ? 'abstentions' : 'abstentions';
  const srcNote = isEn ? 'source' : 'source';
  const whoLabel = isEn ? 'who voted what' : 'qui a voté quoi';
  const rows = list.map(v => {
    const domId = 'snominal-' + v.id;
    return `
      <div class="vote-row">
        <div class="vote-row-head">
          <span class="vote-row-line"><span class="vote-row-date">${v.date}</span> · <b style="color:${v.passed?'var(--green)':'var(--red)'}">${L(v.result)}</b> · <b style="color:var(--green)">${v.totals.yea}</b> ${yeaL} / <b style="color:var(--red)">${v.totals.nay}</b> ${nayL}${v.totals.abstention?` · <b style="color:var(--slate)">${v.totals.abstention}</b> ${absL}`:''}</span>
          <span class="vote-row-toggle"><span class="tally-plus" id="plus-svrow-${v.id}" onclick="toggleVoteDetail('svrow-${v.id}')">+</span> <span class="vote-row-who">${whoLabel}</span></span>
        </div>
        <div class="vote-row-sub">${L(v.title)} · <a href="${L(v.url)}" target="_blank" rel="noopener">${srcNote}</a></div>
        <div id="svrow-${v.id}-detail" style="display:none">
          <div class="tally-row"><span class="tally-plus" onclick="toggleSenateNominal('${domId}',${v.id},'yea')" id="plus-${domId}-yea">+</span><span class="tally-label" style="color:var(--green)"><b>${v.totals.yea}</b> ${yeaL}</span><span class="tally-breakdown">${senateGroupBreakdown(v.per, 'yea')}</span></div>
          <div class="tally-row"><span class="tally-plus" onclick="toggleSenateNominal('${domId}',${v.id},'nay')" id="plus-${domId}-nay">+</span><span class="tally-label" style="color:var(--red)"><b>${v.totals.nay}</b> ${nayL}</span><span class="tally-breakdown">${senateGroupBreakdown(v.per, 'nay')}</span></div>
          <div class="tally-row"><span class="tally-plus" onclick="toggleSenateNominal('${domId}',${v.id},'abstention')" id="plus-${domId}-abstention">+</span><span class="tally-label" style="color:var(--slate)"><b>${v.totals.abstention}</b> ${absL}</span><span class="tally-breakdown">${senateGroupBreakdown(v.per, 'third')}</span></div>
          <div class="nominal-detail" id="${domId}-yea"></div>
          <div class="nominal-detail" id="${domId}-nay"></div>
          <div class="nominal-detail" id="${domId}-abstention"></div>
        </div>
      </div>`;
  }).join('');
  return `<div class="vote-list-panel">${rows}</div>`;
}

function renderSenateVotes(keyword){ return renderVotes(keyword); } // fusionnée dans renderVotes

function toggleSenateNominal(domId, voteId, group){
  const el = document.getElementById(domId + '-' + group);
  const plus = document.getElementById('plus-' + domId + '-' + group);
  const isOpen = el.classList.toggle('open');
  if(isOpen) fillNominal(el, 's-' + voteId, group === 'abstention' ? 'third' : group, groupColors);
  plus.textContent = isOpen ? '−' : '+';
}

// La présidence et les vice-présidences ne votent généralement pas quand elles
// président une séance (neutralité) — leur taux de présence très bas ne veut donc
// pas dire « absent·e » ; on les met en dernier dans le classement par présence.
// Seul le PRÉSIDENT est ici : il ne vote (presque) jamais → un taux ~0 % qui ne
// veut PAS dire « absent ». Les vice-président·e·s, eux, votent normalement hors
// présidence (taux réels élevés) — on ne les exclut donc PAS, leur présence
// affichée est juste. Titulaire vérifié 2026-07 sur
// ourcommons.ca/members/en/chair-occupants (codé en dur : re-vérifier au besoin).
const presidingRoles = {
  'francis scarpaleggia': { fr: 'Président de la Chambre des communes', en: 'Speaker of the House of Commons' },
};
function presidingRoleNote(name, isEn){
  const bareName = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const role = presidingRoles[norm(bareName)];
  return role ? (isEn ? role.en : role.fr) : null;
}
function resolveDepute(name){
  // Même convention que sponsorParty() : un nom peut porter un
  // suffixe "(Circonscription)" quand deux élu·e·s partagent le même nom (ex.
  // les deux "Eric Girard" — un vrai homonyme, pas une erreur). Si le nom est
  // ambigu sans ce suffixe et qu'aucune circonscription ne permet de trancher,
  // on refuse de deviner plutôt que de risquer d'attribuer les votes d'une
  // personne à une autre.
  const ridingMatch = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const bareName = ridingMatch ? ridingMatch[1].trim() : name;
  const ridingHint = ridingMatch ? ridingMatch[2].trim() : null;
  const candidates = deputes.filter(d => norm(d.name) === norm(bareName));
  return ridingHint ? candidates.find(d => norm(d.riding) === norm(ridingHint)) : (candidates.length === 1 ? candidates[0] : null);
}
// Présence à partir du bilan de votes fédéral précalculé (d.votingRecord, voir
// build-frontend-data.js) : { rate %, participated, total }.
function attendanceFromRecord(dep){
  const vr = dep && dep.votingRecord;
  if(!vr || vr.participationRate == null) return null;
  return { rate: Math.round(vr.participationRate * 100), participated: vr.cast, total: vr.eligible };
}
function computeAttendance(name){
  return attendanceFromRecord(resolveDepute(name));
}

// Décompte par parti d'une catégorie, à partir des totaux du vote (v.per).
function partyBreakdownHtml(per, group){
  const counts = {};
  for(const p in per) if(per[p][group]) counts[p] = per[p][group];
  return Object.keys(partyColors).filter(p => counts[p]).map(p => `<span style="color:${partyColors[p]}">${counts[p]} ${p}</span>`).join('');
}

// Liste compacte de votes des Communes (utilisée pour les votes sur MOTIONS, qui
// ne sont rattachés à aucun projet de loi et n'ont donc pas de carte).
function commonsVotePanel(list, isEn, L){
  const yeaL = isEn ? 'Yea' : 'Pour', nayL = isEn ? 'Nay' : 'Contre', pairL = isEn ? 'paired' : 'pairés';
  const srcNote = isEn ? 'source' : 'source';
  const whoLabel = isEn ? 'who voted what' : 'qui a voté quoi';
  const rows = list.map(v=>{
    const domId = 'nominal-' + v.number;
    return `
      <div class="vote-row">
        <div class="vote-row-head">
          <span class="vote-row-line"><span class="vote-row-date">${v.date}</span> · <b style="color:${v.passed?'var(--green)':'var(--red)'}">${L(v.result)}</b> · <b style="color:var(--green)">${v.totals.yea}</b> ${yeaL} / <b style="color:var(--red)">${v.totals.nay}</b> ${nayL}${v.totals.paired?` · <b style="color:var(--slate)">${v.totals.paired}</b> ${pairL}`:''}</span>
          <span class="vote-row-toggle"><span class="tally-plus" id="plus-vrow-${v.number}" onclick="toggleVoteDetail('vrow-${v.number}')">+</span> <span class="vote-row-who">${whoLabel}</span></span>
        </div>
        <div class="vote-row-sub">${L(v.description)} · <a href="${voteUrl(v)}" target="_blank" rel="noopener">${srcNote}</a></div>
        <div id="vrow-${v.number}-detail" style="display:none">
          <div class="tally-row"><span class="tally-plus" onclick="toggleNominalGroup('${domId}',${v.number},'yea')" id="plus-${domId}-yea">+</span><span class="tally-label" style="color:var(--green)"><b>${v.totals.yea}</b> ${yeaL}</span><span class="tally-breakdown">${partyBreakdownHtml(v.per,'yea')}</span></div>
          <div class="tally-row"><span class="tally-plus" onclick="toggleNominalGroup('${domId}',${v.number},'nay')" id="plus-${domId}-nay">+</span><span class="tally-label" style="color:var(--red)"><b>${v.totals.nay}</b> ${nayL}</span><span class="tally-breakdown">${partyBreakdownHtml(v.per,'nay')}</span></div>
          <div class="tally-row"><span class="tally-plus" onclick="toggleNominalGroup('${domId}',${v.number},'paired')" id="plus-${domId}-paired">+</span><span class="tally-label" style="color:var(--slate)"><b>${v.totals.paired}</b> ${pairL}</span><span class="tally-breakdown">${partyBreakdownHtml(v.per,'third')}</span></div>
          <div class="nominal-detail" id="${domId}-yea"></div>
          <div class="nominal-detail" id="${domId}-nay"></div>
          <div class="nominal-detail" id="${domId}-paired"></div>
        </div>
      </div>`;
  }).join('');
  return `<div class="vote-list-panel">${rows}</div>`;
}

/* ---------------- ONGLET VOTES : une carte PAR VOTE ----------------
   Les catégories affichées sont celles du VRAI registre de chaque chambre :
   Communes = Pour / Contre / Pairés (il n'y a PAS d'abstention aux Communes),
   Sénat    = Pour / Contre / Abstentions.
   On n'invente jamais une colonne « absents » (125 − votants) : absence et
   abstention sont deux choses différentes.
   Le résultat Adopté/Rejeté vient du champ officiel (v.passed), pas d'un calcul
   pour > contre : une égalité est rejetée et la présidence peut trancher. */
let votesShown = 6;
function loadMoreVotes(){ votesShown += 6; renderVotes(); }

function toggleVoteCard(id, evt){
  if(evt) evt.stopPropagation();
  const el = document.getElementById(id);
  if(!el) return;
  const willOpen = !el.classList.contains('open');
  document.querySelectorAll('.vc-detail.open').forEach(other => {
    if(other === el) return;
    other.classList.remove('open');
    const t = document.getElementById('vctog-' + other.id);
    if(t) t.textContent = '+';
  });
  el.classList.toggle('open', willOpen);
  if(willOpen) fillVoteNames(el);
  const tog = document.getElementById('vctog-' + id);
  if(tog) tog.textContent = willOpen ? '−' : '+';
}

// Trois colonnes de noms d'une carte de vote, au premier dépliage.
function fillVoteNames(detail){
  const wrap = detail.querySelector('.vc-ncols');
  if(!wrap || wrap.dataset.built) return;
  const key = wrap.dataset.ballots;
  if(!key) return;
  wrap.dataset.built = '1';
  const senate = key[0] === 's';
  const colorOf = code => (senate ? (groupColors[code] || '#8a8f99') : (partyColors[code] || '#8a8f99'));
  const bodies = [...wrap.querySelectorAll('.vc-nbody')];
  const vide = currentLang === 'en' ? 'Nobody' : 'Personne';
  bodies.forEach(b => { b.innerHTML = `<div class="vc-empty">${currentLang === 'en' ? 'Loading…' : 'Chargement…'}</div>`; });
  loadBallots(key)
    .then(names => bodies.forEach(b => {
      const rows = names[b.dataset.group] || [];
      b.innerHTML = rows.length
        ? rows.map(r => `<div class="vc-nrow"><span class="vc-chip" style="background:${colorOf(r.c)}"></span>${r.n}</div>`).join('')
        : `<div class="vc-empty">${vide}</div>`;
    }))
    .catch(() => { bodies.forEach(b => { b.innerHTML = `<div class="vc-empty">${currentLang === 'en' ? 'Names unavailable' : 'Noms indisponibles'}</div>`; }); delete wrap.dataset.built; });
}

function voteCardHtml(v, senate){
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  const vid = 'vc-' + (senate ? 's' : 'c') + (senate ? v.id : v.number);
  const t = v.totals || {};
  const pour = t.yea || 0, contre = t.nay || 0;
  const third = senate ? (t.abstention || 0) : (t.paired || 0);
  const thirdLbl = senate ? (isEn ? 'abst.' : 'abst.') : (isEn ? 'paired' : 'pairés');
  const sum = (pour + contre + third) || 1;
  const p = n => (n / sum * 100).toFixed(2) + '%';
  const adopted = !!v.passed;
  const title = senate ? L(v.title) : L(v.description);
  const url = senate ? (v.url ? L(v.url) : null) : voteUrl(v);
  const colorOf = code => (senate ? (groupColors[code] || '#8a8f99') : (partyColors[code] || '#8a8f99'));

  // Comptes par parti (ou par groupe) : calculés au build, donc disponibles tout
  // de suite. Les NOMS, eux, arrivent au dépliage de la carte (fillVoteNames).
  const per = v.per || {};
  const ref = senate ? groupColors : partyColors;
  const parties = Object.keys(ref).filter(c => per[c]).concat(Object.keys(per).filter(c => !(c in ref)));
  const pourL = isEn ? 'Yea' : 'Pour', contreL = isEn ? 'Nay' : 'Contre';
  const thirdFull = senate ? (isEn ? 'Abstentions' : 'Abstentions') : (isEn ? 'Paired' : 'Pairés');

  const pgrid = parties.map(c => {
    const col = colorOf(c);
    return `<div class="vc-pbox">
        <div class="vc-phead" style="background:${col}; color:${textOn(col)}">${c}</div>
        <div class="vc-pbody">
          <div class="vc-prow"><span>${pourL}</span><b>${per[c].yea}</b></div>
          <div class="vc-prow"><span>${contreL}</span><b>${per[c].nay}</b></div>
          <div class="vc-prow"><span>${thirdFull}</span><b>${per[c].third}</b></div>
        </div>
      </div>`;
  }).join('');

  const total = g => Object.values(per).reduce((n, o) => n + (o[g] || 0), 0);
  const col = (g, label, cls) => `<div class="vc-ncol">
        <div class="vc-nhead ${cls}">${label} — ${total(g)}</div>
        <div class="vc-nbody" data-group="${g}"></div>
      </div>`;

  const srcName = senate ? 'sencanada.ca' : 'ourcommons.ca';
  const foot = `<div class="vc-foot">
      <span class="vc-foot-note">${senate
        ? (isEn ? 'An abstention is not a "no" vote.' : "Une abstention n'est pas un vote « non ».")
        : (isEn ? 'Paired is not absent: two members from opposing sides agree not to vote.' : "Pairé n'est pas absent : deux élu·e·s de camps opposés s'entendent pour ne pas voter.")}</span>
      ${url ? `<a class="bill-more" href="${url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${isEn ? 'Official record' : 'Procès-verbal officiel'} → ${srcName}</a>` : ''}
    </div>`;

  return `<div class="vote-card">
    <div class="vc-head" onclick="toggleVoteCard('${vid}', event)">
      <span class="result-badge ${adopted ? 'adopte' : 'rejete'}">${L(v.result)}</span>
      <div class="vc-head-main">
        <h3>${title}</h3>
        <div class="vc-meta">${v.date} · ${isEn ? 'Recorded vote' : 'Vote nominal'}${v.billNumber ? ' · ' + v.billNumber : ' · ' + (isEn ? 'Motion' : 'Motion')}</div>
      </div>
      <div class="vc-counts">
        <span class="vcc pour"><b>${pour}</b> ${pourL}</span>
        <span class="vcc contre"><b>${contre}</b> ${contreL}</span>
        <span class="vcc abst"><b>${third}</b> ${thirdLbl}</span>
      </div>
      <span class="vc-toggle" id="vctog-${vid}">+</span>
    </div>
    <div class="bar vc-bar" onclick="toggleVoteCard('${vid}', event)">
      <div class="seg pour" style="width:${p(pour)}"></div>
      <div class="seg contre" style="width:${p(contre)}"></div>
      <div class="seg abst" style="width:${p(third)}"></div>
    </div>
    <div class="vc-detail" id="${vid}">
      <div class="vc-pgrid">${pgrid}</div>
      <div class="vc-ncols" data-ballots="${senate ? 's-' + v.id : 'c-' + v.number}">${col('yea', pourL, 'pour')}${col('nay', contreL, 'contre')}${col('third', thirdFull, 'abst')}</div>
      ${foot}
    </div>
  </div>`;
}
function renderVotes(keyword){
  const senate = voteChamber === 'senate';
  const isEn = currentLang === 'en';
  const L = o => (o && typeof o === 'object') ? (isEn ? (o.en ?? o.fr ?? '') : (o.fr ?? o.en ?? '')) : (o ?? '');
  keyword = keyword !== undefined ? keyword : (document.getElementById('searchVotes')?.value || '');
  const kw = norm(keyword);
  // Votes ET motions ensemble : une motion est un vote comme un autre, seulement
  // sans projet de loi rattaché. Plus de bouton pour les cacher.
  const src = senate ? (typeof senateVotes !== 'undefined' ? senateVotes : []) : votes;
  const full = src
    .filter(v => matchesSearch([senate ? L(v.title) : L(v.description), v.billNumber || ''].join(' '), kw))
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || ((b.number || b.id || 0) - (a.number || a.id || 0)));
  const list = full.slice(0, votesShown);
  const el = document.getElementById('votesList');
  if(!el) return;
  el.innerHTML = list.length
    ? list.map(v => voteCardHtml(v, senate)).join('')
    : `<div class="no-results">${isEn ? 'No vote matches this search.' : 'Aucun vote ne correspond à cette recherche.'}</div>`;
  if(full.length > votesShown){
    const step = Math.min(6, full.length - votesShown);
    el.innerHTML += `<button class="votes-more" onclick="loadMoreVotes()">${isEn
      ? 'See ' + step + ' more — ' + list.length + ' of ' + full.length + ' shown'
      : 'Voir ' + step + ' de plus — ' + list.length + ' sur ' + full.length + ' affichés'}</button>`;
  } else if(full.length > 6){
    el.innerHTML += `<div class="votes-more-note">${isEn ? 'All ' + full.length + ' shown' : 'Les ' + full.length + ' affichés'}</div>`;
  }
  const st = document.getElementById('statVotes');
  if(st) st.textContent = votes.length;
}

function toggleNominalGroup(domId, voteNum, group){
  const el = document.getElementById(domId + '-' + group);
  const plus = document.getElementById('plus-' + domId + '-' + group);
  const isOpen = el.classList.toggle('open');
  if(isOpen) fillNominal(el, 'c-' + voteNum, group === 'paired' ? 'third' : group, partyColors);
  plus.textContent = isOpen ? '−' : '+';
}

/* ---------------- MISES À JOUR DU SITE (/mises-a-jour) ----------------
   data/journal.json est tenu À LA MAIN : un changement visible du site y ajoute son entrée,
   dans le même commit que le changement. Chaque entrée garde ses commits dans `commits`,
   pour qu'on puisse toujours remonter à ce qui a vraiment été fait. Rien n'y entre qui ne
   soit en ligne, ni rien qu'une page publique ne doit dire. Chargé seulement quand la page
   est affichée (et pré-rendu au build pour les robots). */
const JOURNAL_VOLETS = {
  projets: ['Projets de loi', 'Bills'],
  deputes: ['Député·e·s', 'MPs'],
  votes:   ['Votes', 'Votes'],
  lexique: ['Lexique', 'Glossary'],
  compte:  ['Compte', 'Account'],
  site:    ['Tout le site', 'Whole site'],
};
const JOURNAL_PREMIERES = 20;   // au-delà, un bouton ouvre le reste
let journal = null, journalTout = false, journalChargement = null;
function ensureJournal(){
  if(journal) return Promise.resolve(journal);
  if(!journalChargement){
    journalChargement = fetch('/data/journal.json')
      .then(r => { if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(j => { journal = Array.isArray(j) ? j : []; return journal; })
      .catch(e => { journalChargement = null; throw e; });
  }
  return journalChargement;
}
function renderJournal(){
  const liste = document.getElementById('journalListe');
  if(!liste) return;
  const vue = document.getElementById('view-bd');
  if(!journal){
    // Pas de téléchargement tant que la page n'est pas affichée.
    if(!vue || !vue.classList.contains('active')) return;
    ensureJournal().then(renderJournal).catch(e => {
      console.error('journal des mises à jour :', e);
      liste.innerHTML = `<li class="maj-vide">${currentLang === 'en' ? 'The update log could not be loaded. Try reloading the page.' : 'Le journal des mises à jour n’a pas pu être chargé. Rechargez la page pour réessayer.'}</li>`;
    });
    return;
  }
  const en = currentLang === 'en';
  const loc = en ? 'en-CA' : 'fr-CA';
  const esc = (x) => String(x ?? '').replace(/[&<>"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  // AAAA-MM-JJ lu comme une date LOCALE : new Date('2026-09-21') serait minuit UTC,
  // donc le 20 au soir au Canada.
  const jour = (iso) => { const [a, m, j] = iso.split('-').map(Number); return new Date(a, m - 1, j); };
  const fmtMois = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' });
  const fmtJour = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long' });
  const entrees = journal.filter((e) => e && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && e.fr)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const visibles = journalTout ? entrees : entrees.slice(0, JOURNAL_PREMIERES);
  let html = '', mois = '';
  for(const e of visibles){
    if(e.date.slice(0, 7) !== mois){
      if(mois) html += '</ol></li>';
      mois = e.date.slice(0, 7);
      const t = fmtMois.format(jour(e.date));
      html += `<li class="maj-mois"><h2>${esc(t.charAt(0).toUpperCase() + t.slice(1))}</h2><ol>`;
    }
    const txt = (en && e.en) ? e.en : e.fr;
    const volet = JOURNAL_VOLETS[e.volet] ? e.volet : 'site';
    html += `<li class="maj-entree"><time datetime="${esc(e.date)}">${esc(fmtJour.format(jour(e.date)))}</time>`
      + `<div class="maj-corps"><span class="maj-volet maj-volet-${volet}">${esc(JOURNAL_VOLETS[volet][en ? 1 : 0])}</span>`
      + `<h3>${esc(txt.titre)}</h3><p>${esc(txt.texte)}</p></div></li>`;
  }
  if(mois) html += '</ol></li>';
  liste.innerHTML = html || `<li class="maj-vide">${en ? 'No updates to show yet.' : 'Aucune mise à jour à afficher pour l’instant.'}</li>`;
  const plus = document.getElementById('journalPlus');
  if(plus){
    const reste = entrees.length - visibles.length;
    plus.hidden = reste <= 0;
    plus.textContent = en
      ? `Show ${reste} older update${reste > 1 ? 's' : ''}`
      : `Voir ${reste > 1 ? `les ${reste} mises à jour plus anciennes` : 'la mise à jour plus ancienne'}`;
  }
}
document.getElementById('journalPlus')?.addEventListener('click', () => { journalTout = true; renderJournal(); });

/* ---------------- NAV ---------------- */
/* Routage par URL (SEO) — chaque onglet a sa propre adresse indexable.
   ⚠️ data-view "ministres" = onglet DÉPUTÉS (slug /deputes) ;
      data-view "cabinet"   = onglet MINISTRES (slug /ministres). */
/* Chaque langue a SES adresses : /projets-de-loi en français, /en/bills en
   anglais. Une page anglaise sous une adresse française se lit mal, et Google
   associe les mots de l'adresse à la langue de la page. Doit rester identique
   à VIEWS dans scripts/seo-pages.js, qui génère les fichiers et le sitemap. */
const VIEW_SLUGS = { apercu:'/', ministres:'/deputes', cabinet:'/ministres', projets:'/projets-de-loi', votes:'/votes', lexique:'/lexique', bd:'/mises-a-jour' };
const VIEW_SLUGS_EN = { apercu:'/', ministres:'/mps', cabinet:'/ministers', projets:'/bills', votes:'/votes', lexique:'/glossary', bd:'/updates' };
const SLUG_VIEWS = { '':'apercu', 'deputes':'ministres', 'ministres':'cabinet', 'projets-de-loi':'projets', 'votes':'votes', 'lexique':'lexique', 'mises-a-jour':'bd' };
// L'ancienne adresse anglaise (/en/deputes) reste comprise : Vercel la redirige,
// mais un lien partagé avant le changement doit aussi s'ouvrir sans recharger.
const SLUG_VIEWS_EN = { '':'apercu', 'mps':'ministres', 'ministers':'cabinet', 'bills':'projets', 'votes':'votes', 'glossary':'lexique', 'updates':'bd', ...SLUG_VIEWS };
// Hôte canonique : l'apex dossiercanada.ca renvoie un 308 vers www, donc
// canonical, hreflang, og:url et sitemap pointent sur www (jamais sur une redirection).
const SITE_ORIGIN = 'https://www.dossiercanada.ca';
/* SOURCE UNIQUE des titres et descriptions (FR/EN) de chaque page.
   scripts/build-section-pages.js lit CET objet pour écrire le <head> de chaque
   page générée ; syncHead() l'applique quand on change d'onglet sans recharger.
   Titres ~50–60 caractères, descriptions ~150–160, et toujours « Canada »,
   « fédéral », « Communes » ou « Parlement » (ne pas copier DossierQuébec). */
const PAGE_META = {
  apercu:    { fr:"DossierCanada — Qui siège et qui vote au Parlement du Canada",
               en:"DossierCanada — Who sits and votes in Canada's Parliament",
               dfr:"Le Parlement du Canada sans jargon : qui siège aux Communes, ce que change chaque projet de loi fédéral, qui a voté quoi. Site citoyen indépendant et gratuit.",
               den:"Canada's Parliament without the jargon: who sits in the House of Commons, what each federal bill changes and who voted how. Independent, free, citizen-run." },
  ministres: { fr:"Députés fédéraux à la Chambre des communes — DossierCanada",
               en:"Canada's MPs in the House of Commons — DossierCanada",
               dfr:"Chaque député·e en poste à la Chambre des communes du Canada (343 sièges) : circonscription, parti et présence aux votes, d'après les données officielles.",
               den:"Every sitting MP in Canada's 343-seat House of Commons: riding, party and attendance at recorded votes, straight from official House of Commons records." },
  cabinet:   { fr:"Le Cabinet fédéral : les ministres du Canada — DossierCanada",
               en:"The federal Cabinet: Canada's ministers — DossierCanada",
               dfr:"Les ministres du Cabinet fédéral du Canada : le portefeuille de chaque ministre, son courriel officiel et sa présence aux votes des Communes. Source : pm.gc.ca.",
               den:"The ministers of Canada's federal Cabinet: each minister's portfolio, official email and attendance at House of Commons recorded votes. Source: pm.gc.ca." },
  projets:   { fr:"Projets de loi du Parlement du Canada — DossierCanada",
               en:"Federal bills in Canada's Parliament — DossierCanada",
               dfr:"Chaque projet de loi fédéral, des Communes ou du Sénat, résumé en langage clair : étape réelle, parrain, votes et lobbying déclaré. Texte officiel en lien.",
               den:"Every federal bill, from the Commons or the Senate, summarized in plain language: actual stage, sponsor, votes and declared lobbying. Official text linked." },
  votes:     { fr:"Votes à la Chambre des communes du Canada — DossierCanada",
               en:"Recorded votes in Canada's House of Commons — DossierCanada",
               dfr:"Chaque vote par appel nominal de la Chambre des communes du Canada : résultat, marge et vote de chaque député·e, regroupé par parti. Source : noscommunes.ca.",
               den:"Every recorded division in Canada's House of Commons: which MPs voted yea, nay or were paired, and by what margin. The official record, as published." },
  lexique:   { fr:"Lexique du Parlement du Canada, sans jargon — DossierCanada",
               en:"Glossary of Canada's Parliament, jargon-free — DossierCanada",
               dfr:"Le vocabulaire du Parlement du Canada traduit en mots de tous les jours : étapes d'un projet de loi, vote nominal, sanction royale, et qui fait quoi.",
               den:"The vocabulary of Canada's Parliament in everyday words: the stages of a bill, recorded votes, royal assent, and who does what on Parliament Hill." },
  bd:        { fr:"Mises à jour de DossierCanada, et qui l'a bâti — DossierCanada",
               en:"DossierCanada updates, and who built the site — DossierCanada",
               dfr:"Pourquoi DossierCanada existe, raconté par celui qui l'a bâti, et le journal de ce qui change sur le site, du plus récent au plus ancien.",
               den:"Why DossierCanada exists, told by the person who built it, plus the log of what changes on the site, newest first." }
};
function pathParts(){
  const parts = location.pathname.replace(/\.html$/, '').split('/').filter(Boolean);
  let lang = 'fr';
  if (parts[0] === 'en') { lang = 'en'; parts.shift(); }
  else if (parts[0] === 'fr') { parts.shift(); }
  return { lang, seg: parts[0] || '' };
}
function viewFromPath(){
  const { lang, seg } = pathParts();
  const table = lang === 'en' ? SLUG_VIEWS_EN : SLUG_VIEWS;
  return table[seg] || 'apercu';
}
function pathForView(viewName, lang){
  const L = lang || currentLang;
  const slug = (L === 'en' ? VIEW_SLUGS_EN : VIEW_SLUGS)[viewName] || '/';
  if (L === 'en') return slug === '/' ? '/en' : '/en' + slug;
  return slug;
}
// Aligne le <head> sur l'onglet affiché quand on navigue sans recharger (le build
// écrit déjà la bonne version dans chaque page ; ceci garde le DOM cohérent).
function syncHead(viewName){
  const m = PAGE_META[viewName]; if(!m) return;
  const en = (typeof currentLang !== 'undefined' && currentLang === 'en');
  const title = en ? m.en : m.fr, desc = en ? m.den : m.dfr;
  const url = SITE_ORIGIN + pathForView(viewName, currentLang);
  document.title = title;
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if(el) el.setAttribute(attr, val); };
  set('meta[name="description"]', 'content', desc);
  set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:title"]', 'content', title);
  set('meta[property="og:description"]', 'content', desc);
  set('meta[property="og:url"]', 'content', url);
  set('meta[property="og:locale"]', 'content', en ? 'en_CA' : 'fr_CA');
  set('meta[property="og:locale:alternate"]', 'content', en ? 'fr_CA' : 'en_CA');
  set('meta[name="twitter:title"]', 'content', title);
  set('meta[name="twitter:description"]', 'content', desc);
  set('link[rel="alternate"][hreflang="fr"]', 'href', SITE_ORIGIN + pathForView(viewName, 'fr'));
  set('link[rel="alternate"][hreflang="en"]', 'href', SITE_ORIGIN + pathForView(viewName, 'en'));
  set('link[rel="alternate"][hreflang="x-default"]', 'href', SITE_ORIGIN + pathForView(viewName, 'fr'));
}
// Liens internes = vrais <a href> (les robots ne suivent pas les boutons). Leur
// href suit la langue ; la bascule FR/EN pointe vers la même page dans l'autre langue.
function syncNavHrefs(view){
  view = VIEW_SLUGS[view] ? view : viewFromPath();
  document.querySelectorAll('a[data-view]').forEach(a=>{
    if(VIEW_SLUGS[a.dataset.view]) a.setAttribute('href', pathForView(a.dataset.view, currentLang));
  });
  const other = currentLang === 'fr' ? 'en' : 'fr';
  const lt = document.getElementById('langToggle');
  if(lt){
    lt.setAttribute('href', pathForView(view, other));
    lt.setAttribute('hreflang', other); lt.setAttribute('lang', other);
    lt.textContent = other.toUpperCase();
  }
}
function isPlainLeftClick(e){ return e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey); }
// Un seul titre de niveau 1 par vue affichée. Le HTML de chaque page n'a qu'un titre h1
// (celui de sa vue) ; après une navigation sans rechargement, c'est le titre de la vue
// affichée qui doit être annoncé comme principal aux lecteurs d'écran.
function syncHeadingLevel(viewName){
  document.querySelectorAll('.band-title, h1.sr-only, h2.sr-only[data-i18n="seo.h1"]').forEach(el=>{
    const on = !!el.closest('#view-' + viewName);
    if(on && el.tagName !== 'H1'){ el.setAttribute('role', 'heading'); el.setAttribute('aria-level', '1'); }
    else { el.removeAttribute('role'); el.removeAttribute('aria-level'); }
  });
}
function goToTab(viewName, opts){
  opts = opts || {};
  document.querySelectorAll('nav.tabs a[data-view]').forEach(a=>{
    const on = a.dataset.view === viewName;
    a.classList.toggle('active', on);
    if(on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const target = document.getElementById('view-'+viewName);
  if(target) target.classList.add('active');
  ensureViewData(viewName);
  if(viewName === 'bd') renderJournal();
  syncHeadingLevel(viewName);
  closeMobileMenu();
  if(!opts.noScroll) window.scrollTo({top:0, behavior: opts.fromHistory ? 'auto' : 'smooth'});
  if(!opts.fromHistory && VIEW_SLUGS[viewName]){
    const url = pathForView(viewName, currentLang);
    const here = (location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/');
    const norm = (url.replace(/\/$/, '') || '/');
    if(here !== norm){ history.pushState({ view: viewName, lang: currentLang }, '', url); }
  }
  syncHead(viewName);
  syncNavHrefs(viewName);
}
window.addEventListener('popstate', ()=>{
  const { lang } = pathParts();
  if (lang !== currentLang) { currentLang = lang; applyLanguage(); }
  goToTab(viewFromPath(), { fromHistory: true });
});

// Un seul écouteur pour tous les liens internes (menu, logo, fil d'Ariane, tuiles…).
// Clic simple : navigation sans rechargement. Ctrl/Cmd/Maj-clic ou clic du milieu :
// le navigateur ouvre le lien normalement (nouvel onglet).
document.addEventListener('click', e=>{
  const a = e.target.closest && e.target.closest('a[data-view]');
  if(!a || e.defaultPrevented || !isPlainLeftClick(e)) return;
  e.preventDefault();
  goToTab(a.dataset.view);
});

function openMobileMenu(){
  document.querySelector('nav.tabs').classList.add('open');
  const hb=document.getElementById('hamburgerBtn');
  hb.setAttribute('aria-expanded','true');
  if(typeof t==='function') hb.setAttribute('aria-label', t('aria.menuClose'));
}
function closeMobileMenu(){
  document.querySelector('nav.tabs').classList.remove('open');
  const hb=document.getElementById('hamburgerBtn');
  hb.setAttribute('aria-expanded','false');
  if(typeof t==='function') hb.setAttribute('aria-label', t('aria.menu'));
}
// (Les clics du bouton menu et de « Fermer » sont branchés dans le petit script qui suit <nav>.)

const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
});

document.getElementById('searchMinistres').addEventListener('input', e=> { renderMinistres(e.target.value); renderDeputes(e.target.value); });
document.getElementById('searchBills').addEventListener('input', ()=> renderBills());
document.getElementById('searchLexique')?.addEventListener('input', ()=> renderLexique());
document.getElementById('searchVotes').addEventListener('input', ()=> { votesShown = 6; renderVotes(); });

/* ---------------- INIT ---------------- */
/* Redessine tout ce qui dépend des données. Appelée au démarrage et chaque fois
   qu'un fichier d'onglet arrive : les vues sans données se redessinent à vide,
   ce qui ne coûte rien et évite d'avoir à savoir qui dépend de quoi. */
function renderAll(){
  for (const f of [renderHemicycle, renderMinistres, renderStatusFilters, renderStepFilters,
                   updateSortToggleLabel, updateMotionsToggleLabel, updatePetitionsToggleLabel,
                   updateMinistresSortLabel, renderAccountBox, renderFlagBox, renderAdminFlagCounts,
                   renderComparateurSelects, renderComparateurTable, renderBills, renderApercuBills,
                   renderApercuStats, renderPageBandCounts, renderVotes, renderDeputes, renderNews,
                   renderSittings, renderChallenged, renderProvinceNetwork, renderTicker]) {
    // Sans await : renderChallenged interroge Supabase en tâche de fond, comme avant.
    try { const r = f(); if (r && r.catch) r.catch(e => console.error('[init]', f.name, e)); }
    catch (e) { console.error('[init]', f.name, e); }
  }
}

(async function init(){
  // Chaque étape est isolée : une panne (réseau, extension de navigateur, donnée
  // inattendue) ne doit plus empêcher le reste de la page de s'afficher.
  const safe = async (f) => { try { await f(); } catch (e) { console.error('[init]', f.name || f, e); } };
  await safe(loadFollowed);
  await safe(loadIntroState);
  await safe(loadTheme);
  await safe(loadFontZoom);
  await safe(loadFollowedDeputes);
  await safe(loadFollowedBills);
  // Les comptes ne doivent jamais bloquer l'affichage : si Supabase ne répond pas
  // (session enregistrée, réseau pendu), on dessine sans eux après 3 s ; initAuth
  // redessine ensuite la boîte de compte et les listes quand il finit par répondre.
  await Promise.race([safe(initAuth), new Promise(r => setTimeout(r, 3000))]);
  // Données de l'onglet d'arrivée : attendues ici pour que la page se dessine
  // pleine du premier coup (et que le pré-rendu capture du vrai contenu).
  await safe(() => ensureData(VIEW_DATA[viewFromPath()] || []));
  renderAll();
  await safe(afficherBandeTemoins);
  await safe(loadSnoozedSections);
  await safe(applyLanguage);
  // Ouvre l'onglet correspondant à l'adresse d'arrivée (/votes, /deputes…).
  const bootView = viewFromPath();
  history.replaceState({ view: bootView }, '', location.pathname + location.search);
  if(bootView !== 'apercu'){ goToTab(bootView, { fromHistory: true, noScroll: true }); }
  else { syncHead('apercu'); syncNavHrefs('apercu'); }
  // Lien profond partagé (/projets-de-loi?pl=NUM) : ouvre le projet ciblé.
  await safe(openBillFromQuery);
  // Signal pour scripts/prerender-pages.js (pré-rendu au build) : la page est rendue.
  window.__dcReady = true;
})();
