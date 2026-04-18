// ================================
// PAGE ADMINISTRATION — NOMS
// ================================

// Structure des noms par défaut
function nomsParDefaut() {
  return {
    equipes: {
      1: 'Équipe 1',
      2: 'Équipe 2',
      3: 'Équipe 3',
      4: 'Équipe 4'
    },
    joueurs: {
      1:  'Joueur 1',  2:  'Joueur 2',  3:  'Joueur 3',
      4:  'Joueur 4',  5:  'Joueur 5',  6:  'Joueur 6',
      7:  'Joueur 7',  8:  'Joueur 8',  9:  'Joueur 9',
      10: 'Joueur 10', 11: 'Joueur 11', 12: 'Joueur 12'
    }
  };
}

// Charge les noms sauvegardés dans les inputs au chargement
function chargerNoms() {
  const data = localStorage.getItem('noms-lan');
  const noms = data ? JSON.parse(data) : nomsParDefaut();

  // Remplir les inputs des équipes
  for (let e = 1; e <= 4; e++) {
    const input = document.getElementById('nom-equipe-' + e);
    if (input) input.value = noms.equipes[e];
  }

  // Remplir les inputs des joueurs
  for (let j = 1; j <= 12; j++) {
    const input = document.getElementById('nom-joueur-' + j);
    if (input) input.value = noms.joueurs[j];

    // Charger les infos d'accueil
chargerInfosAccueil();

  }
}

// Sauvegarde tous les noms depuis les inputs
function sauvegarderNoms() {
  const noms = { equipes: {}, joueurs: {} };

  // Lire les noms des équipes
  for (let e = 1; e <= 4; e++) {
    const input = document.getElementById('nom-equipe-' + e);
    // Si le champ est vide, on garde le nom par défaut
    noms.equipes[e] = input && input.value.trim() !== ''
      ? input.value.trim()
      : 'Équipe ' + e;
  }

  // Lire les pseudos des joueurs
  for (let j = 1; j <= 12; j++) {
    const input = document.getElementById('nom-joueur-' + j);
    noms.joueurs[j] = input && input.value.trim() !== ''
      ? input.value.trim()
      : 'Joueur ' + j;
  }

  // Sauvegarder dans localStorage
  localStorage.setItem('noms-lan', JSON.stringify(noms));

  // Afficher confirmation
  afficherConfirmation('✅ Noms sauvegardés ! Les changements sont appliqués sur tout le site.', 'succes');

  // Sauvegarder les infos d'accueil
sauvegarderInfosAccueil();

}

// Réinitialise tous les noms par défaut
function reinitialiserNoms() {
  const confirmation = confirm('Es-tu sûr de vouloir réinitialiser tous les noms ?');
  if (!confirmation) return;

  localStorage.removeItem('noms-lan');
  chargerNoms();
  localStorage.removeItem('infos-accueil');
chargerInfosAccueil();
  afficherConfirmation('🔄 Noms réinitialisés.', 'neutre');
}

// Affiche un message de confirmation
function afficherConfirmation(message, type) {
  const el = document.getElementById('admin-confirmation');
  if (!el) return;
  el.textContent = message;
  el.className = 'admin-confirmation admin-confirmation-' + type;
  setTimeout(function() {
    el.textContent = '';
    el.className = 'admin-confirmation';
  }, 4000);
}

// Lancer au chargement
document.addEventListener('DOMContentLoaded', chargerNoms);

// ================================
// INFOS PAGE D'ACCUEIL
// ================================

function infosParDefaut() {
  return {
    dates:           'À définir',
    horaires:        'De 18h le vendredi à 12h le dimanche',
    horairesCompet:  'Vendredi 20h → Dimanche 2h',
    lieu:            'Chez Quentin',
    joueurs:         '12 joueurs',
    equipes:         '4 équipes de 3',
    jeux:            '9 jeux au programme',
    format:          'Compétition par équipes — Classement général sur tous les jeux'
  };
}

function chargerInfosAccueil() {
  const data = localStorage.getItem('infos-accueil');
  const infos = data ? JSON.parse(data) : infosParDefaut();

  const champs = [
    { id: 'info-dates',           cle: 'dates'          },
    { id: 'info-horaires',        cle: 'horaires'       },
    { id: 'info-horaires-compet', cle: 'horairesCompet' },
    { id: 'info-lieu',            cle: 'lieu'           },
    { id: 'info-joueurs',         cle: 'joueurs'        },
    { id: 'info-equipes',         cle: 'equipes'        },
    { id: 'info-jeux',            cle: 'jeux'           },
    { id: 'info-format',          cle: 'format'         },
  ];

  champs.forEach(function(champ) {
    const el = document.getElementById(champ.id);
    if (el) el.value = infos[champ.cle];
  });
}

function sauvegarderInfosAccueil() {
  const infos = {
    dates:          getValue('info-dates',           'À définir'),
    horaires:       getValue('info-horaires',        'De 18h le vendredi à 12h le dimanche'),
    horairesCompet: getValue('info-horaires-compet', 'Vendredi 20h → Dimanche 2h'),
    lieu:           getValue('info-lieu',            'Chez Quentin'),
    joueurs:        getValue('info-joueurs',         '12 joueurs'),
    equipes:        getValue('info-equipes',         '4 équipes de 3'),
    jeux:           getValue('info-jeux',            '9 jeux au programme'),
    format:         getValue('info-format',          'Compétition par équipes'),
  };
  localStorage.setItem('infos-accueil', JSON.stringify(infos));
}

// Helper : lit un input, retourne la valeur ou un défaut si vide
function getValue(id, defaut) {
  const el = document.getElementById(id);
  return el && el.value.trim() !== '' ? el.value.trim() : defaut;
}
