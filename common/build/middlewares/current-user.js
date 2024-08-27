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
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const not_authenticated_error_1 = require("../errors/not-authenticated-error");
const currentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check if there is jwt cookie or not
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
        return next();
    }
    // get username from jwt cookie
    try {
        const payload = jsonwebtoken_1.default.verify(req.session.user, process.env.JWT_KEY);
        req.currentUser = payload;
    }
    catch (err) {
        throw new not_authenticated_error_1.NotAuthenticatedError();
    }
    next();
});
exports.currentUser = currentUser;
