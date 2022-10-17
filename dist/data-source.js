"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var dotenv_1 = __importDefault(require("dotenv"));
var typeorm_1 = require("typeorm");
var User_1 = require("./entity/User");
var Project_1 = require("./entity/Project");
var Gentk_1 = require("./entity/Gentk");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
    synchronize: true,
    logging: ["schema"],
    entities: [User_1.User, Project_1.Project, Gentk_1.Gentk],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map