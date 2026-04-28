import { fbSet, fbGet, fbWatch } from './firebase.js';

// Flag pour ignorer les prochains changements Firebase
// (car ce sont les nôtres)
let ignorerProchainChangement = {};

const CLES_SYNC = [
  'scores-lan',
  'noms-lan',
  'infos-accueil',
  'nidhogg-groupes',
  'nidhogg-bracket',
  'bracket-the-finals',
  'rl-resultats',
  'l4d2-resultats',
  'pa-resultats',
  'aoe1-resultats',
  'au-parties',
  'golf-scores',
  // Notes des joueurs
  'notes-joueur1',
  'notes-joueur2',
  'notes-joueur3',
  'notes-joueur4',
  'notes-joueur5',
  'notes-joueur6',
  'notes-joueur7',
  'notes-joueur8',
  'notes-joueur9',
  'notes-joueur10',
  'notes-joueur11',
  'notes-joueur12',
  // Pseudos Steam/Discord
  'pseudos-joueur1',
  'pseudos-joueur2',
  'pseudos-joueur3',
  'pseudos-joueur4',
  'pseudos-joueur5',
  'pseudos-joueur6',
  'pseudos-joueur7',
  'pseudos-joueur8',
  'pseudos-joueur9',
  'pseudos-joueur10',
  'pseudos-joueur11',
  'pseudos-joueur12',
];

// ================================
// SAUVEGARDE VERS FIREBASE
// ================================

const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(cle, valeur) {
  originalSetItem(cle, valeur);
  if (CLES_SYNC.includes(cle)) {
    // Marquer cette clé comme "à ignorer" pendant 3 secondes
    ignorerProchainChangement[cle] = true;
    setTimeout(function() {
      ignorerProchainChangement[cle] = false;
    }, 3000);

    syncVersFirebase(cle, valeur);
  }
};

async function syncVersFirebase(cle, valeur) {
  try {
    const data = JSON.parse(valeur);
    await fbSet('lan-data', cle, { valeur: data });
    console.log('✅ Envoyé Firebase :', cle);
  } catch (e) {
    console.error('❌ Erreur sync Firebase :', cle, e);
  }
}

// ================================
// CHARGEMENT DEPUIS FIREBASE
// ================================

async function chargerDepuisFirebase() {
  console.log('🔄 Chargement Firebase...');
  for (const cle of CLES_SYNC) {
    try {
      const data = await fbGet('lan-data', cle);
      if (data && data.valeur !== undefined) {
        originalSetItem(cle, JSON.stringify(data.valeur));
      }
    } catch (e) {
      console.error('❌ Erreur chargement :', cle, e);
    }
  }
  console.log('✅ Firebase chargé !');
}

// ================================
// ÉCOUTE EN TEMPS RÉEL
// ================================

function activerTempsReel(callback) {
  CLES_SYNC.forEach(function(cle) {
    fbWatch('lan-data', cle, function(data) {
      if (!data || data.valeur === undefined) return;

      // Ignorer si on vient d'envoyer cette clé nous-mêmes
      if (ignorerProchainChangement[cle]) {
        console.log('⏭️ Ignoré :', cle);
        return;
      }

      const valeurActuelle = localStorage.getItem(cle);
      const nouvelleValeur = JSON.stringify(data.valeur);

      if (valeurActuelle !== nouvelleValeur) {
        originalSetItem(cle, nouvelleValeur);
        console.log('📡 Reçu :', cle);
        if (callback) callback(cle);
      }
    });
  });
}

export { chargerDepuisFirebase, activerTempsReel };