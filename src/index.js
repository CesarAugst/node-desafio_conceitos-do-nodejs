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
    username,
    todos: []
  }); //faz o incremento do array

  return response.status(201).json({
    message: "Criado com sucesso",
    user: {
      id,
      name,
      username,
      todos: []
    }
  }); //envia a resposta
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request; //pega do middleware
  return response.status(200).json(user.todos); //retorno
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline, done } = request.body; //pega do request
  const {user} = request; //pega user do middleware

  if(title == null|| deadline == null || done == null)
  response.status(400).json({message: "faltam parametros"});//não procegue se faltar dados

  user.todos.push({
    title, deadline, done
  }); //acrescenta o todo

  return response.status(200).json({message: "Todo criado com sucesso"}); //retorno
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