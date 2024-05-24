import { readFileSync } from 'fs';
import { BfEngine } from '../../src/engine/engine';
import { randomUUID } from 'crypto';
import { EofBehavior, MemoryBits } from '../../src/types';

type BfEngineParams = Partial<ConstructorParameters<typeof BfEngine>['0']>;
function createTestEngine(params: BfEngineParams) {
  return new BfEngine({
    instructions: '',
    breakpoint: '@',
    saveHistory: true,
    eofBehavior: EofBehavior.SetToZero,
    maxMemoryBits: MemoryBits.EightBit,
    stdin: '',
    ...params,
  });
}

function testEngine(params: BfEngineParams, output: string | number[]) {
  const engine = createTestEngine(params);
  engine.run();
  // check expected output
  if (typeof output === 'string') {
    expect(String.fromCharCode(...engine.getStdout())).toEqual(output);
  } else {
    expect(engine.getStdout()).toEqual(output);
  }

  const stepCount = engine.getStepCount();
  const stepBackCount = Math.floor(Math.random() * stepCount);
  for (let i = 0; i < stepBackCount; i++) {
    engine.stepBack();
  }
  for (let i = 0; i < stepBackCount; i++) {
    engine.step();
  }
  // check expected output remains the same
  if (typeof output === 'string') {
    expect(String.fromCharCode(...engine.getStdout())).toEqual(output);
  } else {
    expect(engine.getStdout()).toEqual(output);
  }
}

function loadTestFile(filename: string) {
  return readFileSync(`${__dirname}/files/${filename}.txt`, 'utf-8');
}

/**
 * Contains tests to ensure engine works.
 * 
 * Input/outputs from various sources will be used
 * to ensure engine implementation matches spec.
 */
describe('BfEngine', () => {
  test('should output nothing when no instructions are provided', () => {
    testEngine({}, '');
  });

  // https://esolangs.org/wiki/Brainfuck#Hello,_World!
  test('should output Hello World', () => {
    testEngine(
      {
        instructions: loadTestFile('hello_world'),
      },
      'Hello World!\n'
    );

    testEngine(
      {
        instructions: loadTestFile('hello_world2'),
      },
      'Hello, World!\n'
    );

    testEngine(
      {
        instructions: loadTestFile('hello_world3'),
      },
      'Hello World!\n'
    );

    testEngine(
      {
        instructions: loadTestFile('hello_world4'),
      },
      'Hello, World!'
    );

    testEngine(
      {
        instructions: loadTestFile('hello_world5'),
      },
      'Hello, World!'
    );
  });

  // https://esolangs.org/wiki/Brainfuck#Cat
  test('should output the stdin', () => {
    const randomString = randomUUID();
    testEngine(
      {
        instructions: loadTestFile('cat'),
        stdin: randomString,
      },
      randomString
    );
  });

  // https://www.codewars.com/kata/64bb48838e1e9535af90f303
  test('should replace text', () => {
    testEngine(
      {
        instructions: loadTestFile('replace'),
        stdin: 'e*Example String to show the letter e replaced with the symbol *',
      },
      'Exampl* String to show th* l*tt*r * r*plac*d with th* symbol *'
    );
  });

  // https://www.codewars.com/kata/5a74a62e17040b8a2d0000cb
  test('should calculate absolute value', () => {
    testEngine(
      {
        instructions: loadTestFile('absolute_value'),
        stdin: '0',
      },
      '0'
    );

    testEngine(
      {
        instructions: loadTestFile('absolute_value'),
        stdin: '-123',
      },
      '123'
    );

    testEngine(
      {
        instructions: loadTestFile('absolute_value'),
        stdin: '123',
      },
      '123'
    );
  });

    // https://www.codewars.com/kata/596f80b5f468ae8daa000013
    test('should print characters 0-255', () => {
      testEngine(
        {
          instructions: '.+[.+]',
        },
        Array.from(new Array(256)).map((_n, idx) => idx)
      );
    });

    // https://www.codewars.com/kata/59a96d71dbe3b06c0200009c
    test('should print a square', () => {
      for(let i = 1; i < 50; i++) {
        testEngine(
          {
            instructions: loadTestFile('square'),
            stdin: String.fromCharCode(i)
          },
          Array.from(new Array(i)).map(_n => '+'.repeat(i)).join('\n')
        );
      }
    });
});
