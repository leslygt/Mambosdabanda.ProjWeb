const pool = require("../config/database");

function dbShopListToShopList(dbsl) {
    return new ShopList(dbsl.shl_id,dbsl.shl_usr_id,
        dbsl.shl_name,dbsl.shl_created,dbsl.shl_due);
}

function dbItemToItem(it) {
    return new Item(it.it_id,it.it_quant, it.prd_id, it.prd_name,
        it.prd_img_url, it.bought || 0, it.un_id, it.un_name );
}



class Item {
    constructor(id, quant, idProd, name,img, bought, idUnit, unitName) {
        this.id = id;
        this.quant = quant;
        this.idProd = idProd;
        this.name = name;
        this.img = img;
        this.bought = bought;
        this.idUnit = idUnit;
        this.unitName = unitName;
    }
}


class ShopList {
    constructor(id,idUser,name,dateCreated,dateDue) {
        this.id = id;
        this.idUser = idUser;
        this.name = name;
        this.dateCreated = dateCreated;
        this.dateDue = dateDue;
    }
    export(){
        let sl = new ShopList();
        sl.id = this.id;
        sl.name = this.name;
        sl.dateCreated = this.dateCreated;
        sl.dateDue = this.dateDue;
        return sl;        
    }

    // We consider that the user is authenticated
    static async getUserShoplists(userId) {
        try {
            let dbResult = await pool.query("Select * from shoplist where shl_usr_id = $1", [userId]);
            let dbShoplists = dbResult.rows;
            let shoplists = [];
            for (let dbsl of dbShoplists) {
                shoplists.push(dbShopListToShopList(dbsl));
            }
            return {status:200, result: shoplists};

        } catch (err) {
            console.log(err);
            return {status: 500, result: {msg: "Something went wrong."}};
        }
    }

    static async getUserShoplist(userId,shoplistId) {
        try {
            let dbResult = await pool.query(
                "Select * from shoplist where shl_usr_id = $1 and shl_id = $2", 
                [userId,shoplistId]);
            if (dbResult.rows.length == 0) {
                return {status:404, result: {msg:"That shoplist does not exist on your collection."}};
            }
            let shoplist = dbShopListToShopList(dbResult.rows[0]);
            shoplist.items = [];
            // Falta a parte de contar quantos produtos temos comprados
            let dbItems = await pool.query(
                `Select item.*, product.*, unit.*, COALESCE(SUM(b_quant),0)  as bought from item 
                inner join product on it_prd_id = prd_id
                inner join unit on it_un_id = un_id
                left join bought on b_it_id = it_id
                where it_shl_id = $1
                group by it_id, prd_id, un_id`,  [shoplistId]);
                
            for(let dbit of dbItems.rows) {
                shoplist.items.push(dbItemToItem(dbit));
            }

            return {status:200, result: shoplist};

        } catch (err) {
            console.log(err);
            return {status: 500, result: {msg: "Something went wrong."}};
        }
    }

    
    static async addItem(userId, shopListId, prodId, unitId, quantity) {
        try {
            // Todo: verifications
            // - if the user owns the shopLsit
            // - if prodId and unitId exist
            // - if quantity is valid
     
            let dbResult = await pool.query(
                `Insert into item(it_shl_id,it_prd_id,it_quant, it_un_id)
                 values($1,$2,$3,$4)`, [shopListId,prodId,quantity, unitId]);
            return {status:200, result: dbResult};

        } catch (err) {
            console.log(err); 
            return {status: 500, result: {msg: "Something went wrong."}};
        }
    }

}

module.exports = ShopList;