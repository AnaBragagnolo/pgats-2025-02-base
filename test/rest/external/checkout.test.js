const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Checkout', () => {
    describe('POST /checkout', () => {

        beforeEach(async () => {
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/api/users/login')
                .send({
                    email: 'bob@email.com',
                    password: '123456'
                });

            token = respostaLogin.body.token;
    
        });

        it('Deve realizar checkout com sucesso quando informo produto e quantidade', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send(
                    {items: [
                        {
                        productId: 2,
                        quantity: 1
                        }
                    ],
                    freight: 0,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "string",
                        name: "string",
                        expiry: "string",
                        cvv: "string"
                    }

                });
            
            expect(resposta.status).to.equal(200)
        });

        it('Devo receber erro de produto não encontrado quando informo ID não cadastrado', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send(
                    {items: [
                        {
                        productId: 0,
                        quantity: 1
                        }
                    ],
                    freight: 0,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "string",
                        name: "string",
                        expiry: "string",
                        cvv: "string"
                    }

                });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Produto não encontrado')
        });

        it('Deve retornar erro quando o token não é informado', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/api/checkout')
                .send(
                    {items: [
                        {
                        productId: 0,
                        quantity: 1
                        }
                    ],
                    freight: 0,
                    paymentMethod: "boleto",
                    cardData: {
                        number: "string",
                        name: "string",
                        expiry: "string",
                        cvv: "string"
                    }

                });
            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('error', 'Token inválido')
        });
    });
});