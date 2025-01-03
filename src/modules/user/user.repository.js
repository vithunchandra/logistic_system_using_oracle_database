import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToSingleObject } from "../../utils/database_result_converter.js";

export class UserRepository{
    static #userRepository = null
    #connection = null

    constructor(connection){
        this.#connection = connection;
    }

    static async getRepository() {
        if(this.#userRepository !== null){
            return this.#userRepository
        }
        this.#userRepository = new UserRepository(await DatabaseConnection.getConnection())
        return this.#userRepository
    }

    async findOneByEmail(email){
        let sql = "SELECT * FROM users WHERE email = :email"
        const result = await this.#connection.execute(
            sql,
            {email: email}
        )
        return result.rows.length > 0 ? result.rows[0] : undefined;
    }

    async createUser(userData){
        let sql = `INSERT INTO users VALUES (
            :id, :name, :email, :password, :location, :phoneNumber, :updated_at
        )`
        const result = await this.#connection.execute(
            sql,
            {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                location: userData.location,
                phoneNumber: userData.phoneNumber,
                updated_at: userData.updated_at
            }
        )
        const user = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(user.rows);
    }

    async getLastRow(id){
        return await this.#connection.execute(
            "SELECT * FROM users WHERE ROWID = :id",
            {id}
        )
    }
}