function saveCalificacion() {
    console.log("Todo pinta bien...");
      const payLoad = JSON.stringify({
        gamertag: sessionStorage.getItem('gamer-Tag-Value'),
        calificacion: calificacionNueva.value
        
      });
      console.log(payLoad.gamertag);
      console.log(payLoad.calificacion);
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const result = JSON.parse(xhr.responseText);
        console.log(result);
        const check = result['valid'];
        if (check == 1){
          alert('Se envió la calificacion.');
        } else {
          alert('No se puede enviar la calificacion.');
        
      };
  
      
      }
      xhr.open('PUT',`http://54.147.131.31:8080/api/users/calificacion`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(payLoad);
    
}
