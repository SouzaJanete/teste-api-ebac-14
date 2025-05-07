/// <reference types = "cypress"/>
import contrato from '../contratos/produtos.contrato'



describe('Teste de API em Produto' , () => {
    let token
    beforeEach(() => {
    cy.token('fulano@qa.com' , 'teste'). then(tkn => {
        token = tkn
    })
});

it('Deve validar contrato de produtos com sucesso' , () => {
    cy.request('produtos').then(response =>{
        return contrato.validateAsync(response.body)
    })
});
    it('Listar produtos - GET' , () => {
        cy.request({
            method: 'GET' ,
            url: 'produtos'
        }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('produtos')
        })
    });
    it('Cadastrar produto - POST' , () => {
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 1000000)  
        cy.cadastrarProduto(token, 'produto' , 10, 'Cabo USB C' , 100)   
        .should((response) =>{
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
    });
    it('Deve validar mensagem de produto cadastrado  anteriormente' , () => {
        cy.cadastrarProduto(token, 'Cabo USB 001' , 10, 'Cabo USB C' , 100)
    }).should((response) =>{
        expect(response.status).equal(400)
        expect(response.body.message).equal('Já existe produto com esse nome')
    })
});
it('Deve editar um produto com sucesso - UPDATE' , () =>{
    let produto = 'Produto EBAC ' + Math.floor(Math.random() * 1000000)  
        cy.cadastrarProduto(token, 'produto' , 10, 'Produto EBAC' , 100)   
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT' ,
                url: 'produtos/${id}' ,
                headers:  {authorization: token},
                body: {
                    "nome": "produto",
                    "preco": 470,
                    "descricao": "Editado",
                    "quantidade": 381
                }
            }).should(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    
});
it('Deve deletar um produto com sucesso - DELETE', () => {
    cy.cadastrarProduto(token, 'Produto EBAC a ser deletado', 100, 'Delete', 50)
    .then(response => {
        let id = response.body._id
        cy.request({
            method:'DELETE',
            url: 'produtos/${id}',
            headers:  {authorization: token},
            }).should(response => {
                expect(response.body.message).to.equal('Registro excluido com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });