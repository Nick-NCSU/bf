import { EofBehavior, MemoryBits } from '../types';

export class BfEngine {
  // Pointer to the index in memory which is currently selected
  private addressPointer: number = 0;
  // Index in the instruction set which is currently being ran
  private programCounter: number = 0;
  // Number of steps performed since the program started
  private stepCount: number = 0;

  private stdout: number[] = [];

  // Left-most points in memory. Used to track memory size.
  private minMemoryIdx: number = 0;
  // Right-most points in memory. Used to track memory size.
  private maxMemoryIdx: number = 0;

  // Maximum value for a single memory cell. Numbers will overflow/underflow from this value.
  private maxMemoryValue: number;

  private memory: { [memoryIdx: number]: number } = {};

  private instructions: string;
  private stdin: string;
  /**
   * Behavior to take when encountering EOF.
   * More details: https://esolangs.org/wiki/Brainfuck#EOF
   */
  private eofBehavior: EofBehavior;
  /**
   * Stores a map of where to jump to/from in memory
   * to prevent calculating it at runtime.
   */
  private jumpMap: { [programCounter: number]: number } = {};
  /**
   * History of jumps performed. This value is used when
   * stepping backwards.
   *
   * This data will not be collected if saveHistory is `false`.
   */
  private jumpHistory: { [stepCount: number]: number } = {};
  /**
   * History of jumps performed. This value is used when
   * stepping backwards.
   *
   * This data will not be collected if saveHistory is false
   */
  private stdinHistory: { [stepCount: number]: number } = {};

  /**
   * Determines whether to collect the `jumpHistory` and
   * `stdinHistory` data. In programs with many jumps
   * disabling this may improve performance.
   */
  private saveHistory: boolean;
  /**
   * Breakpoint to pause execution on.
   */
  private breakpoint: string | undefined;

  constructor(params: {
    stdin: string;
    instructions: string;
    saveHistory: boolean;
    breakpoint?: string;
    eofBehavior: EofBehavior;
    maxMemoryBits: MemoryBits;
  }) {
    const escapedBreakpoint =
      params.breakpoint?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') || '';
    const regexPattern = new RegExp(
      `[^<>+\\-\\[\\].,${escapedBreakpoint}]`,
      'g'
    );
    // All characters other than `><+-.,[]` and the breakpoint will be ignored.
    this.instructions = params.instructions.replace(regexPattern, '');
    this.stdin = params.stdin;
    this.saveHistory = params.saveHistory;
    this.breakpoint = params.breakpoint;
    this.eofBehavior = params.eofBehavior;
    this.maxMemoryValue =
      params.maxMemoryBits === MemoryBits.EightBit ? 2 ** 8 - 1 : 2 ** 32 - 1;
    this.loadJumps();
  }

  public run() {
    while (this.programCounter < this.instructions.length) {
      if (
        this.breakpoint &&
        this.instructions[this.programCounter] === this.breakpoint
      ) {
        this.step();
        return;
      }
      this.step();
    }
  }

  public getMemory() {
    const memory: number[] = [];
    for (let i = this.minMemoryIdx; i <= this.maxMemoryIdx; i++) {
      memory.push(this.memory[i] ?? 0);
    }
    return memory;
  }

  public getAddressPointer() {
    return this.addressPointer;
  }

  public getProgramCounter() {
    return this.programCounter;
  }

  public getStepCount() {
    return this.stepCount;
  }

  public getStdout() {
    return this.stdout;
  }

  private loadJumps() {
    const stack: number[] = [];
    for (let i = 0; i < this.instructions.length; i++) {
      const instruction = this.instructions[i];
      if (instruction === '[') {
        stack.push(i);
      } else if (instruction === ']') {
        if (!stack.length) {
          throw new Error(`Unmatched closing bracket at index ${i}`);
        }
        const openBracketIdx = stack.pop()!;
        this.jumpMap[openBracketIdx] = i;
        this.jumpMap[i] = openBracketIdx;
      }
    }
    if (stack.length) {
      throw new Error(`Unmatched opening bracket at index ${stack.pop()}`);
    }
  }

