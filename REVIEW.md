# Review from GaresSNCF

## Est-ce que le problème est clairement décrit ?

Le fichier *DATA.md* décrit bien la problématique à laquelle le groupe souhaite s'attaquer.

Les feuilles de design, notamment la dernière, illustrent bien l'idée qu'il y a derrière le projet.

Le projet paraît pertinent.

Seul petit point d'amélioration pour le fichier *README.md* : il n'est pas précisé que l'étude porte sur plusieurs années.


## Est-ce que les choix de visualisation sont adaptés ?

Plusieurs scénarios sont abordés par l'équipe et les idées de design relatives sont intéressantes.

La présence de plusieurs filtres permet de bien raffiner la visualisation.

Cependant on ne comprend pas bien, en regardant les fiches, l'interactivité de l'utilisateur avec le graphique :
* Le slider permet-il de zoomer sur les graphes, ou est-ce qu'il fait autre chose ?
* Les tooltips sont-ils uniquement en *hover* ou cliquables ?
* Les cases "1", "2", "3", etc signifient-elles que le filtrage par contact n'est possible qu'avec les contacts les plus contactés ? 

## Est-ce que le projet est réalisable ?

* Ce projet semble tout à fait réalisable et la méthode pour récupérer les données est claire.
* Vous pourriez cependant rencontrer des difficultés pour traiter vos données selon l'échelle temporelle choisie. Exemple : si je m'intéresse à mes messages du mois de janvier 2018, alors je vois sur le graphique mes messages jour par jour. Mais si je m'intéresse à mes messages de 2012 à 2018, il n'est pas possible d'afficher les messages jour par jour mais il va falloir peut-être calculer dynamiquement des moyennes ?
* Les messages trop anciens seront probablement impossibles à requêter (par exemple, si l'on fouille dans les vieux messages d'une conversation sur Facebook Messenger, les messages affichés sont datés de 2016 minimum, pas avant). 

## Remarques

Sera-t-il possible de filtrer les conversations avec une personne de son choix ? 
