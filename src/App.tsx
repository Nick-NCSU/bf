import { useEffect, useRef, useState } from 'react';
import { BfEngine } from './engine/engine';
import BfEditor from './monaco-editor/Editor';
import Controls from './controls/Controls';
import * as monaco from 'monaco-editor';
import { Allotment } from 'allotment';
import {
  ControlsProps,
  TextFormat,
  MemoryBits,
  EofBehavior,
  Settings,
} from './types';
import Header from './header/Header';
import SettingsDialog from './settings/Settings';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-1E2WKQ764W');

function App() {
  const [controlsState, setControlsState] = useState<ControlsProps['state']>({
    stdin: '',
    memory: [],
    output: [],
    disableStepBack: true,
    selectedMemoryIdx: 0,
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
  const [currentDecorations, setCurrentDecorations] = useState<
    monaco.editor.IEditorDecorationsCollection | undefined
  >();
  const [hasChangedSinceLastRun, setHasChangedSinceLastRun] =
    useState<boolean>(false);
  const onDidChangeContent = () => setHasChangedSinceLastRun(true);

  useEffect(() => {
    if (engineRef.current) {
      updateValues();
    }
  }, [engineRef.current]);

  const setNewEngine = () => {
    return (engineRef.current = new BfEngine({
      instructions: editorRef.current?.getValue()!,
      stdin: controlsState.stdin,
      saveHistory: settings.saveHistory,
      breakpoint: settings.enableBreakpoints ? settings.breakpointChar : '',
      eofBehavior: settings.eofBehavior,
      maxMemoryBits: settings.memoryBits,
    }));
  };

  const updateValues = () => {
    setHasChangedSinceLastRun(false);
    setControlsState({
      ...controlsState,
      memory: engineRef.current?.getMemory() ?? [],
      output: engineRef.current?.getStdout() ?? [],
      disableStepBack: !engineRef.current?.getStepCount(),
      selectedMemoryIdx: engineRef.current?.getAddressPointer() ?? 0,
    });

    if (!engineRef.current) {
      return;
    }

    const model = editorRef.current?.getModel()!;
    const pos = model.getPositionAt(engineRef.current!.getProgramCounter());
    currentDecorations?.clear();
    setCurrentDecorations(
      editorRef.current?.createDecorationsCollection([
        {
          range: new monaco.Range(
            pos.lineNumber,
            pos.column - 1,
            pos.lineNumber,
            pos.column
          ),
          options: {
            isWholeLine: false,
            inlineClassName: 'highlight',
          },
        },
      ])
    );
  };

  const handleReset = () => {
    setNewEngine().run();
    updateValues();
  };

  const handleContinue = () => {
    if (!engineRef.current || hasChangedSinceLastRun) {
      setNewEngine();
    }
    engineRef.current!.run();
    updateValues();
  };

  const handleStepForward = () => {
    if (!engineRef.current || hasChangedSinceLastRun) {
      setNewEngine();
    }
    engineRef.current!.step();
    updateValues();
  };

  const handleStepBackward = () => {
    if (!engineRef.current) return;
    engineRef.current.stepBack();
    updateValues();
  };

  return (
    <div className="App" style={{ height: '95vh' }}>
      <Allotment>
        <div className="editor-container">
          <BfEditor
            editorRef={editorRef}
            onDidChangeContent={onDidChangeContent}
          />
        </div>
        <div className="controls-container">
          <Header
            isStepBackwardDisabled={
              !settings.saveHistory ||
              controlsState.disableStepBack ||
              hasChangedSinceLastRun
            }
            handleReset={handleReset}
            handleContinue={handleContinue}
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
