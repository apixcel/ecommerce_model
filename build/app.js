"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
// import morgan from "morgan";
const db_1 = __importDefault(require("./config/db"));
const stripe_1 = __importDefault(require("stripe"));
const error_1 = __importDefault(require("./middlewares/error"));
const user_model_1 = __importDefault(require("./models/user.model"));
const index_1 = __importDefault(require("./routes/index"));
exports.stripe = new stripe_1.default(process.env.STRIPE_KEY);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
// app.use(morgan("dev"));
// Connect to Database
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const server = http_1.default.createServer(app);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        auth: "66d2b848c8b59b16c5ee89dd",
    }).populate({
        path: "subscription",
        populate: {
            path: "plan",
            model: "Plan",
        },
    });
    res.json(user);
}));
app.use("/api/v1/", index_1.default);
// Middleware for Errors
app.use(error_1.default);
//handle not found
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`App is running on port: ${port}. Run with http://localhost:${port}`);
});
