import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToSingleObject } from "../../utils/database_result_converter.js"

export default class CourierRepository{
    static #courierRepository = null
    #connection = null

    constructor(connection){
        this.#connection = connection
    }

    static async getCourierRepository(){
        if(this.#courierRepository !== null){
            return this.#courierRepository
        }
        this.#courierRepository = new CourierRepository(await DatabaseConnection.getConnection())
        return this.#courierRepository
    }

    async createCourier(courierData){
        const result = await this.#connection.execute(
            `INSERT INTO couriers VALUES(:id, :name, :email, :password, :phone_number, :updated_at, :branch_id)`,
            {...courierData}
        )
        const courier = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(courier.rows)
    }

    async findOneByEmail(email){
        const result = await this.#connection.execute(
            "SELECT * FROM couriers WHERE email = :email",
            {email}
        )
        return convertToSingleObject(result.rows)
    }

    async getLastRow(id){
        return await this.#connection.execute(
            "SELECT * FROM couriers WHERE ROWID = :id",
            {id}
        )
    }
}