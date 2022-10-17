"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BATCH_LIMIT = exports.ENTRYPOINTS = exports.CONTRACTS = exports.GENTK_V1 = exports.ISSUER_V0 = exports.USER_REGISTER = void 0;
var USER_REGISTER = {
    contract: "KT1XaikgmBDQANBvkFqyFhSpgAZJAXpiDFGE",
    entrypoint: "update_profile",
};
exports.USER_REGISTER = USER_REGISTER;
var ISSUER_V0 = {
    contract: "KT1PyfrDD85RxUWz8dMHoC92MxdPzecSQ5t9",
    entrypoint: "update_issuer",
};
exports.ISSUER_V0 = ISSUER_V0;
var GENTK_V1 = {
    contract: "KT1ExHjELnDuat9io3HkDcrBhHmek7h8EVXG",
    entrypoint: "mint",
};
exports.GENTK_V1 = GENTK_V1;
var CONTRACTS = [
    USER_REGISTER.contract,
    ISSUER_V0.contract,
    GENTK_V1.contract,
];
exports.CONTRACTS = CONTRACTS;
var ENTRYPOINTS = [
    USER_REGISTER.entrypoint,
    ISSUER_V0.entrypoint,
    GENTK_V1.entrypoint,
];
exports.ENTRYPOINTS = ENTRYPOINTS;
var BATCH_LIMIT = 1000;
exports.BATCH_LIMIT = BATCH_LIMIT;
//# sourceMappingURL=constants.js.map