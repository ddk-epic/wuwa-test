import type { SKILL_CATEGORY_KEY, SkillSequence } from "@/shared/types"

const sanhua: Record<SKILL_CATEGORY_KEY, SkillSequence> = {
  intro: {
    1: {
      id: "Freezing Thorns",
      name: "Freezing Thorns",
      category: "intro",
      classifications: ["glacio", "intro"],
      frames: 60,
      onCast: { concerto: 10 },
      hits: [{ frame: 1, mv: 0.7, resonance: 10 }],
    },
  },
  outro: {
    1: {
      id: "Silversnow",
      name: "Silversnow",
      category: "outro",
      classifications: ["glacio", "outro"],
      frames: 0,
      hits: [],
    },
  },
  basic: {
    1: {
      id: "Frigid Light 1",
      name: "Frigid Light 1",
      category: "basic",
      classifications: ["glacio", "basic"],
      frames: 21,
      hits: [{ frame: 10, mv: 0.245, concerto: 2, resonance: 0.87 }],
    },
    2: {
      id: "Frigid Light 2",
      name: "Frigid Light 2",
      category: "basic",
      classifications: ["glacio", "basic"],
      frames: 32,
      hits: [{ frame: 20, mv: 0.371, concerto: 4, resonance: 1.32 }],
    },
    3: {
      id: "Frigid Light 3",
      name: "Frigid Light 3",
      category: "basic",
      classifications: ["glacio", "basic"],
      frames: 42,
      hits: [
        { frame: 16, mv: 0.1085, concerto: 2, resonance: 0.38 },
        { frame: 20, mv: 0.1085, concerto: 2, resonance: 0.38 },
        { frame: 24, mv: 0.1085, concerto: 2, resonance: 0.38 },
        { frame: 28, mv: 0.1085, concerto: 2, resonance: 0.38 },
      ],
    },
    4: {
      id: "Frigid Light 4",
      name: "Frigid Light 4",
      category: "basic",
      classifications: ["glacio", "basic"],
      frames: 34,
      hits: [
        { frame: 10, mv: 0.1995, concerto: 4, resonance: 0.71 },
        { frame: 20, mv: 0.1995, concerto: 4, resonance: 0.71 },
      ],
    },
    5: {
      id: "Frigid Light 5",
      name: "Frigid Light 5",
      category: "basic",
      classifications: ["glacio", "basic"],
      frames: 108,
      hits: [{ frame: 10, mv: 1.176, concerto: 10, resonance: 4.2 }],
    },
  },
  heavy: {
    1: {
      id: "Frigid Light",
      name: "Frigid Light",
      category: "heavy",
      classifications: ["glacio", "heavy"],
      frames: 60,
      hits: [
        { frame: 1, mv: 0.112, concerto: 1.6, resonance: 0.4 },
        { frame: 1, mv: 0.112, concerto: 1.6, resonance: 0.4 },
        { frame: 1, mv: 0.112, concerto: 1.6, resonance: 0.4 },
        { frame: 1, mv: 0.112, concerto: 1.6, resonance: 0.4 },
        { frame: 1, mv: 0.112, concerto: 1.6, resonance: 0.4 },
      ],
    },
  },
  skill: {
    1: {
      id: "Eternal Frost",
      name: "Eternal Frost",
      category: "skill",
      classifications: ["glacio", "skill"],
      frames: 65,
      cooldown: 10,
      onCast: { concerto: 15 },
      hits: [{ frame: 1, mv: 1.81, resonance: 10 }],
      variations: {
        canc: {
          frames: 24,
        },
      },
    },
  },
  liberation: {
    1: {
      id: "Glacial Gaze",
      name: "Glacial Gaze",
      category: "liberation",
      classifications: ["glacio", "liberation"],
      frames: 94,
      freezetime: 84,
      cooldown: 16,
      onCast: { concerto: 20 },
      hits: [{ frame: 1, mv: 4.0716 }],
    },
  },
  forte: {
    1: {
      id: "Detonate",
      name: "Detonate",
      category: "forte",
      classifications: ["glacio", "heavy"],
      frames: 92,
      hits: [
        { frame: 1, mv: 0.937, concerto: 7.5, resonance: 2.34 },
        { frame: 1, mv: 0.937, concerto: 7.5, resonance: 2.34 },
      ],
      variations: {
        swap: {
          frames: 45,
        },
      },
    },
  },
}

export default sanhua
