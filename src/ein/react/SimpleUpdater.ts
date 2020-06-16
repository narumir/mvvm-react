import { useState } from "react";

export class SimpleUpdater {
  private simpleUpdateCount = 1;
  private simpleUpdateState: any;
  flush = () => this.simpleUpdateState(this.simpleUpdateCount *= -1);
  use = () => this.simpleUpdateState = useState(this.simpleUpdateCount)[1];
}