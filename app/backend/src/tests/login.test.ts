import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import User from '../database/models/User';
import loginMocks from './mocks/login.mocks';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Testes da rota login', () => {
    let chaiHttpResponse: Response;

    before(async () => {
        sinon
        .stub(User, "findOne")
        .resolves(loginMocks.user as User);
    });

    after(() => {
        (User.findOne as sinon.SinonStub).restore();
    })

    it('testa se é possível fazer o login com os dados corretos', async () => {
        const correctData = {
            email: "user user",
            password: "secret_admin"
        };

        chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ ...correctData })

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.haveOwnProperty('token');
    });

    it('testa se o Usuário informado é correto', async () => {
        const incorrectUser = {
            email: "incorrect email"
        };

        chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ ...incorrectUser })

        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body).to.haveOwnProperty('message');
        expect(chaiHttpResponse.body.message).to.be.eq('All fields must be filled');
    });

    it('testa se a senha foi informada', async () => {
        const blankPassword = {
            password: "blank Password"
        };

        chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ ...blankPassword })

        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body).to.haveOwnProperty('message');
        expect(chaiHttpResponse.body.message).to.be.eq('All fields must be filled');
    });

    it('testa se foi encontrado algum Usuário', async () => {
        (User.findOne as sinon.SinonStub).restore();
        sinon
        .stub(User, "findOne")
        .resolves(null);

        const blankUser = {
            email: "blank email",
            password: "secret_admin"
        };

        chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ ...blankUser })

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body).to.haveOwnProperty('message');
        expect(chaiHttpResponse.body.message).to.be.eq('Incorrect email or password');
    });

    it('testa se a senha informada é correta', async () => {
        const incorrectPassword = {
            email: "correct email",
            password: "incorrect Password"
        };

        chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ ...incorrectPassword })

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body).to.haveOwnProperty('message');
        expect(chaiHttpResponse.body.message).to.be.eq('Incorrect email or password');
    });

    it('testa se ao tentar enviar um token válido, o endpoint retornará um objeto com o tipo de usuário', async () => {
        const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc";
        
        sinon
        .stub(User, "findByPk")
        .resolves({ role: 'admin'} as User);
        
        chaiHttpResponse = await chai
        .request(app)
        .get('/login/validate')
        .set('authorization', validToken)
        
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.haveOwnProperty('role');
        expect(chaiHttpResponse.body.role).to.be.eq('admin');
        (User.findByPk as sinon.SinonStub).restore();    
    });

    it('testa se o token foi fornecido e retorna um erro caso não', async () => {
        chaiHttpResponse = await chai
        .request(app)
        .get('/login/validate')

        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body).to.haveOwnProperty('message');
        expect(chaiHttpResponse.body.message).to.be.eq('blank token');
    });
});
