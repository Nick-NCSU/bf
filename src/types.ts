export interface ControlsProps {
  state: {
    stdin: string;
    memory: number[];
    output: number[];
    disableStepBack: boolean;
    selectedMemoryIdx: number;
    memoryFormat: TextFormat;
    outputFormat: TextFormat;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      stdin: string;
      memory: number[];
      output: number[];
      disableStepBack: boolean;
      selectedMemoryIdx: number;
      memoryFormat: TextFormat;
      outputFormat: TextFormat;
    }>
  >;
}

export enum TextFormat {
  Ascii,
  Hexadecimal,
  Decimal,
}

export enum MemoryBits {
  EightBit = 8,
  ThirtyTwoBit = 32,
}

export enum EofBehavior {
  SetToZero = 0,
  LeaveUnchanged = 1,
  SetToMinusOne = -1,
}

export interface Settings {
  enableBreakpoints: boolean;
  breakpointChar: string;
  saveHistory: boolean;
  memoryBits: MemoryBits;
  eofBehavior: EofBehavior;
}
