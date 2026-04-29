// ================================
// INITIALISATION DE L'APPLICATION
// ================================
import { fbSet, fbGet, fbWatch } from './firebase.js';
import { chargerDepuisFirebase, activerTempsReel, syncVersFirebase, CLES_SYNC, enregistrerSetItem } from './sync.js';

function afficherChargement(visible) {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = visible ? 'flex' : 'none';
}

let timeoutRechargement = null;

async function init() {
  afficherChargement(true);

  // 1. Sauvegarder le localStorage.setItem natif
  const originalSetItem = localStorage.setItem.bind(localStorage);

  // 2. Le transmettre à sync.js
  enregistrerSetItem(originalSetItem);

  // 3. Surcharger localStorage.setItem pour sync automatique
  localStorage.setItem = function(cle, valeur) {
    originalSetItem(cle, valeur);
    if (CLES_SYNC.includes(cle)) {
      ignorerProchainChangement[cle] = true;
      setTimeout(function() {
        ignorerProchainChangement[cle] = false;
      }, 3000);
      syncVersFirebase(cle, valeur);
    }
  };

  // 4. Charger les données depuis Firebase
  await chargerDepuisFirebase();
  afficherChargement(false);

  // 5. Activer la synchronisation en temps réel
  activerTempsReel(function(cle) {
    console.log('📡 Donnée mise à jour :', cle);
  });
}

// Variable partagée pour ignorer les changements locaux
const ignorerProchainChangement = {};
window.ignorerProchainChangement = ignorerProchainChangement;

init();
window.syncVersFirebase = syncVersFirebase;