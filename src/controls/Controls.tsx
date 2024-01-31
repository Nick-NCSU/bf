import {
  TextField,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Button,
} from "@mui/material";

interface FormProps {
  stdin: string;
  setStdin: React.Dispatch<React.SetStateAction<string>>;
  memory: string[];
  setMemory: React.Dispatch<React.SetStateAction<string[]>>;
  output: string;
  setOutput: React.Dispatch<React.SetStateAction<string>>;

  disableStepBack: boolean;

  handleRun: () => void;
  handleStepForward: () => void;
  handleStepBackward: () => void;
}

const Controls: React.FC<FormProps> = ({ stdin, setStdin, memory, output, disableStepBack, handleRun, handleStepForward, handleStepBackward }) => {
  return (
    <form>
      <TextField
        label="Input"
        variant="outlined"
        fullWidth
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
      />

      <FormControl fullWidth>
        <InputLabel htmlFor="memory">Memory</InputLabel>
        <TextareaAutosize
          id="memory"
          value={memory.join(" ")}
          readOnly
          minRows={3}
          maxRows={5}
        />
      </FormControl>

      <div className="button-container">
        <Button variant="contained" onClick={handleStepBackward} disabled={disableStepBack}>
          Step Backward
        </Button>
        <Button variant="contained" onClick={handleStepForward}>
          Step Forward
        </Button>
        <Button variant="contained" onClick={handleRun}>
          Run
        </Button>
      </div>

      <FormControl fullWidth>
        <InputLabel htmlFor="output">Output</InputLabel>
        <TextareaAutosize
          id="output"
          value={output}
          readOnly
          minRows={3}
          maxRows={5}
        />
      </FormControl>
    </form>
  );
}

export default Controls;
