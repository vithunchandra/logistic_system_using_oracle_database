import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'
import {UserRepository} from "./user.repository.js";
import { DatabaseConnection } from '../../database/database_connection.js';

export default class UserProvider{
    static #userProvider = null
    #userRepository = null
    #connection = null

    constructor(userRepository, connection){
        this.#userRepository = userRepository
        this.#connection = connection
    }

    static async getUserProvider(){
        if(this.#userProvider != null){
            return this.#userProvider
        }
        this.#userProvider = new UserProvider(await UserRepository.getRepository(), await DatabaseConnection.getConnection())
        return this.#userProvider
    }

    async createUser(req, res){
        const {email, name, password, confirmPassword, location} = req.body
        if(!email || !name || !password || !confirmPassword || !location){
            return res.status(401).json({message: "Semua field harus diisii"})
        }

        const isExist = await this.#userRepository.findOneByEmail(email);
        if(isExist){
            return res.status(401).json({message: "Email sudah terpakai"})
        }

        if(confirmPassword !== password){
            return res.status(401).json({message: "Confirm password invalid"})
        }
        
        try{
            const user = await this.#userRepository.createUser({
                email, name, password, location, id: uuidv4()
            })
            user.password = undefined
            const token = jwt.sign(
                { user: user },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            await this.#connection.commit()
            return res.status(201).json({token})
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }
    }

    async login(req, res){
        const {email, password} = req.body
        if(!email || !password){
            return res.status(401).json({message: "Semua field harus diisi"})
        }

        const user = await this.#userRepository.findOneByEmail(email)
        if(!user){
            return res.status(401).json({message: "User tidak ditemukan"})
        }
        
        if(user.password !== password){
            return res.status(401).json({message: "Password tidak valid"})
        }
        user.password = undefined
        const token = jwt.sign(
            { user: user },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        return res.status(200).json({token})
    }
}