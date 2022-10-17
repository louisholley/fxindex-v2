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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_api_1 = require("@tzkt/sdk-api");
var constants_1 = require("./constants");
var data_source_1 = require("./data-source");
var lib_1 = require("./lib");
sdk_api_1.defaults.baseUrl = "https://api.ghostnet.tzkt.io/";
// fix this because we're getting the earliest entry in the batch rn - we want the latest!
// we need to ignore project transactions with entrypoint mint also
var dedupeById = function (entities) {
    return Object.values(entities.reduce(function (acc, entity) {
        if (acc[entity.id]) {
            return acc;
        }
        acc[entity.id] = entity;
        return acc;
    }, {}));
};
var runIndexer = function (level, cr) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, lastTransaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("indexing from block ".concat(level), cr ? "with cursor ".concat(cr) : "");
                return [4 /*yield*/, (0, sdk_api_1.operationsGetTransactions)({
                        level: {
                            gt: level,
                        },
                        target: {
                            in: constants_1.CONTRACTS,
                        },
                        entrypoint: {
                            in: constants_1.ENTRYPOINTS,
                        },
                        offset: cr ? { cr: cr } : undefined,
                        limit: 100,
                    })];
            case 1:
                transactions = _a.sent();
                if (transactions.length === 0)
                    return [2 /*return*/, null];
                return [4 /*yield*/, data_source_1.AppDataSource.manager.transaction("SERIALIZABLE", function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                        var entities;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    entities = dedupeById((0, lib_1.mapTransactionsToEntities)(transactions));
                                    return [4 /*yield*/, transactionManager.save(entities)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                console.log(transactions.length, "transactions indexed");
                lastTransaction = transactions[transactions.length - 1];
                if (transactions.length < constants_1.BATCH_LIMIT)
                    return [2 /*return*/, lastTransaction.level];
                if (transactions.length === constants_1.BATCH_LIMIT)
                    return [2 /*return*/, runIndexer(lastTransaction.level, lastTransaction.id)];
                return [2 /*return*/];
        }
    });
}); };
var loadInitialBlock = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, sdk_api_1.operationsGetTransactions)({
                    target: {
                        in: constants_1.CONTRACTS,
                    },
                    entrypoint: {
                        in: constants_1.ENTRYPOINTS,
                    },
                    limit: 1,
                })];
            case 1:
                transactions = _a.sent();
                /**
                 * subtract 1 as we query for transactions gt: level
                 */
                return [2 /*return*/, transactions[0].level - 1];
        }
    });
}); };
var blockCursor = 0;
var liveIndex = function () { return __awaiter(void 0, void 0, void 0, function () {
    var lastIndexedBlock;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runIndexer(blockCursor)];
            case 1:
                lastIndexedBlock = _a.sent();
                if (lastIndexedBlock !== null)
                    blockCursor = lastIndexedBlock;
                else
                    console.log("no transactions found");
                return [2 /*return*/];
        }
    });
}); };
data_source_1.AppDataSource.initialize()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var initialBlock;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadInitialBlock()];
            case 1:
                initialBlock = _a.sent();
                return [4 /*yield*/, runIndexer(initialBlock)];
            case 2:
                blockCursor = _a.sent();
                setInterval(liveIndex, 30000);
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (error) { return console.log(error); });
//# sourceMappingURL=app.js.map