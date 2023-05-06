function updateGamertag() {
    console.log("Todo pinta bien...");
      const payLoad = JSON.stringify({
        prevGamertag: PrevGamertag.value,
        gamertag: NewGamertag.value
      });
  
      const xhr = new XMLHttpRequest();
        xhr.onload = () => {
        //console.log("success");
        const result = JSON.parse(xhr.responseText);
        console.log(result);
        const check = result['valid'];
        if (check == 1){
          alert('Se cambio el gamertag. Para ver el cambio, vuelve a iniciar sesión.');
        } else {
          alert('No se puede cambiar gamertag en estos momentos');
        }
      };
      xhr.open('PUT', 'http://54.147.131.31:8080/api/users/gamertags');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(payLoad);
  }
  