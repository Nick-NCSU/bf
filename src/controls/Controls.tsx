import {
  TextField,
  FormControl,
  TextareaAutosize,
  Button,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { FormProps, TextFormat } from "../types";

const formatText = (text: number[], format?: TextFormat) => {
  switch (format) {
    case TextFormat.Ascii:
      return text.map((cell) => String.fromCharCode(cell)).join("");
    case TextFormat.Hexadecimal:
      return text.map((cell) => cell.toString(16)).join(" ");
    case TextFormat.Decimal:
      return text.join(" ");
  }
};

const Controls: React.FC<FormProps> = ({
  state: { disableStepBack, memory, output, stdin, memoryFormat, outputFormat },
  state,
  setState,
  handleRun,
  handleStepForward,
  handleStepBackward,
}) => {
  return (
    <form>
      <TextField
        label="Input"
        variant="outlined"
        fullWidth
        value={stdin}
        onChange={(e) => setState({ ...state, stdin: e.target.value })}
      />

      <FormControl fullWidth>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={10}>
            <TextareaAutosize
              id="memory"
              value={formatText(memory, memoryFormat)}
              readOnly
              minRows={3}
              maxRows={5}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              value={memoryFormat}
              onChange={(e) =>
                setState({
                  ...state,
                  memoryFormat: e.target.value as TextFormat,
                })
              }
              style={{ width: "100%" }}
            >
              <MenuItem value={TextFormat.Ascii}>Ascii</MenuItem>
              <MenuItem value={TextFormat.Hexadecimal}>Hex</MenuItem>
              <MenuItem value={TextFormat.Decimal}>Decimal</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </FormControl>

      <FormControl fullWidth>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={10}>
            <TextareaAutosize
              id="output"
              value={formatText(output, outputFormat)}
              readOnly
              minRows={3}
              maxRows={5}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={2}>
            <Select
              value={outputFormat}
              onChange={(e) =>
                setState({
                  ...state,
                  outputFormat: e.target.value as TextFormat,
                })
              }
              style={{ width: "100%" }}
            >
              <MenuItem value={TextFormat.Ascii}>Ascii</MenuItem>
              <MenuItem value={TextFormat.Hexadecimal}>Hex</MenuItem>
              <MenuItem value={TextFormat.Decimal}>Decimal</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </FormControl>

      <div className="button-container">
        <Button
          variant="contained"
          onClick={handleStepBackward}
          disabled={disableStepBack}
        >
          Step Backward
        </Button>
        <Button variant="contained" onClick={handleStepForward}>
          Step Forward
        </Button>
        <Button variant="contained" onClick={handleRun}>
          Run
        </Button>
      </div>
    </form>
  );
};

export default Controls;
