import { Platform } from 'react-native';

let db = null;

const initializeDB = async () => {
  if (!db) {
    try {
      const SQLite = await import('expo-sqlite');
      db = SQLite.openDatabase('favorites.db');
      console.log('Database initialized:', db);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
  return db;
};

// Initialize the database
export const initDatabase = async () => {
  const database = await initializeDB();
  if (!database) {
    console.error('Database not initializeddd');
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    try {
      database.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY, placeData TEXT);',
          [],
          () => {
            console.log('Database initialized successfully');
            resolve();
          },
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      reject(error);
    }
  });
};

// Add a place to favorites
export const addToFavorites = async (placeId, placeData) => {
  const database = await initializeDB();
  if (!database) {
    console.error('Database not initialized');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      database.transaction(tx => {
        tx.executeSql(
          'INSERT INTO favorites (id, placeData) VALUES (?, ?)',
          [placeId, JSON.stringify(placeData)],
          (_, result) => {
            console.log('Added to favorites successfully');
            resolve(result);
          },
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Add to favorites error:', error);
      reject(error);
    }
  });
};

// Remove a place from favorites
export const removeFromFavorites = async (placeId) => {
  const database = await initializeDB();
  if (!database) {
    console.error('Database not initialized');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      database.transaction(tx => {
        tx.executeSql(
          'DELETE FROM favorites WHERE id = ?',
          [placeId],
          (_, result) => {
            console.log('Removed from favorites successfully');
            resolve(result);
          },
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Remove from favorites error:', error);
      reject(error);
    }
  });
};

// Check if a place is in favorites
export const isInFavorites = async (placeId) => {
  const database = await initializeDB();
  if (!database) {
    console.error('Database not initialized');
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    try {
      database.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM favorites WHERE id = ?',
          [placeId],
          (_, { rows: { _array } }) => {
            console.log('Checked favorites successfully');
            resolve(_array.length > 0);
          },
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Check favorites error:', error);
      reject(error);
    }
  });
};

// Get all favorites
export const getAllFavorites = async () => {
  const database = await initializeDB();
  if (!database) {
    console.error('Database not initialized');
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    try {
      database.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM favorites',
          [],
          (_, { rows: { _array } }) => {
            console.log('Retrieved all favorites successfully');
            const favorites = _array.map(item => ({
              ...item,
              placeData: JSON.parse(item.placeData)
            }));
            resolve(favorites);
          },
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error('Get all favorites error:', error);
      reject(error);
    }
  });
};
