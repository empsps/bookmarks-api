"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var argon2_1 = require("argon2");
var runtime_1 = require("@prisma/client/runtime");
var AuthService = /** @class */ (function () {
    function AuthService(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    AuthService.prototype.register = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, username, hash, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = dto.email, password = dto.password, username = dto.username;
                        return [4 /*yield*/, (0, argon2_1.hash)(password)];
                    case 1:
                        hash = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    email: email,
                                    username: username,
                                    hash: hash
                                }
                            })];
                    case 3:
                        user = _a.sent();
                        return [2 /*return*/, this.signToken(user.id, user.email)];
                    case 4:
                        error_1 = _a.sent();
                        if (error_1 instanceof runtime_1.PrismaClientKnownRequestError) {
                            if ((error_1.code = 'P2002')) {
                                throw new common_1.ForbiddenException('E-mail is already in use');
                            }
                        }
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.isEmail = function (credential) {
        return !!String(credential)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };
    AuthService.prototype.login = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var credential, password, user, _a, passwordMatches;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        credential = dto.credential, password = dto.password;
                        _a = this.isEmail(credential);
                        switch (_a) {
                            case true: return [3 /*break*/, 1];
                            case false: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: {
                                email: credential
                            }
                        })];
                    case 2:
                        user = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: {
                                username: credential
                            }
                        })];
                    case 4:
                        user = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        if (!user) {
                            throw new common_1.ForbiddenException('Incorrect login or password');
                        }
                        return [4 /*yield*/, (0, argon2_1.verify)(user.hash, password)];
                    case 6:
                        passwordMatches = _b.sent();
                        if (!passwordMatches) {
                            throw new common_1.ForbiddenException('Incorrect login of password');
                        }
                        return [2 /*return*/, this.signToken(user.id, user.email)];
                }
            });
        });
    };
    AuthService.prototype.signToken = function (userId, email) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, access_token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            sub: userId,
                            email: email
                        };
                        return [4 /*yield*/, this.jwt.signAsync(payload, {
                                // expiresIn: '15m',
                                secret: this.config.get('JWT_SECRET')
                            })];
                    case 1:
                        access_token = _a.sent();
                        return [2 /*return*/, {
                                access_token: access_token
                            }];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)({})
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
