function getPuntajeMax() {
    console.log("Todo pinta bien...");
      
      const gamertag = sessionStorage.getItem('gamer-Tag-Value')
      
  
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const result = JSON.parse(xhr.responseText);
        console.log(result);
        const data = [];
        for (let i of result ['table']) {
          data.push(i['Puntaje']);
        }
        console.log(data[0]);
        puntajeMax.innerText = data[0];
      };
  
      xhr.open('GET',`http://54.147.131.31:8080/api/users/maximoPuntaje/${gamertag}`);
      xhr.send();
}

function getNivelMax() {
  console.log("Todo pinta bien...");
    
    const gamertag = sessionStorage.getItem('gamer-Tag-Value')
    
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText);
      console.log(result);
      const data = [];
      for (let i of result ['table']) {
        data.push(i['% de Progreso']);
      }
      console.log(data[0]);
      nivelMax.innerText = (data[0] * 0.04);
    };

    xhr.open('GET', `http://54.147.131.31:8080/api/users/progreso/${gamertag}`);
    xhr.send();
}

function partidasJugadas() {
  console.log("Todo pinta bien...");
    
    const gamertag = sessionStorage.getItem('gamer-Tag-Value')
    
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText);
      console.log(result);
      const data = [];
      for (let i of result ['table']) {
        data.push(i['Cantidad']);
      }
      console.log(data[0]);
      partidas.innerText = data[0];
    };

    xhr.open('GET', `http://54.147.131.31:8080/api/users/partidas/${gamertag}`);
    xhr.send();
}