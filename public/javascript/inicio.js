// inicio.js
/*
export async function login(req, res, next) {
  const { gamertag, password } = req.body
  // Comprobar si se proporciona el nombre de usuario y la contraseña
  if (!gamertag || !password) {
    return res.status(400).json({
      message: "Nombre de usuario o contraseña no ingresados",
    })
  }
  try {
    const gamertag = await gamertag.findOne({ gamertag, password })
    if (!gamertag) {
      res.status(401).json({
        message: "No se pudo iniciar sesión",
        error: "Usuario no encontrado",
      })
    } else {
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        gamertag,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Ocurrió un error",
      error: error.message,
    })
  }
}
*/

function cargarRegistrar(){
  window.location.assign("registrar.html")
  };

function cargarIndex(){
    const form = document.getElementById('form');
    const gamertag = document.getElementById('gamertag');

    form.addEventListener('click', function(e){
        e.preventDefault();
        const valueGamerTag = gamertag.value;
        sessionStorage.setItem('gamer-Tag-Value', valueGamerTag);
        window.location.href = "index (2).html";
      });
  };

function loginUser(){
  console.log("Todo pinta bien...");
  const payload = JSON.stringify({
    gamertag: gamertag.value,
    password: password.value
  });

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const result = JSON.parse(xhr.responseText);
    console.log(result);
    const check = result['valid'];
    if (check == 1){
      alert('Inicio de sesión exitoso. Presione nuevamente INGRESAR.');
      cargarIndex();
    } else {
      alert('No se pueden iniciar sesión en estos momentos');
    }
    //alert('Inicio de sesión exitoso');

  };

  xhr.open('POST', 'http://54.147.131.31:8080/api/users/login');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(payload);

  //cargarIndex();
  /*const form = document.getElementById('form');
  const gamertag = document.getElementById('gamertag');

      form.addEventListener('click', function(e){
          e.preventDefault();
          const valueGamerTag = gamertag.value;
          sessionStorage.setItem('gamer-Tag-Value', valueGamerTag);
          window.location.href = "index(2).html";
      });*/
      
}

function showAlertAndRedirect() {
  alert("¡Haz clic en Aceptar para continuar!");
  window.location.href = "https://www.ejemplo.com/otra-pagina.html";
}

/*
function loginUser(){
  console.log("Todo pinta bien...");
  document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
    // Envía los datos de inicio de sesión al servidor
  fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
        alert('Inicio de sesión exitoso');
      } else {
        alert('Nombre de usuario o contraseña incorrectos');
      }
    })
    .catch(error => console.error(error));
  });
  
}
*/