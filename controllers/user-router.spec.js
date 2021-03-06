const request = require("supertest");
const server = require("../server.js");
const db = require('../database/dbConfig');
describe('user router endpoints', () =>{
    describe('GET /users', () =>{
        it('should return 200', async () => {
            const res = await request(server).get('/users')
            expect(res.status).toBe(200)
        })
        it('should return json', async () => {
            const res = await request(server).get('/users')
            expect(res.type).toBe('application/json')
            console.log(res.body)
        })
        it('should return an array ', async () =>{
            const res = await request(server).get('/users')
            expect(Array.isArray(res.body)).toBe(true)

        })
    })

    describe('GET /users/:id', () =>{
        it('should return 200 if seeds have run', async () => {
            const res = await request(server).get('/users/1')
            expect(res.status).toBe(200)            
        })
        it('should return json', async () => {
            const res = await request(server).get('/users')
            expect(res.type).toBe('application/json')
        })
        it('should return an error message', async () =>{
            const res = await request(server).get('/users/1')
            expect(res.body).toEqual({
                  "company_name": "Sauti Studio Designs",
                  "country": "USA",
                  "display_name": "Sauti Studio",
                  "email": "sauti.design.studio@gmail.com",
                  "facebook_id": null,
                  "google_id": "103512929668160621184",
                  "id": 1,
                  "password": null,
                  "phone_num": "235556969",
                  "pic": "https://avatars0.githubusercontent.com/u/51124353?s=200&v=4",
                  })
        })
    })
})

// message: `The reason you're getting an error: