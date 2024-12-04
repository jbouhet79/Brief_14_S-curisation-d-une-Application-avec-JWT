const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/authMiddleware');
// const user = require('./controller/user');
var cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

const PORT = process.env.PORT || 3000;
const TOKEN_KEY = process.env.TOKEN_KEY;

const users = [
  { id: 1, username: 'user', password: 'user', role: 'user' },
  { id: 2, username: 'admin', password: 'admin', role: 'admin' }
];

// TODO: Ajouter un middleware de redirection qui vérifie si l'utilisateur est authentifié, on le redirige vers /user dans ce cas
app.get('/login', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Login</h2>
        <form action="/login" method="POST">
          <label for="username">Username:</label><br>
          <input type="text" id="username" name="username"><br>
          <label for="password">Password:</label><br>
          <input type="password" id="password" name="password"><br><br>
          <input type="submit" value="Submit">
        </form>
      </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // TODO: Créer le token JWT et le stocker dans un cookie
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, // payload à sécuriser
      process.env.TOKEN_KEY, // clé qui permet l'encryptage : process.env.TOKEN_KEY - ici sécurisée comme variable d'environnement pour éviter la vunérabilité
      { expiresIn: '1h' } // Expiration du token (par exemple, 1 heure)
    );

    // Stockage dans un cookie sécurisé
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000 // Durée de vie en millisecondes (1h ici)
    });

    if (user.role === 'user') {
      // TODO: Rediriger l'utilisateur vers la route `/user`
      res.redirect('/user'); // Redirection après authentification
    } else if (user.role === 'admin') {
      res.redirect('/admin');
    }

  } else {
    res.status(401).send('Informations d\'identification non valides');
  }
});

// TODO: Ajouter un middleware pour l'authentification avec JWT
app.get('/user', authMiddleware, (req, res) => {
  res.json({ message: 'Bienvenue, utilisateur!' });
});

// TODO: Ajouter un middleware pour l'authentification avec JWT
app.get('/admin', authMiddleware, (req, res) => {
  req.user.role === 'admin' ? res.json({ message: 'Bienvenue, admin!' }) : res.status(403).send('Accès refusé');
  // if (req.user.role === 'admin') {
  //   res.json({ message: 'Bienvenue, admin!' });
  // } else {
  //   res.status(403).send('Accès refusé');
  // }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token'); // Efface le cookie
  res.json({ message: 'Déconnexion affectuée' });
});

app.listen(PORT, () => console.log(`Le serveur s'exécute sur le port ${PORT}`));


/* 
Sources pour compléter les TODO:
- Outil d'encodage décodage de JWT : https://jwt.io/
  - Vérification de la validité du JWT : https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
  - Stockage du JWT dans un cookie : https://www.npmjs.com/package/cookie-parser
*/
