const { Genre } = require('../../models/genres')
const request = require('supertest');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') })
    afterEach(async() => {
        server.close();
        await Genre.remove({});
    })

    describe(' GET/', () => {

        it('should get a list of all genres', async() => {
            Genre.collection.insertMany([
                { genre: "genre1" },
                { genre: "genre2" },
                { genre: "genre3" }
            ])

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre3')).toBeTruthy();
        })

    })
})