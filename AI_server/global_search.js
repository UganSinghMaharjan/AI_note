import mongoose from "mongoose";

async function findGlobal() {
  const adminUri = "mongodb://localhost:27017/admin";
  const targetId = "6964a3d047a833fa5e028b42";

  try {
    const adminConn = await mongoose.createConnection(adminUri).asPromise();
    const admin = adminConn.db.admin();
    const dbs = await admin.listDatabases();

    console.log("Searching for ID:", targetId);

    for (const dbInfo of dbs.databases) {
      if (
        dbInfo.name === "admin" ||
        dbInfo.name === "local" ||
        dbInfo.name === "config"
      )
        continue;

      console.log(`Checking database: ${dbInfo.name}`);
      const dbConn = await mongoose
        .createConnection(`mongodb://localhost:27017/${dbInfo.name}`)
        .asPromise();
      const collections = await dbConn.db.listCollections().toArray();

      for (const col of collections) {
        const result = await dbConn.db
          .collection(col.name)
          .findOne({ _id: new mongoose.Types.ObjectId(targetId) });
        if (result) {
          console.log(
            `FOUND! Database: ${dbInfo.name}, Collection: ${col.name}`
          );
          console.log(JSON.stringify(result, null, 2));
        }
      }
      await dbConn.close();
    }
    await adminConn.close();
    console.log("Search complete.");
  } catch (err) {
    console.error(err);
  }
}

findGlobal();
