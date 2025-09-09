// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

// Testes
describe('Checkout', () => {
    describe('POST /login', () => {
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

        it('Deve calcular o valor final quando informo produto, quantidade e frete', async () => {
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `
                        mutation {
                            checkout(items: [{ productId: 1, quantity: 2 }],freight: 10, paymentMethod: "boleto") {
                                valorFinal}
                        }   
                    `
                });
                    
            expect(resposta.status).to.equal(200);
            expect(resposta.body.data.checkout.valorFinal).to.equal(210)
        });
    });
});