  /**
   * Step Forward
   */
  public step() {
    if (this.programCounter >= this.instructions.length) {
      return;
    }
    const instruction = this.instructions[this.programCounter];
    switch (instruction) {
      case '<':
        this.movePointerLeft();
        break;
      case '>':
        this.movePointerRight();
        break;
      case '+':
        this.incrementValue();
        break;
      case '-':
        this.decrementValue();
        break;
      case '[':
        this.jumpForward();
        break;
      case ']':
        this.jumpBackward();
        break;
      case '.':
        this.writeValue();
        break;
      case ',':
        this.readValue();
        break;
      case this.breakpoint:
        break;
      default:
        throw new Error(`Invalid instruction: ${instruction}`);
    }
    this.programCounter++;
    this.stepCount++;
  }

  private movePointerLeft() {
    if (this.addressPointer === this.minMemoryIdx) {
      this.minMemoryIdx--;
    }
    this.addressPointer--;
  }

  private movePointerRight() {
    if (this.addressPointer === this.maxMemoryIdx) {
      this.maxMemoryIdx++;
    }
    this.addressPointer++;
  }

  private incrementValue() {
    switch (this.memory[this.addressPointer]) {
      case undefined:
        this.memory[this.addressPointer] = 1;
        break;
      case this.maxMemoryValue:
        this.memory[this.addressPointer] = 0;
        break;
      default:
        this.memory[this.addressPointer]++;
    }
  }

  private decrementValue() {
    switch (this.memory[this.addressPointer]) {
      case undefined:
      case 0:
        this.memory[this.addressPointer] = this.maxMemoryValue;
        break;
      default:
        this.memory[this.addressPointer]--;
    }
  }

  private jumpForward() {
    if (!this.memory[this.addressPointer]) {
      if (this.saveHistory) {
        this.jumpHistory[this.stepCount] = this.programCounter;
      }
      this.programCounter = this.jumpMap[this.programCounter];
    }
  }

  private jumpBackward() {
    if (this.memory[this.addressPointer]) {
      if (this.saveHistory) {
        this.jumpHistory[this.stepCount] = this.programCounter;
      }
      this.programCounter = this.jumpMap[this.programCounter];
    }
  }

  private writeValue() {
    this.stdout.push(this.memory[this.addressPointer] ?? 0);
  }

  private readValue() {
    const c = this.stdin[0];
    if (c !== undefined) {
      this.stdin = this.stdin.slice(1);
      if (this.saveHistory) {
        this.stdinHistory[this.stepCount] =
          this.memory[this.addressPointer] ?? 0;
      }
      this.memory[this.addressPointer] = c.charCodeAt(0);
    } else {
      if (this.saveHistory) {
        this.stdinHistory[this.stepCount] =
          this.memory[this.addressPointer] ?? 0;
      }
      switch (this.eofBehavior) {
        case EofBehavior.LeaveUnchanged:
          break;
        case EofBehavior.SetToMinusOne:
          this.memory[this.addressPointer] = this.maxMemoryValue;
          break;
        case EofBehavior.SetToZero:
          this.memory[this.addressPointer] = 0;
          break;
      }
    }
  }
  /**
   * Step back
   */
  public stepBack() {
    if (!this.saveHistory) {
      throw new Error('History is not being saved. Unable to step back.');
    }
    if (this.stepCount === 0) {
      return;
    }
    this.programCounter--;
    this.stepCount--;
    const instruction = this.instructions[this.programCounter];
    switch (instruction) {
      case '<':
        this.movePointerRight();
        break;
      case '>':
        this.movePointerLeft();
        break;
      case '+':
        this.decrementValue();
        break;
      case '-':
        this.incrementValue();
        break;
      case '[':
      case ']':
        this.unjump();
        break;
      case '.':
        this.unwriteValue();
        break;
      case ',':
        this.unreadValue();
        break;
    }
  }

  private unjump() {
    if (this.jumpHistory[this.stepCount] !== undefined) {
      this.programCounter = this.jumpHistory[this.stepCount];
      delete this.jumpHistory[this.stepCount];
    }
  }

  private unwriteValue() {
    this.stdout = this.stdout.slice(0, -1);
  }

  private unreadValue() {
    if (this.stdinHistory[this.stepCount] !== undefined) {
      this.stdin =
        String.fromCharCode(this.memory[this.addressPointer]) + this.stdin;
      this.memory[this.addressPointer] = this.stdinHistory[this.stepCount];
      delete this.stdinHistory[this.stepCount];
    }
  }
}
