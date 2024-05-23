import { useEffect, useRef, useState } from 'react';
import { BfEngine } from './engine/engine';
import BfEditor from './monaco-editor/Editor';
import Controls from './controls/Controls';
import * as monaco from 'monaco-editor';
import { Allotment } from 'allotment';
import {
  FormProps,
  TextFormat,
  MemoryBits,
  EofBehavior,
  Settings,
} from './types';
import Header from './header';
import SettingsDialog from './settings';

function App() {
  const [controlsState, setControlsState] = useState<FormProps['state']>({
    stdin: '',
    memory: [],
    output: [],
    disableStepBack: true,
    memoryFormat: TextFormat.Decimal,
    outputFormat: TextFormat.Ascii,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    enableBreakpoints: true,
    breakpointChar: '@',
    saveHistory: true,
    memoryBits: MemoryBits.EightBit,
    eofBehavior: EofBehavior.SetToZero,
  });

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const engineRef = useRef<BfEngine | null>(null);

  useEffect(() => {
    if (engineRef.current) {
      updateValues();
    }
  }, [engineRef.current]);

  const updateValues = () => {
    setControlsState({
      stdin: controlsState.stdin,
      memory: engineRef.current!.getMemory(),
      output: engineRef.current!.getStdout(),
      disableStepBack: !engineRef.current!.getStepCount(),
      memoryFormat: controlsState.memoryFormat,
      outputFormat: controlsState.outputFormat,
    });
  };

  const handleRun = () => {
    const newEngine = new BfEngine({
      instructions: editorRef.current?.getValue()!,
      stdin: controlsState.stdin,
      saveHistory: settings.saveHistory,
      breakpoint: settings.enableBreakpoints ? settings.breakpointChar : '',
      eofBehavior: settings.eofBehavior,
      maxMemoryBits: settings.memoryBits,
    });
    newEngine.run();
    engineRef.current = newEngine;
    updateValues();
  };

  const handleStepForward = () => {
    if (!engineRef.current) {
      engineRef.current = new BfEngine({
        instructions: editorRef.current?.getValue()!,
        stdin: controlsState.stdin,
        saveHistory: settings.saveHistory,
        breakpoint: settings.enableBreakpoints ? settings.breakpointChar : '',
        eofBehavior: settings.eofBehavior,
        maxMemoryBits: settings.memoryBits,
      });
    }
    engineRef.current.step();
    updateValues();
  };

  const handleStepBackward = () => {
    if (!engineRef.current) return;
    engineRef.current.stepBack();
    updateValues();
  };

  return (
    <div className="App" style={{ height: '100vh' }}>
      <Allotment>
        <div className="editor-container" style={{ height: '100%' }}>
          <BfEditor editorRef={editorRef} />
        </div>
        <div className="controls-container">
          <Header
            isStepBackwardEnabled={settings.saveHistory}
            handleRun={handleRun}
            handleStepForward={handleStepForward}
            handleStepBackward={handleStepBackward}
            openSettings={() => setIsSettingsOpen(true)}
          />
          <Controls state={controlsState} setState={setControlsState} />
          <SettingsDialog
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            setSettings={setSettings}
          />
        </div>
      </Allotment>
    </div>
  );
}

export default App;
