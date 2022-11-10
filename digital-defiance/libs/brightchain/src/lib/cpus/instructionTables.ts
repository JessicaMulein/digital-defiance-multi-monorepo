import { X86Cpu } from './x86Cpu';
import { Registers } from './registers';
import * as instructions from './instructions';

export enum Instructions {
  // fn0x0f
  fn0x0f = 0x0f,
  // mov imm8 reg
  movImm8RegEAX = 0xb8,
  movImm8RegECX = 0xb9,
  movImm8RegEDX = 0xba,
  movImm8RegEBX = 0xbb,
  movImm8RegESP = 0xbc,
  // dec reg
  decEAX = 0x48,
  decECX = 0x49,
  decEDX = 0x4a,
  decEBX = 0x4b,
  decESP = 0x4c,
  decEBP = 0x4d,
  decESI = 0x4e,
  decEDI = 0x4f,
  // push reg
  pushEAX = 0x50,
  pushECX = 0x51,
  pushEDX = 0x52,
  pushEBX = 0x53,
  pushESP = 0x54,
  pushEBP = 0x55,
  pushESI = 0x56,
  pushEDI = 0x57,
  // pop reg
  popEAX = 0x58,
  popECX = 0x59,
  popEDX = 0x5a,
  popEBX = 0x5b,
  popESP = 0x5c,
  popEBP = 0x5d,
  popESI = 0x5e,
  popEDI = 0x5f,
  pushImm8 = 0x6a,
  movRegReg = 0x89,
  yam = 0x8b,
  ret = 0xc3,
  movl = 0xc7,
  lea = 0x8d,
  addReg = 0x01,
  addRegPad = 0x03,
  addEAX = 0x05,
  subRAX = 0x2d,
  jge = 0x7d,
  x81 = 0x81,
  x83 = 0x83,
  int = 0xcd,
  call = 0xe8,
  jmpImm8 = 0xeb,
}

export function buildInstructionMapForCpu(
  cpu: X86Cpu
): Map<number, () => void> {
  return new Map<number, () => void>([
    [Instructions.fn0x0f, instructions.invokeFn0x0f(cpu)],
    [Instructions.movImm8RegEAX, instructions.mov(cpu, Registers.EAX)],
    [Instructions.movImm8RegECX, instructions.mov(cpu, Registers.ECX)],
    [Instructions.movImm8RegEDX, instructions.mov(cpu, Registers.EDX)],
    [Instructions.movImm8RegEBX, instructions.mov(cpu, Registers.EBX)],
    [Instructions.movImm8RegESP, instructions.mov(cpu, Registers.ESP)],
    [Instructions.decEAX, instructions.dec(cpu, Registers.EAX)],
    [Instructions.decECX, instructions.dec(cpu, Registers.ECX)],
    [Instructions.decEDX, instructions.dec(cpu, Registers.EDX)],
    [Instructions.decEBX, instructions.dec(cpu, Registers.EBX)],
    [Instructions.decESP, instructions.dec(cpu, Registers.ESP)],
    [Instructions.decEBP, instructions.dec(cpu, Registers.EBP)],
    [Instructions.decESI, instructions.dec(cpu, Registers.ESI)],
    [Instructions.decEDI, instructions.dec(cpu, Registers.EDI)],
    [Instructions.pushEAX, instructions.pushr(cpu, Registers.EAX)],
    [Instructions.pushECX, instructions.pushr(cpu, Registers.ECX)],
    [Instructions.pushEDX, instructions.pushr(cpu, Registers.EDX)],
    [Instructions.pushEBX, instructions.pushr(cpu, Registers.EBX)],
    [Instructions.pushESP, instructions.pushr(cpu, Registers.ESP)],
    [Instructions.pushEBP, instructions.pushr(cpu, Registers.EBP)],
    [Instructions.pushESI, instructions.pushr(cpu, Registers.ESI)],
    [Instructions.pushEDI, instructions.pushr(cpu, Registers.EDI)],
    [Instructions.popEAX, instructions.popr(cpu, Registers.EAX)],
    [Instructions.popECX, instructions.popr(cpu, Registers.ECX)],
    [Instructions.popEDX, instructions.popr(cpu, Registers.EDX)],
    [Instructions.popEBX, instructions.popr(cpu, Registers.EBX)],
    [Instructions.popESP, instructions.popr(cpu, Registers.ESP)],
    [Instructions.popEBP, instructions.popr(cpu, Registers.EBP)],
    [Instructions.popESI, instructions.popr(cpu, Registers.ESI)],
    [Instructions.popEDI, instructions.popr(cpu, Registers.EDI)],
    [Instructions.pushImm8, instructions.pushi(cpu)],
    [Instructions.movRegReg, instructions.movRegReg(cpu)],
    [Instructions.yam, instructions.yam(cpu)],
    [Instructions.ret, instructions.ret(cpu)],
    [Instructions.movl, instructions.movl(cpu)],
    [Instructions.lea, instructions.lea(cpu)],
    [Instructions.addReg, instructions.addReg(cpu)],
    [Instructions.addRegPad, instructions.addRegPad(cpu)],
    [Instructions.addEAX, instructions.addEAX(cpu)],
    [Instructions.subRAX, instructions.subRAX(cpu)],
    [Instructions.jge, instructions.jge(cpu)],
    [Instructions.x81, instructions.invokeX81(cpu)],
    [Instructions.x83, instructions.invokeX83(cpu)],
    [Instructions.int, instructions.int(cpu)],
    [Instructions.call, instructions.call(cpu)],
    [Instructions.jmpImm8, instructions.jmpImm8(cpu)],
  ]);
}

