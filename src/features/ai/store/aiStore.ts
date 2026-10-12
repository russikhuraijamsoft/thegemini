import { create } from 'zustand';
import { AiInsight, AiAlert, AiForecast } from '../models/ai';
import { aiService } from '../services/aiService';

interface AiState {
  insights: AiInsight[];
  alerts: AiAlert[];
  forecast: AiForecast[];
  loading: boolean;
  error: string | null;

  loadAiData: () => Promise<void>;
}

export const useAiStore = create<AiState>((set) => ({
  insights: [],
  alerts: [],
  forecast: [],
  loading: false,
  error: null,

  loadAiData: async () => {
    set({ loading: true, error: null });
    try {
      const [insights, alerts, forecast] = await Promise.all([
        aiService.getInsights(),
        aiService.getAlerts(),
        aiService.getForecast()
      ]);
      set({ insights, alerts, forecast, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  }
}));
