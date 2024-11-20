const User = require('../models/user');
const bcrypt = require('bcrypt');

// Rota de login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar o usuário pelo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Comparar a senha
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Armazenar o ID do usuário na sessão
        req.session.userId = user._id;

        // Retornar uma resposta JSON com os dados necessários para o frontend
        res.status(200).json({
            message: 'Login realizado com sucesso',
            userId: user._id,
            username: user.username // Adiciona o nome do usuário para facilitar a navegação
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
    }
};

// Endpoint para verificar o estado da autenticação
exports.checkAuth = async (req, res) => {
    if (req.session.userId) {
        // Se o usuário estiver autenticado, obtenha os dados do usuário
        const user = await User.findById(req.session.userId);
        if (user) {
            res.status(200).json({
                authenticated: true,
                userName: user.username,
                userId: user._id
            });
        } else {
            res.status(401).json({ message: 'Usuário não encontrado' });
        }
    } else {
        // Caso o usuário não esteja autenticado
        res.status(200).json({ authenticated: false });
    }
};

// Rota de logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer logout' });
        }
        res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
};
