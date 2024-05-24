import React from 'react';
import { MemoryBits, EofBehavior, Settings } from './types';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
}) => {
  if (!isOpen) return null;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="settings-dialog">
      <h2>Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            name="enableBreakpoints"
            checked={settings.enableBreakpoints}
            onChange={handleCheckboxChange}
          />
          Enable Breakpoints
        </label>
        {settings.enableBreakpoints && (
          <input
            type="text"
            name="breakpointChar"
            value={settings.breakpointChar}
            onChange={handleInputChange}
            placeholder="Breakpoint Character"
          />
        )}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="saveHistory"
            checked={settings.saveHistory}
            onChange={handleCheckboxChange}
          />
          Save History
        </label>
        <span>
          Disable this to improve performance, will disable the "Step Backward"
          functionality
        </span>
      </div>
      <div>
        Maximum number of bits:
        <label>
          <input
            type="radio"
            name="memoryBits"
            value={MemoryBits.EightBit}
            checked={+settings.memoryBits === MemoryBits.EightBit}
            onChange={handleInputChange}
          />
          8 Bit Memory
        </label>
        <label>
          <input
            type="radio"
            name="memoryBits"
            value={MemoryBits.ThirtyTwoBit}
            checked={+settings.memoryBits === MemoryBits.ThirtyTwoBit}
            onChange={handleInputChange}
          />
          32 Bit Memory
        </label>
      </div>
      <div>
        <label>
          EOF Behavior:
          <select
            name="eofBehavior"
            value={settings.eofBehavior}
            onChange={handleInputChange}
          >
            <option value={EofBehavior.SetToZero}>Set memory to 0</option>
            <option value={EofBehavior.LeaveUnchanged}>Leave unchanged</option>
            <option value={EofBehavior.SetToMinusOne}>Set memory to -1</option>
          </select>
        </label>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default SettingsDialog;
