
function saveComment() {

    console.log("Todo pinta bien...");
      const payLoad = JSON.stringify({
        comentario: comentarioNuevo.value,
        gamertag: sessionStorage.getItem('gamer-Tag-Value')
      });
  
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const result = JSON.parse(xhr.responseText);
        console.log(result);
        const check = result['valid'];
        console.log(check);
        if (check == 1){
          alert('Se guardo el comentario');
        } else {
          alert('No se puede guardar el comentario en estos momentos');
        }
      };
      xhr.open('POST', 'http://54.147.131.31:8080/api/users/comments');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(payLoad);
}

function getComment() {
    console.log("Todo pinta bien...");
      const payLoad = JSON.stringify({
        comentario: comentarioNuevo.value,
      });
  
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const result = JSON.parse(xhr.responseText);
        console.log(result);
        const data = [];
        for (let i of result ['table']) {
          data.push(i['comentario']);
        }
        comentario1.innerText = data[0];
        comentario2.innerText = data[1];
        comentario3.innerText = data[2];
      };
  
      xhr.open('GET', 'http://54.147.131.31:8080/api/leaderboard/comments');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(payLoad);
}
  
/*const xhr = new XMLHttpRequest();
    xhr.onload = () => {
    const result = JSON.parse(xhr.responseText);
    console.log(result);
    const check = result['valid'];
    if (check == 1){
      alert('Inicio de sesión exitoso');
      cargarIndex();
    } else {
      alert('No se pueden iniciar sesión en estos momentos');
    }
  /*app.get('/quotations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const rows = (await mssql.query`
        SELECT id, author, excerpt FROM quotations 
        WHERE id=${id}
    `).recordset;
    const row = rows[0];
    if (row) {
      res.json({
        comentario: row.comentario,
        gamertag: row.gamertag
      });
    } else {
      res.type('text').status(404).send(
        `Resource with ID = ${id} not found.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});*/