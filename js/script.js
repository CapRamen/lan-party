// ================================
// SAUVEGARDE DES NOTES JOUEURS
// ================================

function sauvegarderNotes(joueurId) {
  const inputs = document.querySelectorAll(`input[data-joueur="${joueurId}"]`);
  const notes = {};
  inputs.forEach(function(input) {
    const nomJeu = input.getAttribute('data-jeu');
    notes[nomJeu] = input.value;
  });
  localStorage.setItem('notes-' + joueurId, JSON.stringify(notes));
  const confirmation = document.getElementById('confirm-' + joueurId);
  confirmation.textContent = '✅ Notes sauvegardées !';
  setTimeout(function() {
    confirmation.textContent = '';
  }, 3000);
}

function chargerToutesLesNotes() {
  const joueurs = [
    'joueur1','joueur2','joueur3',
    'joueur4','joueur5','joueur6',
    'joueur7','joueur8','joueur9',
    'joueur10','joueur11','joueur12'
  ];
  joueurs.forEach(function(joueurId) {
    const donneesSauvegardees = localStorage.getItem('notes-' + joueurId);
    if (donneesSauvegardees) {
      const notes = JSON.parse(donneesSauvegardees);
      Object.keys(notes).forEach(function(nomJeu) {
        const input = document.querySelector(
          `input[data-joueur="${joueurId}"][data-jeu="${nomJeu}"]`
        );
        if (input) input.value = notes[nomJeu];
      });
    }
  });
}

// ================================
// SCORES ET CLASSEMENT
// ================================

// Les jeux et leur max de points
const jeux = [
  'rocket-league', 'the-finals', 'wntgd',
  'party-animals', 'l4d2', 'golf-it',
  'aoe1', 'among-us', 'nidhogg'
];

// Charge les scores depuis localStorage
function chargerScores() {
  const scores = localStorage.getItem('scores-lan');
  if (scores) {
    return JSON.parse(scores);
  }
  // Si aucun score sauvegardé, tout à zéro
  const vide = {};
  jeux.forEach(function(jeu) {
    vide[jeu] = { 1: 0, 2: 0, 3: 0, 4: 0 };
  });
  return vide;
}

// Sauvegarde les scores dans localStorage
function sauvegarderScores(scores) {
  localStorage.setItem('scores-lan', JSON.stringify(scores));
}

// Affiche les scores dans le tableau
function afficherScores() {
  const scores = chargerScores();

  // Mettre à jour chaque cellule du tableau
  document.querySelectorAll('.score-cell').forEach(function(cellule) {
    const jeu = cellule.getAttribute('data-jeu');
    const equipe = cellule.getAttribute('data-equipe');
    cellule.textContent = scores[jeu][equipe];
  });

  // Calculer et afficher les totaux
  const totaux = { 1: 0, 2: 0, 3: 0, 4: 0 };
  jeux.forEach(function(jeu) {
    for (let e = 1; e <= 4; e++) {
      totaux[e] += parseInt(scores[jeu][e]) || 0;
    }
  });

  for (let e = 1; e <= 4; e++) {
    const cellTotal = document.getElementById('total-' + e);
    if (cellTotal) cellTotal.textContent = totaux[e];
  }

  // Mettre à jour le podium
  mettreAJourPodium(totaux);
}

// Met à jour le podium selon les totaux
function mettreAJourPodium(totaux) {
  const nomsData = localStorage.getItem('noms-lan');
  const nomsStockes = nomsData ? JSON.parse(nomsData) : null;
  const noms = {
    1: nomsStockes ? nomsStockes.equipes[1] : 'Équipe 1',
    2: nomsStockes ? nomsStockes.equipes[2] : 'Équipe 2',
    3: nomsStockes ? nomsStockes.equipes[3] : 'Équipe 3',
    4: nomsStockes ? nomsStockes.equipes[4] : 'Équipe 4'
  };

  // Créer un tableau trié par points décroissants
  const classement = [1, 2, 3, 4].sort(function(a, b) {
    return totaux[b] - totaux[a];
  });

  // Positions du podium : [1er, 2e, 3e, 4e]
  const positions = [1, 2, 3, 4];

  positions.forEach(function(position) {
    const equipeId = classement[position - 1];
    const bloc = document.getElementById('podium-' + position);
    if (bloc) {
      bloc.querySelector('.podium-nom').textContent = noms[equipeId];
      bloc.querySelector('.podium-pts').textContent = totaux[equipeId] + ' pts';
    }
  });
}

