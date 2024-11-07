const User = require('../models/user');
const createError = require('http-errors');
const Event = require('../models/event');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar o usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    // Verificar a senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    // Armazenar o ID do usuário na sessão
    req.session.userId = user._id;

    res.status(200).json({ message: 'Login bem-sucedido!', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verifique se todos os campos obrigatórios foram fornecidos
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Gerar hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Criar o novo usuário com o hash da senha
    const newUser = await User.create({ username, email, passwordHash }); // Corrigido aqui

    // Armazenar o ID do usuário na sessão, se necessário
    req.session.userId = newUser._id; // Se você ainda usar sessão

    // Retorna uma resposta JSON
    res.status(201).json({ message: "Usuário criado com sucesso!", userId: newUser._id });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId; // Obtenha o userId da sessão
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Encontrar os eventos criados e cadastrados pelo usuário
    const userEvents = await Event.find({ organizer: userId });
    const registeredEvents = await Event.find({ 'participants.user': userId });

    // Retornar os dados do usuário e eventos em JSON
    res.status(200).json({
      user,
      userEvents,
      registeredEvents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
