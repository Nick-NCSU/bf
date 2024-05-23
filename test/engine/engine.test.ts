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

describe('BfEngine should output', () => {
  test('nothing when no instructions are provided', () => {
    testEngine({}, '');
  });

  // Example programs from https://esolangs.org/wiki/Brainfuck
  test('Hello World', () => {
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

  test('the stdin', () => {
    const randomString = randomUUID();
    testEngine(
      {
        instructions: loadTestFile('cat'),
        stdin: randomString,
      },
      randomString
    );
  });
});
