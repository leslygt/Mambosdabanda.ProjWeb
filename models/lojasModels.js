const bcrypt = require('bcrypt');
const pool = require("../config/database");
const auth = require("../config/utils");
const saltRounds = 10; 

function dbLojaToLoja(dbLoja)  {
    let loja = new Loja();
    loja.id = dbLoja.loja_id;
    loja.name = dbLoja.loja_nome;
    loja.email= dbLoja.loja_email;
    return loja;
}

class Loja {
    constructor( id, name, email, pass, endereco, contacto, cpostal, token) {
        this.id = id;
        this.name = name;
        this.pass = pass;
        this.token = token;
        this.email = email;
        this.endereco = endereco;
        this.contacto = contacto;
        this.cpostal = cpostal;
    }
    export() {
        let loja=new Loja();
        loja.name = this.nome;
        return loja; 
    }


    static async getById(id) {
        try {
            let dbResult = await pool.query("Select * from loja where loja_id=$1", [id]);
            let dbLojas = dbResult.rows;
            if (!dbLojas.length) 
                return { status: 404, result:{msg: "Sem loja para este id."} } ;
            let dbLoja = dbLojas[0];
            return { status: 200, result: 
                new Loja(dbLoja.id,dbLoja.loja_nome, dbLoja.loja_email,dbLoja.loja_pass, dbLoja.loja_token)} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }  
    }

    


    static async registerLoja(loja) {
        try {
            let dbResult =
                await pool.query("Select * from loja where loja_email=$1", [loja.name]);
            let dbLojas = dbResult.rows;
            if (dbLojas.length)
                return {
                    status: 400, result: [{
                        location: "body", param: "name",
                        msg: "Email já existente"
                    }]
                };
            let encpass = await bcrypt.hash(loja.pass,saltRounds);   
            dbResult = await pool.query(`Insert into loja (loja_nome, loja_pass)
                       values ($1,$2)`, [loja.name, encpass]);
            return { status: 200, result: {msg:"Loja registada! Pode fazer log in."}} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    } 
 

    static async checkLogin(loja) {
        try {
            let dbResult =
                await pool.query("Select * from loja where loja_email=$1", [loja.name]);
            let dbLojas = dbResult.rows;
            if (!dbLojas.length)
                return { status: 401, result: { msg: "Email ou palavra passe incorreto!"}};
            let dbLoja = dbUsers[0]; 
            //let isPass = await bcrypt.compare(user.pass,dbUser.usr_pass);
            let isPass = loja.pass == dbLoja.loja_pass;
            if (!isPass) 
                return { status: 401, result: { msg: "Email ou palavra passe incorreto!"}};
           
            return { status: 200, result: dbLojaToLoja(dbLoja) } ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // No verifications. Only to use internally
    static async saveToken(loja) {
        try {
            let dbResult =
                await pool.query(`Update loja set loja_token=$1 where loja_id = $2`,
                [loja.token,loja.id]);
            return { status: 200, result: {msg:"Token saved!"}} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getLojaByToken(token) {
        try {
            let dbResult =
                await pool.query(`Select * from loja where loja_token = $1`,[token]);
            let dbLojas = dbResult.rows;
            if (!dbLojas.length)
                return { status: 403, result: {msg:"Invalid authentication!"}} ;
            let user = dbLojaToLoja(dbLojas[0]);
            return { status: 200, result: loja} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    

}


class ListaLojas {
    constructor(id, nome, img,endereco) {
        this.id = id;
        this.name = nome;
        this.img = img;
        this.endereco = endereco;
        this.loja = [];
    }
    export(){
        let ll = new ListaLojas();
        ll.id = this.id;
        ll.name = this.name;
        ll.img = this.img;
        ll.endereco = this.endereco;
        return ll;        
    }

    static async addLoja(loja_id, loja_nome, img_url, loja_endereco) {
        try {
            // Todo: verifications
            // - if the user owns the shopLsit
            // - if prodId and unitId exist
            // - if quantity is valid
     
            let dbResult = await pool.query(
                `Insert into ListaLoja(id,name,img) values($1,$2,$3,$4)`, [loja_id, loja_nome, img_url, loja_endereco
                ]);
            return {status:200, result: dbResult};

        } catch (err) {
            console.log(err);
            return {status: 500, result: {msg: "Something went wrong."}};
        }
    }

    gerarTabela();

}

function gerarTabela(loja) {
    // seleciona o elemento <table> pelo id
    var tabela = document.getElementById("tabela");
    
    // cria uma linha para o cabeçalho da tabela
    var cabecalho = tabela.createTHead().insertRow();
    
    // cria as células do cabeçalho com os nomes das colunas
    cabecalho.insertCell().textContent = "Coluna 1";
    cabecalho.insertCell().textContent = "Coluna 2";
    cabecalho.insertCell().textContent = "Coluna 3";
    
    // cria as linhas da tabela com os dados
    for (var i = 0; i < loja.length; i++) {
      var linha = tabela.insertRow();
      linha.insertCell().textContent = dados[i].coluna1;
      linha.insertCell().textContent = dados[i].coluna2;
      linha.insertCell().textContent = dados[i].coluna3;
    }
}

module.exports = Loja;