const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json()); // para ler JSON no body

// Importar rotas de autenticação
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));