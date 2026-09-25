// Repérer un projet de loi OMNIBUS, et compter ses parties.
//
// Un omnibus regroupe sous un seul titre des changements à plusieurs lois différentes.
// Le titre n'en nomme qu'une partie : le C-39, « Loi visant à bâtir un Canada fort »,
// touche l'évaluation d'impact, la Régie de l'énergie, la Loi sur les douanes, la taxe
// d'accise, le droit criminel… Résumé comme un projet ordinaire (6 à 8 puces), il ne
// disait rien de la plupart de ses parties, et le lecteur ne pouvait pas le devinier.
//
// Au fédéral, le découpage se lit dans le SOMMAIRE OFFICIEL (LEGISinfo) :
//   FR « La partie 1 met en œuvre… », « La section 2 de la partie 1 modifie… »
//   EN « Part 1 implements… »,       « Division 2 of Part 1 amends… »
// (L'équivalent des « annexes » de l'Ontario, qui découpe ses omnibus autrement.)
//
// Règle : deux parties ou plus = omnibus. Un projet à UNE partie découpée en deux
// sections ou plus l'est aussi (les lois budgétaires : une partie, vingt sections).

const uniq = (arr) => [...new Set(arr)];

function numbersOf(text, re) {
  const out = [];
  let m;
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  while ((m = rx.exec(text || ''))) out.push(Number(m[1]));
  return uniq(out).filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
}

// { isOmnibus, parts, divisions } — `parts` et `divisions` sont des NUMÉROS distincts.
export function detectOmnibus(summary) {
  const fr = (summary && summary.fr) || '';
  const en = (summary && summary.en) || '';
  const parts = uniq([
    ...numbersOf(fr, /\bpartie\s+(\d+)/gi),
    ...numbersOf(en, /\bPart\s+(\d+)\b/g),
  ]).sort((a, b) => a - b);
  const divisions = uniq([
    ...numbersOf(fr, /\bsection\s+(\d+)\s+de\s+la\s+partie\b/gi),
    ...numbersOf(en, /\bDivision\s+(\d+)\s+of\s+Part\b/gi),
  ]).sort((a, b) => a - b);
  return { isOmnibus: parts.length >= 2 || divisions.length >= 2, parts, divisions };
}
