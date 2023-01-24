import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import matchesMocks from './mocks/matches.mocks';

import { Response } from 'superagent';
import Match from '../database/models/Match';
import IMatch from '../interfaces/IMatch';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da rota matches', () => {
    let chaiHttpResponse: Response;

    it('testa se a rota retorna todos os dados das partidas corretamente', async () => {
        sinon
        .stub(Match, "findAll")
        .resolves(matchesMocks.matchData as IMatch[]);

        chaiHttpResponse = await chai
        .request(app)
        .get('/matches')

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(matchesMocks.matchData);

        (Match.findAll as sinon.SinonStub).restore();
    });

    it('testa se a rota retorna todas as partidas em andamento', async () => {
        sinon
        .stub(Match, "findAll")
        .resolves(matchesMocks.matchData as IMatch[]);

        chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=true')

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(matchesMocks.matchesInProgress);

        (Match.findAll as sinon.SinonStub).restore();
    });

    it('testa se a rota retorna todas as partidas finalizadas', async () => {
        sinon
        .stub(Match, "findAll")
        .resolves(matchesMocks.matchData as IMatch[]);

        chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=false')

        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(matchesMocks.finishedMatches);

        (Match.findAll as sinon.SinonStub).restore();
    });
});