import {v4 as uuid4} from 'uuid'
import StaffRepository from './staff.repository.js'
import { DatabaseConnection } from '../../database/database_connection.js'
import jwt from 'jsonwebtoken'

export class StaffProvider{
    static #staffProvider = null
    #staffRepository = null
    #connection = null

    constructor(staffRepository, connection){
        this.#staffRepository = staffRepository
        this.#connection = connection
    }

    static async getStaffProvider(){
        if(this.#staffProvider !== null){
            return this.#staffProvider
        }
        this.#staffProvider = new StaffProvider(await StaffRepository.getStaffRepository(), await DatabaseConnection.getConnection())
        return this.#staffProvider
    }

    async createStaff(req, res){
        const {name, email, password} = req.body
        if(!name || !email || !password){
            return res.status(401).json({message: "Semua field wajib diisi"})
        }

        const isExist = await this.#staffRepository.findOneByEmail(email)
        if(isExist){
            return res.status(401).json({message: "Email sudah terdaftar"})
        }

        const staff = await this.#staffRepository.createStaff({
            id: uuid4(),
            ...req.body
        })
        staff.password = undefined
        const token = jwt.sign(
            { staff: staff },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        await this.#connection.commit()
        return res.status(201).json({token})
    }

    async login(req, res){
        const {email, password} = req.body
        if(!email || !password){
            return res.status(401).json({message: "Semua field wajib diisi"})
        }

        try{
            const staff = await this.#staffRepository.findOneByEmail(email)
            if(!staff){
                return res.status(404).json({message: "Staff tidak ditemukan"})
            }

            if(staff.password !== password){
                return res.status(401).json({message: "Password tidak valid"})
            }
            staff.password = undefined
            const token = jwt.sign(
                { staff: staff },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            await this.#connection.commit()
            return res.status(200).json({token})
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }
    }
}