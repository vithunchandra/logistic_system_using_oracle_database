import { config } from "dotenv"
config()

const surabayaCustomerConfig = {
    user          : process.env.CUSTOMER_ROLE_USERNAME,
    password      : process.env.CUSTOMER_ROLE_PASSWORD,
    connectString : "localhost/orcl"
}

const surabayaKarywanConfig = {
    user          : process.env.KARYAWAN_ROLE_USERNAME,
    password      : process.env.KARYAWAN_ROLE_PASSWORD,
    connectString : "localhost/orcl"
}

const surabayaCourierConfig = {
    user          : process.env.COURIER_ROLE_USERNAME,
    password      : process.env.COURIER_ROLE_PASSWORD,
    connectString : "localhost/orcl"
}

const surabayaConfig = {
    user          : "bali",
    password      : "bali",
    connectString : "localhost/diondb"
}

export {surabayaConfig, surabayaCustomerConfig, surabayaKarywanConfig, surabayaCourierConfig}