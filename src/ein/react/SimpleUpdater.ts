import {
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export class SimpleUpdater {
  private updateCount: number = 1;
  private updateState: Dispatch<SetStateAction<number>>;
  flush = () => this.updateState(this.updateCount *= -1);
  use = () => this.updateState = useState(this.updateCount)[1];
}
