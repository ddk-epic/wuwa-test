import type { ActionItem } from "./types"

import skills from "./skills"

const actions: ActionItem[] = [
  {
    char: "Encore",
    skill: skills.encore.skill[1],
  },
  {
    char: "Sanhua",
    skill: skills.sanhua.intro[1],
  },
  {
    char: "Sanhua",
    skill: skills.sanhua.skill[1],
  },
  {
    char: "Sanhua",
    skill: skills.sanhua.liberation[1],
  },
  {
    char: "Sanhua",
    skill: skills.sanhua.forte[1],
  },
  {
    char: "Encore",
    skill: skills.encore.skill[2],
  },
  {
    char: "Sanhua",
    skill: skills.sanhua.basic[1],
  },
  {
    char: "Sanhua",
    skill: skills.sanhua.basic[2],
  },
  {
    char: "Sanhua",
    skill: skills.sanhua.outro[1],
  },
]

let time = 0

const actionList = actions.map((action) => {
  const res = { ...action, time };
  time += action.skill.frames;
  return res;
})

export default actionList
