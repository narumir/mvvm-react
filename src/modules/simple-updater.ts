import {
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export class SimpleUpdater {
  private state = 1;
  private dispatcher: Dispatch<SetStateAction<number>>;
  use = () => {
    this.dispatcher = useState(this.state)[1];
  };
  flush = () => {
    this.dispatcher(this.state *= -1);
  };
}
