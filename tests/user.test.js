const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase } = require('../tests/fixtures/db')

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockReturnValue((mailoptions, callback) => { })
    })
}))

beforeEach(setupDatabase)


test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Dima',
        email: 'dmdmmd@gmail.com',
        password: 'MYPATHdssadsd'
    }).expect(201)

    //Assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertation about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Dima',
            email: 'dmdmmd@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MYPATHdssadsd')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Shold not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'mike@gmail.com',
        password: 'idontknowpassword'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Shuld notget profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = User.findById(response.body._id)
    expect(user).toBeNull
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Dima'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual(response.body.name)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Ukraine'
        })
        .expect(400)
})

