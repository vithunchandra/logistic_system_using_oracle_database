import CourierRepository from "./courier.repository.js"
import {v4 as uuid} from 'uuid'
import jwt from 'jsonwebtoken'
import { DatabaseConnection } from "../../database/database_connection.js"

export default class CourierProvider{
    static #courierProvider = null
    #courierRepository = null
    #connection = null

    constructor(courierRepository, connection){
        this.#courierRepository = courierRepository
        this.#connection = connection
    }

    static async getCourierProvider(){
        if(this.#courierProvider !== null){
            return this.#courierProvider
        }
        this.#courierProvider = new CourierProvider(
            await CourierRepository.getCourierRepository(),
            await DatabaseConnection.getConnection()
        )
        return this.#courierProvider
    }

    async createCourier(req, res){
        const {name, email, password, phone_number} = req.body
        if(!name || !email || !password, !phone_number){
            return res.status(401).json({message: "Semua field wajib diisi"})
        }

        const isExist = await this.#courierRepository.findOneByEmail(email)
        if(isExist){
            return res.status(401).json({message: "Email sudah terpakai"})
        }

        try{
            const courier = await this.#courierRepository.createCourier({
                id: uuid(),
                ...req.body
            })
            courier.password = undefined
            const token = jwt.sign(
                { courier },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            this.#connection.commit()
            return res.status(201).json({token})
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }     
    }

    async login(req, res){
        const {email, password} = req.body
        if(!email || !password){
            return res.status(401).json({message: "Semua field wajib diisi"})
        }
        const courier = await this.#courierRepository.findOneByEmail(email)
        if(!courier){
            return res.status(404).json({message: "Courier tidak ditemukan"})
        }
        if(courier.password !== password){
            return res.status(401).json({message: "Password tidak valid"})
        }
        courier.password = undefined
        const token = jwt.sign(
            { courier },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        return res.status(200).json({token})
    }
}