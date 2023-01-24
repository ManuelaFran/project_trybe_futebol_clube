import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import teamsMocks from './mocks/teams.mocks';

import { Response } from 'superagent';
import Team from '../database/models/Team';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da rota teams', () => {
    let chaiHttpResponse: Response;

    it('testa se a rota retorna todos os times correspondentes', async () => {
        sinon
        .stub(Team, "findAll")
        .resolves(teamsMocks.teams as Team[]);

        chaiHttpResponse = await chai
        .request(app)
        .get('/teams')

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.be.deep.equal(teamsMocks.teams);
    });

    it('testa se a rota retorna dados de um time específico', async () => {
        const teamId = 5;

        sinon
        .stub(Team, "findByPk")
        .resolves(teamsMocks.teamId as Team);

        chaiHttpResponse = await chai
        .request(app)
        .get(`/teams/${teamId}`)

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body).to.be.deep.equal(teamsMocks.teamId);
        (Team.findByPk as sinon.SinonStub).restore();
    });

    it('testa o retorno da rota quando o id é inexistente', async () => {
        const teamId = 555;

        sinon
        .stub(Team, "findByPk")
        .resolves(null);

        chaiHttpResponse = await chai
        .request(app)
        .get(`/teams/${teamId}`)

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.null;
    
        (Team.findByPk as sinon.SinonStub).restore();
    });
});