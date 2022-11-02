import { createPatch, applyPatch } from 'diff'

export class CodingTimeline {
  private historyList: string[] = []
  private redoStack: string[] = []
  private newData: string = ''
  private redoValueStack: string[] = []

  /**
   * 撤销
   */
  undo(): string | boolean {
    if (this.historyList.length === 0) return false
    const lastHistory = this.historyList.pop()!
    this.redoStack.push(lastHistory)
    this.redoValueStack.push(this.newData)
    const prevVersion = applyPatch(this.newData, lastHistory)
    this.newData = prevVersion
    return this.newData
  }

  /**
   * 撤销之前的撤销
   */
  redo(): string | boolean {
    if (this.redoStack.length === 0) return false
    this.newData = this.redoValueStack.pop()!
    this.historyList.push(this.redoStack.pop()!)
    return this.newData
  }

  /**
   * 每次再保存之前都要push一下，用来记录操作
   */
  push(newData: string) {
    const undoPatch = createPatch('diff', newData, this.newData)
    this.newData = newData
    this.historyList.push(undoPatch)
  }

  /**
   * 当当前页面被关闭的时候调用，用来清楚保存的历史操作
   */
  clear() {
    this.historyList = []
    this.newData = ''
    this.redoStack = []
    this.redoValueStack = []
  }
}
