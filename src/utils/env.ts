import dotenv from 'dotenv'

dotenv.config(); // Load file dotenv

//Jika DATABASE_URL kosong (falsy) maka DATABASE_URL bakal jadi string kosong ""
export const DATABASE_URL: string = process.env.DATABASE_URL || ""

export const SECRET: string = process.env.SECRET || ""