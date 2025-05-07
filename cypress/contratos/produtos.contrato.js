const Joi = require('joi')

const produtosSchema = Joi.object({
    produtos: Joi.array().items({
        nome: Joi.string(),
        preco: Joi.number(),
        descricao: Joi.string(),
        quantidade: Joi.string(),
        _id: Joi.string()
    }),
    quantidade: Joi.number()
})

export default produtosSchema;