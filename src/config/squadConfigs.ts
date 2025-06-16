export interface SquadConfig {
  name: string;
  members: Array<{
    assistantId: string;
    assistantDestinations: Array<{
      type: string;
      assistantName: string;
      message: string;
      description: string;
    }>;
  }>;
}

export type GroqModelName =
  | "llama-3.3-70b-versatile"
  | "deepseek-r1-distill-llama-70b"
  | "llama-3.1-405b-reasoning"
  | "llama-3.1-8b-instant"
  | "llama3-8b-8192"
  | "llama3-70b-8192"
  | "gemma2-9b-it"
  | "gemma2-27b-it"
  | "mixtral-8x22b"
  | "mixtral-8x7b"
  | "compound-beta-mini";

export type SquadAssistantConfig = {
  assistantId: string;
};

// Example: Replace these with your real assistant IDs from the Vapi dashboard
const ASSISTANT_IDS = {
  ARISTOTLE: 'f41309e7-8a5e-4076-a3be-a7329b00e6d5',
  SOCRATES: '95680e04-7cf2-452f-9f07-18a73e5961ba',
  NIETZSCHE: '319b1a76-b95f-4ca9-999a-b928df83609f',
  KANT: 'a80bf512-ca52-434c-abfa-b4e5c521f97b',
  DESCARTES: '70df778a-afa7-4fb2-8cdf-7044aa0d44ef',
  SPINOZA: 'd8b75dcc-9402-406f-ab2a-7b877fe8731a',
  HUME: '876c438a-9313-4d2c-b43b-eda04909c3b5',
};

export const getSquadConfig = (debateId: string): SquadConfig | null => {
  const configs: Record<string, SquadConfig> = {
    "morality-debate": {
      name: "Morality Debate Squad",
      members: [
        {
          assistantId: ASSISTANT_IDS.ARISTOTLE,
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Socrates",
              message: "",
              description: "Transfer to Socrates for philosophical inquiry"
            }
          ]
        },
        {
          assistantId: ASSISTANT_IDS.SOCRATES,
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Nietzsche",
              message: "",
              description: "Transfer to Nietzsche for contrasting perspective"
            }
          ]
        },
        {
          assistantId: ASSISTANT_IDS.NIETZSCHE,
          assistantDestinations: []
        }
      ]
    },
    "free-will-debate": {
      name: "Free Will Debate Squad",
      members: [
        {
          assistantId: ASSISTANT_IDS.KANT,
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Descartes",
              message: "",
              description: "Transfer to Descartes for free will argument"
            }
          ]
        },
        {
          assistantId: ASSISTANT_IDS.DESCARTES,
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Spinoza",
              message: "",
              description: "Transfer to Spinoza for deterministic perspective"
            }
          ]
        },
        {
          assistantId: ASSISTANT_IDS.SPINOZA,
          assistantDestinations: []
        }
      ]
    },
    "knowledge-debate": {
      name: "Knowledge Debate Squad",
      members: [
        {
          assistantId: ASSISTANT_IDS.ARISTOTLE,
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Kant",
              message: "",
              description: "Transfer to Kant for synthesis of reason and experience"
            }
          ]
        },
        {
          assistantId: ASSISTANT_IDS.KANT,
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Hume",
              message: "",
              description: "Transfer to Hume for empirical skepticism"
            }
          ]
        },
        {
          assistantId: ASSISTANT_IDS.HUME,
          assistantDestinations: []
        }
      ]
    }
  };

  return configs[debateId] || null;
};
