const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

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


/* GET METHODS */

app.get('/', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.redirect('/home');
});


app.get('/error', (req, res) => {
  res.render('error');
});


// SERVICIOS //
app.get('/plomero', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/plomero');
});

app.get('/decorador', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/decorador');
});

app.get('/fumigador', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/fumigador');
});

app.get('/reparacion', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/reparacion');
});

app.get('/carpinteria', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/carpinteria');
});

app.get('/electricidad', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/electricidad');
});

app.get('/pintura', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/pintura');
});

app.get('/limpieza', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/limpieza');
});

app.get('/albanil', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  res.render('servicios/albanil');
});



app.get('/home', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  //console.log('SESSION USERNAME HOME ', req.session.username)

  res.render('home');
});

// Ruta para mostrar el formulario de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  // Elimina la información de sesión del usuario
  req.session.destroy();

  // Redirige a la página de inicio de sesión
  res.redirect('/login');
});

app.get('/perfil', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  var Dataview = {
    'user': req.session.userData.username,
    'email': req.session.userData.email
  }
  res.render('perfil', Dataview);
});

// Ruta para mostrar el formulario de registro
app.get('/register', (req, res) => {
  res.render('register');
});


app.get('/register-error', (req, res) => {
  res.render('register-error');
});


app.get('/services', (req, res) => {
  if (!req.session.login) { res.redirect('/login'); return; }
  var Dataview = {
    'user': req.session.username
  }
  res.render('services', Dataview);
});


/* POST METHODS */

// Registro de usuario
app.post('/register', (req, res) => {
  const { username, password, docNumber, email } = req.body;

  try {
    // Verifica si el usuario ya existe en el archivo users.json
    const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
    if (users[docNumber]) {
      throw new Error('El usuario ya existe');
    }

    users[docNumber] = {password, username, email};
    fs.writeFileSync('./users.json', JSON.stringify(users));

    res.redirect('/login');
  } catch (error) {
    res.redirect('register-error');
  }
});


// Inicio de sesión de usuario
app.post('/login', (req, res) => {

  const { docNumber, password } = req.body;
  //console.log('REQ.BODY', req.body)
  //console.log('DOCUNUMBER', docNumber)
  //console.log('PASSWORD', password)
  // Verifica si el usuario existe en el archivo users.json
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  if (users[docNumber] && users[docNumber].password === password) {
    // Autentica al usuario

    req.session.login = 1;
    req.session.userData = users[docNumber]
    req.session.docNumber = docNumber;

    console.log('REQ.SESSION.USERDATA', req.session.userData)
    // Redirige a la página de inicio
    res.redirect('home');
  } else {
    res.redirect('error');
  }
});


