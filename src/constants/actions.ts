import skills from "./skills"
import type { ActionItem } from "./types"

const actions: ActionItem[] = [
  {
    char: "Sanhua",
    action: skills.sanhua.intro[1],
  },
  {
    char: "Sanhua",
    action: skills.sanhua.skill[1],
  },
  {
    char: "Sanhua",
    action: skills.sanhua.liberation[1],
  },
  {
    char: "Sanhua",
    action: skills.sanhua.basic[1],
  },
  {
    char: "Sanhua",
    action: skills.sanhua.basic[2],
  },
  {
    char: "Sanhua",
    action: skills.sanhua.basic[3],
  },
  {
    char: "Sanhua",
    action: skills.sanhua.basic[4],
  },
  {
    char: "Sanhua",
    action: skills.sanhua.outro[1],
  },
]

let time = 0

const actionList = actions.map((item) => {
  const res = { ...item, time };
  time += item.action.frames;
  return res;
})

export default actionList
