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
import { useState, useEffect, useRef } from 'react';
import { ControlsProps, TextFormat } from '../types';
import { formatText } from './utils';
import MemoryVisualizer from './Memory';
import './styles.css';

const Controls: React.FC<ControlsProps> = ({
  state: { output, stdin, outputFormat },
  state,
  setState,
}) => {
  const [textareaHeight, setTextareaHeight] = useState('100px');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      setTextareaHeight(`${Math.min(scrollHeight + 5, 300)}px`);
    }
  }, [output, outputFormat]);

  return (
    <div className="full-screen-container scrollable">
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
        <div style={{ maxHeight: '12.5rem', overflowY: 'auto' }}>
          <MemoryVisualizer state={state} setState={setState} />
        </div>
      </div>
      <div className="section output-section">
        <Typography variant="h6" gutterBottom>
          Output
        </Typography>
        <FormControl fullWidth>
          <Grid container direction="column" spacing={2}>
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
            <Grid item>
              <Box sx={{ marginBottom: '4rem' }}>
                <textarea
                  ref={textareaRef}
                  id="output"
                  placeholder="Output"
                  value={formatText(output, outputFormat)}
                  readOnly
                  style={{
                    width: '100%',
                    height: textareaHeight,
                    resize: 'none',
                    overflow: 'auto',
                  }}
                  className="output-textarea"
                />
              </Box>
            </Grid>
          </Grid>
        </FormControl>
      </div>
    </div>
  );
};

export default Controls;
