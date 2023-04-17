const express = require("express");
const sql = require("mssql");
const router = express.Router();
const sqlConfig = {
    user: 'sa',
    password: process.env.db_pswd,
    server: 'localhost',
    database: 'JuegoCrackTheCode',
    port: 1433,
    options:{
        encrypt: true,
        trustServerCertificate: true
    }
};

//insert tutor
router.post('/', async function (req, res) {
    const tutor = {
        nombreTutor: req.body.nombreTutor,
        primerApellido: req.body.primerApellido,
        email: req.body.email,
        password: req.body.password,
        telefono: req.body.telefono,
        codTel: req.body.codTel
    };
    let pool = await sql.connect(sqlConfig);
    let request = pool.request();
//    request.input(tutor.nombreTutor, tutor.primerApellido, tutor.email, tutor.password, tutor.telefono, tutor.codTel);
    request.input('NombreTutor', tutor.nombreTutor);
    request.input('PrimerApellido', tutor.primerApellido);
    request.input('Email', tutor.email);
    request.input('Password', tutor.password);
    request.input('Telefono', sql.Int, tutor.telefono);
    request.input('CodTel', sql.Int , tutor.codTel);
    let result = await request.execute('PROC_Insertar_Tutor');
    res.send(result);
});
//alter password
router.put('/passwords', (req, res)=>{
    const password ={
        password: req.body.password
    };
    res.send(password.password);
});

module.exports = router;