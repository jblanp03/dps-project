const request = require("supertest");
//Se cambio app por http, no se si dara errores futuros
const {http, server} = require('../server');
const db = require("../models");
const User = db.user;
const api = request(http)

describe('Auth', () =>{
    var bcrypt = require("bcryptjs");
    const getAllContentFromUsers = async () => {
        const response = await api.get('/api/users')
        return {
          contents: response.body.map(users => users.name),
          response
        }
      }
    const initialUsers = [
        {
            username: "user1", 
            email: "user@user.es", 
            name: "user1", 
            password: bcrypt.hashSync("upintelligence", 8), 
            id_role: 2
        }
    ]
    
    //Antes del test borra todos los registros y añade dos
    beforeEach(async () => {
        await User.destroy({truncate : true, cascade: true});
        await User.create(initialUsers[0])
    })
    test('a valid user can be added', async () => {
        const newUser = {
            username: "user2", 
            email: "user2@user.es", 
            name: "user2", 
            password: bcrypt.hashSync("upintelligence", 8), 
            id_role: 2
        }

        await api
            .post('/api/createAccount')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')
        const contents = response.body.map(user => user.username)
        expect(response.body).toHaveLength(initialUsers.length + 1)
        expect(contents).toContain(newUser.username)
    })

    test('login', async () => {
        await User.create({username: "prueba", email: "prueba@prueba.es", name: "prueba", password: bcrypt.hashSync("prueba", 8), id_role: 2})
        const login = {
            username: "prueba", 
            password: "prueba"
        }

        const response = await api
            .post('/api/logIn')
            .send(login)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.username).toEqual('prueba')
    })

    test('user without content is not added', async () => {
        const newUser = {
                username: "user1",
                }

        await api
            .post('/api/createAccount')
            .send(newUser)
            .expect(500)

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })

    test('a user can be deleted', async () =>{
        const {response} = await getAllContentFromUsers()
        const {body:users} = response
        const userToDelete = users[0]

        await api
            .delete(`/api/users/${userToDelete.id}`)
            .expect(200)

        const {contents, response:secondResponse} = await getAllContentFromUsers()

        expect(secondResponse.body).toHaveLength(0)

        expect(contents).not.toContain(userToDelete.name)
    })

    test('a user that has an invalid id can not be deleted', async () => {
        await api
        .delete('/api/users/123456789')
        .expect(500)
    
        const { response } = await getAllContentFromUsers()
    
        expect(response.body).toHaveLength(initialUsers.length)
    })

    afterAll(() => {
        server.close()
    })
})

