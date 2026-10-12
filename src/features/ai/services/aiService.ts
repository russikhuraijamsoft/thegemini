import { collection, query, getDocs } from 'firebase/firestore';
import { AiInsight, AiAlert, AiForecast } from '../models/ai';
import { db } from '../../../core/firebase/firebaseConfig';

class AiService {
  async getInsights(): Promise<AiInsight[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'ai_insights'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AiInsight));
  }

  async getAlerts(): Promise<AiAlert[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'ai_alerts'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AiAlert));
  }

  async getForecast(): Promise<AiForecast[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'ai_forecasts'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data } as unknown as AiForecast;
    });
  }
}

export const aiService = new AiService();
