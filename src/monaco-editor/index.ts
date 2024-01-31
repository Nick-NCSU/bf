import { editor, languages } from "monaco-editor";

editor.setTheme('vs-dark');

languages.register({ id: 'bf' });

languages.setMonarchTokensProvider('bf', {
  defaultToken: 'comment',
  brackets: [
    { open: '[', close: ']', token: 'brackets' }
  ],
  tokenizer: {
    root: [
      [/[+-]/, 'operators'],
      [/[\[\]]/, 'brackets'],
      [/[<>]/, 'pointers'],
      [/[,]/, 'input'],
      [/[.]/, 'output'],
    ],
  },
});

editor.defineTheme('bf-theme', {
  base: 'vs-dark',
  inherit: true,
  colors: {
    'editor.foreground': '#A9B7C6',
    'editor.background': '#1E1E1E',
    'editorLineNumber.foreground': '#495162',
    'editorCursor.foreground': '#A9B7C6',
    'editor.selectionBackground': '#41505E',
    'editor.inactiveSelectionBackground': '#3A4451',
    'editorWhitespace.foreground': '#3A3A3A',
  },
  rules: [
    { token: 'comment', foreground: '6471a3' },
    { token: 'operators', foreground: 'b36692' },
    { token: 'brackets', foreground: 'f5c9fb' },
    { token: 'pointers', foreground: 'd1c99f' },
    { token: 'input', foreground: 'bb864a' },
    { token: 'output', foreground: 'ca5557' },
  ],
});
// ####