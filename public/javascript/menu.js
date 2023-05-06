function cargarInicio(){
  conIndex.style.display = 'block';
  conScoreboard.style.display = 'none';
  conProgreso.style.display = 'none';
  conComentarios.style.display = 'none';

};

function cargarScoreboard(){
  conIndex.style.display = 'none';
  conScoreboard.style.display = 'block';
  conProgreso.style.display = 'none';
  conComentarios.style.display = 'none';
  
};

function cargarProgreso(){
  conIndex.style.display = 'none';
  conScoreboard.style.display = 'none';
  conProgreso.style.display = 'block';
  conComentarios.style.display = 'none';
  getPuntajeMax();
  getNivelMax();
  partidasJugadas();

};

function cargarComentarios(){
  
  conIndex.style.display = 'none';
  conScoreboard.style.display = 'none';
  conProgreso.style.display = 'none';
  conComentarios.style.display = 'block';

};


getComment();
const gamerTag = sessionStorage.getItem('gamer-Tag-Value');
document.getElementById('gamer-Tag').textContent = gamerTag;