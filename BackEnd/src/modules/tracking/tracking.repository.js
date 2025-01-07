import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToArray } from "../../utils/database_result_converter.js"

export class TrackingRepository{
    static #trackingRepository = null
    #connection = null

    constructor(connection) {
        this.#connection = connection
    }

    static async getTrackingRepository(){
        if(this.#trackingRepository !== null){
            return this.#trackingRepository
        }
        this.#trackingRepository = new TrackingRepository(await DatabaseConnection.getConnection())
        return this.#trackingRepository
    }

    async createTrack(shipmentTrackingData){
        const sql = `INSERT INTO trackings VALUES(:id, :shipment_id, :staff_id, :message, :created_at, :updated_at)`
        const result = await this.#connection.execute(
            sql,
            {...shipmentTrackingData}
        )
    }

    async getShipmentTrack(shipment_id){
        const sql = `SELECT * FROM trackings WHERE shipment_id = :shipment_id ORDER BY created_at DESC`
        const result = await this.#connection.execute(
            sql,
            {shipment_id}
        )
        return convertToArray(result.rows)
    }
}