describe('Tipos', () =>{
    const Tipo = db.tipo;
    const getAllContentFromTipos = async () => {
        const response = await api.get('/api/tipos')
        return {
          contents: response.body.map(tipo => tipo.nombre),
          response
        }
    }
    const initialTipos = [{id: 1, nombre: "T1"}, {id: 2, nombre: "T2"}]
    //Antes del test
    beforeEach(async () => {
        await Tipo.destroy({truncate : true, cascade: true})
        await Tipo.create(initialTipos[0])
        await Tipo.create(initialTipos[1])
    })

    describe('GET ALL', () =>{
        test('"tipos" are returned as json', async () => {
            await api
                .get('/api/tipos')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('there are two "tipos"', async () => {
            const response = await api.get('/api/tipos')
            expect(response.body).toHaveLength(initialTipos.length)
        })

        test('the first "tipos" "nombre" is "T1"', async () => {
            const {
                contents
            } = await getAllContentFromTipos()
            expect(contents).toContain('T1')
            // expect(response.body[0].nombre).toBe('T1')
        })
    })

    describe('GET ONE', () =>{
        test('a "tipo" can be found', async () =>{
            const {response} = await getAllContentFromTipos()
            const {body:tipos} = response
            const tipoToFind = tipos[0]

            await api
                .get(`/api/tipos/${tipoToFind.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
    })

    describe('PUT', () =>{
        test('a "tipo" can be edited', async () =>{
            const editTipo = {nombre: "editado"}
            const {response} = await getAllContentFromTipos()
            const {body:tipos} = response
            const tipoToFind = tipos[1]

            await api
                .put(`/api/tipos/${tipoToFind.id}`)
                .send(editTipo)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            const {
                contents
            } = await getAllContentFromTipos()
            expect(contents).toContain('editado')
        })
    })

    describe('POST', () =>{
        test('a valid "tipo" can be added', async () => {
            const newTipo = {nombre: "prueba"}

            await api
                .post('/api/tipos')
                .send(newTipo)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/tipos')
            const contents = response.body.map(tipo => tipo.nombre)
            expect(response.body).toHaveLength(initialTipos.length + 1)
            expect(contents).toContain(newTipo.nombre)
        })

        test('"tipo" without content is not added', async () => {
            const newTipo = {}

            await api
                .post('/api/tipos')
                .send(newTipo)
                .expect(500)

            const response = await api.get('/api/tipos')
            expect(response.body).toHaveLength(initialTipos.length)
        })
    })

    afterAll(() => {
        server.close()
    })
})

describe('Preguntas', () =>{
    const Pregunta = db.pregunta;
    const getAllContentFromPreguntas = async () => {
        const response = await api.get('/api/preguntas')
        return {
          contents: response.body.map(pregunta => pregunta.descripcion),
          response
        }
    }
    const initialPreguntas = [{id: 1, descripcion: "P1"}, {id: 2, descripcion: "P2"}]
    //Antes del test
    beforeEach(async () => {
        await Pregunta.destroy({truncate : true, cascade: true})
        await Pregunta.create(initialPreguntas[0])
        await Pregunta.create(initialPreguntas[1])
    })

    describe('GET ALL', () =>{
        test('"preguntas" are returned as json', async () => {
            await api
                .get('/api/preguntas')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('there are two "preguntas"', async () => {
            const response = await api.get('/api/preguntas')
            expect(response.body).toHaveLength(initialPreguntas.length)
        })

        test('the first "preguntas" "nombre" is "P1"', async () => {
            const {
                contents
            } = await getAllContentFromPreguntas()
            expect(contents).toContain('P1')
            // expect(response.body[0].nombre).toBe('P1')
        })
    })

    describe('GET ONE', () =>{
        test('a "pregunta" can be found', async () =>{
            const {response} = await getAllContentFromPreguntas()
            const {body:preguntas} = response
            const preguntaToFind = preguntas[0]

            await api
                .get(`/api/preguntas/${preguntaToFind.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
    })

    describe('PUT', () =>{
        test('a "pregunta" can be edited', async () =>{
            const editPregunta = {descripcion: "editado"}
            const {response} = await getAllContentFromPreguntas()
            const {body:preguntas} = response
            const preguntaToFind = preguntas[1]

            await api
                .put(`/api/preguntas/${preguntaToFind.id}`)
                .send(editPregunta)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            
            const {
                contents
            } = await getAllContentFromPreguntas()
            expect(contents).toContain('editado')
        })
    })

    describe('POST', () =>{
        test('a valid "pregunta" can be added', async () => {
            const newPregunta = {descripcion: "prueba"}
            
            await api
                .post('/api/preguntas')
                .send(newPregunta)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/preguntas')
            const contents = response.body.map(pregunta => pregunta.nombre)
            expect(response.body).toHaveLength(initialPreguntas.length + 1)
            expect(contents).toContain(newPregunta.nombre)
        })

        test('"pregunta" without content is not added', async () => {
            const newPregunta = {}

            await api
                .post('/api/preguntas')
                .send(newPregunta)
                .expect(500)

            const response = await api.get('/api/preguntas')
            expect(response.body).toHaveLength(initialPreguntas.length)
        })
    })

    afterAll(() => {
        server.close()
    })
})

describe('Plantillas', () =>{
    const Plantilla = db.plantilla;
    var bcrypt = require("bcryptjs");
    const Pregunta = db.pregunta;
    const getAllContentFromPlantillas = async () => {
        const response = await api.get('/api/plantillas')
        return {
          contents: response.body.map(plantilla => plantilla.cod_alumno),
          response
        }
    }
    const initialPlantillas = [{id: 1, cod_alumno: "1234"}, {id: 2, cod_alumno: "5678"}]
    const initialUser = 
        {
            id: 1,
            username: "user1", 
            email: "user@user.es", 
            name: "user1", 
            password: bcrypt.hashSync("upintelligence", 8), 
            id_role: 2
        }
    
    //Antes del test
    beforeEach(async () => {
        await Plantilla.destroy({truncate : true, cascade: true})
        await User.destroy({truncate : true, cascade: true})
        await Plantilla.create(initialPlantillas[0])
        await Plantilla.create(initialPlantillas[1])
        await User.create(initialUser)
    })

    describe('GET ALL', () =>{
        test('"plantillas" are returned as json', async () => {
            await api
                .get('/api/plantillas')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('there are two "plantillas"', async () => {
            const response = await api.get('/api/plantillas')
            expect(response.body).toHaveLength(initialPlantillas.length)
        })

        test('the first "plantillas" "cod_alumno" is "1234"', async () => {
            const {
                contents
            } = await getAllContentFromPlantillas()
            expect(contents).toContain('1234')
            // expect(response.body[0].cod_alumno).toBe('1234')
        })
    })

    describe('GET ONE', () =>{
        test('a "plantilla" can be found', async () =>{
            const {response} = await getAllContentFromPlantillas()
            const {body:plantillas} = response
            const plantillaToFind = plantillas[0]

            await api
                .get(`/api/plantillas/${plantillaToFind.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
    })

    describe('POST', () =>{
        test('a valid "plantilla" can be added', async () => {
            const initialPreguntas = [{id: 1, descripcion: "P1"}, {id: 2, descripcion: "P2"}]
            await Pregunta.destroy({truncate : true, cascade: true})
            await Pregunta.create(initialPreguntas[0])
            await Pregunta.create(initialPreguntas[1])
            const newPlantilla = {
                cod_alumno: "9123",
                id_user: 1,
                preguntas: [
                    {
                        id_pregunta: 1,
                        respuesta: "si"
                    },
                    {
                        id_pregunta: 2
                    }
                ]
            }

            await api
                .post('/api/plantillas')
                .send(newPlantilla)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/plantillas')
            const contents = response.body.map(plantilla => plantilla.cod_alumno)
            expect(response.body).toHaveLength(initialPlantillas.length + 1)
            expect(contents).toContain(newPlantilla.cod_alumno)
        })

        test('"plantilla" without content is not added', async () => {
            const newlantilla = {}

            await api
                .post('/api/plantillas')
                .send(newlantilla)
                .expect(500)

            const response = await api.get('/api/plantillas')
            expect(response.body).toHaveLength(initialPlantillas.length)
        })
    })

    afterAll(() => {
        server.close()
    })
})