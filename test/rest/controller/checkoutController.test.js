// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');

// Aplicação
const app = require('../../../rest/app');

// Mock
const checkoutService = require('../../../src/services/checkoutService');

// Testes
describe('Checkout Controller', () => {
    describe('POST /checkout', () => {

        beforeEach(async () => {
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'bob@email.com',
                    password: '123456'
                });

            token = respostaLogin.body.token;
    
        });

        it('Deve realizar checkout com sucesso quando informo produto e quantidade', async () => {
            
            const resposta = await request(app)
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
            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.throws({ status: 400, message: 'Produto não encontrado' });
           
            const resposta = await request(app)
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

            const checkoutServiceMock = sinon.stub(checkoutService, 'checkout');
            checkoutServiceMock.throws({ status: 401, message: 'Token inválido' });

            const resposta = await request(app)
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

        afterEach(() => {
            sinon.restore();
        })
    });
});