import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToSingleObject } from "../../utils/database_result_converter.js"

export default class PaymentRepository{
    static #paymentRepository = null
    #connection = null

    constructor(connection){
        this.#connection = connection
    }

    static async getPaymentRepository(){
        if(this.#paymentRepository !== null){
            return this.#paymentRepository
        }
        this.#paymentRepository = new PaymentRepository(await DatabaseConnection.getConnection())
        return this.#paymentRepository
    }

    async createPayment(paymentData){
        let sql = `INSERT INTO payments VALUES(
            :id, :staff_id, :created_at, :gross_amount, :updated_at, :user_id
        )`
        console.log(paymentData)
        const result = await this.#connection.execute(sql, {
            ...paymentData
        })
        const payment = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(payment.rows)
    }

    async getLastRow(id){
        const result = await this.#connection.execute(
            `SELECt * FROM payments WHERE ROWID = :id`,
            {id}
        )
        return result
    }
}