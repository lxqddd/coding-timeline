// export class CodingTimeline {
//   private historyList: any[] = []
//   private pointer: number = 0

//   undo() {
//     if (this.pointer >= 1) {
//       this.pointer -= 1
//       return this.historyList[this.pointer]
//     }
//     return this.historyList[0]
//   }

//   redo() {
//     if (this.pointer <= this.historyList.length - 2) {
//       this.pointer += 1
//       return this.historyList[this.pointer]
//     }
//     return this.historyList[this.historyList.length - 1]
//   }

//   push(data: any) {
//     this.historyList.push(data)
//     this.pointer += 1
//   }
// }

import { applyPatch, createPatch, diffChars, diffJson, parsePatch } from 'diff'

// const obj1 = {
//   name: 'xy',
//   age: 18
// }
// const obj2 = {
//   name: 'ys',
//   age: 18
// }

// const ret = diffJson(obj1, obj2)

// const filter = ret.filter(item => (item.removed !== undefined || item.added === true || item.added === undefined))
// console.log(filter)


const str1 = 'hello world'
const str2 = 'nihao world'

const patches = ['nihao', 'world']



let ret = ''
for (let patch of patches) {
  ret = applyPatch(ret, patch)
}

console.log(ret)