import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import matchesMocks from './mocks/matches.mocks';

import { Response } from 'superagent';
import Match from '../database/models/Match';
import IMatch from '../interfaces/IMatch';
import IMatchSave from '../interfaces/IMatchSave';
import Team from '../database/models/Team';
import teamsMocks from './mocks/teams.mocks';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testes da rota matches', () => {
    let chaiHttpResponse: Response;
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxfSwiaWF0IjoxNjY5MTU3ODI1fQ.6sbiQCzjvJzGdpvxKjwFbEAKD5xwORbPCP7fhf2pvro';

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

    describe('Testes da rota matches/POST', () => {
        it('testa se a rota retorna todas as partidas inseridas com sucesso', async () => {
            const matchSave: IMatchSave = {
                homeTeamId: 16,
                awayTeamId: 8,
                homeTeamGoals: 2,
                awayTeamGoals: 2,
            }

            sinon
            .stub(Team, "findByPk")
            .resolves(teamsMocks.teamId as Team);

            sinon
            .stub(Match, 'create')
            .resolves(matchesMocks.insertMatch as Match);
    
            chaiHttpResponse = await chai
            .request(app)
            .post('/matches')
            .set('authorization', validToken)
            .send(matchSave);
    
            expect(chaiHttpResponse).to.have.status(201);
            expect(chaiHttpResponse.body).to.be.an('object');
            expect(chaiHttpResponse.body).to.deep.equal(matchesMocks.insertMatch);
    
            (Team.findByPk as sinon.SinonStub).restore();
            (Match.create as sinon.SinonStub).restore();
        });

        it('testa que não é possível inserir uma partida com times iguais', async () => {
            const matchSave = {
                homeTeamId: 8,
                awayTeamId: 8,
                homeTeamGoals: 2,
                awayTeamGoals: 0,
            }
    
            chaiHttpResponse = await chai
            .request(app)
            .post('/matches')
            .send(matchSave);
    
            expect(chaiHttpResponse).to.have.status(422);
            expect(chaiHttpResponse.body).to.haveOwnProperty('message');
            expect(chaiHttpResponse.body.message).to.be.eq('It is not possible to create a match with two equal teams');
        });

        it('testa que não é possível inserir uma partida com um time que não existe na tabela teams', async () => {
            const matchSave: IMatchSave = {
                homeTeamId: 32000,
                awayTeamId: 8,
                homeTeamGoals: 2,
                awayTeamGoals: 2,
            }

            sinon
            .stub(Team, "findByPk")
            .onFirstCall()
            .resolves(teamsMocks.teamId as Team)
            .onSecondCall()
            .resolves(null);
    
            chaiHttpResponse = await chai
            .request(app)
            .post('/matches')
            .set('authorization', validToken)
            .send(matchSave);
    
            expect(chaiHttpResponse).to.have.status(404);
            expect(chaiHttpResponse.body).to.haveOwnProperty('message');
            expect(chaiHttpResponse.body.message).to.eq('There is no team with such id!');
    
            (Team.findByPk as sinon.SinonStub).restore();
        });
    });

    describe('Testes da rota matches/PATCH', () => {
        it('testa se ao finalizar uma partida, a alteração é feita no banco de dados e na página', async () => {
            const testId = 5;

            sinon
            .stub(Match, "update")
            .resolves([1]);
    
            chaiHttpResponse = await chai
            .request(app)
            .patch(`/matches/${testId}/finish`)
    
            expect(chaiHttpResponse).to.have.status(200);
            expect(chaiHttpResponse.body).to.haveOwnProperty('message');
            expect(chaiHttpResponse.body.message).to.be.eq('Finished');
    
            (Match.update as sinon.SinonStub).restore();
        });

        it('testa se é possível atualizar partidas em andamento', async () => {
            const testId = 5;

            sinon
            .stub(Match, "update")
            .resolves([1]);

            sinon
            .stub(Match, "findByPk")
            .resolves(matchesMocks.updateMatches as IMatch);
    
            chaiHttpResponse = await chai
            .request(app)
            .patch(`/matches/${testId}`)
    
            expect(chaiHttpResponse).to.have.status(200);
            expect(chaiHttpResponse.body).to.be.an('object');
            expect(chaiHttpResponse.body).to.be.deep.eq(matchesMocks.updateMatches);
    
            (Match.update as sinon.SinonStub).restore();
            (Match.findByPk as sinon.SinonStub).restore();
        });
    });
});