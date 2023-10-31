# Mon vieux Grimoire

Ce projet est le backend d'un site de notation de livres développé en utilisant MongoDB, Express, et Node.js. Il a été réalisé dans le cadre du projet numéro 7 de la formation "Développeur Frontend" que j'ai suivie sur Openclassrooms.

## Informations sur le Repository

Le backend est actuellement hébergé sur une instance EC2 d'AWS, tandis que le frontend est hébergé sur GitHub Pages. Le repository est configuré en conséquence, mais vous devrez effectuer certaines étapes d'ajustement pour le déploiement complet de l'application. Voici quelques instructions :

- **Variables d'Environnement** : Assurez-vous de configurer correctement les variables d'environnement dans le backend, en particulier celles liées à la base de données et à d'autres configurations spécifiques à votre déploiement.

- **Configuration du Serveur** : Prenez en compte la configuration du serveur sur l'instance EC2, le serveur est configuré avec un certificat SSL 

#### Fonctionalités 

Authentification : Les utilisateurs peuvent créer un compte, se connecter et se déconnecter.

Gestion des Livres : Les utilisateurs peuvent ajouter, mettre à jour, supprimer et consulter des livres.

Notation : Les utilisateurs peuvent attribuer des notes aux livres.

### Sécurité

Il est important de noter que, pour simplifier les tests, ce projet n'inclut pas de validation approfondie des entrées utilisateur ni de limites strictes pour les mots de passe. Les logs d'erreurs sont génériques et ne sont pas spécifiquement adaptés à un environnement de production. Il est vivement recommandé d'améliorer la sécurité en implémentant une validation appropriée et en suivant les meilleures pratiques de sécurité pour les applications web.

