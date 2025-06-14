const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function register(req, res) {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
  }

  const existing = await prisma.user.findUnique({ where: { name } });
  if (existing) {
    return res.status(409).json({ error: 'Usuário já existe.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      password: hashed,
    },
  });

  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
}

async function login(req, res) {
  const { name, password } = req.body;
  const user = await prisma.user.findUnique({ where: { name } });

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
}

module.exports = { register, login };
