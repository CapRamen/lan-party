// ================================
// SYSTÈME DE SCORING CENTRALISÉ
// ================================

const COULEURS_SCORING = {
  1: '#eb415d', 2: '#4a9eff', 3: '#4caf50', 4: '#ffd700'
};

// Charge les scores depuis localStorage
function chargerScoresLAN() {
  const data = localStorage.getItem('scores-lan');
  if (data) return JSON.parse(data);

  // Structure vide par défaut
  const vide = {};
  const jeux = [
    'rocket-league', 'the-finals', 'wntgd', 'party-animals',
    'l4d2', 'golf-it', 'aoe1', 'among-us', 'nidhogg'
  ];
  jeux.forEach(function(jeu) {
    vide[jeu] = { 1: 0, 2: 0, 3: 0, 4: 0 };
  });
  return vide;
}

// Sauvegarde les scores dans localStorage
function sauvegarderScoresLAN(scores) {
  localStorage.setItem('scores-lan', JSON.stringify(scores));
}

// Met à jour le score d'un jeu pour une équipe
function mettreAJourScore(jeuId, equipeId, valeur) {
  const scores = chargerScoresLAN();
  if (!scores[jeuId]) scores[jeuId] = { 1: 0, 2: 0, 3: 0, 4: 0 };
  scores[jeuId][equipeId] = parseInt(valeur) || 0;
  sauvegarderScoresLAN(scores);
}

// Affiche le bloc scoring éditable
function afficherBlocScoring(jeuId, conteneurId, noms) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const scores = chargerScoresLAN();
  const pts = scores[jeuId] || { 1: 0, 2: 0, 3: 0, 4: 0 };

  // Trier par points décroissants
  const classement = [1, 2, 3, 4].sort(function(a, b) {
    return (parseInt(pts[b]) || 0) - (parseInt(pts[a]) || 0);
  });

  const medailles = ['🥇', '🥈', '🥉', '4️⃣'];

  conteneur.innerHTML = `
    <div class="scoring-editable">
      ${classement.map(function(equipeId, idx) {
        const nomEquipe = noms ? noms[equipeId] : 'Équipe ' + equipeId;
        const couleur = COULEURS_SCORING[equipeId];
        return `
          <div class="scoring-editable-ligne">
            <span class="scoring-medaille">${medailles[idx]}</span>
            <span class="scoring-equipe-nom" style="color: ${couleur}">${nomEquipe}</span>
            <div class="scoring-edit-zone">
              <span
                class="scoring-pts-affiche"
                id="pts-affiche-${jeuId}-${equipeId}"
                onclick="activerEditionScoring('${jeuId}', ${equipeId})"
                title="Cliquer pour modifier"
              >${parseInt(pts[equipeId]) || 0} pts</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <p class="scoring-hint">💡 Clique sur un score pour le modifier manuellement</p>
  `;
}

// Active l'édition d'un score
function activerEditionScoring(jeuId, equipeId) {
  const affiche = document.getElementById(`pts-affiche-${jeuId}-${equipeId}`);
  if (!affiche) return;

  const valeurActuelle = parseInt(affiche.textContent) || 0;

  const input = document.createElement('input');
  input.type = 'number';
  input.value = valeurActuelle;
  input.min = 0;
  input.className = 'scoring-input-edit';

  affiche.replaceWith(input);
  input.focus();

  function valider() {
    const nouvelleValeur = parseInt(input.value) || 0;
    mettreAJourScore(jeuId, equipeId, nouvelleValeur);

    const nouveauAffiche = document.createElement('span');
    nouveauAffiche.className = 'scoring-pts-affiche';
    nouveauAffiche.id = `pts-affiche-${jeuId}-${equipeId}`;
    nouveauAffiche.title = 'Cliquer pour modifier';
    nouveauAffiche.textContent = nouvelleValeur + ' pts';
    nouveauAffiche.onclick = function() {
      activerEditionScoring(jeuId, equipeId);
    };
    input.replaceWith(nouveauAffiche);

    // Rafraîchir le classement
    const noms = chargerNomsEquipes();
    afficherBlocScoring(jeuId, 'scoring-' + jeuId, noms);
  }

  input.addEventListener('blur', valider);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') {
      const annule = document.createElement('span');
      annule.className = 'scoring-pts-affiche';
      annule.id = `pts-affiche-${jeuId}-${equipeId}`;
      annule.title = 'Cliquer pour modifier';
      annule.textContent = valeurActuelle + ' pts';
      annule.onclick = function() { activerEditionScoring(jeuId, equipeId); };
      input.replaceWith(annule);
    }
  });
}

// Charge les noms d'équipes
function chargerNomsEquipes() {
  const data = localStorage.getItem('noms-lan');
  if (!data) return { 1: 'Équipe 1', 2: 'Équipe 2', 3: 'Équipe 3', 4: 'Équipe 4' };
  return JSON.parse(data).equipes;
}

// Applique les points calculés et met à jour l'affichage
function appliquerPointsCalcules(jeuId, points, conteneurId) {
  const scores = chargerScoresLAN();
  if (!scores[jeuId]) scores[jeuId] = { 1: 0, 2: 0, 3: 0, 4: 0 };

  for (let e = 1; e <= 4; e++) {
    scores[jeuId][e] = points[e] || 0;
  }

  sauvegarderScoresLAN(scores);
  const noms = chargerNomsEquipes();
  afficherBlocScoring(jeuId, conteneurId, noms);
}