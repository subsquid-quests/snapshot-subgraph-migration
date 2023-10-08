type SetDelegate = {
  type: "setDelegate";
  id: string;
  delegator: Buffer;
  space: string;
  delegate: Buffer;
  timestamp: number;
};

type ClearDelegate = {
  type: "clearDelegate";
  id: string;
  timestamp: bigint;
};

type SignMsg = {
  type: "signMsg";
  id: any;
  account: Buffer;
  msgHash: string;
  timestamp: bigint;
};

export type EventType =
  | SetDelegate
  | ClearDelegate
  | SignMsg
  | undefined;