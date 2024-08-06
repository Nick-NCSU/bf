import {
  FormControl,
  Grid,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { ControlsProps, TextFormat } from '../types';
import { formatText } from './utils';

const MemoryVisualizer: React.FC<ControlsProps> = ({
  state: { memory, selectedMemoryIdx, memoryFormat },
  setState,
}) => {
  return (
    <FormControl fullWidth>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Select
            value={memoryFormat}
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                memoryFormat: e.target.value as TextFormat,
              }))
            }
            size="small"
          >
            <MenuItem value={TextFormat.Ascii}>Ascii</MenuItem>
            <MenuItem value={TextFormat.Hexadecimal}>Hex</MenuItem>
            <MenuItem value={TextFormat.Decimal}>Decimal</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Grid container className="memory-grid-container" spacing={0}>
            {memory.map((value, index) => (
              <Grid item key={index} className="memory-grid-item">
                <Box
                  className={`memory-box ${index === selectedMemoryIdx ? 'selected' : ''}`}
                >
                  <Typography className="memory-index" variant="body2">
                    {index}
                  </Typography>
                  <Typography className="memory-value" variant="body2">
                    {formatText([value], memoryFormat)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default MemoryVisualizer;
