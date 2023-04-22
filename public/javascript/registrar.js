
function saveDataUser() {
  console.log("Todo pinta bien...");
  saveDataTutor();
  let fecha = `${year.value}-${mes.value}-${dia.value}`;
  console.log(fecha);
    const payLoad = JSON.stringify({
      nombreUsuario: nombreUsuario.value,
      primerApellido: apellidoUs.value,
      gamertag: GamerTag.value,
      password: passUs.value,
      fecha: fecha,
      emailTutor: email.value
    });
    
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      result.innerText = xhr.responseText;
      main.style.display = 'none';
      endMessage.style.display = 'block';
    };
    xhr.open('POST', 'http://localhost:3000/api/users');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(payLoad);
}

function saveDataTutor() {
  const payLoad = JSON.stringify({
    nombreTutor: nombreTutor.value,
    primerApellido: apellidoTu.value,
    email: email.value,
    password: passTu.value,
    telefono: telefono.value,
    codTel: codTel.value
  });
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    result.innerText = xhr.responseText;
    main.style.display = 'none';
    endMessage.style.display = 'block';
  };
  xhr.open('POST', 'http://localhost:3000/api/tutors');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(payLoad);
}