import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToSingleObject } from "../../utils/database_result_converter.js"

export default class StaffRepository{
    static #staffRepository = null
    #connection = null

    constructor(connection){
        this.#connection = connection
    }

    static async getStaffRepository(){
        if(this.#staffRepository !== null){
            return this.#staffRepository
        }
        this.#staffRepository = new StaffRepository(await DatabaseConnection.getConnection())
        return this.#staffRepository
    }

    async createStaff(staffData){
        let sql = `INSERT INTO staffs VALUES(
            :id, :name, :email, :password, :branch_id
        )`
        const result = await this.#connection.execute(
            sql,
            {...staffData}
        )
        const staff = await this.getLastRow(result.lastRowid)
        return staff.rows[0]
    }

    async findOneByEmail(email){
        const result = await this.#connection.execute(
            "SELECT * FROM staffs WHERE email = :email",
            {email}
        )
        return convertToSingleObject(result.rows)
    }

    async getLastRow(id){
        return await this.#connection.execute(
            "SELECT * FROM staffs WHERE ROWID = :id",
            {id}
        )
    }
}