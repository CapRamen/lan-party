// ================================
// CONFIGURATION
// ================================

const JEUX_CONFIG = [
  { id: 'rocket-league', nom: 'Rocket League',        emoji: '🚗', max: 15 },
  { id: 'the-finals',    nom: 'The Finals',            emoji: '🔫', max: 15 },
  { id: 'wntgd',         nom: 'We Need to Go Deeper',  emoji: '🌊', max: 15 },
  { id: 'party-animals', nom: 'Party Animals',         emoji: '🐾', max: 15 },
  { id: 'l4d2',          nom: 'Left 4 Dead 2',         emoji: '🧟', max: 15 },
  { id: 'golf-it',       nom: 'Golf It',               emoji: '⛳', max: 15 },
  { id: 'aoe1',          nom: 'Age of Empires 1',      emoji: '⚔️', max: 15 },
  { id: 'among-us',      nom: 'Among Us',              emoji: '🔪', max: 32 },
  { id: 'nidhogg',       nom: 'Nidhogg',               emoji: '🗡️', max: 23 },
];

const COULEURS_EQUIPES = {
  1: '#eb415d',
  2: '#4a9eff',
  3: '#4caf50',
  4: '#ffd700'
};

const COULEURS_EQUIPES_BG = {
  1: 'rgba(235, 65, 93, 0.2)',
  2: 'rgba(74, 158, 255, 0.2)',
  3: 'rgba(76, 175, 80, 0.2)',
  4: 'rgba(255, 215, 0, 0.2)'
};

// ================================
// FONCTION PRINCIPALE
// ================================

function initialiserPageEquipe(equipeId, joueursIds) {

  // 1. Charger les noms depuis localStorage (système admin)
  const nomsData = localStorage.getItem('noms-lan');
  const noms = nomsData ? JSON.parse(nomsData) : null;

  // 2. Appliquer le nom de l'équipe
  const nomEquipe = noms ? noms.equipes[equipeId] : 'Équipe ' + equipeId;
  const titreEl = document.getElementById('nom-equipe');
  if (titreEl) titreEl.textContent = nomEquipe;

  // 3. Charger les scores
  const scoresData = localStorage.getItem('scores-lan');
  const scores = scoresData ? JSON.parse(scoresData) : {};

  // 4. Calculer les totaux pour le classement
  const totaux = { 1: 0, 2: 0, 3: 0, 4: 0 };
  JEUX_CONFIG.forEach(function(jeu) {
    if (scores[jeu.id]) {
      for (let e = 1; e <= 4; e++) {
        totaux[e] += parseInt(scores[jeu.id][e]) || 0;
      }
    }
  });

  // 5. Déterminer le classement
  const classement = [1, 2, 3, 4].sort(function(a, b) {
    return totaux[b] - totaux[a];
  });
  const position = classement.indexOf(equipeId) + 1;
  const medailles = ['🥇', '🥈', '🥉', '4️⃣'];

  // 6. Afficher classement et points
  const elClassement = document.getElementById('classement-actuel');
  const elPoints = document.getElementById('points-totaux');
  if (elClassement) elClassement.textContent = medailles[position - 1];
  if (elPoints) elPoints.textContent = totaux[equipeId] + ' pts';

  // 7. Afficher les scores par jeu
  afficherScoresParJeu(equipeId, scores);

  // 8. Charger les notes des joueurs
  const notesParJoueur = {};
  joueursIds.forEach(function(joueurId) {
    const data = localStorage.getItem('notes-joueur' + joueurId);
    notesParJoueur[joueurId] = data ? JSON.parse(data) : {};
  });

  // 9. Afficher les fiches joueurs (noms seulement)
  afficherFichesJoueurs(joueursIds, noms, equipeId);

  // 10. Radar d'équipe
  creerRadarEquipe(joueursIds, notesParJoueur, equipeId);

  // 11. Radars individuels
  creerRadarsIndividuels(joueursIds, notesParJoueur, noms);
}

// ================================
// SCORES PAR JEU
// ================================

function afficherScoresParJeu(equipeId, scores) {
  const conteneur = document.getElementById('jeux-scores');
  if (!conteneur) return;

  JEUX_CONFIG.forEach(function(jeu) {
    const pts = scores[jeu.id] ? (parseInt(scores[jeu.id][equipeId]) || 0) : 0;
    const pourcentage = Math.round((pts / jeu.max) * 100);

    const bloc = document.createElement('div');
    bloc.className = 'jeu-score-ligne';
    bloc.innerHTML = `
      <div class="jeu-score-info">
        <span>${jeu.emoji} ${jeu.nom}</span>
        <span class="jeu-score-pts">${pts} / ${jeu.max} pts</span>
      </div>
      <div class="barre-fond">
        <div class="barre-remplie" style="width: ${pourcentage}%"></div>
      </div>
    `;
    conteneur.appendChild(bloc);
  });
}

// ================================
// FICHES JOUEURS
// ================================

