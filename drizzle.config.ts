import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    out: "./migrations",
    schema: "./database/schema/*",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
})
