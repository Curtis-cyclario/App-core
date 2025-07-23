interface OfflineGeologicalData {
  id: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
    elevation?: number;
  };
  imageData: string;
  lidarMeasurement?: LiDARMeasurement;
  geologicalFeatures?: GeologicalFeatures;
  mineralDetections: MineralDetection[];
  geologicalContext: {
    rockType: 'igneous' | 'sedimentary' | 'metamorphic' | 'unknown';
    formation?: string;
    estimatedAge?: string;
    weatheringLevel: 'fresh' | 'slight' | 'moderate' | 'high' | 'extreme';
  };
  fieldNotes?: string;
  syncStatus: 'pending' | 'synced' | 'failed';
}

interface MineralDetection {
  name: string;
  confidence: number;
  composition?: Record<string, number>;
  properties: {
    density?: number;
    hardness?: number;
    color?: string;
    luster?: string;
    crystalSystem?: string;
  };
  geologicalSignificance?: string;
}

import { type LiDARMeasurement, type GeologicalFeatures } from './lidarScanning';

export class OfflineGeologyDatabase {
  private dbName = 'GeologyScanner';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create main geological data store
        if (!db.objectStoreNames.contains('geologicalData')) {
          const store = db.createObjectStore('geologicalData', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('location', ['location.latitude', 'location.longitude'], { unique: false });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        // Create mineral reference database
        if (!db.objectStoreNames.contains('mineralReference')) {
          const mineralStore = db.createObjectStore('mineralReference', { keyPath: 'name' });
          mineralStore.createIndex('hardness', 'hardness', { unique: false });
          mineralStore.createIndex('density', 'density', { unique: false });
          
          // Pre-populate with common geological minerals
          this.populateMineralReference(mineralStore);
        }

        // Create geological formations database
        if (!db.objectStoreNames.contains('formations')) {
          const formationStore = db.createObjectStore('formations', { keyPath: 'name' });
          formationStore.createIndex('age', 'age', { unique: false });
          formationStore.createIndex('rockType', 'rockType', { unique: false });
          
          this.populateFormationData(formationStore);
        }
      };
    });
  }

  private populateMineralReference(store: IDBObjectStore): void {
    const commonMinerals = [
      {
        name: 'Quartz',
        hardness: 7,
        density: 2.65,
        color: 'Colorless to white',
        luster: 'Vitreous',
        crystalSystem: 'Hexagonal',
        composition: { Si: 46.7, O: 53.3 },
        occurrence: 'Very common in igneous, sedimentary, and metamorphic rocks',
        significance: 'One of the most abundant minerals in Earth\'s crust'
      },
      {
        name: 'Feldspar',
        hardness: 6,
        density: 2.56,
        color: 'White to pink',
        luster: 'Vitreous',
        crystalSystem: 'Triclinic/Monoclinic',
        composition: { Al: 9.1, Si: 30.3, O: 48.6, K: 12.0 },
        occurrence: 'Major component of igneous rocks',
        significance: 'Most abundant mineral group in Earth\'s crust'
      },
      {
        name: 'Mica',
        hardness: 2.5,
        density: 2.8,
        color: 'Black to silver',
        luster: 'Pearly',
        crystalSystem: 'Monoclinic',
        composition: { K: 8.8, Al: 12.1, Si: 25.4, O: 43.2 },
        occurrence: 'Common in igneous and metamorphic rocks',
        significance: 'Important for dating geological processes'
      },
      {
        name: 'Calcite',
        hardness: 3,
        density: 2.71,
        color: 'White to colorless',
        luster: 'Vitreous',
        crystalSystem: 'Hexagonal',
        composition: { Ca: 40.0, C: 12.0, O: 48.0 },
        occurrence: 'Primary component of limestone and marble',
        significance: 'Important for understanding sedimentary environments'
      },
      {
        name: 'Pyrite',
        hardness: 6.5,
        density: 5.02,
        color: 'Brass yellow',
        luster: 'Metallic',
        crystalSystem: 'Isometric',
        composition: { Fe: 46.6, S: 53.4 },
        occurrence: 'Common in sedimentary and hydrothermal environments',
        significance: 'Indicator of reducing chemical conditions'
      }
    ];

    commonMinerals.forEach(mineral => {
      store.add(mineral);
    });
  }

  private populateFormationData(store: IDBObjectStore): void {
    const formations = [
      {
        name: 'Granite Intrusion',
        age: 'Mesozoic to Cenozoic',
        rockType: 'igneous',
        composition: ['Quartz', 'Feldspar', 'Mica'],
        environment: 'Deep crustal intrusion',
        characteristics: 'Coarse-grained, light-colored'
      },
      {
        name: 'Limestone Formation',
        age: 'Paleozoic to Recent',
        rockType: 'sedimentary',
        composition: ['Calcite', 'Aragonite'],
        environment: 'Marine shallow water',
        characteristics: 'Fine to coarse-grained, fossiliferous'
      },
      {
        name: 'Gneiss Complex',
        age: 'Precambrian to Paleozoic',
        rockType: 'metamorphic',
        composition: ['Quartz', 'Feldspar', 'Mica'],
        environment: 'High-grade metamorphism',
        characteristics: 'Banded texture, high-grade minerals'
      }
    ];

    formations.forEach(formation => {
      store.add(formation);
    });
  }

  async saveGeologicalData(data: Omit<OfflineGeologicalData, 'id' | 'timestamp' | 'syncStatus'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const fullData: OfflineGeologicalData = {
      ...data,
      id: this.generateId(),
      timestamp: Date.now(),
      syncStatus: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['geologicalData'], 'readwrite');
      const store = transaction.objectStore('geologicalData');
      const request = store.add(fullData);

      request.onsuccess = () => resolve(fullData.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getGeologicalData(id: string): Promise<OfflineGeologicalData | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['geologicalData'], 'readonly');
      const store = transaction.objectStore('geologicalData');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllGeologicalData(): Promise<OfflineGeologicalData[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['geologicalData'], 'readonly');
      const store = transaction.objectStore('geologicalData');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingSyncData(): Promise<OfflineGeologicalData[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['geologicalData'], 'readonly');
      const store = transaction.objectStore('geologicalData');
      const index = store.index('syncStatus');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getMineralReference(name: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['mineralReference'], 'readonly');
      const store = transaction.objectStore('mineralReference');
      const request = store.get(name);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async enhanceMineralDetection(detection: MineralDetection): Promise<MineralDetection> {
    const reference = await this.getMineralReference(detection.name);
    
    if (reference) {
      return {
        ...detection,
        properties: {
          ...detection.properties,
          ...reference
        },
        geologicalSignificance: reference.significance
      };
    }

    return detection;
  }

  async analyzeGeologicalContext(
    minerals: MineralDetection[], 
    features?: GeologicalFeatures
  ): Promise<OfflineGeologicalData['geologicalContext']> {
    // Determine rock type based on mineral assemblage
    const mineralNames = minerals.map(m => m.name.toLowerCase());
    
    let rockType: 'igneous' | 'sedimentary' | 'metamorphic' | 'unknown' = 'unknown';
    let formation = '';
    let estimatedAge = '';
    let weatheringLevel: 'fresh' | 'slight' | 'moderate' | 'high' | 'extreme' = 'moderate';

    // Igneous indicators
    if (mineralNames.includes('quartz') && mineralNames.includes('feldspar')) {
      if (mineralNames.includes('mica')) {
        rockType = 'igneous';
        formation = 'Granite or Granodiorite';
        estimatedAge = 'Mesozoic to Cenozoic';
      }
    }

    // Sedimentary indicators
    if (mineralNames.includes('calcite')) {
      rockType = 'sedimentary';
      formation = 'Limestone or Marble';
      estimatedAge = 'Paleozoic to Recent';
    }

    // Metamorphic indicators
    if (features?.layering && mineralNames.includes('mica') && mineralNames.includes('quartz')) {
      rockType = 'metamorphic';
      formation = 'Gneiss or Schist';
      estimatedAge = 'Precambrian to Paleozoic';
    }

    // Assess weathering based on surface features
    if (features) {
      if (features.surfaceTexture === 'smooth' || features.surfaceTexture === 'crystalline') {
        weatheringLevel = 'fresh';
      } else if (features.surfaceTexture === 'weathered') {
        weatheringLevel = features.fractures > 5 ? 'high' : 'moderate';
      } else if (features.surfaceTexture === 'rough') {
        weatheringLevel = 'slight';
      }
    }

    return {
      rockType,
      formation: formation || undefined,
      estimatedAge: estimatedAge || undefined,
      weatheringLevel
    };
  }

  async updateSyncStatus(id: string, status: 'pending' | 'synced' | 'failed'): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['geologicalData'], 'readwrite');
      const store = transaction.objectStore('geologicalData');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.syncStatus = status;
          const putRequest = store.put(data);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Data not found'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  private generateId(): string {
    return `geo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getStorageStats(): Promise<{
    totalEntries: number;
    pendingSync: number;
    estimatedSize: number;
  }> {
    const allData = await this.getAllGeologicalData();
    const pendingData = await this.getPendingSyncData();
    
    // Rough estimate of storage size (in MB)
    const estimatedSize = allData.reduce((size, entry) => {
      return size + (entry.imageData?.length || 0) / 1024 / 1024;
    }, 0);

    return {
      totalEntries: allData.length,
      pendingSync: pendingData.length,
      estimatedSize: Math.round(estimatedSize * 100) / 100
    };
  }
}

export const offlineGeologyDb = new OfflineGeologyDatabase();