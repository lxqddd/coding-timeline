import { createPatch, applyPatch } from 'diff'

export class CodingTimeline {
  private newData: string = ''
  private undoPatchStack: string[] = []
  private redoPatchStack: string[] = []
  private undoProduct: string | null = null
  private redoProduct: string | null = null
  private point: number = 0

  /**
   * 撤销
   */
  undo(): string | boolean {
    if (this.undoPatchStack.length === 0) return false
    const lastUndoPatch = this.undoPatchStack.pop()!
    this.undoProduct = applyPatch(this.newData, lastUndoPatch)
    this.point = this.undoPatchStack.length - 1
    this.newData = this.undoProduct
    return this.undoProduct
  }

  /**
   * 撤销之前的撤销
   */
  redo(): string | boolean {
    if (this.redoPatchStack.length === 0 || !this.undoProduct) return false
    this.point += 1
    const redoPatch = this.redoPatchStack[this.point]
    if (!redoPatch) return false
    this.undoProduct = this.newData
    this.redoProduct = applyPatch(this.undoProduct, redoPatch)
    this.undoPatchStack.push(createPatch('diff', this.redoProduct, this.undoProduct))
    this.newData = this.redoProduct
    return this.redoProduct
  }

  /**
   * 每次再保存之前都要push一下，用来记录操作
   */
  push(newData: string) {
    this.undoPatchStack.push(createPatch('diff', newData, this.newData))
    this.redoPatchStack.push(createPatch('diff', this.newData, newData))
    this.newData = newData
    if (this.undoPatchStack.length > 100) {
      // 每当长度超过100的时候就删除栈底元素
      this.undoPatchStack.shift()
    }
  }

  /**
   * 当当前页面被关闭的时候调用，用来清楚保存的历史操作
   */
  clear() {
    this.newData = ''
    this.undoPatchStack = []
    this.redoPatchStack = []
    this.undoProduct = null
    this.redoProduct = null
  }
}

const codingTimeline = new CodingTimeline()
codingTimeline.push('aaaa')
codingTimeline.push('bbbb')
codingTimeline.push('cccc')
codingTimeline.push('dddd')

console.log('c', codingTimeline.undo()) // c
console.log('d', codingTimeline.redo()) // d
console.log('c', codingTimeline.undo()) // c
console.log('b', codingTimeline.undo()) // b
console.log('c', codingTimeline.redo()) // c
console.log('d', codingTimeline.redo()) // d
console.log('d', codingTimeline.redo()) // false
console.log('b', codingTimeline.undo()) // c
console.log('b', codingTimeline.undo()) // b
console.log('d', codingTimeline.redo()) // c
console.log('d', codingTimeline.redo()) // d
console.log('d', codingTimeline.redo()) // false
console.log('d', codingTimeline.redo()) // false
console.log('b', codingTimeline.undo()) // c
console.log('b', codingTimeline.undo()) // b
console.log('b', codingTimeline.undo()) // a
console.log('b', codingTimeline.undo()) // ''
console.log('b', codingTimeline.undo()) // false
console.log('b', codingTimeline.undo()) // false
console.log('b', codingTimeline.undo()) // false

