import { DatabaseConnection } from "../../database/database_connection.js"
import {v4 as uuid4} from 'uuid'
import { convertToArray } from "../../utils/database_result_converter.js"

export default class ShipmentTransitRepository{
    static #shipmentTransitRepository = null
    #connection = null

    constructor(connection){
        this.#connection = connection
    }

    static async getShipmentTransitRepository(){
        if(this.#shipmentTransitRepository !== null){
            return this.#shipmentTransitRepository
        }
        this.#shipmentTransitRepository = new ShipmentTransitRepository(await DatabaseConnection.getConnection())
        return this.#shipmentTransitRepository
    }

    async createShipmentTransit(transitRoute, shipment_id){
        const sql = `INSERT INTO shipment_transits VALUES(
            :id, :shipment_id, :previous_branch, :next_branch, :status
        )`
        const binds = transitRoute.map(row => ({
            id: uuid4(),
            shipment_id: shipment_id,
            previous_branch: row.previous_branch,
            next_branch: row.next_branch,
            status: "Shipping"
        }))
        console.log(binds)
        await this.#connection.executeMany(sql, binds)
        return this.getShipmentTransit(shipment_id)
    }

    async getShipmentTransit(shipment_id){
        const sql = `
            SELECT 
                st.id AS id, 
                b1.name AS previous_branch,
                b2.name AS next_branch, 
                st.status AS status
            FROM shipment_transits st 
            JOIN branches b1 ON st.previous_branch = b1.id
            JOIN branches b2 ON st.next_branch = b2.id
            WHERE st.shipment_id = :shipment_id
        `
        const result = await this.#connection.execute(sql, {shipment_id})
        return convertToArray(result.rows)
    }
}