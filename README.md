# Brief 14 - Sécurisation d'une Application avec JWT

## Mise en route du projet  
**import de jwt et installation de la dépendence :**  
npm install jsonwebtoken --save

**Commande pour lancer le projet :**  
node to_complete/index.js

**clé secrète**  
ma_clé_secrète

## Généralités

**Token:**  
- Header --> infos du token. L'en-tête contient les métadonnées, comme l'algorithme utilisé pour signer (exemple : HMAC SHA256 ou RSA).  

```js
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- Payload -> infos que l'on souhaite sécuriser. Le payload contient les données utilisateur (id, role, etc.).
```js
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```
- VERIFY SIGNATURE --> somme des 2 parties (concaténés). La signature est générée en combinant l'en-tête et le payload avec la clé secrète.
```js
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

==> **le front** conserve ce token encrypté

==> pour certaines requêtes, on envoie ce token pour que **le back** puisse récupérer ces infos  
--> le back décrypte le token (pour récupérer les 3 parties)  
--> ensuite : il vérifie la signature (reprend le header et le payload et vétifie si la somme des 2 correspond à la signature décryptée)

## Pourquoi il n'est pas possible (ou extrêmement difficile) pour un pirate de générer un nouveau JWT avec le rôle admin sans connaître votre clé très secrète servant à l'encodage du JWT ?

Un pirate ne peut pas générer un nouveau JWT valide avec un rôle admin sans la clé secrète parce que :

- La signature du JWT dépend de la **clé secrète** pour être valide. Sans la clé secrète (ou la clé privée), il est pratiquement impossible de recréer une signature valide pour un JWT modifié.  

- Les algorithmes cryptographiques utilisés (HMAC SHA256 ou RSA) sont conçus pour être résistants aux attaques (le nombre de combinaisons prossibles extrêment élevé rend quasi impossible de retrouver la clé secrète)

- Modifier un JWT existant invalide immédiatement sa signature.  
Un JWT se compose de trois parties : l'en-tête, le payload, et la signature, séparées par des points.  
Si un pirate modifie le payload pour ajouter **role: admin**, la signature actuelle ne correspondra plus au contenu modifié. Le serveur détectera immédiatement que le token est invalide lors de la vérification.

- La clé secrète est conservée en sécurité sur le serveur (dans une variable d'environnement), ce qui la rend inaccessible aux utilisateurs finaux ou au code côté client..