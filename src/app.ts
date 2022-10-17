import { defaults, operationsGetTransactions } from "@tzkt/sdk-api";
import { BATCH_LIMIT, CONTRACTS, ENTRYPOINTS } from "./constants";
import { AppDataSource } from "./data-source";
import { mapTransactionsToEntities } from "./lib";

defaults.baseUrl = "https://api.ghostnet.tzkt.io/";

// fix this because we're getting the earliest entry in the batch rn - we want the latest!
// we need to ignore project transactions with entrypoint mint also
const dedupeById = (entities: any[]) =>
  Object.values(
    entities.reduce((acc, entity) => {
      if (acc[entity.id]) {
        return acc;
      }
      acc[entity.id] = entity;
      return acc;
    }, {})
  );

const runIndexer = async (level: number, cr?: number) => {
  console.log(`indexing from block ${level}`, cr ? `with cursor ${cr}` : "");

  const transactions = await operationsGetTransactions({
    level: {
      gt: level,
    },
    target: {
      in: CONTRACTS,
    },
    entrypoint: {
      in: ENTRYPOINTS,
    },
    offset: cr ? { cr } : undefined,
    limit: 100,
  });

  if (transactions.length === 0) return null;

  await AppDataSource.manager.transaction(
    "SERIALIZABLE",
    async (transactionManager) => {
      const entities = dedupeById(mapTransactionsToEntities(transactions));
      await transactionManager.save(entities);
    }
  );

  console.log(transactions.length, "transactions indexed");

  const lastTransaction = transactions[transactions.length - 1];
  if (transactions.length < BATCH_LIMIT) return lastTransaction.level;
  if (transactions.length === BATCH_LIMIT)
    return runIndexer(lastTransaction.level, lastTransaction.id);
};

const loadInitialBlock = async () => {
  const transactions = await operationsGetTransactions({
    target: {
      in: CONTRACTS,
    },
    entrypoint: {
      in: ENTRYPOINTS,
    },
    limit: 1,
  });
  /**
   * subtract 1 as we query for transactions gt: level
   */
  return transactions[0].level - 1;
};

let blockCursor = 0;

const liveIndex = async () => {
  const lastIndexedBlock = await runIndexer(blockCursor);
  if (lastIndexedBlock !== null) blockCursor = lastIndexedBlock;
  else console.log("no transactions found");
};

AppDataSource.initialize()
  .then(async () => {
    const initialBlock = await loadInitialBlock();
    blockCursor = await runIndexer(initialBlock);
    setInterval(liveIndex, 30000);
  })
  .catch((error) => console.log(error));
