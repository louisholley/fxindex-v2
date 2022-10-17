"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gentk = void 0;
var typeorm_1 = require("typeorm");
var Project_1 = require("./Project");
var User_1 = require("./User");
var Gentk = /** @class */ (function () {
    function Gentk() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Gentk.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Project_1.Project; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", Project_1.Project)
    ], Gentk.prototype, "project", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", User_1.User)
    ], Gentk.prototype, "minter", void 0);
    __decorate([
        (0, typeorm_1.Column)("simple-json"),
        __metadata("design:type", Object)
    ], Gentk.prototype, "metadata", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Gentk.prototype, "iteration", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Gentk.prototype, "royalties", void 0);
    Gentk = __decorate([
        (0, typeorm_1.Entity)()
    ], Gentk);
    return Gentk;
}());
exports.Gentk = Gentk;
//# sourceMappingURL=Gentk.js.map