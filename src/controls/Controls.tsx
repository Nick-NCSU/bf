import {
  TextField,
  FormControl,
  TextareaAutosize,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { ControlsProps, TextFormat } from '../types';
import { formatText } from './utils';
import MemoryVisualizer from './Memory';
import './styles.css';

const Controls: React.FC<ControlsProps> = ({
  state: { output, stdin, outputFormat },
  state,
  setState,
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

      <MemoryVisualizer
        setState={setState}
        state={state}
      />

      <FormControl fullWidth>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={10}>
            <TextareaAutosize
              id="output"
              placeholder='Output'
              value={formatText(output, outputFormat)}
              readOnly
              minRows={3}
              style={{ width: '100%' }}
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
              style={{ width: '100%' }}
            >
              <MenuItem value={TextFormat.Ascii}>Ascii</MenuItem>
              <MenuItem value={TextFormat.Hexadecimal}>Hex</MenuItem>
              <MenuItem value={TextFormat.Decimal}>Decimal</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </FormControl>
    </form>
  );
};

export default Controls;
