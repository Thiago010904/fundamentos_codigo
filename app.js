const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const app = express();
const ejs = require('ejs');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: false
}));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
    res.redirect('/home');
});

app.get('/home', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  console.log('SESSION USERNAME HOME ',req.session.username)
  var Dataview ={
    'user': req.session.username
  }
  res.render('home', Dataview);
});
// Ruta para mostrar el formulario de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para mostrar el formulario de registro
app.get('/register', (req, res) => {
  res.render('register');
});
app.get('/logout', (req, res) => {
  // Elimina la información de sesión del usuario
  req.session.destroy();

  // Redirige a la página de inicio de sesión
  res.redirect('/login');
});

// Registro de usuario
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Verifica si el usuario ya existe en el archivo users.json
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  if (users[username]) {
    return res.status(409).send('El usuario ya existe');
  }

  users[username] = password;
  fs.writeFileSync('./users.json', JSON.stringify(users));

  res.redirect('/login');
});

// Inicio de sesión de usuario
app.post('/login', (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;

  // Verifica si el usuario existe en el archivo users.json
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  if (users[username] === password) {
    // Autentica al usuario
    
    req.session.login = 1;
    req.session.username = username;
    
    // Redirige a la página de inicio
    res.redirect('home');
  } else {
    // Envía un código de error y el mensaje de error a la vista
    res.status(401).render('login', { error: 'Usuario o contraseña incorrectos' });
  }
  console.log("REQ.SESSION ",req.session)
  
});

app.listen(3000, () => {
  console.log('El servidor está funcionando en el puerto 3000');
});