function afficherFichesJoueurs(joueursIds, noms, equipeId) {
  const conteneur = document.getElementById('joueurs-fiches');
  if (!conteneur) return;

  joueursIds.forEach(function(joueurId) {
    const nomJoueur = noms ? noms.joueurs[joueurId] : 'Joueur ' + joueurId;

    // Charger les pseudos
    const pseudoData = localStorage.getItem('pseudos-joueur' + joueurId);
    const pseudos = pseudoData ? JSON.parse(pseudoData) : {};

    // Charger l'avatar
    const avatarData = localStorage.getItem('avatar-joueur' + joueurId);
    const couleur = COULEURS_EQUIPES[equipeId];
const avatarStyle = avatarData
  ? `background-image:url(${avatarData}); color: transparent; border-color: ${couleur};`
  : `border-color: ${couleur};`;

    // Construire les pseudos HTML
    const steamHTML = pseudos.steam ? `
      <div class="fiche-pseudo-ligne">
        <img class="fiche-pseudo-icone" src="https://store.steampowered.com/favicon.ico" alt="Steam">
        <span class="fiche-pseudo-steam">${pseudos.steam}</span>
      </div>` : '';

    const discordHTML = pseudos.discord ? `
      <div class="fiche-pseudo-ligne">
        <img class="fiche-pseudo-icone" src="https://cdn.cdnlogo.com/logos/d/15/discord.svg" alt="Discord">
        <span class="fiche-pseudo-discord">${pseudos.discord}</span>
      </div>` : '';

    const fiche = document.createElement('div');
    fiche.className = 'joueur-fiche-simple';
    fiche.innerHTML = `
  <div class="fiche-avatar-photo" style="${avatarStyle}">
    ${avatarData ? '' : '🎮'}
  </div>
  <div class="fiche-infos">
    <span class="fiche-nom">${nomJoueur}</span>
    <div class="fiche-pseudos-groupe">
      ${steamHTML}
      ${discordHTML}
    </div>
  </div>
`;
    conteneur.appendChild(fiche);
  });
}

// ================================
// RADAR ÉQUIPE
// ================================

function creerRadarEquipe(joueursIds, notesParJoueur, equipeId) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  const moyennes = JEUX_CONFIG.map(function(jeu) {
    let total = 0;
    let count = 0;
    joueursIds.forEach(function(joueurId) {
      const note = parseFloat(notesParJoueur[joueurId][jeu.id]);
      if (!isNaN(note)) {
        total += note;
        count++;
      }
    });
    return count > 0 ? Math.round((total / count) * 10) / 10 : 0;
  });

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: JEUX_CONFIG.map(function(j) { return j.emoji + ' ' + j.nom; }),
      datasets: [{
        label: 'Niveau moyen de l\'équipe',
        data: moyennes,
        backgroundColor: COULEURS_EQUIPES_BG[equipeId],
        borderColor: COULEURS_EQUIPES[equipeId],
        borderWidth: 2,
        pointBackgroundColor: '#e94560',
        pointRadius: 1,
      }]
    },
    options: configRadar(false)
  });
}

// ================================
// RADARS INDIVIDUELS
// ================================

function creerRadarsIndividuels(joueursIds, notesParJoueur, noms) {
  const conteneur = document.getElementById('radars-individuels');
  if (!conteneur) return;

  // Couleurs distinctives pour chaque joueur
  const couleurs = [
    { bg: 'rgba(74, 158, 255, 0.2)',  border: '#4a9eff' },
    { bg: 'rgba(76, 175, 80, 0.2)',   border: '#4caf50' },
    { bg: 'rgba(255, 215, 0, 0.2)',   border: '#ffd700' },
  ];

  joueursIds.forEach(function(joueurId, index) {
    const nomJoueur = noms ? noms.joueurs[joueurId] : 'Joueur ' + joueurId;
    const notes = notesParJoueur[joueurId];
    const couleur = couleurs[index % couleurs.length];

    // Récupérer les notes du joueur pour chaque jeu
    const donnees = JEUX_CONFIG.map(function(jeu) {
      const note = parseFloat(notes[jeu.id]);
      return isNaN(note) ? 0 : note;
    });

    // Créer le bloc pour ce joueur
    const bloc = document.createElement('div');
    bloc.className = 'radar-individuel-bloc';
    bloc.innerHTML = `
      <h4 class="radar-individuel-titre"> ${nomJoueur}</h4>
      <canvas id="radar-joueur-${joueurId}"></canvas>
    `;
    conteneur.appendChild(bloc);

    // Créer le graphique
    const canvas = document.getElementById('radar-joueur-' + joueurId);
    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: JEUX_CONFIG.map(function(j) { return j.emoji; }),
        datasets: [{
          label: nomJoueur,
          data: donnees,
          backgroundColor: couleur.bg,
          borderColor: couleur.border,
          borderWidth: 2,
          pointBackgroundColor: couleur.border,
          pointRadius: 1,
        }]
      },
      options: configRadar(true)
    });
  });
}

// ================================
// CONFIG RADAR (partagée)
// ================================

function configRadar(petit) {
  return {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#888',
          backdropColor: 'transparent',
          font: { size: petit ? 8 : 10 }
        },
        grid:       { color: '#0f3460' },
        angleLines: { color: '#0f3460' },
        pointLabels: {
          color: '#e0e0e0',
          font: { size: petit ? 13 : 11 }
        }
      }
    },
   plugins: {
  legend: {
    display: false
  }
}
  };
}