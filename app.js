//Asignacion de paquetes
let express = require('express')
let mysql = require('mysql')
let cors = require('cors')
let jwt = require('jsonwebtoken')
const { json } = require('express/lib/response')

//Cosntructor express, para acceder a sus metodos
let app = express()
app.use(express.json()) // Le decimos a la aplicacion que vamos a utilizar formatos JSON
app.use(cors())

//configuracion de la conexion a la base de datos
let conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'barberserver'
})

//probamos conexion
conexion.connect(function(error){
    if(error){
        throw error //captura el error 
    }else{
        console.log("¡Conexion exitosa a la base de datos!")
    }
})

//configuracion de las rutas
app.get('/', function(req, res){
    res.send('Ruta de inicio')
})

//creacion de todos los metodos

//tabla cliente

//Metodos get

//Mostrar todos los articulos
app.get('/api/cliente', (req, res) =>{
    conexion.query('SELECT * FROM cliente', (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Mostrar un solo articulo
app.get('/api/cliente/:idCliente', (req, res) =>{
    conexion.query('SELECT * FROM cliente WHERE idCliente = ?', [req.params.idCliente], (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Metodos post
app.post('/api/register', (req, res)=>{
    let data = {Nombres:req.body.Nombres, 
                Apellidos:req.body.Apellidos,
                Telefono:req.body.Telefono,
                Email:req.body.Email,
                Foto:req.body.Foto,
                Password:req.body.Password} //esta data va a tener un objeto de todos los valores que le vamos a mandar a la sentencia sql 

    jwt.sign({data}, 'secretkey', (err, token) =>{
        res.json({
            token
        })
    })
})

function verifytoken(req, res, next){
    let bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined'){
        let bearerToken = bearerHeader.split(" ")[1]
        req.token = bearerToken
        next()
    }else{
        res.sendStatus(403)
    }
}

app.post('/api/cliente', verifytoken, (req, res)=>{
    jwt.verify(req.token, 'secretkey', (error, authData) =>{
        if(error){
            res.sendStatus(403)
        }else{
            let slq = "INSERT INTO cliente SET ?" //Sentencia slq que nos permite setear los campos que vamos a llenar, con el "?" definimos todos los parametros(Cedula, Nombre, Apellidos ) de la data
            conexion.query(slq, authData.data, function(error, results){
                if(error){
                    throw error
                }else{
                    res.send(results)
                }
            })

        }
    })  
})


//Metodos put

app.put('/api/cliente/:idCliente', (req,res)=>{
    let idCliente = req.params.idCliente
    let Nombres = req.body.Nombres
    let Apellidos = req.body.Apellidos
    let Telefono = req.body.Telefono
    let Email = req.body.Email
    let sql = "UPDATE cliente SET Nombres = ?, Apellidos = ?, Telefono = ?, Email = ? WHERE idCliente = ?;"
    conexion.query(sql, [Nombres, Apellidos, Telefono, Email, idCliente], function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos Delete

app.delete('/api/cliente/:idCliente', (req, res)=>{
    conexion.query('DELETE FROM cliente WHERE idCliente = ?', [req.params.idCliente], function(error, filas){
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//tabla Trabajador

//Metodos get

//Mostrar todos los trabajadores
app.get('/api/trabajador', (req, res) =>{
    conexion.query('SELECT * FROM trabajador', (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Mostrar un solo Trabajadores
app.get('/api/cliente/:idTrabajador', (req, res) =>{
    conexion.query('SELECT * FROM trabajador WHERE idTrabajador = ?', [req.params.idTrabajador], (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Metodos post

app.post('/api/trabajador', (req, res)=>{
    let data = {
                Nombres:req.body.Nombres, 
                Apellidos:req.body.Apellidos,
                Servicios:req.body.Servicios,
                Categoria:req.body.Categoria,
                Direccion:req.body.Direccion,
                Foto:req.body.Foto,
                Calificacion:req.body.Calificacion,
                Password:req.body.Password}
    let slq = "INSERT INTO trabajador SET ?"
    conexion.query(slq, data, function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos put

app.put('/api/cliente/:idTrabajador', (req,res)=>{
    let idTrabajador = req.params.idTrabajador
    let Nombres = req.body.Nombres
    let Apellidos = req.body.Apellidos
    let idServicios = req.body.idServicios
    let Categoria = req.body.Categoria
    let Dirrecion = req.body.Dirrecion
    let Foto = req.body.Foto
    let sql = "UPDATE cliente SET Nombres = ?, Apellidos = ?, idServicos = ?, Categotia = ?, Dirrecion = ?, Foto = ? WHERE idTrabajador = ?;"
    conexion.query(sql, [Nombres, Apellidos, idServicios, Categoria, Dirrecion, Foto, idTrabajador], function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos Delete

app.delete('/api/trabajador/:idTrabajador', (req, res)=>{
    conexion.query('DELETE FROM trabajador WHERE idTrabajador = ?', [req.params.idTrabajador], function(error, filas){
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//tabla Servicios

//Metodos get

//Mostrar todos los trabajadores
app.get('/api/servicios', (req, res) =>{
    conexion.query('SELECT * FROM servicios', (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Mostrar un solo Trabajadores
app.get('/api/servicios/:idServicio', (req, res) =>{
    conexion.query('SELECT * FROM servicios WHERE idServicio = ?', [req.params.idServicio], (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Metodos post

app.post('/api/servicios', (req, res)=>{
    let data = {TipoServicio:req.body.TipoServicio, 
                Valor:req.body.Valor
                }
    let slq = "INSERT INTO servicios SET ?"
    conexion.query(slq, data, function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos put

app.put('/api/servicios/:idServicio', (req,res)=>{x
    let idServicio = req.params.idServicio
    let TipoServicio = req.body.TipoServicio
    let Valor = req.body.Valor
    let sql = "UPDATE servicios SET TipoServicio = ?, Valor = ? WHERE Documento_cliente = ?;"
    conexion.query(sql, [TipoServicio, Valor, idServicio], function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos Delete

app.delete('/api/servicios/:idServicio', (req, res)=>{
    conexion.query('DELETE FROM servicios WHERE idServicio = ?', [req.params.idServicio], function(error, filas){
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//Tabla citas

//Metodos get

//Mostrar todos los trabajadores
app.get('/api/citas', (req, res) =>{
    conexion.query('SELECT * FROM citas', (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Mostrar un solo Trabajadores
app.get('/api/citas/:idCitas', (req, res) =>{
    conexion.query('SELECT * FROM citas WHERE idCitas = ?', [req.params.idCitas], (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Metodos post

app.post('/api/citas', (req, res)=>{
    let data = {idTrabajador:req.body.idTrabajador,
                idCliente:req.body.idCitas,
                idServicio:req.body.idServicio,
                Hora:req.body.Hora,
                Fecha:req.body.Fecha
                }
    let slq = "INSERT INTO citas SET ?"
    conexion.query(slq, data, function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos put

app.put('/api/citas/:idCitas', (req,res)=>{x
    let idCitas = req.params.idCitas
    let idTrabajador = req.body.idTrabajador
    let idCliente = req.body.idCitas
    let idServicio = req.body.idServicio
    let Hora = req.body.Hora
    let Fecha = req.body.Fecha
    let sql = "UPDATE citas SET idTrabajador = ?, idCliente = ?, idServicio = ?, Hora = ?, Fecha = ? WHERE idCitas = ?;"
    conexion.query(sql, [idTrabajador, idCliente, idServicio, Hora, Fecha, idCitas], function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos Delete

app.delete('/api/citas/:idCitas', (req, res)=>{
    conexion.query('DELETE FROM citas WHERE idCitas = ?', [req.params.idCitas], function(error, filas){
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//Tabla Categoria

//Metodos get

//Mostrar todos los trabajadores
app.get('/api/categoria', (req, res) =>{
    conexion.query('SELECT * FROM categoria', (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Mostrar un solo Trabajadores
app.get('/api/categoria/:idCategoria', (req, res) =>{
    conexion.query('SELECT * FROM categoria WHERE idCategoria = ?', [req.params.idCategoria], (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
            // res.send(filas[0].Nombres) //Sirve para llamar un solo registro de una fila mediante su posicion
        }
    })
})

//Metodos post

app.post('/api/categoria', (req, res)=>{
    let data = {Nombre_cat:req.body.Nombre_cat,
                idServicio:req.body.idServicio
                }
    let slq = "INSERT INTO categoria SET ?"
    conexion.query(slq, data, function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos put

app.put('/api/categoria/:idCitas', (req,res)=>{x
    let idCategoria = req.params.idCategoria
    let Nombre_cat = req.body.Nombre_cat
    let idServicio = req.body.idServicio
    let sql = "UPDATE categoria SET idServicio = ?, Nombre_cat = ? WHERE idCategoria = ?;"
    conexion.query(sql, [idServicio, Nombre_cat, idCategoria], function(error, results){
        if(error){
            throw error
        }else{
            res.send(results)
        }
    })
})

//Metodos Delete

app.delete('/api/categoria/:idCategoria', (req, res)=>{
    conexion.query('DELETE FROM categoria WHERE idCategoria = ?', [req.params.idCategoria], function(error, filas){
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//Puertos

//Variable de entorno, sirve para cambiar un puerto si ya esta en uso
const puerto = process.env.PUERTO || 7000;//si el puerto de la variable esta disponible se ejecuta, si no se ejecuta en el puerto 3000

app.listen(puerto, function(){
    console.log("Servidor Ok, en puerto: "+puerto) //se utiliza el comando set PUERTO = (7000) -> Puerto deseado
}); //Metodo para correr nuestro servidor en un puerto 


