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

app.get('/rechazo', (req, res) => {
  res.render('rechazo');
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

    users[docNumber] = { password, username, email };
    fs.writeFileSync('./users.json', JSON.stringify(users));

    res.redirect('/login');
  } catch (error) {
    res.redirect('register-error');
  }
});


// Inicio de sesión de usuario
app.post('/login', (req, res) => {

  const { docNumber, password } = req.body;
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
  const email = req.session.userData.email;

  function correoAleatorio() {
    var listaCorreos = ['alejandromarin203@gmail.com', 'santiagoxox09@gmail.com']
    const indiceAleatorio = Math.floor(Math.random() * listaCorreos.length);
    return listaCorreos[indiceAleatorio]
  }



  // Configurar el correo electrónico en función del botón seleccionado
  let mailOptions;
  if (botonSeleccionado === 'plomero') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const textdescrip = req.body.textdescrip;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&textdescrip=${encodeURIComponent(textdescrip)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicio de plomería para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante<br/>
      de Auxilium.<br/>
      <br/>
      El cliente ${username} ha reportado un problema con su sistema de plomería y ha <br/>
      solicitado su ayuda para solucionarlo. El cliente se encuentra en la siguiente dirección: ${direccion}<br/>
      y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      El problema que ha reportado el cliente es el siguiente:<br/>
      <br/>
      -${textdescrip}
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion<br/>
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
      </html>


      `
    };
  } else if (botonSeleccionado === 'decorador') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const textdescrip = req.body.estildeco;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&textdescrip=${encodeURIComponent(textdescrip)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicio de decoración para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante de Auxilium.<br/>
      <br/>
      El cliente ${username} ha solicitado sus servicios de decoración para su hogar, ubicado en la siguiente dirección: ${direccion}<br/>
      y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      El cliente ha especificado lo siguiente:<br/>
      <br/>
      -${textdescrip}<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestión<br/>
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
    </html>
    `
    };
  }
  else if (botonSeleccionado === 'fumigador') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const numhabs = req.body.numhabs;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&numhabs=${encodeURIComponent(numhabs)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicio de control de plagas para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante<br/>
      de Auxilium.<br/>
      <br/>
      El cliente ${nombre} ha solicitado un servicio de fumigación en la siguiente dirección: ${direccion}.<br/>
      La solicitud incluye ${numhabs} habitaciones y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </html>
      `
    };

  }
  else if (botonSeleccionado === 'reparacion') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const textdescrip = req.body.textdescrip;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&textdescrip=${encodeURIComponent(textdescrip)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicio de reparación para  ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante<br/>
      de Auxilium.<br/>
      <br/>
      El cliente ${username} ha solicitado un servicio de reparacion y necesita de su ayuda para solucionarlo.<br/>
      El cliente se encuentra en la siguiente dirección: ${direccion} y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      El problema que ha reportado el cliente es el siguiente:<br/>
      <br/>
      -${textdescrip}<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Le agradecemos su pronta atención a este asunto.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion<br/>
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
      </html>
      `
    };
  } else if (botonSeleccionado === 'carpintero') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const textdescrip = req.body.textdescrip;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&textdescrip=${encodeURIComponent(textdescrip)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${email}`,
      subject: `Solicitud de servicio de carpinteríapara para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante 
      de Auxilium.
      <br/>
      El cliente ${username} ha reportado un problema con un mueble en su hogar y ha solicitado<br/>
      su ayuda para repararlo. El cliente se encuentra en la siguiente dirección: ${direccion} y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      El problema que ha reportado el cliente es el siguiente:
      <br/>
      -${textdescrip}<br/>
      <br/>
      Numero de celular: ${phoneNumber}
      <br/>
      Agradecemos de antemano su colaboración y profesionalismo.
      <br/>
      Saludos cordiales,
      <br/>
      Auxilium Gestion
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
      </html>
      `
    };
  } else if (botonSeleccionado === 'electricista') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const textdescrip = req.body.problemdescrip;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&textdescrip=${encodeURIComponent(textdescrip)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicio de electricidad para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante<br/>
      de Auxilium.<br/>
      <br/>
      El cliente ${username} ha reportado un problema con su sistema eléctrico y ha<br/>
      solicitado su ayuda para solucionarlo. El cliente se encuentra en la siguiente dirección: ${direccion} y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      El problema que ha reportado el cliente es el siguiente:<br/>
      <br/>
        -${textdescrip}<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
      </html>
      `
    };
  } else if (botonSeleccionado === 'pintor') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const textdescrip = req.body.jobdescrip;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&textdescrip=${encodeURIComponent(textdescrip)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicio de pintura para el cliente ${username}`,
      html: `

      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante<br/>
      de Auxilium.<br/>
      <br/>
      El cliente ${username} ha solicitado los servicios de un pintor para realizar trabajos en su <br/>
      domicilio. La dirección del cliente es la siguiente: ${direccion} y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      El cliente necesita los siguientes trabajos de pintura:<br/>
      <br/>
        - ${textdescrip}<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
      </html>

      `
    };
  } else if (botonSeleccionado === 'limpieza') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const numhabs = req.body.numhabs;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&numhabs=${encodeURIComponent(numhabs)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicio de limpieza para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante <br/>
      de Auxilium.<br/>
      <br/>
      El cliente ${username} ha solicitado un servicio de limpieza en su hogar ubicado en la <br/>
      siguiente dirección: ${direccion}.<br/>
      La solicitud incluye ${numhabs} habitaciones y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
      </html>
      `
    };
  } else if (botonSeleccionado === 'albañil') {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const textdescrip = req.body.jobdescrip;
    const phoneNumber = req.body.phoneNumber;
    const fecha = req.body.fecha;
    const rechazarLink = `http://localhost:7777/rechazo?nombre=${encodeURIComponent(nombre)}&direccion=${encodeURIComponent(direccion)}&textdescrip=${encodeURIComponent(textdescrip)}&phoneNumber=${encodeURIComponent(phoneNumber)}&botonSeleccionado=${encodeURIComponent(botonSeleccionado)}&fecha=${encodeURIComponent(fecha)}`;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: ` Solicitud de servicios de albañilería para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante <br/>
      de Auxilium.<br/>

      El cliente ${username} ha reportado un problema con una pared en su hogar y ha solicitado <br/>
      su ayuda para solucionarlo. El cliente se encuentra en la siguiente dirección: ${direccion} <br/>
      y la fecha de servicio deseada es el ${fecha}.<br/>
      <br/>
      El problema que ha reportado el cliente es el siguiente: <br/>
      <br/>
      - ${textdescrip}<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      <p style="text-align: center;">
      <a href="${rechazarLink}" style="display: inline-block; background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;  text-decoration: none; font-size: 16px;">Rechazar</a>
      </p>
      </html>
      `
    };
  }else if(botonSeleccionado === 'ambulancia'){
    const direccion = req.body.direccion;
    const phoneNumber = req.body.phoneNumber;
    mailOptions = {
      from: 'auxilium.gestion777',
      to: `${correoAleatorio}`,
      subject: `Solicitud de servicios de ambulancia para el cliente ${username}`,
      html: `
      <html>
      <p>
      Estimado/a Agente,<br/>
      <br/>
      Espero que se encuentre bien. Me pongo en contacto con usted en calidad de representante <br/>
      de Auxilium.<br/>
      <br/>
      El cliente ${username} ha reportado un problema y requiere de una ambulancia urgentemente.<br/>
      <br/>
      El cliente se encuentra en la siguiente dirección: ${direccion}.<br/>
      <br/>
      Numero de celular: ${phoneNumber}<br/>
      Contactar con el usuario lo mas pronto posible<br/>
      <br/>
      Agradecemos de antemano su colaboración.<br/>
      <br/>
      Saludos cordiales,<br/>
      <br/>
      Auxilium Gestion
      </p>
      <p style="text-align: center;">
      <a href="mailto:${email}?subject=Solicitud%20aceptada&body=Su%20pedido%20ha%20sido%20confirmado" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 16px;">Aceptar</a>
      </p>
      </html>
      `
    };
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send('Error al enviar el correo electrónico uwu');
    } else {
      console.log('Correo electrónico enviado: ' + info.response);
      res.send('Correo electrónico enviado');
    }
  });
});
app.listen(7777, () => {
  console.log('El servidor está funcionando en el puerto 7777');
});
