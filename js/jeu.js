// ================================
// CONFIGURATION DES JEUX
// ================================

function getNoms() {
  const data = localStorage.getItem('noms-lan');
  return data ? JSON.parse(data) : {
    equipes: { 1: 'Équipe 1', 2: 'Équipe 2', 3: 'Équipe 3', 4: 'Équipe 4' },
    joueurs: {
      1: 'Joueur 1',   2: 'Joueur 2',   3: 'Joueur 3',
      4: 'Joueur 4',   5: 'Joueur 5',   6: 'Joueur 6',
      7: 'Joueur 7',   8: 'Joueur 8',   9: 'Joueur 9',
      10: 'Joueur 10', 11: 'Joueur 11', 12: 'Joueur 12'
    }
  };
}

function getScores() {
  const data = localStorage.getItem('scores-lan');
  return data ? JSON.parse(data) : {};
}

// ================================
// FONCTION PRINCIPALE
// ================================

function initialiserPageJeu(jeuId) {
  const noms = getNoms();
  const scores = getScores();
  const e = noms.equipes;
  const j = noms.joueurs;

  afficherScoring(jeuId, scores);

  switch(jeuId) {
    case 'rocket-league': afficherMatchsRocketLeague(e); break;
    case 'the-finals':    afficherMatchsTheFinales(e);   break;
    case 'wntgd':         afficherMatchsWNTGD();          break;
    case 'party-animals': afficherMatchsPartyAnimals(j);  break;
    case 'l4d2':          afficherMatchsL4D2(e);          break;
    case 'golf-it':       afficherMatchsGolfIt();         break;
    case 'aoe1':          afficherMatchsAOE1(e);          break;
    case 'among-us':      afficherMatchsAmongUs();        break;
    case 'nidhogg':       afficherMatchsNidhogg(j);       break;
  }
}

// ================================
// SCORING GÉNÉRAL
// ================================

function afficherScoring(jeuId, scores) {
  const conteneur = document.getElementById('scoring-' + jeuId);
  if (!conteneur) return;

  const pointsParJeu = {
    'rocket-league': { 1: 0, 2: 0, 3: 0, 4: 0 },
    'the-finals':    { 1: 0, 2: 0, 3: 0, 4: 0 },
    'wntgd':         { 1: 0, 2: 0, 3: 0, 4: 0 },
    'party-animals': { 1: 0, 2: 0, 3: 0, 4: 0 },
    'l4d2':          { 1: 0, 2: 0, 3: 0, 4: 0 },
    'golf-it':       { 1: 0, 2: 0, 3: 0, 4: 0 },
    'aoe1':          { 1: 0, 2: 0, 3: 0, 4: 0 },
    'among-us':      { 1: 0, 2: 0, 3: 0, 4: 0 },
    'nidhogg':       { 1: 0, 2: 0, 3: 0, 4: 0 },
  };

  const noms = getNoms();
  const couleurs = {
    1: '#e94560', 2: '#4a9eff', 3: '#4caf50', 4: '#ffd700'
  };

  const pts = scores[jeuId] ? scores[jeuId] : pointsParJeu[jeuId];

  // Trier par points
  const classement = [1, 2, 3, 4].sort(function(a, b) {
    return (parseInt(pts[b]) || 0) - (parseInt(pts[a]) || 0);
  });

  const medailles = ['🥇', '🥈', '🥉', '4️⃣'];

  classement.forEach(function(equipeId, index) {
    const ligne = document.createElement('div');
    ligne.className = 'scoring-ligne';
    ligne.innerHTML = `
      <span class="scoring-medaille">${medailles[index]}</span>
      <span class="scoring-equipe" style="color: ${couleurs[equipeId]}">
        ${noms.equipes[equipeId]}
      </span>
      <span class="scoring-pts">${parseInt(pts[equipeId]) || 0} pts</span>
    `;
    conteneur.appendChild(ligne);
  });
}

// ================================
// FORMATS PAR JEU
// ================================

