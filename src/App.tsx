import { useEffect, useRef, useState } from 'react';
import { BfEngine } from './engine/engine';
import BfEditor from './monaco-editor/Editor';
import Controls from './controls/Controls';
import * as monaco from 'monaco-editor';
import { Allotment } from 'allotment';
import { FormProps, TextFormat } from './types';

function App() {
  const [controlsState, setControlsState] = useState<FormProps['state']>({
    stdin: '',
    memory: [],
    output: [],
    disableStepBack: true,
    memoryFormat: TextFormat.Decimal,
    outputFormat: TextFormat.Ascii
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
      outputFormat: controlsState.outputFormat
    });
  }
  
  const handleRun = () => {
    const newEngine = new BfEngine({ instructions: editorRef.current?.getValue()!, stdin: controlsState.stdin, debug: true, breakpoint: '@' });
    newEngine.run();
    engineRef.current = newEngine;
    updateValues();
  };
  
  const handleStepForward = () => {
    if(!engineRef.current) {
      engineRef.current = new BfEngine({ instructions: editorRef.current?.getValue()!, stdin: controlsState.stdin, debug: true, breakpoint: '@' });
    }
    engineRef.current.step();
    updateValues();
  };
  
  const handleStepBackward = () => {
    if(!engineRef.current) return;
    engineRef.current.stepBack();
    updateValues();
  };
  
  return (
    <div className="App" style={{ height: '100vh' }}>
      <Allotment>
        <div className="editor-container" style={{ height: '100%' }}>
          <BfEditor 
            editorRef={editorRef}
          />
        </div>
        <div className='controls-container'>
          <Controls
            handleRun={handleRun}
            handleStepForward={handleStepForward}
            handleStepBackward={handleStepBackward}
            state={controlsState}
            setState={setControlsState}
          />
        </div>
      </Allotment>
    </div>
  );
}

export default App;
