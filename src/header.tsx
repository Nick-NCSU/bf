import {
  PlayArrow,
  SkipNext,
  SkipPrevious,
  SettingsApplications,
} from '@mui/icons-material';

interface HeaderProps {
  isStepBackwardEnabled: boolean;
  handleRun: () => void;
  handleStepForward: () => void;
  handleStepBackward: () => void;
  openSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isStepBackwardEnabled,
  handleRun,
  handleStepForward,
  handleStepBackward,
  openSettings,
}) => {
  return (
    <div className="header">
      <button onClick={handleStepBackward} disabled={!isStepBackwardEnabled}>
        <SkipPrevious />
      </button>
      <button onClick={handleRun}>
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
