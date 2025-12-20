import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { FlowDiagram } from './types';

interface FlowDB extends DBSchema {
  diagrams: {
    key: string;
    value: FlowDiagram;
    indexes: { 'by-updated': string };
  };
}

const DB_NAME = 'flow-builder-db';
const DB_VERSION = 1;
const STORE_NAME = 'diagrams';

let dbInstance: IDBPDatabase<FlowDB> | null = null;

async function getDB(): Promise<IDBPDatabase<FlowDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<FlowDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
      });
      store.createIndex('by-updated', 'metadata.updatedAt');
    },
  });

  return dbInstance;
}

export async function saveDiagram(diagram: FlowDiagram): Promise<void> {
  const db = await getDB();
  const updatedDiagram = {
    ...diagram,
    metadata: {
      ...diagram.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
  await db.put(STORE_NAME, updatedDiagram);
}

export async function loadDiagram(id: string): Promise<FlowDiagram | null> {
  const db = await getDB();
  return (await db.get(STORE_NAME, id)) || null;
}

export async function listDiagrams(): Promise<FlowDiagram[]> {
  const db = await getDB();
  const index = db.transaction(STORE_NAME).store.index('by-updated');
  return await index.getAll();
}

export async function deleteDiagram(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function createNewDiagram(title: string = 'Untitled Flow'): Promise<FlowDiagram> {
  const id = `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  const diagram: FlowDiagram = {
    id,
    metadata: {
      title,
      createdAt: now,
      updatedAt: now,
    },
    nodes: [],
    edges: [],
  };

  await saveDiagram(diagram);
  return diagram;
}

