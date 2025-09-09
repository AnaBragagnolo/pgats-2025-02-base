const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Checkout', () => {
    describe('POST /checkout', () => {
        
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