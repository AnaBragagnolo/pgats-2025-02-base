// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

// Testes
describe('Register', () => {
    describe('POST /register', () => {
        
        beforeEach(async () => {
            const respostaLogin = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/users/login')
                .send({
                    query: `
                        mutation {
                            login(email: "bob@email.com", password: "123456") {
                                token
                            }
                        }
                    `
                });
            token = respostaLogin.body.data.login.token;
    
        });

        it('Deve retornar erro ao tentar registrar email já cadastrado', async () => {
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/register')
                .send({
                    query: `
                        mutation {
                            register(name: "bob", email: "bob@email.com", password: "123456") {
                                name
                                email}
                        } 
                    `
                });
                    
            expect(resposta.status).to.equal(200);
            expect(resposta.body.errors[0].message).to.equal("Email já cadastrado");
        });
    });
});