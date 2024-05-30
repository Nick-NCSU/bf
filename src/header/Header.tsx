import {
  PlayArrow,
  SkipNext,
  SkipPrevious,
  SettingsApplications,
  RestartAlt,
} from '@mui/icons-material';
import './styles.css';

interface HeaderProps {
  isStepBackwardEnabled: boolean;
  handleContinue: () => void;
  handleReset: () => void;
  handleStepForward: () => void;
  handleStepBackward: () => void;
  openSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isStepBackwardEnabled,
  handleReset,
  handleContinue,
  handleStepForward,
  handleStepBackward,
  openSettings,
}) => {
  return (
    <div className="header">
      <button onClick={handleReset}>
        <RestartAlt />
      </button>
      <button onClick={handleStepBackward} disabled={!isStepBackwardEnabled}>
        <SkipPrevious />
      </button>
      <button onClick={handleContinue}>
        <PlayArrow />
      </button>
      <button onClick={handleStepForward}>
        <SkipNext />
      </button>
      <button onClick={openSettings}>
        <SettingsApplications />
      </button>
    </div>
  );
};

export default Header;
