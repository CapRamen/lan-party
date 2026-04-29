// ================================
// INITIALISATION DE L'APPLICATION
// ================================
import { fbSet, fbGet, fbWatch } from './firebase.js';
import { chargerDepuisFirebase, activerTempsReel } from './sync.js';

function afficherChargement(visible) {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = visible ? 'flex' : 'none';
}

async function init() {
  afficherChargement(true);
  await chargerDepuisFirebase();
  afficherChargement(false);

  // Activer la synchronisation SANS rechargement
  activerTempsReel(function(cle) {
    console.log('📡 Donnée mise à jour :', cle);
    // Ne rien faire d'autre — les données sont déjà
    // dans localStorage, elles seront lues au prochain
    // clic ou interaction de l'utilisateur
  });
}

init();