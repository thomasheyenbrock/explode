import { ExplodeProps, FunctionComponent } from "./types";

export class ExplodeElement {
  type: string | FunctionComponent;
  props: ExplodeProps;
  key?: string | number;

  constructor(
    type: string | FunctionComponent,
    props: ExplodeProps,
    key: string | number | null
  ) {
    this.type = type;
    this.props = props;
    if (key !== null) {
      this.key = key;
    }
  }
}
