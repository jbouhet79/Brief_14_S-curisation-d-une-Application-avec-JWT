const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  // TODO: Récupérer le token dans les cookies et vérifier s'il est valide avec la méthode `jwt.verify`
  // TODO: Si le token est invalide, retourner une erreur 401
  // TODO: Si le token est valide, ajouter le contenu décodé du token dans `req.user`
  try {

    // Récupérer le token depuis les cookies
    const token = req.cookies.token;
    //const token = req.headers.authorization.split(' ')[1]; // sépare le Bearer de la valeur token qu'on a envoyé ==> tableau dont [0]: bearer et [1]: le token (on ne récupère que le token en lui-même)
    
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Token non fourni.' });
    }
    
    // vérifie le token, le décode et ajout les données du token à la requête
    req.user = jwt.verify(token, process.env.TOKEN_KEY) // vérification du token avec le token récupéré dans process.env.TOKEN_KEY
    next();

  } catch {
    next.status(401).json({message : "Token d'autentification invalide"}) // ne s'exécute que si la vérif c'est bien passé
  }
};