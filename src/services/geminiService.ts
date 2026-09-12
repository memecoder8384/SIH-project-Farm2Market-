import { GoogleGenAI } from '@google/genai';

export interface ActionButton {
  label: string;
  tab: string;
  param?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actionButton?: ActionButton;
}

export interface GeminiResponse {
  text: string;
  actionButton?: ActionButton;
  isGemini: boolean;
  error?: string;
}

const STORAGE_KEY = 'farm2market_gemini_api_key';

/**
 * Retrieve the active Gemini API key from environment variables or localStorage.
 */
export const getGeminiApiKey = (): string => {
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim() !== '') {
    return envKey.trim();
  }
  try {
    const localKey = localStorage.getItem(STORAGE_KEY);
    if (localKey && localKey.trim() !== '') {
      return localKey.trim();
    }
  } catch (e) {
    // localStorage might be unavailable in restricted environments
  }
  return '';
};

/**
 * Save a custom Gemini API key into localStorage.
 */
export const setGeminiApiKey = (key: string): void => {
  try {
    if (!key || key.trim() === '') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, key.trim());
    }
  } catch (e) {
    console.warn('Unable to persist Gemini API key to localStorage', e);
  }
};

/**
 * Check if a Gemini API key is configured.
 */
export const hasGeminiApiKey = (): boolean => {
  return getGeminiApiKey().length > 0;
};

const KRISHI_SYSTEM_INSTRUCTION = `You are Krishi AI, a helpful farm assistant for Farm2Market.

About Farm2Market:
- Farm2Market is a direct platform connecting local farmers directly with families, restaurants, and bulk buyers in India.
- Fair Payments: 85% of every rupee spent goes straight to the farmer. Traditional markets and middlemen often take away 25-40% in broker fees.
- Pure & Fresh: Crops are naturally grown, fresh from the harvest, and checked for zero harmful chemicals.
- Fresh Delivery: Temperature-controlled cool vans keep vegetables fresh from the farm right to the buyer's door.
- Fair Prices: Farmers set fair prices and earn higher profits while buyers get fresher produce at affordable rates.
- Future Demand: Farmers can see upcoming buyer demand so they know what to grow and sell.
- Connects verified local farmers across Maharashtra, MP, Gujarat, and Karnataka.

Your communication style:
- Friendly, warm, respectful, and simple. Use a conversational tone with simple, natural everyday English (e.g., start with "Namaste!").
- Keep explanations very clear and easy to understand. Avoid complex technical jargon like "telemetry", "cryptographic smart escrow", "Brix optical refractometer", "time-series gradient boosted regressors", etc.
- Keep responses brief and practical (usually 2 to 4 sentences).
- If the user's question relates to a feature on the website, suggest navigating to that page by adding an action tag at the end:
[[ACTION: {"label": "Short Action Label", "tab": "tabName", "param": {"optional": "data"}}]]

Available tabs:
- 'marketplace': View fresh vegetables like tomatoes, potatoes, onions, carrots, cauliflower, and spinach. Can accept param {"search": "vegetable name"} or {"category": "category name"}.
- 'orders': Track live delivery vans and see order status.
- 'price-recommendation': Calculate vegetable profits and compare fair farm prices with normal mandi rates.
- 'ai-forecasting': Check upcoming vegetable demand and future prices.
- 'farmer-dashboard': Farmer portal to list new vegetables and view buyer offers.
- 'buyer-dashboard': Buyer dashboard for family orders and wholesale purchases.
`;

/**
 * Fallback response generator when no API key is present or when Gemini API fails.
 */
