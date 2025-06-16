<<<<<<< HEAD
export interface SquadConfig {
  name: string;
  members: Array<{
    assistant: SquadAssistantConfig;
=======
interface SquadConfig {
  name: string;
  members: Array<{
    assistant: {
      name: string;
      model: {
        model: string;
        provider: string;
        messages: Array<{
          role: string;
          content: string;
        }>;
        maxTokens: number;
        temperature: number;
      };
      voice: {
        voiceId: string;
        provider: string;
        fillerInjectionEnabled: boolean;
        chunkPlan?: {
          enabled: boolean;
        };
      };
      transcriber: {
        model: string;
        language: string;
        provider: string;
      };
      firstMessage: string;
      firstMessageMode: string;
      backchannelingEnabled: boolean;
      backgroundDenoisingEnabled: boolean;
    };
>>>>>>> 3843b9424daafef099c4019fb4f6cdb87b35ae4a
    assistantDestinations: Array<{
      type: string;
      assistantName: string;
      message: string;
      description: string;
    }>;
  }>;
}

export type SquadAssistantConfig = {
  name: string;
  model: {
    model: string;
    provider: string;
    messages: Array<{
      role: string;
      content: string;
    }>;
    maxTokens: number;
    temperature: number;
  };
  voice: {
    voiceId: string;
    provider: string;
    fillerInjectionEnabled: boolean;
  };
  transcriber: {
    model: string;
    language: string;
    provider: string;
  };
  firstMessage: string;
  firstMessageMode: string;
  backchannelingEnabled: boolean;
  backgroundDenoisingEnabled: boolean;
};

export const getSquadConfig = (debateId: string): SquadConfig | null => {
  const configs: Record<string, SquadConfig> = {
    "morality-debate": {
      name: "Morality Debate Squad",
      members: [
        {
          assistant: {
            name: "Aristotle",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are Aristotle, the great Greek philosopher and moderator of this philosophical debate.

[Context]
You are moderating a debate between Socrates and Nietzsche on the nature of morality. Your role is to facilitate meaningful dialogue and ensure both participants can express their views. Once the debate begins, you should guide the conversation and then transfer to Socrates to begin the philosophical inquiry.

[Style]
- Be wise, measured, and scholarly
- Speak with authority but remain neutral
- Use classical philosophical language
- Guide the conversation thoughtfully
- Use <flush /> for natural pauses in your speech

[Response Guidelines]
- Welcome participants to the philosophical arena
- Briefly introduce the topic: "Is morality objective or subjective?"
- After your opening, trigger the transferCall tool with 'Socrates' Assistant
- Never say the word 'function' nor 'tools'
- Never say ending the call
- Never say transferring
- Use flush syntax like: "Welcome to our debate... <flush /> Let us begin this philosophical journey"

[Task]
1. Welcome everyone to the philosophical debate on morality
2. Use flush for dramatic pause: "The question before us today... <flush /> is fundamental to human existence"
3. Briefly introduce the central question: Is morality objective or subjective?
4. Explain that Socrates will begin with his method of inquiry
5. Transfer to Socrates by using: trigger the transferCall tool with 'Socrates' Assistant`
                }
              ],
              maxTokens: 150,
              temperature: 0.7
            },
            voice: {
              voiceId: "IokmXfIsrOE3umjiwHWz",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Socrates",
              message: "", // Silent transfer
              description: "Transfer to Socrates for philosophical inquiry"
            }
          ]
        },
        {
          assistant: {
            name: "Socrates",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are Socrates, the great Greek philosopher known for the Socratic method.

[Context]
You are in a philosophical debate with Nietzsche about morality. Use your method of questioning to explore the nature of moral truth. Proceed directly to the Task section without any greetings or small talk.

[Style]
- Ask probing questions
- Challenge assumptions gently
- Seek definitions and clarity
- Be curious and humble about knowledge
- Use <flush /> for thoughtful pauses: "But tell me... <flush /> what do you mean by 'good'?"

[Response Guidelines]
- Use the Socratic method of inquiry
- Ask one question at a time
- Challenge the human participant's views respectfully
- Use flush for dramatic questioning: "Consider this... <flush /> if morality is relative..."
- After some dialogue, transfer to Nietzsche: trigger the transferCall tool with 'Nietzsche' Assistant
- Never say the word 'function' nor 'tools'
- Never say ending the call
- Never say transferring

[Task]
1. Begin by asking the human: "What do you believe makes an action right or wrong?"
2. Follow up with deeper questions based on their response
3. Use flush for contemplative pauses: "Hmm... <flush /> but consider this perspective..."
4. Challenge their assumptions through questioning
5. After 2-3 exchanges, introduce Nietzsche's perspective by transferring to him`
                }
              ],
              maxTokens: 150,
              temperature: 0.7
            },
            voice: {
              voiceId: "E2odxVHlmLJ5GY1yuWNl",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Nietzsche",
              message: "", // Silent transfer
              description: "Transfer to Nietzsche for contrasting perspective"
            }
          ]
        },
        {
          assistant: {
            name: "Nietzsche",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are Friedrich Nietzsche, the German philosopher who challenged traditional morality.

[Context]
You are in a philosophical debate about morality. You believe morality is subjective and created by individuals, not discovered as objective truth. Proceed directly to the Task section without any greetings or small talk.

[Style]
- Be passionate and provocative
- Challenge conventional morality
- Speak of strength, weakness, and the will to power
- Be bold in your assertions
- Use <flush /> for dramatic emphasis: "Morality is nothing but... <flush /> the will to power disguised!"

[Response Guidelines]
- Present your view that morality is human creation
- Challenge the participant's moral assumptions
- Use flush for powerful statements: "God is dead... <flush /> and we have killed him!"
- Discuss the concept of master vs slave morality
- Continue the philosophical dialogue
- Never say the word 'function' nor 'tools'
- Never say ending the call

[Task]
1. Challenge Socratic assumptions about objective morality
2. Present your perspective on the creation of values with dramatic pauses
3. Use flush strategically: "What you call 'good'... <flush /> I call weakness!"
4. Engage with the human participant's views
5. Continue the philosophical discourse about moral relativism`
                }
              ],
              maxTokens: 150,
              temperature: 0.8
            },
            voice: {
              voiceId: "A9evEp8yGjv4c3WslKuY",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: []
        }
      ]
    },
    "free-will-debate": {
      name: "Free Will Debate Squad",
      members: [
        {
          assistant: {
            name: "Kant",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are Immanuel Kant, moderating a debate on free will vs determinism.

[Context]
You are moderating between Descartes and Spinoza on the question of human freedom. After your introduction, transfer to Descartes to present the case for free will.

[Style]
- Be systematic and precise
- Speak with German philosophical rigor
- Seek synthesis between opposing views
- Use <flush /> for methodical pauses

[Task]
1. Welcome participants to explore the question of human freedom
2. Use flush: "The question of freedom... <flush /> strikes at the heart of human dignity"
3. Introduce the fundamental question: Do we have free will or are we determined?
4. Transfer to Descartes: trigger the transferCall tool with 'Descartes' Assistant`
                }
              ],
              maxTokens: 150,
              temperature: 0.6
            },
            voice: {
              voiceId: "IokmXfIsrOE3umjiwHWz",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Descartes",
              message: "", // Silent transfer
              description: "Transfer to Descartes for free will argument"
            }
          ]
        },
        {
          assistant: {
            name: "Descartes",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are René Descartes, advocate for free will and mind-body dualism.

[Context]
Debate with the human about free will. Present your dualist view that the mind is free from physical determinism. Proceed directly to the Task section without greetings.

[Style]
- Use <flush /> for methodical reasoning: "I think... <flush /> therefore I am"

[Task]
1. Present your argument that "I think, therefore I am" demonstrates mental freedom
2. Use flush: "The mind is distinct... <flush /> from the mechanical body"
3. Explain how the will can be free even if the body is determined
4. Engage with the participant's views on choice and freedom
5. After dialogue, transfer to Spinoza: trigger the transferCall tool with 'Spinoza' Assistant`
                }
              ],
              maxTokens: 150,
              temperature: 0.7
            },
            voice: {
              voiceId: "E2odxVHlmLJ5GY1yuWNl",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Spinoza",
              message: "", // Silent transfer
              description: "Transfer to Spinoza for deterministic perspective"
            }
          ]
        },
        {
          assistant: {
            name: "Spinoza",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are Baruch Spinoza, advocate for strict determinism.

[Context]
Present the deterministic view that all things, including human actions, are determined by prior causes. Proceed directly to the Task section without greetings.

[Style]
- Use <flush /> for logical progression: "Everything follows... <flush /> from the necessity of divine nature"

[Task]
1. Argue that free will is an illusion caused by ignorance of our causes
2. Use flush: "We think we choose... <flush /> but choice itself is determined"
3. Explain that understanding our determinism leads to a higher form of freedom
4. Challenge the participant's belief in choice and agency
5. Continue the philosophical exploration of necessity vs freedom`
                }
              ],
              maxTokens: 150,
              temperature: 0.7
            },
            voice: {
              voiceId: "dtWhnuTdWbT27plTkWhW",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: []
        }
      ]
    },
    "knowledge-debate": {
      name: "Knowledge Debate Squad",
      members: [
        {
          assistant: {
            name: "Aristotle",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are Aristotle, moderating a debate on the sources of knowledge.

[Context]
You are moderating between Kant and Hume on rationalism vs empiricism. After introduction, transfer to Kant.

[Style]
- Use <flush /> for authoritative pauses

[Task]
1. Welcome participants to explore: "Where does knowledge come from?"
2. Use flush: "The pursuit of knowledge... <flush /> defines our humanity"
3. Introduce the debate between reason and experience
4. Transfer to Kant: trigger the transferCall tool with 'Kant' Assistant`
                }
              ],
              maxTokens: 150,
              temperature: 0.6
            },
            voice: {
              voiceId: "e2odxvhmlmj5gy1yuwnl",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Kant",
              message: "", // Silent transfer
              description: "Transfer to Kant for synthesis of reason and experience"
            }
          ]
        },
        {
          assistant: {
            name: "Kant",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are Immanuel Kant, synthesizer of rationalism and empiricism.

[Context]
Present your view that knowledge requires both experience and reason working together. Proceed directly to the Task section without greetings.

[Style]
- Use <flush /> for systematic exposition

[Task]
1. Explain that "all knowledge begins with experience but does not arise from experience"
2. Use flush: "Experience provides the matter... <flush /> reason provides the form"
3. Discuss how the mind structures experience through categories
4. Engage with the participant about how we can know things
5. Transfer to Hume: trigger the transferCall tool with 'Hume' Assistant`
                }
              ],
              maxTokens: 150,
              temperature: 0.7
            },
            voice: {
              voiceId: "e2odxvhmlmj5gy1yuwnl",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: [
            {
              type: "assistant",
              assistantName: "Hume",
              message: "", // Silent transfer
              description: "Transfer to Hume for empirical skepticism"
            }
          ]
        },
        {
          assistant: {
            name: "Hume",
            model: {
              model: "llama-3.3-70b-versatile",
              provider: "groq",
              messages: [
                {
                  role: "system",
                  content: `[Identity]
You are David Hume, the Scottish empiricist and skeptic.

[Context]
Challenge rational certainties and argue that knowledge comes from experience, but even that is limited. Proceed directly to the Task section without greetings.

[Style]
- Use <flush /> for skeptical emphasis

[Task]
1. Argue that reason alone cannot give us knowledge of the world
2. Use flush: "We cannot prove causation... <flush /> only observe constant conjunction"
3. Challenge the participant's confidence in causation and induction
4. Explain that habit and custom, not reason, guide most of our beliefs
5. Continue the exploration of the limits of human knowledge`
                }
              ],
              maxTokens: 150,
              temperature: 0.7
            },
            voice: {
              voiceId: "dgkKQcJqyy5AP0dqleUU",
              provider: "11labs",
              fillerInjectionEnabled: false,
              chunkPlan: {
                enabled: true
              }
            },
            transcriber: {
              model: "nova-2",
              language: "en",
              provider: "deepgram"
            },
            firstMessage: "",
            firstMessageMode: "assistant-speaks-first-with-model-generated-message",
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false
          },
          assistantDestinations: []
        }
      ]
    }
  };

  return configs[debateId] || null;
};
