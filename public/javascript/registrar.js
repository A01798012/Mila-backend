
function saveDataUser() {
  console.log("Todo pinta bien...");
  let fecha = `${year.value}-${mes.value}-${dia.value}`;
  console.log(fecha);
  console.log(codTel.value);
    const payLoad = JSON.stringify({
      nombreUsuario: nombreUsuario.value,
      primerApellido: primerApellidoUs.value,
      segundoApellido: segundoApellidoUs.value,
      gamertag: GamerTag.value,
      password: passUs.value,
      fecha: fecha,
      emailTutor: email.value
    });
    
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      /*const result = JSON.parse(xhr.responseText);
      console.log(result);
      const check = result['valid'];
      if (check == 1){
        alert('Se registro el usuario');
        cargarIndex();
      } else {
        alert('No se puede registrar el usuario en estos momentos');
      }*/
      //window.location.href = "inicio.html";
    };
    xhr.open('POST', 'http://54.147.131.31:8080/api/users');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(payLoad);
}

function saveDataTutor() {
  const payLoad = JSON.stringify({
    nombreTutor: nombreTutor.value,
    primerApellido: primerApellidoTu.value,
    segundoApellido: segundoApellidoTu.value,
    email: email.value,
    password: passTu.value,
    telefono: telefono.value,
    codTel: codTel.value
  });
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    saveDataUser();
    //window.location.href = "inicio.html";

 
  };
  xhr.open('POST', 'http://54.147.131.31:8080/api/tutors');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(payLoad);
  //callback();
}

function cargarInicio(){
  window.location.href = "inicio.html";
}