function afficherMatchsRocketLeague(e) {
  const conteneur = document.getElementById('matchs-rocket-league');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">🔵 Premiers matchs</h4>
      <div class="match-ligne">${e[1]} vs ${e[2]}</div>
      <div class="match-ligne">${e[3]} vs ${e[4]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🟡 Deuxièmes matchs</h4>
      <div class="match-ligne">${e[2]} vs ${e[3]}</div>
      <div class="match-ligne">${e[1]} vs ${e[4]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🔴 Troisièmes matchs</h4>
      <div class="match-ligne">${e[1]} vs ${e[3]}</div>
      <div class="match-ligne">${e[2]} vs ${e[4]}</div>
    </div>
  `;
}

function afficherMatchsTheFinales(e) {
  const conteneur = document.getElementById('matchs-the-finals');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">🔵 Tour 1</h4>
      <div class="match-ligne">Match 1 : ${e[1]} vs ${e[2]}</div>
      <div class="match-ligne">Match 2 : ${e[3]} vs ${e[4]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🟡 Tour 2</h4>
      <div class="match-ligne winner-bracket">🏆 Winner : Vainqueur M1 vs Vainqueur M2</div>
      <div class="match-ligne loser-bracket">💀 Loser : Perdant M1 vs Perdant M2</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🔴 Tour 3</h4>
      <div class="match-ligne loser-bracket">💀 Loser : Gagnant M4 vs Perdant M3</div>
    </div>
    <div class="match-groupe finale">
      <h4 class="match-round">🏆 Finale</h4>
      <div class="match-ligne">Gagnant M3 vs Gagnant M5</div>
    </div>
  `;
}

function afficherMatchsWNTGD() {
  const conteneur = document.getElementById('matchs-wntgd');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">⏱️ Règles</h4>
      <div class="match-ligne">Durée : 1h30</div>
      <div class="match-ligne">On retient la plus grande profondeur atteinte</div>
      <div class="match-ligne">Peu importe le nombre de resets</div>
      <div class="match-ligne capture-info">📸 Une capture d'écran comme preuve est requise</div>
    </div>
  `;
}

function afficherMatchsPartyAnimals(j) {
  const conteneur = document.getElementById('matchs-party-animals');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">🔵 Match 1 — 2v2v2v2</h4>
      <div class="match-ligne">${j[1]}/${j[2]} vs ${j[4]}/${j[5]} vs ${j[7]}/${j[8]} vs ${j[10]}/${j[11]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🟡 Match 2 — 2v2v2v2</h4>
      <div class="match-ligne">${j[1]}/${j[3]} vs ${j[4]}/${j[6]} vs ${j[7]}/${j[9]} vs ${j[10]}/${j[12]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🔴 Match 3 — 2v2v2v2</h4>
      <div class="match-ligne">${j[2]}/${j[3]} vs ${j[5]}/${j[6]} vs ${j[8]}/${j[9]} vs ${j[11]}/${j[12]}</div>
    </div>
  `;
}

function afficherMatchsL4D2(e) {
  const conteneur = document.getElementById('matchs-l4d2');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">ℹ️ Règles</h4>
      <div class="match-ligne">Carte choisie au hasard</div>
      <div class="match-ligne">5 pts par victoire · 2 pts par égalité</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🔵 Premiers matchs</h4>
      <div class="match-ligne">${e[1]} vs ${e[2]}</div>
      <div class="match-ligne">${e[3]} vs ${e[4]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🟡 Deuxièmes matchs</h4>
      <div class="match-ligne">${e[2]} vs ${e[3]}</div>
      <div class="match-ligne">${e[1]} vs ${e[4]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🔴 Troisièmes matchs</h4>
      <div class="match-ligne">${e[1]} vs ${e[3]}</div>
      <div class="match-ligne">${e[2]} vs ${e[4]}</div>
    </div>
  `;
}

function afficherMatchsGolfIt() {
  const conteneur = document.getElementById('matchs-golf-it');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">⛳ Règles</h4>
      <div class="match-ligne">FFA — Tous contre tous</div>
      <div class="match-ligne">Les points de chaque joueur sont additionnés par équipe</div>
      <div class="match-ligne">Classement final par total d'équipe</div>
    </div>
  `;
}

function afficherMatchsAOE1(e) {
  const conteneur = document.getElementById('matchs-aoe1');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">ℹ️ Règles</h4>
      <div class="match-ligne">2 matchs simultanés</div>
      <div class="match-ligne">Les équipes choisissent leur duo et leur solo</div>
      <div class="match-ligne">Égalité si pas de vainqueur après 45 minutes</div>
      <div class="match-ligne">Victoire au nombre de civilisations vivantes</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">⚔️ 2v2v2</h4>
      <div class="match-ligne">${e[1]} vs ${e[2]} vs ${e[3]} vs ${e[4]}</div>
      <div class="match-ligne scoring-detail">10 pts victoire · 5 pts nul · 0 pt défaite</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🗡️ 1v1v1</h4>
      <div class="match-ligne">${e[1]} vs ${e[2]} vs ${e[3]} vs ${e[4]}</div>
      <div class="match-ligne scoring-detail">5 pts victoire · 2 pts nul · 0 pt défaite</div>
    </div>
  `;
}

function afficherMatchsAmongUs() {
  const conteneur = document.getElementById('matchs-among-us');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">🔪 Règles</h4>
      <div class="match-ligne">4 parties à 12 joueurs</div>
      <div class="match-ligne">2 Killers vs 10 Crew par partie</div>
      <div class="match-ligne scoring-detail">1 pt par victoire Crew · 4 pts par victoire Killer</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🎮 Parties</h4>
      <div class="match-ligne">Partie 1</div>
      <div class="match-ligne">Partie 2</div>
      <div class="match-ligne">Partie 3</div>
      <div class="match-ligne">Partie 4</div>
    </div>
  `;
}

function afficherMatchsNidhogg(j) {
  const conteneur = document.getElementById('matchs-nidhogg');
  if (!conteneur) return;
  conteneur.innerHTML = `
    <div class="match-groupe">
      <h4 class="match-round">👥 Groupes</h4>
      <div class="match-ligne">Groupe A : ${j[1]}, ${j[4]}, ${j[7]}</div>
      <div class="match-ligne">Groupe B : ${j[2]}, ${j[5]}, ${j[10]}</div>
      <div class="match-ligne">Groupe C : ${j[3]}, ${j[8]}, ${j[11]}</div>
      <div class="match-ligne">Groupe D : ${j[6]}, ${j[9]}, ${j[12]}</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">⚔️ Quarts de finale</h4>
      <div class="match-ligne">M1 : 1er A vs 2e B</div>
      <div class="match-ligne">M2 : 1er C vs 2e D</div>
      <div class="match-ligne">M3 : 2e A vs 1er B</div>
      <div class="match-ligne">M4 : 2e C vs 1er D</div>
    </div>
    <div class="match-groupe">
      <h4 class="match-round">🥊 Demi-finales</h4>
      <div class="match-ligne">Vainqueur M1 vs Vainqueur M2</div>
      <div class="match-ligne">Vainqueur M3 vs Vainqueur M4</div>
    </div>
    <div class="match-groupe finale">
      <h4 class="match-round">🏆 Finale</h4>
      <div class="match-ligne">Vainqueur DF1 vs Vainqueur DF2</div>
    </div>
  `;
}