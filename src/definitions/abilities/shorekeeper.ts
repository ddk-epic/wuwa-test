import type { SKILL_CATEGORY_KEY, SkillSequence } from "@/shared/types"

const shorekeeper: Record<SKILL_CATEGORY_KEY, SkillSequence> = {
  intro: {
    1: {
      id: "Enlightenment",
      name: "Enlightenment",
      category: "intro",
      classifications: ["spectro", "skill"],
      frames: 90,
      onCast: { concerto: 10 },
      hits: [
        { frame: 60, mv: 0.2279, concerto: 2, resonance: 2 },
        { frame: 61, mv: 0.2279, concerto: 2, resonance: 2 },
        { frame: 62, mv: 0.2279, concerto: 2, resonance: 2 },
        { frame: 63, mv: 0.2279, concerto: 2, resonance: 2 },
        { frame: 64, mv: 0.2279, concerto: 2, resonance: 2 },
      ],
    },
    2: {
      id: "Discernment",
      name: "Discernment",
      category: "intro",
      classifications: ["spectro", "liberation"],
      frames: 141 + 74,
      freezetime: 141,
      onCast: { concerto: 20 },
      hits: [
        { frame: 1, mv: 0.0988, concerto: 0, resonance: 3.34},
        { frame: 2, mv: 0.0988, concerto: 0, resonance: 3.34},
        { frame: 3, mv: 0.0988, concerto: 0, resonance: 3.34},
      ],
      variations: {
        swap: {
          frames: 141 + 53,
        },
      },
    },
  },
  outro: {
    1: {
      id: "Binary Butterfly",
      name: "Binary Butterfly",
      category: "outro",
      classifications: ["spectro", "outro"],
      frames: 0,
      hits: [],
    },
  },
  basic: {
    1: {
      id: "Origin Calculus 1",
      name: "Origin Calculus 1",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 22,
      hits: [
        { frame: 10, mv: 0.1599, forte: 1, concerto: 1.6, resonance: 0.5 },
      ],
    },
    2: {
      id: "Origin Calculus 2",
      name: "Origin Calculus 2",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 36,
      hits: [
        { frame: 10, mv: 0.12, forte: 1, concerto: 1.2, resonance: 0.38 },
        { frame: 11, mv: 0.12, concerto: 1.2, resonance: 0.38 },
      ],
      variations: {
        canc: {
          frames: 17,
        },
      },
    },
    3: {
      id: "Origin Calculus 3",
      name: "Origin Calculus 3",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 41,
      hits: [
        { frame: 10, mv: 0.1173, forte: 1, concerto: 1.18, resonance: 0.37 },
        { frame: 11, mv: 0.1173, forte: 1, concerto: 1.18, resonance: 0.37 },
        { frame: 12, mv: 0.1173, concerto: 1.18, resonance: 0.37 },
      ],
      variations: {
        canc: {
          frames: 24,
        },
      },
    },
    4: {
      id: "Origin Calculus 4",
      name: "Origin Calculus 4",
      category: "basic",
      classifications: ["spectro", "basic"],
      frames: 53,
      hits: [
        { frame: 20, mv: 0.3658, forte: 1, concerto: 3.66, resonance: 1.15 },
      ],
      variations: {
        canc: {
          frames: 32,
        },
      },
    },
  },
  heavy: {
    1: null,
  },
  skill: {
    1: {
      id: "Chaos Theory",
      name: "Chaos Theory",
      category: "skill",
      classifications: ["spectro", "skill"],
      frames: 42,
      cooldown: 16,
      onCast: { concerto: 20 },
      hits: [
        { frame: 1, mv: 0.1575, concerto: 2, resonance: 2 },
        { frame: 1, mv: 0.1575, concerto: 2, resonance: 2 },
        { frame: 1, mv: 0.1575, concerto: 2, resonance: 2 },
        { frame: 1, mv: 0.1575, concerto: 2, resonance: 2 },
        { frame: 1, mv: 0.1575, concerto: 2, resonance: 2 },
      ],
      variations: {
        swap: {
          frames: 15,
        },
      },
    },
  },

  liberation: {
    1: {
      id: "End Loop",
      name: "End Loop",
      category: "liberation",
      classifications: ["spectro", "liberation"],
      frames: 180 + 2,
      freezetime: 180,
      cooldown: 25,
      hits: [], // TODO: add healing hits
    },
  },
  forte: {
    1: {
      id: "Illation",
      name: "Illation",
      category: "forte",
      classifications: ["spectro", "heavy"],
      frames: 69,
      onCast: { concerto: 6 },
      hits: [
        { frame: 1, mv: 0.0954, concerto: 0, resonance: 0.4 },
        { frame: 1, mv: 0.0954, concerto: 0, resonance: 0.4 },
        { frame: 1, mv: 0.0954, concerto: 0, resonance: 0.4 },
        { frame: 1, mv: 0.0954, concerto: 0, resonance: 0.4 },
        { frame: 1, mv: 0.0954, concerto: 0, resonance: 0.4 },
      ],
      variations: {
        swap: {
          frames: 24,
        },
      },
    },
    2: {
      id: "Transmutation",
      name: "Transmutation",
      category: "forte",
      classifications: ["spectro", "basic"],
      frames: 90,
      hits: [{ frame: 1, mv: 0.372, concerto: 0, resonance: 1.55 }],
      variations: {
        swap: {
          frames: 24,
        },
      },
    },
  },
}

export default shorekeeper