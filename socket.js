module.exports = (http) => {
    const db = require("./models");
    const Qr = db.qr;
    const Chat = db.chat;
    const Plantilla_pregunta = db.plantilla_pregunta;
    const Pregunta = db.pregunta;
    const io = require('socket.io')(http);
    var request = require("request-promise");
    
    io.on('connection', async(socket) => {
        console.log('User connected.');
        socket.on('chat-message', async (msg) => {
            let mensaje = msg.message;
            let nodo;
            // Hardcodeado hasta que se haga esa parte
            const id_qr = 4;
            // const id_qr = msg.id_qr;
            //Buscamos el ultimo nodo del chat del qr especificado
            await Chat.findOne({
                attributes: ['id', 'nodo'],
                where: {id_qr: id_qr},
                order: [['id', 'DESC']]
            })
                .then((data) => {
                    //Si hay mensajes coge ese nodo buscado
                    nodo = data.nodo
                })
                .catch((err) => {
                    //Si no hay mensajes el nodo de inicio es -1
                    nodo = -1
                });
            //Busco el qr que se ha escaneado
            await Qr.findOne({
                attributes: ['id', 'case'],
                where: {id: id_qr}
            })
                .then(async (data) => {
                    //Si no tiene caso es que no se registraron sus respuestas
                    if(data.case == null){
                        Chat.create({
                            autor: "bot",
                            nodo: nodo,
                            mensaje: "No tienes ninguna respuesta registrada todavía",
                            fecha: new Date(),
                            id_qr: id_qr
                        })
                            .then((data) => {        
                                console.log("No has respondido a ninguna pregunta todavia")
                            })
                            .catch((err) => {
                                console.log({
                                    message: err.message || "Error guardando el chat de respuesta no registrada",
                                });
                            });
                    }else{
                        //Si hay respuestas busco la respuesta de satisfaccion para mandarsela al python
                        Qr.findOne({
                            attributes: ['id', 'case'],
                            where: {id: id_qr},
                            include: {
                                model: Plantilla_pregunta,
                                include: {
                                    model: Pregunta,
                                    where: {descripcion: 'Satisfaction'}
                                },
                                through: {
                                    attributes: ['res']
                                }
                            }
                        })
                            .then(async (data) => {
                                //Añado el mensaje que envio el alumno
                                Chat.create({
                                    autor: "alumno",
                                    nodo: nodo,
                                    mensaje: mensaje,
                                    fecha: new Date(),
                                    id_qr: id_qr
                                })
                                    .then((data) => {        
                                        console.log({msg: "chat de alumno creado"})
                                    })
                                    .catch((err) => {
                                        console.log({
                                            message: err.message || "Error guardando el chat de alumno",
                                        });
                                    });
                                    
                                let json = {
                                    caso: data.case,
                                    msg: msg,
                                    nodo: nodo,
                                    satisfaccion: data.plantilla_pregunta[0].respuesta.res
                                }
                                var options = { 
                                    method: 'POST', 
                                    uri: 'http://127.0.0.1:5000/getBotAnswer', 
                                    body: json, 
                                    json: true 
                                };
                                var sendrequest = await request(options)
                                    .then(function(parsedBody) {
                                        //Se guarda la respuesta del chatbot
                                        Chat.create({
                                            autor: "bot",
                                            nodo: parsedBody.nodo,
                                            mensaje: parsedBody.msg,
                                            fecha: new Date(),
                                            id_qr: id_qr
                                        })
                                            .then((data) => {  
                                                //Envio el mensaje del python a la conversacion del chatbot   
                                                io.emit("chat-emit", {message: parsedBody.msg})   
                                                console.log({msg: "chat de python creado"})
                                            })
                                            .catch((err) => {
                                                console.log({
                                                    message: err.message || "Error guardando el chat de python",
                                                });
                                            });
                                    }).catch(function(err) {
                                        console.log({
                                            message: "Error en el python"
                                        });
                                    });
                            })
                            .catch((err) => {
                                console.log({
                                    message: "Error buscando el qr de id=" + id,
                                });
                            });
                    }
                })
        
                .catch((err) => {
                    console.log({
                        message: "Error buscando el qr de id=" + id,
                    });
                });
        })

        socket.on('disconnect', () => {
            console.log('User disconnected.');
        });
    });
}
    