app.post('/enviar-correo', (req, res) => {
  const nodemailer = require('nodemailer');


  // Configura el cliente SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'auxilium.gestion777',
      pass: 'dtaajbosjwdzdzji'

      //correo: auxilium.gestion777
      //contraseña: Auxilium777
      //contraseña de aplicacion: dtaajbosjwdzdzji
    }
  });
  // Obtener el valor del botón seleccionado
  const botonSeleccionado = req.body.button;
  const username = req.session.userData.username;


  // Configurar el correo electrónico en función del botón seleccionado
  let mailOptions;
  if (botonSeleccionado === 'plomero') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de plomería para el cliente ${username}`,
      text:`
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante
      de Auxilium.


      El cliente ha reportado un problema con su sistema de plomería y ha 
      solicitado su ayuda para solucionarlo. El cliente se encuentra en la siguiente dirección: Carrera 87a #32-81.

      Agradecemos de antemano su colaboración.

      Saludos cordiales,

      Auxilium Gestion`
    };
  } else if (botonSeleccionado === 'decorador') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de decoración para el cliente ${username}`,
      text:`
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.

      El cliente ha solicitado sus servicios de decoración para su hogar, ubicado en la siguiente dirección: Carrera 87a #32-81.

      El cliente ha especificado que desea hacer una remodelación completa de su sala de estar y necesita su 
      asesoría en cuanto a la selección de muebles, colores y decoración.

      Agradecemos de antemano su colaboración.

      Saludos cordiales,

      Auxilium Gestión`

    };
  } else if (botonSeleccionado === 'fumigador') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de control de plagas para el cliente ${username}`,
      text: `
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante
      de Auxilium.

      El cliente ha reportado un problema de plagas en su hogar y ha solicitado su ayuda para
      solucionarlo. Se encuentra en la siguiente dirección: Carrera 87a #32-81.

      Saludos cordiales,

      Auxilium Gestion`
    };
    
  }
  else if (botonSeleccionado === 'reparacion_AC') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de reparación de aire acondicionado para  ${username}`,
      text: `
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.

      El cliente ha reportado un problema con su sistema de aire acondicionado y ha 
      solicitado su ayuda para solucionarlo. El cliente se encuentra en la siguiente dirección: Carrera 87a #32-81.

      Le agradecemos su pronta atención a este asunto.

      Saludos cordiales,

      Auxilium Gestion`
    };
  }else if (botonSeleccionado === 'carpintero') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de carpinteríapara para el cliente ${username}`,
      text: `
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.

      El cliente ha reportado un problema con un mueble en su hogar y ha solicitado 
      su ayuda para repararlo. El cliente se encuentra en la siguiente dirección: Carrera 87a #32-81.

      Agradecemos de antemano su colaboración y profesionalismo.

      Saludos cordiales,

      Auxilium Gestion`
    };
  }else if (botonSeleccionado === 'electricista') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de electricidad para el cliente ${username}`,
      text: `
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.

      El cliente ha reportado un problema con su sistema eléctrico y ha 
      solicitado su ayuda para solucionarlo. El cliente se encuentra en la siguiente dirección: Carrera 87a #32-81.

      El problema que ha reportado el cliente es el siguiente: [descripción del problema].

      Agradecemos de antemano su colaboración.

      Saludos cordiales,

      Auxilium Gestion`
    };
  }else if (botonSeleccionado === 'pintor') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de pintura para el cliente ${username}`,
      text: `
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.

      El cliente ha solicitado los servicios de un pintor para realizar trabajos en su 
      domicilio. La dirección del cliente es la siguiente: Carrera 87a #32-81.

      El cliente necesita los siguientes trabajos de pintura:

        - Fachada completa

      Agradecemos de antemano su colaboración.
      
      Saludos cordiales,

      Auxilium Gestion`
    };
  }else if (botonSeleccionado === 'limpieza') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: `Solicitud de servicio de limpieza para el cliente ${username}`,
      text: `
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.

      El cliente ha solicitado un servicio de limpieza en su hogar ubicado en la 
      siguiente dirección: Carrera 87a #32-81. 
      
      La limpieza debe incluir los siguientes detalles:

        - Limpieza general
        - Ventanas y vidrios

      Agradecemos de antemano su colaboración.
      
      Saludos cordiales,

      Auxilium Gestion`
    };
  }else if (botonSeleccionado === 'albañil') {
    mailOptions = {
      from: 'auxilium.gestion777',
      to: 'juanpabloaguirreosorio@gmail.com',
      subject: ` Solicitud de servicios de albañilería para el cliente ${username}`,
      text: `
      Estimado/a Agente,

      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.

      El cliente ha reportado un problema con una pared en su hogar y ha solicitado 
      su ayuda para solucionarlo. El cliente se encuentra en la siguiente dirección: Carrera 87a #32-81.
      
      El problema que ha reportado el cliente es el siguiente: 
      
      - Humedad en techo.

      Agradecemos de antemano su colaboración.
      
      Saludos cordiales,

      Auxilium Gestion`
    };
  }

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send('Error al enviar el correo electrónico');
    } else {
      console.log('Correo electrónico enviado: ' + info.response);
      res.send('Correo electrónico enviado');
    }
  });
});
app.listen(7777, () => {
  console.log('El servidor está funcionando en el puerto 7777');
});
