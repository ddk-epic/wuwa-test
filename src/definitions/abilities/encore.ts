import type { SKILL_CATEGORY_KEY, SkillSequence } from "@/shared/types"

const encore: Record<SKILL_CATEGORY_KEY, SkillSequence> = {
  intro: {
    1: {
      id: "Woolies Helpers",
      name: "Woolies Helpers",
      category: "intro",
      classifications: ["fusion", "intro"],
      frames: 92,
      onCast: { concerto: 10 },
      hits: [{ frame: 60, mv: 1, concerto: 10, resonance: 10 }],
    },
  },
  outro: {
    1: {
      id: "Thermal Field",
      name: "Thermal Field",
      category: "outro",
      classifications: ["fusion", "outro"],
      frames: 0,
      hits: [
        { frame: 0, mv: 1.7676 },
        { frame: 90, mv: 1.7676 },
        { frame: 180, mv: 1.7676 },
        { frame: 270, mv: 1.7676 },
      ],
    },
  },
  basic: {
    1: {
      id: "Wooly Attack 1",
      name: "Wooly Attack 1",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 30,
      hits: [{ frame: 20, mv: 0.28, concerto: 1.4, resonance: 0.7 }],
    },
    2: {
      id: "Wooly Attack 2",
      name: "Wooly Attack 2",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 30,
      hits: [{ frame: 20, mv: 0.333, concerto: 1.66, resonance: 0.83 }],
    },
    3: {
      id: "Wooly Attack 3",
      name: "Wooly Attack 3",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 30,
      hits: [
        { frame: 18, mv: 0.3335, concerto: 1.66, resonance: 0.83 },
        { frame: 20, mv: 0.3335, concerto: 1.66, resonance: 0.83 },
      ],
    },
    4: {
      id: "Wooly Attack 4",
      name: "Wooly Attack 4",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 30,
      hits: [
        { frame: 10, mv: 0.1925, concerto: 0.96, resonance: 0.48 },
        { frame: 15, mv: 0.1925, concerto: 0.96, resonance: 0.48 },
        { frame: 20, mv: 0.1925, concerto: 0.96, resonance: 0.48 },
        { frame: 25, mv: 0.1925, concerto: 0.96, resonance: 0.48 },
      ],
    },
    5: {
      id: "Wooly Attack 5",
      name: "Wooly Attack 5",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 90,
      hits: [{ frame: 1, mv: 1.2, concerto: 6, resonance: 3 }],
    },
    6: {
      id: "Cosmos - Frolicking 1",
      name: "Cosmos - Frolicking 1",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 20,
      hits: [
        { frame: 10, mv: 0.4536, concerto: 1.33, resonance: 0.66 },
        { frame: 15, mv: 0.4536, concerto: 1.33, resonance: 0.66 },
      ],
    },
    7: {
      id: "Cosmos - Frolicking 2",
      name: "Cosmos - Frolicking 2",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 40,
      hits: [
        { frame: 10, mv: 0.2837, concerto: 0.83, resonance: 0.41 },
        { frame: 20, mv: 0.2837, concerto: 0.83, resonance: 0.41 },
        { frame: 30, mv: 0.2837, concerto: 0.83, resonance: 0.41 },
      ],
    },
    8: {
      id: "Cosmos - Frolicking 3",
      name: "Cosmos - Frolicking 3",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 30,
      hits: [
        { frame: 10, mv: 0.3319, concerto: 0.97, resonance: 0.48 },
        { frame: 15, mv: 0.3319, concerto: 0.97, resonance: 0.48 },
        { frame: 20, mv: 0.3319, concerto: 0.97, resonance: 0.48 },
        { frame: 25, mv: 0.3319, concerto: 0.97, resonance: 0.48 },
      ],
    },
    9: {
      id: "Cosmos - Frolicking 4",
      name: "Cosmos - Frolicking 4",
      category: "basic",
      classifications: ["fusion", "basic"],
      frames: 90,
      hits: [
        { frame: 50, mv: 0.9759, concerto: 2.86, resonance: 1.43 },
        { frame: 60, mv: 0.9759, concerto: 2.86, resonance: 1.43 },
        { frame: 70, mv: 0.9759, concerto: 2.86, resonance: 1.43 },
      ],
      variations: {
        canc: {
          frames: 15,
        },
      },
    },
  },
  heavy: {
    1: null,
  },
  skill: {
    1: {
      id: "Flaming Woolies",
      name: "Flaming Woolies",
      category: "skill",
      classifications: ["fusion", "skill"],
      frames: 108,
      cooldown: 10,
      onCast: { concerto: 15 },
      hits: [
        { frame: 12, mv: 0.3853, resonance: 1.91 },
        { frame: 24, mv: 0.3853, resonance: 1.91 },
        { frame: 36, mv: 0.3853, resonance: 1.91 },
        { frame: 48, mv: 0.3853, resonance: 1.91 },
        { frame: 60, mv: 0.3853, resonance: 1.91 },
        { frame: 72, mv: 0.3853, resonance: 1.91 },
        { frame: 84, mv: 0.3853, resonance: 1.91 },
        { frame: 96, mv: 0.3853, resonance: 1.91 },
      ],
      variations: {
        canc: {
          frames: 30,
          hits: [
            { frame: 12, mv: 0.3853, resonance: 1.91 },
            { frame: 24, mv: 0.3853, resonance: 1.91 },
          ],
        },
        swap: {
          frames: 15,
        },
      },
    },
    2: {
      id: "Energetic Welcome",
      name: "Energetic Welcome",
      category: "skill",
      classifications: ["fusion", "skill"],
      frames: 60,
      cooldown: 0,
      onCast: { concerto: 5 },
      hits: [{ frame: 30, mv: 1.706, concerto: 1.51, resonance: 0.75 }],
    },
    3: {
      id: "Cosmos Rampage",
      name: "Cosmos Rampage",
      category: "skill",
      classifications: ["fusion", "skill"],
      frames: 30,
      cooldown: 4,
      onCast: { concerto: 10 },
      hits: [
        { frame: 15, mv: 0.3185, concerto: 2, resonance: 1.64 },
        { frame: 15, mv: 0.3185, concerto: 2, resonance: 1.64 },
        { frame: 20, mv: 0.3185, concerto: 2, resonance: 1.64 },
        { frame: 20, mv: 0.3185, concerto: 2, resonance: 1.64 },
      ],
    },
  },
  liberation: {
    1: {
      id: "Cosmos Rave",
      name: "Cosmos Rave",
      category: "liberation",
      classifications: ["fusion", "liberation"],
      frames: 0,
      freezetime: 0,
      cooldown: 16,
      onCast: { concerto: 20, resonance: -125 },
      hits: [],
    },
  },
  forte: {
    1: {
      id: "Cloudy Frenzy",
      name: "Cloudy Frenzy",
      category: "forte",
      classifications: ["fusion", "liberation"],
      frames: 202,
      hits: [{ frame: 180, mv: 1.68, concerto: 10, resonance: 10 }],
      variations: {
        swap: {
          frames: 15,
        },
      },
    },

    2: {
      id: "Cosmos Rupture",
      name: "Cosmos Rupture",
      category: "forte",
      classifications: ["fusion", "liberation"],
      frames: 202,
      hits: [
        { frame: 160, mv: 0.2335, concerto: 0, resonance: 0 },
        { frame: 160, mv: 0.2335, concerto: 0, resonance: 0 },
        { frame: 170, mv: 0.2335, concerto: 0, resonance: 0 },
        { frame: 170, mv: 0.2335, concerto: 0, resonance: 0 },
        { frame: 180, mv: 0.2335, concerto: 0, resonance: 0 },
        { frame: 180, mv: 0.2335, concerto: 0, resonance: 0 },
        { frame: 190, mv: 2.4908, concerto: 10, resonance: 10 }, // TODO: check if concerto is onCast
      ],
      variations: {
        swap: {
          frames: 15,
        },
      },
    },
  },
}

export default encore
