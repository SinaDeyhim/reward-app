export interface Score {
  id: string;
  value: number;
}

export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ScoreDB", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("myStore")) {
        db.createObjectStore("myStore", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      reject(db);
    };
  });
};

export const getScore = async (id: number): Promise<Score | undefined> => {
  try {
    const db = (await openDatabase()) as IDBOpenDBRequest["result"];
    const transaction = db.transaction(["myStore"]);
    const store = transaction.objectStore("myStore");
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result as Score);
      };

      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  } catch (error) {
    console.error("Error opening database", error);
    return undefined;
  }
};

export const updateScore = async (id: string, diff: number): Promise<void> => {
  try {
    // Open the database
    const db = (await openDatabase()) as IDBOpenDBRequest["result"];

    // Start a read-write transaction
    const transaction = db.transaction(["myStore"], "readwrite");
    const store = transaction.objectStore("myStore");

    // Fetch the existing record
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const existingData = getRequest.result;

      if (existingData) {
        // Update the specific field

        existingData.value = Math.max((existingData.value || 0) + diff, 0);

        // Store the updated record
        const putRequest = store.put(existingData);

        putRequest.onsuccess = () => {
          console.log("Data updated successfully");
        };

        putRequest.onerror = (event: Event) => {
          console.error(
            "Error updating data",
            (event.target as IDBRequest).error
          );
        };
      } else {
        if (diff > 0) {
          store.add({ id, value: 10 });
        }
      }
    };

    getRequest.onerror = (event: Event) => {
      console.error("Error fetching data", (event.target as IDBRequest).error);
    };
  } catch (error) {
    console.error("Error opening database", error);
  }
};
