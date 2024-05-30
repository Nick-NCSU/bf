import {
  TextField,
  FormControl,
  TextareaAutosize,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
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
    <div className="full-screen-container">
      <div className="section input-section">
        <Typography variant="h6" gutterBottom>
          Input
        </Typography>
        <TextField
          label="Input"
          variant="outlined"
          fullWidth
          value={stdin}
          onChange={(e) => setState({ ...state, stdin: e.target.value })}
        />
      </div>

      <div className="section memory-visualizer-section">
        <Typography variant="h6" gutterBottom>
          Memory
        </Typography>
        <MemoryVisualizer state={state} setState={setState} />
      </div>

      <div className="section output-section">
        <Typography variant="h6" gutterBottom>
          Output
        </Typography>
        <FormControl fullWidth>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={10}>
              <TextareaAutosize
                id="output"
                placeholder="Output"
                value={formatText(output, outputFormat)}
                readOnly
                minRows={3}
                className="output-textarea"
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
                fullWidth
              >
                <MenuItem value={TextFormat.Ascii}>Ascii</MenuItem>
                <MenuItem value={TextFormat.Hexadecimal}>Hex</MenuItem>
                <MenuItem value={TextFormat.Decimal}>Decimal</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </FormControl>
      </div>
    </div>
  );
};

export default Controls;
