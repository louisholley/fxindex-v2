"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTransactionsToEntities = void 0;
var constants_1 = require("./constants");
var Gentk_1 = require("./entity/Gentk");
var Project_1 = require("./entity/Project");
var User_1 = require("./entity/User");
var mapTransactionToUser = function (_a) {
    var _b = _a.sender, address = _b.address, alias = _b.alias;
    var user = new User_1.User();
    user.id = address;
    user.alias = alias;
    return user;
};
var mapTransactionToProject = function (t) {
    console.log(t);
    var _a = t.sender, address = _a.address, alias = _a.alias, _b = t.parameter.value, issuer_id = _b.issuer_id, price = _b.price, royalties = _b.royalties, enabled = _b.enabled;
    var project = new Project_1.Project();
    project.id = issuer_id;
    project.price = price ? parseInt(price) : null;
    project.royalties = royalties ? parseInt(royalties) : null;
    project.enabled = enabled;
    var user = new User_1.User();
    user.id = address;
    user.alias = alias;
    project.creator = user;
    return [project, user];
};
var mapTransactionToGentk = function (_a) {
    var _b = _a.parameter.value, address = _b.address, metadata = _b.metadata, token_id = _b.token_id, issuer_id = _b.issuer_id, iteration = _b.iteration, royalties = _b.royalties;
    var user = new User_1.User();
    user.id = address;
    var project = new Project_1.Project();
    project.id = issuer_id;
    var gentk = new Gentk_1.Gentk();
    gentk.id = token_id;
    gentk.project = project;
    gentk.minter = user;
    gentk.iteration = parseInt(iteration);
    gentk.royalties = parseInt(royalties);
    gentk.metadata = metadata;
    return [user, project, gentk];
};
var mapTransactionsToEntities = function (transactions) {
    return transactions.reduce(function (acc, t) {
        if (t.target.address === constants_1.USER_REGISTER.contract)
            return __spreadArray(__spreadArray([], acc, true), [mapTransactionToUser(t)], false);
        if (t.target.address === constants_1.ISSUER_V0.contract)
            return __spreadArray(__spreadArray([], acc, true), mapTransactionToProject(t), true);
        if (t.target.address === constants_1.GENTK_V1.contract)
            return __spreadArray(__spreadArray([], acc, true), mapTransactionToGentk(t), true);
    }, []);
};
exports.mapTransactionsToEntities = mapTransactionsToEntities;
//# sourceMappingURL=lib.js.map