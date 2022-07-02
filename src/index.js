const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers; //recupera id do request
  const user = users.find((user) => user.username === username); //bool se existe

  if(!user){
    return response.status(404).json({error: "Não encontrado"});//se não encontrar
  }

  request.user = user; //disponibiliza para as rotas o usuario
  return next(); //se encontrar e não cair na condicional
}

app.post('/users', (request, response) => {
  const { name, username } = request.body; //pega do request
  const id = uuidv4(); //cria id como uuid

  const user = users.find((user) => user.username === username); //bool se existe
  if(user){
    return response.status(400).json({error: "Já existe"});//se não encontrar
  }

  if(name == null || username == null)
  response.status(400).json({message: "faltam parametros"});//não procegue se faltar dados

  users.push({
    id,
    name,
    username,
    todos: []
  }); //faz o incremento do array

  return response.status(201).json({
      id,
      name,
      username,
      todos: []
    }
  ); //envia a resposta
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request; //pega do middleware
  return response.status(200).json(user.todos); //retorno
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body; //pega do request
  const {user} = request; //pega user do middleware

  if(title == null|| deadline == null)
  response.status(400).json({message: "faltam parametros"});//não procegue se faltar dados

  const id = uuidv4(); //cria id como uuid
  const done = false;
  const created_at = new Date()

  user.todos.push({
    id, title, done, deadline: new Date(deadline), created_at
  }); //acrescenta o todo

  return response.status(201).json({
    id, title, done, deadline: new Date(deadline), created_at
  }); //retorno
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request; //pega do middleware
  const {title, deadline} = request.body; //pega atualização do request
  const { id } = request.params; //pega id do todo

  var ok = false;
  var responseTodo;
  user.todos.forEach(todo => {
    if(todo.id === id){
      todo.title = title == null ? todo.title : title,
      todo.deadline = deadline == null ? todo.deadline : new Date(deadline)
      ok = true;
      responseTodo = todo;
    }
  }); //altera com o parametro que veio, se veio
  if(ok != true)return response.status(404).json({error: "Todo não encontrado"}); //retorno
  return response.status(200).json({
    title: responseTodo.title,
    deadline: responseTodo.deadline,
    done: responseTodo.done
  }); //retorno
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request; //pega do middleware
  const { id } = request.params; //pega id do todo

  var ok = false;
  var responseTodo;
  user.todos.forEach(todo => {
    if(todo.id === id){
      todo.done = true
      ok = true;
      responseTodo = todo
    }
  }); //altera para finalizado

  if(ok != true)return response.status(404).json({error: "Todo não encontrado"}); //retorno
  return response.status(200).json(responseTodo); //retorno
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request; //pega do middleware
  const { id } = request.params; //pega id do todo

  var ok = false;
  user.todos.forEach(todo => {
    var cont = 0;
    if(todo.id === id){
      user.todos.splice(cont, 1);
      ok = true;
    }
    cont++;
  }); //altera para finalizado

  if(ok != true)return response.status(404).json({error: "Todo não encontrado"}); //retorno
  return response.status(204).json({message: "Todo excluido com sucesso"}); //retorno
});

module.exports = app;