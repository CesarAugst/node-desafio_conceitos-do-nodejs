const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { id } = request.headers; //recupera id do request
  const user = users.find((user) => user.id === id); //bool se existe

  if(!user){
    return response.status(400).json({message: "Não encontrado"});//se não encontrar
  }

  request.user = user; //disponibiliza para as rotas o usuario
  return next(); //se encontrar e não cair na condicional
}

app.post('/users', (request, response) => {
  const { name, username } = request.body; //pega do request
  const id = uuidv4(); //cria id como uuid

  if(name == null || username == null)
  response.status(400).json({message: "faltam parametros"});//não procegue se faltar dados

  users.push({
    id,
    name,
    username
  }); //faz o incremento do array

  return response.status(201).json({
    message: "Criado com sucesso",
    user: {
      id,
      name,
      username
    }
  }); //envia a resposta
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;