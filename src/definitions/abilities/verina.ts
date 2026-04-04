import type { SKILL_CATEGORY_KEY, SkillSequence } from "@/shared/types"

const verina: Record<SKILL_CATEGORY_KEY, SkillSequence> = {
  intro: {
    1: {
      id: "Verdant Growth",
      name: "Verdant Growth",
      category: "intro",
      classifications: ["spectro", "intro"],
      frames: 114,
      onCast: { concerto: 10 },
      hits: [{ frame: 0, mv: 0, concerto: 0, resonance: 0 }],
    },
  },
  outro: {
    1: {
      id: "Blossom",
      name: "Blossom",
      category: "outro",
      classifications: ["spectro", "outro"],
      frames: 0,
      hits: [],
    },
  },
  basic: {
    1: {
      id: "Cultivation 1",
      name: "Cultivation 1",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0, concerto: 0, resonance: 0 }],
    },
    2: {
      id: "Cultivation 2",
      name: "Cultivation 2",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0, concerto: 0, resonance: 0 }],
    },
    3: {
      id: "Cultivation 3",
      name: "Cultivation 3",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0, concerto: 0, resonance: 0 }],
    },
    4: {
      id: "Cultivation 4",
      name: "Cultivation 4",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0, concerto: 0, resonance: 0 }],
    },
    5: {
      id: "Cultivation 5",
      name: "Cultivation 5",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0, concerto: 0, resonance: 0 }],
      variations: {
        canc: {
          frames: 32,
        },
      },
    },
  },
  heavy: {
    1: {
      id: "Cultivation Heavy",
      name: "Cultivation Heavy",
      category: "heavy",
      classifications: ["spectro", "heavy"],
      frames: 42,
      onCast: { concerto: 20 },
      hits: [{ frame: 0, mv: 0, concerto: 0, resonance: 0 }],
      variations: {
        swap: {
          frames: 15,
        },
      },
    },
  },
  skill: {
    1: {
      id: "Botany Experiment",
      name: "Botany Experiment",
      category: "skill",
      classifications: ["spectro", "skill"],
      frames: 42,
      cooldown: 12,
      hits: [{ frame: 0, mv: 0, concerto: 0, resonance: 0 }],
      variations: {
        canc: {
          frames: 15,
        },
      },
    },
  },

  liberation: {
    1: {
      id: "Arboreal Flourish",
      name: "Arboreal Flourish",
      category: "liberation",
      classifications: ["spectro", "liberation"],
      frames: 120,
      freezetime: 74,
      cooldown: 25,
      hits: [],
    },
  },
  forte: {
    1: {
      id: "Starflower Blooms (Mid-Air)",
      name: "Starflower Blooms (Mid-Air)",
      category: "liberation",
      classifications: ["spectro", "liberation"],
      frames: 18,
      hits: [],
    },
  },
}

export default verina
