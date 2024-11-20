var express = require('express');
var router = express.Router();
const authController = require('../controller/authController');

// Rota de logout
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer logout' });
    }
    res.status(200).json({ message: 'Logout realizado com sucesso' }); // Resposta JSON
  });
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificando se as credenciais são válidas
    const user = await authController.login(req, res);
    
    // Se o login for bem-sucedido, retornamos o ID e o nome do usuário
    if (user) {
      res.status(200).json({
        message: 'Login realizado com sucesso',
        userId: user._id,
        userName: user.username // Informações adicionais
      });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
  }
});

module.exports = router;
