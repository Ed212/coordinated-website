function render(){ renderCore(); renderLedgerV4(); }
// Person-by-person ledger, rendered from the measured LEDGER with the weekday on every date (the fixture's busiest weeks start Mon Sep 28 and Mon Oct 19, 2026).
var WEEKDAY = { 'Sep 28':'Mon Sep 28', 'Oct 19':'Mon Oct 19' };
function withWeekday(s){ return String(s).replace(/\b(Sep 28|Oct 19)\b/g, function(m){ return WEEKDAY[m] || m; }); }
function renderLedgerV4(){
  var L = document.getElementById('ledgerV4'); if (!L) return;
  L.innerHTML = '<tr><th>Person</th><th>Role</th><th class="num">Cards to answer</th><th class="num">Settlement notes to read</th><th class="num">Channel posts to read</th><th class="num">Reading minutes (estimate)</th><th>Busiest week</th></tr>' +
    Object.keys(LEDGER).map(function(k){ var p = LEDGER[k]; return '<tr><td>' + k[0].toUpperCase() + k.slice(1) + '</td><td>' + p.persona + (p.approvals ? ' (also approved ' + p.approvals + ' sends)' : '') + '</td><td class="num">' + p.cards + '</td><td class="num">' + p.notes + '</td><td class="num">' + p.posts + '</td><td class="num">' + h1(p.words / P.wpm.v) + '</td><td>' + (p.peak === 'none' ? 'none' : 'week of ' + withWeekday(p.peak)) + '</td></tr>'; }).join('') +
    '<tr class="co"><td>Total</td><td>nine people, seven weeks</td><td class="num">' + FIX.cards + '</td><td class="num">' + FIX.notes + '</td><td class="num">' + FIX.postsPerPerson + ' each</td><td class="num">' + h1(FIX.wordsTotal / P.wpm.v) + '</td><td></td></tr>';
}

buildControls(); render();
