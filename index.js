const express = require("express");
const app = express();
app.use(express.json());
// TUTOR
//insert new tutor
app.post('/api/tutor', (req, res)=>{
    const tutor = {
        nombreTutor: req.body.nombreTutor,
        primerApellido: req.body.primerApellido,
        email: req.body.email,
        password: req.body.password,
        telefono: req.body.telefono,
        codTel: req.body.codTel
    };
    res.send(tutor);
});
//alter password
//:

// USER
//insert new user
app.post('/api/user', (req, res)=>{
    const user = {
        nombreUsuario: req.body.nombreUsuario,
        primerApellido: req.body.primerApellido,
        gamertag: req.body.gamertag,
        password: req.body.password,
        calificacion: req.body.calificacion,
        edad: req.body.edad,
        iDTutor: req.body.iDTutor, // TODO ???
        codTel: req.body.codTel
    };
    res.send(user);
});
//insert comment
app.post('/api/comment', (req, res)=>{
    const comment = {
        comentario: req.body.comentario,
        idUsuario: req.body.idUsuario //TODO ???
    };
    res.send(comment);
});
//validate password
//alter calificacion
//alter gamertag
//alter password

//Partida
//alter score
app.put('/api/score', (req, res)=>{

});
//alter actual progresss
app.put('/api/progress', (req, res)=>{

});
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));