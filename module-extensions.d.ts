import { Fiber } from "./src/types";

declare interface HTMLElement {
  __explode__root__?: Fiber;
}