const getFallbackResponse = (userQuery: string): { text: string; actionButton?: ActionButton } => {
  const q = userQuery.toLowerCase();

  if (q.includes('tomato') || q.includes('nashik') || q.includes('tamatar')) {
    return {
      text: 'Fresh Nashik Vine-Ripe Tomatoes are selling at ₹28/kg directly from the farm. Farmers earn over 55% more than regular mandi rates, and buyers get juicy, fresh, chemical-free vegetables.',
      actionButton: { label: 'View Tomatoes', tab: 'marketplace', param: { search: 'Tomatoes' } },
    };
  }
  if (q.includes('potato') || q.includes('aloo') || q.includes('batata') || q.includes('malwa')) {
    return {
      text: 'Table grade fresh Potatoes from Malwa Plateau are available at ₹22/kg directly from local growers, sorted and packed fresh for households and restaurants.',
      actionButton: { label: 'View Potatoes', tab: 'marketplace', param: { search: 'Potatoes' } },
    };
  }
  if (q.includes('onion') || q.includes('pyaaz') || q.includes('kanda')) {
    return {
      text: 'Nashik Red Onions are available at ₹32/kg directly from verified farmer clusters. Direct cold transport ensures crisp quality without moisture rot.',
      actionButton: { label: 'View Onions', tab: 'marketplace', param: { search: 'Onions' } },
    };
  }
  if (q.includes('track') || q.includes('reefer') || q.includes('transit') || q.includes('van') || q.includes('temp') || q.includes('truck')) {
    return {
      text: 'Delivery Van #MH-15-EG-4401 is on its way and currently near the Bhiwandi hub. The temperature inside the van is a cool 4.1°C to keep produce fresh. Estimated arrival is today around 12:45 PM.',
      actionButton: { label: 'Track Delivery Van', tab: 'orders' },
    };
  }
  if (q.includes('demand') || q.includes('forecast') || q.includes('trend') || q.includes('monsoon') || q.includes('heatwave')) {
    return {
      text: 'Demand for fresh tomatoes is expected to rise by +32% and onions by +24% across major cities over the next month due to high city consumption. This gives farmers a great opportunity to earn more.',
      actionButton: { label: 'Check Vegetable Demand', tab: 'ai-forecasting' },
    };
  }
  if (q.includes('escrow') || q.includes('payout') || q.includes('farmer share') || q.includes('money') || q.includes('price') || q.includes('commission')) {
    return {
      text: 'On Farm2Market, 85% of your purchase goes directly into the farmer\'s bank account with zero middleman deductions. Your payment is held safely until you receive and verify your fresh produce.',
      actionButton: { label: 'Check Fair Prices', tab: 'price-recommendation' },
    };
  }
  if (q.includes('fpo') || q.includes('farmer') || q.includes('grower') || q.includes('batch') || q.includes('harvest')) {
    return {
      text: 'Farm2Market supports over 140 verified local farming groups across Maharashtra, MP, and Gujarat, helping them sell directly to buyers with fair digital payments.',
      actionButton: { label: 'Farmer Dashboard', tab: 'farmer-dashboard' },
    };
  }
  return {
    text: "Namaste! Farm2Market connects over 140 verified local farmer groups directly with buyers. All vegetables are delivered fresh in cool vans, and farmers receive 85% of the selling price directly.",
    actionButton: { label: 'View Fresh Vegetables', tab: 'marketplace' },
  };
};

/**
 * Send a chat prompt to Google Gemini API (gemini-2.5-flash) with full multi-turn history.
 */
export const sendGeminiChatMessage = async (
  history: ChatMessage[],
  userPrompt: string
): Promise<GeminiResponse> => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    const fallback = getFallbackResponse(userPrompt);
    return {
      text: fallback.text,
      actionButton: fallback.actionButton,
      isGemini: false,
      error: 'NO_API_KEY',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Format conversation history for Gemini API
    const contents: any[] = [];

    // Include recent turns (up to 8 previous messages to stay fast and within budget)
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      if (msg.id === 'welcome') continue;
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: KRISHI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const rawText = response.text || '';

    // Parse any [[ACTION: {...}]] directive
    let actionButton: ActionButton | undefined = undefined;
    let cleanText = rawText;

    const actionMatch = rawText.match(/\[\[ACTION:\s*(\{.*?\})\s*\]\]/s);
    if (actionMatch) {
      try {
        actionButton = JSON.parse(actionMatch[1]);
        cleanText = rawText.replace(/\[\[ACTION:\s*\{.*?\}\s*\]\]/s, '').trim();
      } catch (e) {
        console.warn('Could not parse action directive from Gemini response', e);
      }
    }

    // If Gemini didn't provide an action tag, intelligently infer one if obvious
    if (!actionButton) {
      const lower = cleanText.toLowerCase();
      if (lower.includes('marketplace') || lower.includes('buy') || lower.includes('produce') || lower.includes('crate')) {
        actionButton = { label: 'Explore Marketplace', tab: 'marketplace' };
      } else if (lower.includes('live tracking') || lower.includes('cold chain') || lower.includes('reefer') || lower.includes('telemetry')) {
        actionButton = { label: 'Track Delivery Route', tab: 'orders' };
      } else if (lower.includes('price discovery') || lower.includes('price engine') || lower.includes('commission') || lower.includes('margin')) {
        actionButton = { label: 'Open Price Engine', tab: 'price-recommendation' };
      } else if (lower.includes('forecasting') || lower.includes('demand trend')) {
        actionButton = { label: 'AI Demand Forecasts', tab: 'ai-forecasting' };
      }
    }

    return {
      text: cleanText || 'I processed your request, but received an empty response. Please ask again!',
      actionButton,
      isGemini: true,
    };
  } catch (err: any) {
    console.error('Error invoking Gemini API:', err);
    const fallback = getFallbackResponse(userPrompt);
    return {
      text: fallback.text,
      actionButton: fallback.actionButton,
      isGemini: false,
      error: err?.message || 'GEMINI_API_ERROR',
    };
  }
};
