import { TextFormat } from '../types';

export const formatText = (text: number[], format?: TextFormat) => {
  switch (format) {
    case TextFormat.Ascii:
      return text.map((cell) => String.fromCharCode(cell)).join('');
    case TextFormat.Hexadecimal:
      return text.map((cell) => cell.toString(16)).join(' ');
    case TextFormat.Decimal:
      return text.join(' ');
  }
};
