const express = require("express");
const sql = require("mssql");
const router = express.Router();
const sqlConfig = {
    user: 'sa',
    password: process.env.MSSQL_PASSWORD,
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
        segundoApellido: req.body.segundoApellido,
        email: req.body.email,
        password: req.body.password,
        telefono: req.body.telefono,
        codTel: req.body.codTel
    };
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
    //    request.input(tutor.nombreTutor, tutor.primerApellido, tutor.email, tutor.password, tutor.telefono, tutor.codTel);
        request.input('NombreTutor', tutor.nombreTutor);
        request.input('PrimerApellido', tutor.primerApellido);
        request.input('SegundoApellido', tutor.segundoApellido);
        request.input('Email', tutor.email);
        request.input('Password', tutor.password);
        request.input('Telefono', tutor.telefono);
        request.input('CodTel', tutor.codTel);
        let result = await request.execute('PROC_Insertar_Tutor');
        res.status(201).send(result);
        console.log('Success')
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error:', err.message);
            res.status(500).json({error: "Correo o teléfono de ya registrado"});
        }else{
            console.log('Unknown error', err.message);
            res.status(500).json({error: "No se puede registrar al tutor en estos momentos"});
        }
    }
});
//alter password
router.put('/passwords', (req, res)=>{
    const password ={
        password: req.body.password
    };
    res.send(password.password);
});

//TODO: tutor login
//validation of login
router.post('/login', async function (req, res){
    const tutor = {
        email: req.body.email,
        password: req.body.password
    }
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('Email', tutor.email );
        request.input('Password', tutor.password);
        let result =  await request.execute('PROC_Login_Tutor'); //TODO:
        console.log(result);
        res.status(200).json({valid: result.returnValue} );
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede iniciar sesion en este momento. Intente más tard"});
        }else{
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede iniciar sesion en este momento. Intente más tard"});

        }
    }
});
module.exports = router;