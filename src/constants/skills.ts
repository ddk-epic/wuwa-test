import type { CharacterSkills } from "./types"

const skillData: CharacterSkills = {
  encore: {
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
          cancel: {
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
          cancel: {
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
      },
      2: {
        id: "Cosmos Rupture",
        name: "Cosmos Rupture",
        category: "forte",
        classifications: ["fusion", "liberation"],
        frames: 202,
        hits: [
          { frame: 160, mv: 0.2335, concerto: 10, resonance: 10 },
          { frame: 160, mv: 0.2335, concerto: 10, resonance: 10 },
          { frame: 170, mv: 0.2335, concerto: 10, resonance: 10 },
          { frame: 170, mv: 0.2335, concerto: 10, resonance: 10 },
          { frame: 180, mv: 0.2335, concerto: 10, resonance: 10 },
          { frame: 180, mv: 0.2335, concerto: 10, resonance: 10 },
          { frame: 190, mv: 2.4908, concerto: 10, resonance: 10 },
        ],
      },
    },
  },
  sanhua: {
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
          cancel: {
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
  },
  shorekeeper: {
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
          { frame: 1, mv: 0.0988, concerto: 0, resonance: 3.34, scaling: "hp" },
          { frame: 2, mv: 0.0988, concerto: 0, resonance: 3.34, scaling: "hp" },
          { frame: 3, mv: 0.0988, concerto: 0, resonance: 3.34, scaling: "hp" },
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
          cancel: {
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
          cancel: {
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
          cancel: {
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
  },
}

export default skillData
