import { setState, StateSetter, useStateSetter } from "./StateSetter";

export class ViewModel implements StateSetter {
  static EMPTY = new ViewModel();
  private static factory = () => new ViewModel();
  static use = () => useStateSetter(ViewModel.factory);
  stateSetter: any;
  private map?: Map<string, any>;
  private updatedCount = 0;
  constructor(block?: ((vm: ViewModel) => void) | ViewModel) {
    if (!block) return;
    else if (block instanceof ViewModel) {
      this.updatedCount = block.updatedCount + 1;
      if (block.map) this.map = new Map(block.map);
    } else block(this);
  }
  get(k: string, def: any = ""): any { return this.map?.get(k) ?? def; }
  set(k: string, v: any) {
    if (!this.map) this.map = new Map<string, any>();
    this.map?.set(k, v);
  }
  flush() { setState(this, new ViewModel(this)); }
}
