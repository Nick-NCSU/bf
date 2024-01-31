import { useEffect, useRef, useState } from 'react';
import { BfEngine } from './engine/engine';
import BfEditor from './monaco-editor/Editor';
import Controls from './controls/Controls';
import * as monaco from 'monaco-editor';

function App() {
  const [stdin, setStdin] = useState('');
  const [memory, setMemory] = useState<string[]>([]);
  const [output, setOutput] = useState('');
  const [disableStepBack, setDisableStepBack] = useState(true);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const engineRef = useRef<BfEngine | null>(null);


  useEffect(() => {
    if (engineRef.current) {
      updateValues();
    }
  }, [engineRef.current]);
  
  const updateValues = () => {
    setMemory(engineRef.current!.getMemory().map(String));
    setOutput(engineRef.current!.getStdout().map((n) => String.fromCharCode(n)).join(''));
    setDisableStepBack(!engineRef.current!.getStepCount());
  }
  
  const handleRun = () => {
    const newEngine = new BfEngine({ instructions: editorRef.current?.getValue()!, stdin, debug: true, breakpoint: '@' });
    newEngine.run();
    engineRef.current = newEngine;
    updateValues();
  };
  
  const handleStepForward = () => {
    if(!engineRef.current) {
      engineRef.current = new BfEngine({ instructions: editorRef.current?.getValue()!, stdin, debug: true, breakpoint: '@' });
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
    <div className="App">
      <div className="editor-container">
        <BfEditor 
          editorRef={editorRef}
        />
      </div>
      <div className='controls-container'>
        <Controls
          handleRun={handleRun}
          handleStepForward={handleStepForward}
          handleStepBackward={handleStepBackward}
          stdin={stdin}
          setStdin={setStdin}
          memory={memory}
          setMemory={setMemory}
          output={output}
          setOutput={setOutput}
          disableStepBack={disableStepBack}
        />
      </div>
    </div>
  );
}

export default App;
