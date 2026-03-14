import type { CharacterSkills } from "./types"

const skillData: CharacterSkills = {
  encore: {
    intro: {
      1: {
        name: "Woolies Can Help!",
        category: "intro",
        classifications: ["fusion", "intro"],
        frames: 92,
        onCast: {
          concerto: 10,
        },
        hits: [{ frame: 60, mv: 1, concerto: 10, resonance: 10 }],
      },
    },
    outro: {
      1: {
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
        name: "Woolies Attack 1",
        category: "basic",
        classifications: ["fusion", "basic"],
        frames: 30,
        hits: [{ frame: 20, mv: 0.28, concerto: 1.4, resonance: 0.7 }],
      },
      2: {
        name: "Woolies Attack 2",
        category: "basic",
        classifications: ["fusion", "basic"],
        frames: 30,
        hits: [{ frame: 20, mv: 0.333, concerto: 1.66, resonance: 0.83 }],
      },
      3: {
        name: "Woolies Attack 3",
        category: "basic",
        classifications: ["fusion", "basic"],
        frames: 30,
        hits: [
          { frame: 18, mv: 0.3335, concerto: 1.66, resonance: 0.83 },
          { frame: 20, mv: 0.3335, concerto: 1.66, resonance: 0.83 },
        ],
      },
      4: {
        name: "Woolies Attack 4",
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
        name: "Woolies Attack 5",
        category: "basic",
        classifications: ["fusion", "basic"],
        frames: 90,
        hits: [{ frame: 1, mv: 1.2, concerto: 6, resonance: 3 }],
      },
      6: {
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
        name: "Flaming Woolies",
        category: "skill",
        classifications: ["fusion", "skill"],
        frames: 108,
        cooldown: 10,
        onCast: {
          concerto: 15,
        },
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
        name: "Energetic Welcome",
        category: "skill",
        classifications: ["fusion", "skill"],
        frames: 60,
        cooldown: 0,
        onCast: {
          concerto: 5,
        },
        hits: [{ frame: 30, mv: 1.706, concerto: 6.51, resonance: 0.75 }],
      },
      3: {
        name: "Cosmos Rampage",
        category: "skill",
        classifications: ["fusion", "skill"],
        frames: 30,
        cooldown: 4,
        onCast: {
          concerto: 10,
        },
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
        name: "Cloudy Frenzy",
        category: "forte",
        classifications: ["fusion", "liberation"],
        frames: 202,
        hits: [{ frame: 180, mv: 1.68, concerto: 10, resonance: 10 }],
      },
      2: {
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
        name: "Freezing Thorns",
        category: "intro",
        classifications: ["glacio", "intro"],
        frames: 60,
        onCast: {
          concerto: 10,
        },
        hits: [{ frame: 1, mv: 0.7, resonance: 10 }],
      },
    },
    outro: {
      1: {
        name: "Silversnow",
        category: "outro",
        classifications: ["glacio", "outro"],
        frames: 0,
        hits: [],
      },
    },
    basic: {
      1: {
        name: "Frigid Light 1",
        category: "basic",
        classifications: ["glacio", "basic"],
        frames: 21,
        hits: [{ frame: 10, mv: 0.371, concerto: 2, resonance: 0.87 }],
      },
      2: {
        name: "Frigid Light 2",
        category: "basic",
        classifications: ["glacio", "basic"],
        frames: 32,
        hits: [{ frame: 20, mv: 0.245, concerto: 4, resonance: 1.32 }],
      },
      3: {
        name: "Frigid Light 3",
        category: "basic",
        classifications: ["glacio", "basic"],
        frames: 42,
        hits: [{ frame: 20, mv: 0.434, concerto: 8, resonance: 1.52 }],
      },
      4: {
        name: "Frigid Light 4",
        category: "basic",
        classifications: ["glacio", "basic"],
        frames: 34,
        hits: [
          { frame: 10, mv: 0.2, concerto: 8, resonance: 1.42 },
          { frame: 20, mv: 0.2, concerto: 8, resonance: 1.42 },
        ],
      },
      5: {
        name: "Frigid Light 5",
        category: "basic",
        classifications: ["glacio", "basic"],
        frames: 108,
        hits: [{ frame: 1, mv: 1.176, concerto: 10, resonance: 4.2 }],
      },
    },
    heavy: {
      1: {
        name: "Frigid Light",
        category: "heavy",
        classifications: ["glacio", "heavy"],
        frames: 60,
        hits: [{ frame: 1, mv: 0.56, concerto: 8, resonance: 2 }],
      },
    },
    skill: {
      1: {
        name: "Eternal Frost",
        category: "skill",
        classifications: ["glacio", "skill"],
        frames: 65,
        cooldown: 10,
        onCast: {
          concerto: 15,
        },
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
        name: "Glacial Gaze",
        category: "liberation",
        classifications: ["glacio", "liberation"],
        frames: 94,
        freezetime: 84,
        cooldown: 10,
        onCast: {
          concerto: 20,
        },
        hits: [{ frame: 1, mv: 4.0716 }],
      },
    },
    forte: {
      1: {
        name: "Detonate",
        category: "forte",
        classifications: ["glacio", "skill"],
        frames: 92,
        hits: [{ frame: 1, mv: 1.874, concerto: 15 + 2, resonance: 0.87 }],
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
        name: "Enlightenment",
        category: "intro",
        classifications: ["spectro", "skill"],
        frames: 0,
        hits: [
          { frame: 1, mv: 0.2279, concerto: 0, resonance: 0 },
          { frame: 2, mv: 0.2279, concerto: 0, resonance: 0 },
          { frame: 3, mv: 0.2279, concerto: 0, resonance: 0 },
          { frame: 4, mv: 0.2279, concerto: 0, resonance: 0 },
          { frame: 5, mv: 0.2279, concerto: 0, resonance: 0 },
        ],
      },
      2: {
        name: "Discernment",
        category: "intro",
        classifications: ["spectro", "liberation"],
        frames: 0,
        hits: [
          { frame: 1, mv: 0.0988, concerto: 0, resonance: 0 },
          { frame: 2, mv: 0.0988, concerto: 0, resonance: 0 },
          { frame: 3, mv: 0.0988, concerto: 0, resonance: 0 },
        ],
      },
    },
    outro: {
      1: {
        name: "Binary Butterfly",
        category: "outro",
        classifications: ["spectro", "outro"],
        frames: 0,
        hits: [], // no hits
      },
    },
    basic: {
      1: {
        name: "Origin Calculus 1",
        category: "basic",
        classifications: ["spectro", "basic"],
        frames: 0,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
      2: {
        name: "Origin Calculus 2",
        category: "basic",
        classifications: ["spectro", "basic"],
        frames: 0,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
      3: {
        name: "Origin Calculus 3",
        category: "basic",
        classifications: ["spectro", "basic"],
        frames: 0,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
      4: {
        name: "Origin Calculus 4",
        category: "basic",
        classifications: ["spectro", "basic"],
        frames: 0,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
    },
    heavy: {
      1: null,
    },
    skill: {
      1: {
        name: "Chaos Theory",
        category: "skill",
        classifications: ["spectro", "skill"],
        frames: 0,
        cooldown: 16,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
    },

    liberation: {
      1: {
        name: "End Loop",
        category: "liberation",
        classifications: ["spectro", "liberation"],
        frames: 0,
        freezetime: 0,
        cooldown: 25,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
    },
    forte: {
      1: {
        name: "Illation",
        category: "forte",
        classifications: ["spectro", "heavy"],
        frames: 0,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
      2: {
        name: "Transmutation",
        category: "forte",
        classifications: ["spectro", "basic"],
        frames: 0,
        hits: [{ frame: 1, mv: 0, concerto: 0, resonance: 0 }],
      },
    },
  },
}

export default skillData
