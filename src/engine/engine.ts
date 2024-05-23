export class BfEngine {
  private addressPointer: number = 0;
  private programCounter: number = 0;
  private stepCount: number = 0;
  private stdout: number[] = [];

  private minMemoryIdx: number = 0;
  private maxMemoryIdx: number = 0;
  private memory: { [memoryIdx: number]: number } = {};

  private instructions: string;
  private stdin: string;
  private jumpMap: { [programCounter: number]: number } = {};
  private jumpHistory: { [programCounter: number]: number } = {};
  private stdinHistory: { [programCounter: number]: number } = {};

  private debug: boolean;
  private breakpoint: string;

  constructor(params: {
    stdin: string;
    instructions: string;
    debug: boolean;
    breakpoint: string;
  }) {
    const escapedBreakpoint = params.breakpoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regexPattern = new RegExp(`[^<>+\\-\\[\\].,${escapedBreakpoint}]`, 'g');
    this.instructions = params.instructions.replace(regexPattern, "");
    this.stdin = params.stdin;
    this.debug = params.debug;
    this.breakpoint = params.breakpoint;
    this.loadJumps();
  }

  public run() {
    while (this.programCounter < this.instructions.length) {
      if(this.debug && this.instructions[this.programCounter] === this.breakpoint) {
        this.step();
        return;
      }
      this.step();
    }
  }

  /**
   * Step Forward
   */
  public step() {
    if(this.programCounter >= this.instructions.length) {
      return;
    }
    const instruction = this.instructions[this.programCounter];
    switch(instruction) {
      case "<":
        this.movePointerLeft();
        break;
      case ">":
        this.movePointerRight();
        break;
      case "+":
        this.incrementValue();
        break;
      case "-":
        this.decrementValue();
        break;
      case "[":
        this.jumpForward();
        break;
      case "]":
        this.jumpBackward();
        break;
      case ".":
        this.writeValue();
        break;
      case ",":
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

  /**
   * Step back
   */
  public stepBack() {
    if(this.stepCount === 0) {
      return;
    }
    this.programCounter--;
    this.stepCount--;
    const instruction = this.instructions[this.programCounter];
    switch(instruction) {
      case "<":
        this.movePointerRight();
        break;
      case ">":
        this.movePointerLeft();
        break;
      case "+":
        this.decrementValue();
        break;
      case "-":
        this.incrementValue();
        break;
      case "[":
      case "]":
        this.unjump();
        break;
      case ".":
        this.unwriteValue();
        break;
      case ",":
        this.unreadValue();
        break;
    }
  }

  public getMemory() {
    const memory: number[] = [];
    for(let i = this.minMemoryIdx; i <= this.maxMemoryIdx; i++) {
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
      if (instruction === "[") {
        stack.push(i);
      } else if (instruction === "]") {
        if(!stack.length) {
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
    switch(this.memory[this.addressPointer]) {
      case undefined:
        this.memory[this.addressPointer] = 1;
        break;
      case 255:
        this.memory[this.addressPointer] = 0;
        break;
      default:
        this.memory[this.addressPointer]++;
    }
  }

  private decrementValue() {
    switch(this.memory[this.addressPointer]) {
      case undefined:
        this.memory[this.addressPointer] = 255;
        break;
      case 0:
        this.memory[this.addressPointer] = 255;
        break;
      default:
        this.memory[this.addressPointer]--;
    }
  }

  private jumpForward() {
    if (!this.memory[this.addressPointer]) {
      this.jumpHistory[this.stepCount] = this.programCounter;
      this.programCounter = this.jumpMap[this.programCounter];
    }
  }

  private jumpBackward() {
    if (this.memory[this.addressPointer]) {
      this.jumpHistory[this.stepCount] = this.programCounter;
      this.programCounter = this.jumpMap[this.programCounter];
    }
  }

  private unjump() {
    if(this.jumpHistory[this.stepCount] !== undefined) {
      this.programCounter = this.jumpHistory[this.stepCount];
      delete this.jumpHistory[this.stepCount];
    }
  }

  private writeValue() {
    this.stdout.push(this.memory[this.addressPointer]);
  }

  private unwriteValue() {
    this.stdout = this.stdout.slice(0, -1);
  }

  private readValue() {
    const c = this.stdin[0];
    if(c !== undefined) {
      this.stdin = this.stdin.slice(1);
      this.stdinHistory[this.stepCount] = this.memory[this.addressPointer] ?? 0;
      this.memory[this.addressPointer] = c.charCodeAt(0);
    } else {
      this.stdinHistory[this.stepCount] = this.memory[this.addressPointer] ?? 0;
      this.memory[this.addressPointer] = 0;
    }
  }

  private unreadValue() {
    if(this.stdinHistory[this.stepCount] !== undefined) {
      this.stdin = String.fromCharCode(this.memory[this.addressPointer]) + this.stdin;
      this.memory[this.addressPointer] = this.stdinHistory[this.stepCount];
      delete this.stdinHistory[this.stepCount];
    }
  }
}