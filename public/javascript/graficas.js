function crearUsuariosPorPais() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
      const data = [];
      const labels = [];
      const result = JSON.parse(xhr.responseText);
      for (let i of result['table']) {
          data.push(i['Cantidad']);
          labels.push(i['Pais']);
      }

      const ctx = document.getElementById("usuariosPorPais");
      new Chart(ctx, {
          type: 'pie',
          data: {
              labels: labels,
              datasets: [{
                  label: "Usuarios por país",
                  data: data
              }]
          },
          options: {
              plugins: {
                  title: {
                      display: true,
                      text: 'Cantidad de usuarios por país'
                  }
              }
          }
      });
  };
  xhr.open('GET','http://54.147.131.31:8080/api/leaderboard/country' );
  xhr.send();
};

function changePage(n) {
const params = new URLSearchParams(window.location.search);
let page = parseInt(params.get('page')) ?? 1;
page += n;
params.set('page', page);
window.location.search = params;
};

function crearLeaderBoard() {
const params = new URLSearchParams(window.location.search);
const page = params.get('page') ?? 1;

const xhr = new XMLHttpRequest();
xhr.onload = function() {
    const labels = [];
    const data = [];
    const result = JSON.parse(xhr.responseText);
    const table = document.getElementById('tablaLeaderboard');
    for (let i of result['table']) {
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        cell1.innerHTML = i['Place'];
        cell2.innerHTML = i['GamerTag'];
        cell3.innerHTML = i['Progreso'];
        cell4.innerHTML = i['Puntaje'];
        console.log((i["Fecha"]).substring(0,11));
        cell5.innerHTML = (i["Fecha"]).substring(0,10);
        labels.push(i['GamerTag']);
        data.push(i['Puntaje']);
    }
};
xhr.open('GET',`http://54.147.131.31:8080/api/leaderboard/${1}` );
xhr.send();
};

function crearUsuariosProgreso() {
const xhr = new XMLHttpRequest();
xhr.onload = () => {
    const data = [];
    const labels = [];
    const result = JSON.parse(xhr.responseText);
    for (let i of result['table']) {
        data.push(i['Cantidad']);
        labels.push(i['% de Progreso']);
    }

    const ctx = document.getElementById("usuariosProgreso");
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: "Cantidad",
                data: data, 
                backgroundColor: ["#F74E4E", "#F7934E", "#F7CE4E", "#E8EB85", "#86E95E"]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '% de progreso de usuarios'
                }
            }
        }
    });
};
xhr.open('GET','http://54.147.131.31:8080/api/leaderboard/progress' );
xhr.send();
};

function crearScoresUsuario(){
const gamertag = sessionStorage.getItem('gamer-Tag-Value');
const xhr = new XMLHttpRequest();
xhr.onload = ()  => {
    const data = [];
const labels = [];
const result = JSON.parse(xhr.responseText);
console.log(result);
for (let i of result['table']) {
    data.push(i['Puntaje']);
    labels.push((i["Fecha"]).substring(0,10));
}

const ctx = document.getElementById("scoreUsuario");
new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets : [{
            label: "Score total",
            data: data
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Scores de las partidas jugadas'
            }
        }
    }
});
};
xhr.open('GET', `http://54.147.131.31:8080/api/users/scores/${gamertag}`);
xhr.send();
};

crearScoresUsuario();
crearUsuariosPorPais();
crearUsuariosProgreso();
crearLeaderBoard();