import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToArray, convertToSingleObject } from "../../utils/database_result_converter.js"

export default class BranchRepository{
    static #branchRepository = null
    #connection = null

    constructor(connection){
        this.#connection = connection
    }

    static async getBranchRepository(){
        if(this.#branchRepository !== null){
            return this.#branchRepository
        }
        this.#branchRepository = new BranchRepository(await DatabaseConnection.getConnection())
        return this.#branchRepository
    }

    async createBranch(branchData){
        const sql = `INSERT INTO branches VALUES(
            :id, :name, :location, :updated_at
        )`
        const result = await this.#connection.execute(
            sql,
            {
                id: branchData.id,
                name: branchData.name,
                location: branchData.location,
                updated_at: branchData.updated_at
            }
        )
        const branch = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(branch.rows)
    }

    async getAllBranch(){
        const result = await this.#connection.execute(
            `SELECT * FROM branches`
        )

        return convertToArray(result.rows)
    }

    async getLastRow(id){
        const result = await this.#connection.execute(
            "SELECT * FROM branches WHERE ROWID = :id",
            {id}
        )
        return result
    }

    async getBranch(id){
        const result = await this.#connection.execute(
            `SELECT * FROM branches WHERE id = :id`,
            {id}
        )
        return convertToSingleObject(result.rows)
    }
}