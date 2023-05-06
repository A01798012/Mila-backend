function updatePassword() {
    console.log("Todo pinta bien...");
      const payLoad = JSON.stringify({
        gamertag: sessionStorage.getItem('gamer-Tag-Value'),
        previousPassword: PrevPass.value,
        newPassword: NewPass.value
      });

      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const result = JSON.parse(xhr.responseText);
        console.log(result);
        const check = result['valid'];
        if (check == 1){
          alert('Se cambio el password');
        } else {
          alert('No se puede cambiar  el password en estos momentos');
        }
      };
      xhr.open('PUT', 'http://54.147.131.31:8080/api/users/passwords');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(payLoad);
  }
