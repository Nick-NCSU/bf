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
      <Grid container direction="column" spacing={2} style={{ height: '100%' }}>
        <Grid item>
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
        </Grid>

        <Grid item>
          <Typography variant="h6" gutterBottom>
            Memory
          </Typography>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <MemoryVisualizer state={state} setState={setState} />
          </div>
        </Grid>

        <Grid item xs>
          <Typography variant="h6" gutterBottom>
            Output
          </Typography>
          <FormControl fullWidth style={{ height: '100%' }}>
            <Grid
              container
              direction="column"
              spacing={2}
              style={{ height: '100%' }}
            >
              <Grid item>
                <Select
                  value={outputFormat}
                  onChange={(e) =>
                    setState({
                      ...state,
                      outputFormat: e.target.value as TextFormat,
                    })
                  }
                  size="small"
                >
                  <MenuItem value={TextFormat.Ascii}>Ascii</MenuItem>
                  <MenuItem value={TextFormat.Hexadecimal}>Hex</MenuItem>
                  <MenuItem value={TextFormat.Decimal}>Decimal</MenuItem>
                </Select>
              </Grid>
              <Grid item xs style={{ minHeight: 0 }}>
                <TextareaAutosize
                  id="output"
                  placeholder="Output"
                  value={formatText(output, outputFormat)}
                  readOnly
                  style={{
                    width: '100%',
                    height: '100%',
                    resize: 'none',
                    overflow: 'auto',
                  }}
                  className="output-textarea"
                />
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default Controls;
