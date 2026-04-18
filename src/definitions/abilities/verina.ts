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
      hits: [{ frame: 45, mv: 0.5, forte: 1, resonance: 10 }],
      variations: {
        canc: {
          frames: 54,
        },
      },
    },
  },
  outro: {
    1: {
      id: "Blossom",
      name: "Blossom",
      category: "outro",
      classifications: ["spectro", "outro"],
      frames: 0,
      hits: [
        { frame: 60, mv: 0.19, type: "heal" },
        { frame: 120, mv: 0.19, type: "heal" },
        { frame: 180, mv: 0.19, type: "heal" },
        { frame: 240, mv: 0.19, type: "heal" },
        { frame: 300, mv: 0.19, type: "heal" },
        { frame: 360, mv: 0.19, type: "heal" },
      ],
    },
  },
  basic: {
    1: {
      id: "Cultivation 1",
      name: "Cultivation 1",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0.1904, concerto: 3.04, resonance: 0.95 }],
    },
    2: {
      id: "Cultivation 2",
      name: "Cultivation 2",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0.2573, concerto: 4.11, resonance: 1.28 }],
    },
    3: {
      id: "Cultivation 3",
      name: "Cultivation 3",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [
        { frame: 10, mv: 0.1287, concerto: 2.05, resonance: 0.64 },
        { frame: 10, mv: 0.1287, concerto: 2.05, resonance: 0.64 },
      ],
    },
    4: {
      id: "Cultivation 4",
      name: "Cultivation 4",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [{ frame: 10, mv: 0.3386, concerto: 5.41, resonance: 1.69 }],
    },
    5: {
      id: "Cultivation 5",
      name: "Cultivation 5",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 30,
      hits: [
        { frame: 10, mv: 0.3603, forte: 1, concerto: 5.76, resonance: 1.8 },
      ],
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
      hits: [{ frame: 10, mv: 0.5, concerto: 8, resonance: 2.5 }],
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
      onCast: { concerto: 30 },
      hits: [{ frame: 10, mv: 0.18, forte: 1, resonance: 9 }],
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
      onCast: { concerto: 20, resonance: -175 },
      hits: [
        { frame: 0, mv: 1, concerto: 0, resonance: 0 },
        { frame: 0, mv: 0.238, flat: 950, type: "heal" },
      ],
    },
  },
  forte: {
    1: {
      id: "Starflower Blooms 1",
      name: "Starflower Blooms 1",
      category: "forte",
      classifications: ["spectro", "basic"],
      frames: 18,
      hits: [
        {
          frame: 10,
          mv: 0.3402,
          forte: -1,
          concerto: 12 + 4.53,
          resonance: 1.41,
        },
        { frame: 10, mv: 0.2975, flat: 1188, type: "heal" },
      ],
    },
    2: {
      id: "Starflower Blooms 2",
      name: "Starflower Blooms 2",
      category: "forte",
      classifications: ["spectro", "basic"],
      frames: 18,
      hits: [
        {
          frame: 10,
          mv: 0.321,
          forte: -1,
          concerto: 12 + 4.28,
          resonance: 1.33,
        },
        { frame: 10, mv: 0.2975, flat: 1188, type: "heal" },
      ],
    },
    3: {
      id: "Starflower Blooms 3",
      name: "Starflower Blooms 3",
      category: "forte",
      classifications: ["spectro", "basic"],
      frames: 18,
      hits: [
        {
          frame: 10,
          mv: 0.1534,
          forte: -1,
          concerto: 12 + 2.04,
          resonance: 0.63,
        },
        { frame: 10, mv: 0.1534, concerto: 2.04, resonance: 0.63 },
        { frame: 10, mv: 0.1534, concerto: 2.04, resonance: 0.63 },
        { frame: 10, mv: 0.2975, flat: 1188, type: "heal" },
      ],
    },
    4: {
      id: "Starflower Blooms Heavy",
      name: "Starflower Blooms Heavy",
      category: "forte",
      classifications: ["spectro", "heavy"],
      frames: 42,
      onCast: { concerto: 20 },
      hits: [
        {
          frame: 10,
          mv: 0.3267,
          forte: -1,
          concerto: 12 + 4.66,
          resonance: 2.91,
        },
        { frame: 20, mv: 0.49 },
      ],
      variations: {
        swap: {
          frames: 15,
        },
      },
    },
  },
}

export default verina
