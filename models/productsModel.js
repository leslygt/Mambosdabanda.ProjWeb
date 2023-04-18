const pool = require("../config/database");

function dbProdToProd (prod) {
    return new Product(prod.prd_id,prod.prod_nome,prod.img_url,prod.descricao,prod.preco);
}

class Product {
    constructor(id,nome,imgUrl, descricao,preco) { 
        this.id = id;
        this.name = nome;
        this.imgUrl = imgUrl;
        this.descricao = descricao;
        this.preco = preco;
    }

    static async getProducts() {
        try {
            let dbResult = await pool.query("Select * from producto");
            let dbProducts = dbResult.rows;
            let prods = [];
            for (let dbProd of dbProducts) {
                prods.push(dbProdToProd(dbProd));
            }
            return {status:200, result: prods};
        } catch (err) {
            console.log(err);
            return {status: 500, result: {msg: "Something went wrong."}};
        }
    }
}


class Produto { 
    constructor(id, nome, descricao, preco, img_url) 
    {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.img_url = img_url;
        this.lojas = [];
    }
    export()
    {
        let pp = new Produto();
        pp.id = this.id;
        pp.nome = this.nome;
        pp.descricao = this.descricao;
        pp.preco = this.preco;
        pp.imgUrl = this.imgUrl;
        pp.lojas = this.lojas;
        return pp;        
    }

    static async addProduto(produto_id, produto_nome, produto_descricao, produto_preco, produto_img_url)
     {
        try {
            // Todo: verifications
            // - if the user owns the shopLsit
            // - if prodId and unitId exist
            // - if quantity is valid
            let dbResult = await pool.query(
                `Insert into Produto(id,nome,descricao,preco,img_url) values($1,$2,$3,$4,$5)`, [produto_id, produto_nome, produto_descricao, produto_preco, produto_img_url
                ]);
            return {status:200, result: dbResult};
            
        } 
        catch (err) 
        {
            console.log(err);
            return {status: 500, result: {msg: "Something went wrong."}};
        }
    }
}
    
module.exports = Produto;