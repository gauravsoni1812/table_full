"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../authentication/auth"));
const signin_1 = __importDefault(require("../apis/signin"));
const signup_1 = __importDefault(require("../apis/signup"));
const category_1 = __importDefault(require("../apis/category"));
const subcategory_1 = __importDefault(require("../apis/subcategory"));
const product_1 = __importDefault(require("../apis/product"));
const userRouter = (0, express_1.Router)();
userRouter.use('/signin', signin_1.default);
userRouter.use('/signup', signup_1.default);
userRouter.use(auth_1.default);
userRouter.use('/category', category_1.default);
userRouter.use('/subcategory', subcategory_1.default);
userRouter.use('/product', product_1.default);
// userRouter.use('/removePickupaddress',removePickupaddress);
exports.default = userRouter;
