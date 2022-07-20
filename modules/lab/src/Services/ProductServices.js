'use strict'

const Product = use('TTSoft/Product/Models/Product')
const Database = use('Database')
const Helpers = use('App/Libraries/Helpers')

class ProductServices{
	/**
     * Get List Product
     * @param
     * @return json
     * @author Dat Nguyen
     */
	static async getList(){
		const products =  await Product.query().with('category').orderBy('id','DESC').fetch();
        return products.toJSON();
	}

	/**
     * Create New a Product
     * @param
     * @return json
     * @author Dat Nguyen
     */
	static async createNewProduct(data){
		const trx = await Database.beginTransaction()
		const product = new Product();
		product.title 				= data.title
        product.price               = data.price;
        product.package_category_id = data.category_id;
        product.price_sale          = (data.price_sale != null) ? data.price_sale : 0;
        product.description         = data.description;
        product.package_code        = (data.package_code != null) ? data.package_code : Helpers.generateCodeGame();
        product.content             = data.content;
        product.status              = data.status;
		await product.save(trx);
		trx.commit()
		const productJson = await Product.query().with('category').where('id',product.id).first();
        return productJson.toJSON();
	}

    /**
     * Update a Product
     * @param
     * @return json
     * @author Dat Nguyen
     */
    static async updateProduct(data){
        const trx = await Database.beginTransaction()
        const product = await Product.find(data.id)
        if (!product) {
            return false;
        }
        product.title               = data.title
        product.price               = data.price;
        product.package_category_id = data.category_id;
        product.price_sale          = (data.price_sale != null) ? data.price_sale : 0;
        product.description         = data.description;
        product.content             = data.content;
        product.status              = data.status;
        await product.save(trx);
        trx.commit()
        const productJson = await Product.query().with('category').where('id',product.id).first();
        return productJson.toJSON();
    }

    /**
     * Find a Product
     * @param
     * @return json
     * @author Dat Nguyen
     */
    static async findProduct(id){
        const product = await Product.query().with('category').where('id',id).first();
        if (product) {
            return product.toJSON();
        }
        return false;
    }

    /**
     * Delete a Product
     * @param
     * @return json
     * @author Dat Nguyen
     */
    static async deleteProduct(id){
        const product = await Product.query().with('category').where('id',id).first();
        if (product) {
            product.delete();
            return true;
        }
        return false;
    }

} 
module.exports = ProductServices