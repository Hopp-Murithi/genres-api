const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');

describe('user.generateAuthTokens', () => {
    it.todo('should return a valid JWT'), () => {
        const user = new User({ id: '1', isAdmin: true })
        const token = user.generateAuthTokens()
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        expect(decoded).toMatchObject({ id: '1', isAdmin: true })


    }

})