// Rend une cellule de score éditable au clic
function activerEditionScores() {
  document.querySelectorAll('.score-cell').forEach(function(cellule) {
    cellule.addEventListener('click', function() {

      // Évite de créer plusieurs inputs
      if (cellule.querySelector('input')) return;

      const valeurActuelle = cellule.textContent;
      const jeu = cellule.getAttribute('data-jeu');
      const equipe = cellule.getAttribute('data-equipe');

      // Remplace le texte par un input
      cellule.textContent = '';
      const input = document.createElement('input');
      input.type = 'number';
      input.value = valeurActuelle;
      input.className = 'score-input';
      input.min = 0;
      cellule.appendChild(input);
      input.focus();

      // Quand on quitte le champ ou appuie sur Entrée
      function validerScore() {
        const nouvelleValeur = parseInt(input.value) || 0;
        cellule.textContent = nouvelleValeur;

        // Sauvegarder
        const scores = chargerScores();
        scores[jeu][equipe] = nouvelleValeur;
        sauvegarderScores(scores);

        // Recalculer tout
        afficherScores();
      }

      input.addEventListener('blur', validerScore);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') input.blur();
      });
    });
  });
}

// ================================
// DÉMARRAGE
// ================================

document.addEventListener('DOMContentLoaded', function() {
  chargerToutesLesNotes();
  afficherScores();
  activerEditionScores();
});

// ================================
// MENU — PAGE ACTIVE
// ================================

function marquerPageActive() {
  // Récupère le nom du fichier actuel (ex: "jeux.html")
  const pageCourante = window.location.pathname.split('/').pop();

  // Cherche tous les liens du menu
  const liensMenu = document.querySelectorAll('nav a');

  liensMenu.forEach(function(lien) {
    // Récupère la destination du lien (ex: "jeux.html")
    const destination = lien.getAttribute('href');

    // Si le lien pointe vers la page courante, on lui ajoute la classe "actif"
    if (destination === pageCourante) {
      lien.classList.add('actif');
    }

    // Cas spécial : page d'accueil
    if (pageCourante === '' && destination === 'index.html') {
      lien.classList.add('actif');
    }
  });
}

marquerPageActive();

// ================================
// APPLICATION DES NOMS PARTOUT
// ================================

function appliquerNoms() {
  const data = localStorage.getItem('noms-lan');
  if (!data) return;
  const noms = JSON.parse(data);

  // Mettre à jour les noms d'équipes partout
  for (let e = 1; e <= 4; e++) {
    // Dans la page équipes (les h3 des cartes)
    document.querySelectorAll('.equipe-' + e + ' h3').forEach(function(el) {
      el.textContent = noms.equipes[e];
    });

    // Dans le tableau classement
    const th = document.querySelector('.col-equipe.equipe-' + e + '-color');
    if (th) th.textContent = noms.equipes[e];

    // Dans le podium
    const podiumNom = document.querySelector('#podium-1 .podium-nom, #podium-2 .podium-nom, #podium-3 .podium-nom, #podium-4 .podium-nom');
  }

  // Mettre à jour les noms de joueurs sur la page joueurs
  for (let j = 1; j <= 12; j++) {
    const pseudo = document.querySelector(
      '.joueur-carte:nth-child(' + j + ') .joueur-pseudo'
    );
    if (pseudo) pseudo.textContent = noms.joueurs[j];

    const equipeSpan = document.querySelector(
      '.joueur-carte:nth-child(' + j + ') .joueur-equipe'
    );
    // Trouver l'équipe du joueur
    const equipeId = j <= 3 ? 1 : j <= 6 ? 2 : j <= 9 ? 3 : 4;
    if (equipeSpan) equipeSpan.textContent = noms.equipes[equipeId];
  }

  // Appliquer les infos de la page d'accueil
  const infosData = localStorage.getItem('infos-accueil');
  if (infosData) {
    const infos = JSON.parse(infosData);

    const correspondances = [
      { id: 'accueil-dates',          cle: 'dates'          },
      { id: 'accueil-horaires',       cle: 'horaires'       },
      { id: 'accueil-horaires-compet',cle: 'horairesCompet' },
      { id: 'accueil-lieu',           cle: 'lieu'           },
      { id: 'accueil-joueurs',        cle: 'joueurs'        },
      { id: 'accueil-equipes',        cle: 'equipes'        },
      { id: 'accueil-jeux',           cle: 'jeux'           },
      { id: 'accueil-format',         cle: 'format'         },
    ];

    correspondances.forEach(function(item) {
      const el = document.getElementById(item.id);
      if (el) el.textContent = infos[item.cle];
    });
  }

}

document.addEventListener('DOMContentLoaded', appliquerNoms);
