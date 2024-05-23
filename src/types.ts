export interface FormProps {
  state: {
    stdin: string;
    memory: number[];
    output: number[];
    disableStepBack: boolean;
    memoryFormat: TextFormat;
    outputFormat: TextFormat;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      stdin: string;
      memory: number[];
      output: number[];
      disableStepBack: boolean;
      memoryFormat: TextFormat;
      outputFormat: TextFormat;
    }>
  >;

  handleRun: () => void;
  handleStepForward: () => void;
  handleStepBackward: () => void;
}

export enum TextFormat {
  Ascii,
  Hexadecimal,
  Decimal,
}