import {
  blocksGet,
  defaults,
  Int32Parameter,
  operationsGetTransactions,
} from "@tzkt/sdk-api";
import { BATCH_LIMIT, CONTRACTS } from "./constants";
import { AppDataSource } from "./data-source";
import { mapTransactionsToEntities } from "./lib";

defaults.baseUrl = "https://api.ghostnet.tzkt.io/";

const getFilters = (level: Int32Parameter, cr?: number) => ({
  level,
  target: {
    in: CONTRACTS.map((c) => c.address),
  },
  entrypoint: {
    in: CONTRACTS.map((c) => c.entrypoint),
  },
  offset: cr ? { cr } : undefined,
  limit: BATCH_LIMIT,
});

// const indexEveryBlock = async (
//   level: number,
//   stopAtLevel: number,
//   cr?: number
// ) => {
//   console.log(`indexing from block ${level}`, cr ? `with cursor ${cr}` : "");

//   const transactions = await operationsGetTransactions(
//     getFilters({ eq: level }, cr)
//   );

//   await AppDataSource.manager.transaction(
//     "SERIALIZABLE",
//     async (transactionManager) => {
//       const { users, projects, gentks } =
//         mapTransactionsToEntities(transactions);

//       await transactionManager.save(users);
//       await transactionManager.save(projects);
//       await transactionManager.save(gentks);
//     }
//   );

//   console.log(transactions.length, "transactions indexed");

//   if (level === stopAtLevel) return;
//   if (transactions.length === BATCH_LIMIT)
//     return indexEveryBlock(
//       level,
//       stopAtLevel,
//       transactions[transactions.length - 1].id
//     );
//   if (transactions.length < BATCH_LIMIT)
//     return indexEveryBlock(level + 1, stopAtLevel);
// };

const runIndexer = async (level: number, cr?: number) => {
  console.log(`indexing from block ${level}`, cr ? `with cursor ${cr}` : "");

  const transactions = await operationsGetTransactions(
    getFilters({ gt: level }, cr)
  );

  if (transactions.length === 0) return null;

  await AppDataSource.manager.transaction(
    "SERIALIZABLE",
    async (transactionManager) => {
      const { users, projects, gentks } =
        mapTransactionsToEntities(transactions);

      await transactionManager.save(users);
      await transactionManager.save(projects);
      await transactionManager.save(gentks);
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
      in: CONTRACTS.map((c) => c.address),
    },
    entrypoint: {
      in: CONTRACTS.map((c) => c.entrypoint),
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

    // blockCursor = await blocksGet({
    //   limit: 1,
    //   sort: { desc: "id" },
    // });
    // await indexEveryBlock(0, blockCursor);
    // setInterval(liveIndex, 30000);
  })
  .catch((error) => console.log(error));