export function buildInstructionArray(cpu: X86Cpu): Array<() => void> {
  const instructionList = buildInstructionMapForCpu(cpu);
  const instructionArray = new Array<() => void>(0xff);
  for (let i = 0; i < instructionArray.length; i++) {
    instructionArray[i] = instructions.noOp(cpu);
  }
  instructionList.forEach((value, key) => {
    instructionArray[key] = value;
  });
  return instructionArray;
}

export function X83Instructions(
  cpu: X86Cpu
): Map<number, (reg: number, op2: number) => void> {
  return new Map<number, (reg: number, op2: number) => void>([
    // add
    [0x00, instructions.x83Add(cpu)],

    // sub
    [0x05, instructions.x83Sub(cpu)],

    // cmp
    [0x07, instructions.x83Cmp(cpu)],
  ]);
}

export function fn0x81Instructions(
  cpu: X86Cpu
): Map<number, (reg: number, value?: number) => void> {
  return new Map<number, (reg: number, value?: number) => void>([
    // sub
    [0x05, instructions.invokeX81_05Sub(cpu)],

    // cmpl
    [0x07, instructions.invokeX81_07Cmp(cpu)],
  ]);
}

export function syscallInstructions(cpu: X86Cpu): Map<number, () => void> {
  return new Map<number, () => void>([
    [0x1, instructions.sysCallExit(cpu)],
    [0x80, instructions.sysCallInterrupt(cpu)],
  ]);
}

// Prefix 0x0F
export function fn0x0fInstructions(cpu: X86Cpu): Map<number, () => void> {
  return new Map<number, () => void>([
    // jge
    [0x8d, instructions.fn0x0f8dJge(cpu)],

    // jle short jump
    [0x8e, instructions.fn0x0f8eJle(cpu)],

    // imul
    [0xaf, instructions.fn0x0fAfImul(cpu)],

    // noop
    [0x1f, instructions.noOp(cpu)],
  ]);
}

export function getSysCallInstruction(cpu: X86Cpu, opcode: number): () => void {
  const instruction = cpu.Syscalls.get(opcode);
  if (instruction === undefined) {
    throw new Error('Invalid opcode');
  }
  return instruction;
}

export function getInterruptInstruction(
  cpu: X86Cpu,
  opcode: number
): () => void {
  const instruction = cpu.Interrupts.get(opcode);
  if (instruction === undefined) {
    throw new Error('Invalid opcode');
  }
  return instruction;
}

export function getFn0x0fInstruction(cpu: X86Cpu, opcode: number): () => void {
  const instruction = fn0x0fInstructions(cpu).get(opcode);
  if (instruction === undefined) {
    throw new Error('Invalid opcode');
  }
  return instruction;
}

export function getFn0x81Instruction(
  cpu: X86Cpu,
  opcode: number
): (reg: number, value?: number) => void {
  const instruction = fn0x81Instructions(cpu).get(opcode);
  if (instruction === undefined) {
    throw new Error('Invalid opcode');
  }
  return instruction;
}

export function getX83Instruction(
  cpu: X86Cpu,
  opcode: number
): (reg: number, op2: number) => void {
  const instruction = X83Instructions(cpu).get(opcode);
  if (instruction === undefined) {
    throw new Error('Invalid opcode');
  }
  return instruction;
}
