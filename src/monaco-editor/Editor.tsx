import React, { useRef, useEffect, RefObject } from 'react';
import * as monaco from 'monaco-editor';
import { setRef } from '@mui/material';

const BfEditor = (props: {
  editorRef?: RefObject<monaco.editor.IStandaloneCodeEditor>;
}) => {
  const [_editor, setEditor] = React.useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(editorRef.current) {
      setEditor((editor) => {
        if(editor) {
          return editor;
        }

        const newEditor = monaco.editor.create(editorRef.current!, {
          value: '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
          language: 'bf',
          theme: 'bf-theme',
          automaticLayout: true,
          minimap: {
            enabled: false,
          },
          wordWrap: 'on',
        });

        if(props.editorRef) {
          setRef(props.editorRef, newEditor);
        }

        return newEditor;
      });
    }
  }, [editorRef.current]);

  return (
    <div ref={editorRef} style={{ height: '50vh' }}></div>
  );
};

export default BfEditor;