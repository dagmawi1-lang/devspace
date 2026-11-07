// A tiny in-browser port of CoreSim's CS16 CPU (a subset of the instruction set) for the portfolio demo.
export const PROGRAMS = {
  fibonacci: `; first 10 Fibonacci numbers
        LDI R1, 0
        LDI R2, 1
        LDI R3, 10
loop:   OUT R1
        MOV R4, R1
        ADD R4, R2
        MOV R1, R2
        MOV R2, R4
        ADDI R3, -1
        JNZ loop
        HALT`,
  countdown: `; count down from 5 using CMPI and JGE
        LDI R1, 5
again:  OUT R1
        ADDI R1, -1
        CMPI R1, 1
        JGE again
        HALT`,
};

const OPS = { LDI: 'RI', MOV: 'RR', ADD: 'RR', SUB: 'RR', ADDI: 'RI', CMPI: 'RI', OUT: 'R', JMP: 'A', JNZ: 'A', JZ: 'A', JGE: 'A', HALT: '' };

export function assemble(src) {
  const lines = src.split('\n').map((raw, i) => ({ raw, no: i + 1, text: raw.replace(/;.*/, '').trim() }));
  const labels = {}; const code = [];
  for (const l of lines) {
    let t = l.text; const m = t.match(/^([A-Za-z_]\w*):\s*(.*)$/);
    if (m) { labels[m[1]] = code.length; t = m[2]; }
    if (!t) continue;
    const [op, ...rest] = t.split(/\s+/); const args = rest.join(' ').split(',').map((s) => s.trim()).filter(Boolean);
    const form = OPS[op.toUpperCase()];
    if (form === undefined) throw new Error(`line ${l.no}: unknown instruction ${op}`);
    code.push({ op: op.toUpperCase(), args, line: l.no });
  }
  const reg = (s, n) => { const m = /^R([0-7])$/i.exec(s || ''); if (!m) throw new Error(`line ${n}: expected register, got "${s}"`); return +m[1]; };
  const val = (s, n) => { if (s in labels) return labels[s]; const v = Number(s); if (!Number.isFinite(v)) throw new Error(`line ${n}: bad value "${s}"`); return v; };
  return code.map((c) => {
    const f = OPS[c.op];
    const need = f.length === 2 ? 2 : f.length;
    if (c.args.length !== need) throw new Error(`line ${c.line}: ${c.op} expects ${need} operand(s)`);
    if (f === 'RR') return { ...c, rd: reg(c.args[0], c.line), rs: reg(c.args[1], c.line) };
    if (f === 'RI') return { ...c, rd: reg(c.args[0], c.line), imm: val(c.args[1], c.line) };
    if (f === 'R') return { ...c, rd: reg(c.args[0], c.line) };
    if (f === 'A') return { ...c, imm: val(c.args[0], c.line) };
    return c;
  });
}

export function createCpu(program) {
  const s = { r: new Array(8).fill(0), pc: 0, z: false, n: false, c: false, v: false, halted: false, out: [], steps: 0 };
  const u16 = (x) => ((x % 65536) + 65536) % 65536;
  const setFlags = (a, b, sub) => {
    const raw = sub ? a - b : a + b; const res = u16(raw);
    s.z = res === 0; s.n = (res & 0x8000) !== 0; s.c = sub ? a < u16(b) : raw > 0xffff;
    const sa = a & 0x8000, sb = u16(b) & 0x8000, sr = res & 0x8000;
    s.v = sub ? sa !== sb && sr !== sa : sa === sb && sr !== sa;
    return res;
  };
  function step() {
    if (s.halted) return null;
    if (s.steps > 10000) throw new Error('step limit reached');
    const i = program[s.pc]; if (!i) { s.halted = true; return null; }
    const before = [...s.r]; s.pc += 1; s.steps += 1;
    switch (i.op) {
      case 'LDI': s.r[i.rd] = u16(i.imm); break;
      case 'MOV': s.r[i.rd] = s.r[i.rs]; break;
      case 'ADD': s.r[i.rd] = setFlags(s.r[i.rd], s.r[i.rs], false); break;
      case 'SUB': s.r[i.rd] = setFlags(s.r[i.rd], s.r[i.rs], true); break;
      case 'ADDI': s.r[i.rd] = setFlags(s.r[i.rd], i.imm, false); break;
      case 'CMPI': setFlags(s.r[i.rd], i.imm, true); break;
      case 'OUT': s.out.push(s.r[i.rd]); break;
      case 'JMP': s.pc = i.imm; break;
      case 'JZ': if (s.z) s.pc = i.imm; break;
      case 'JNZ': if (!s.z) s.pc = i.imm; break;
      case 'JGE': if (s.n === s.v) s.pc = i.imm; break;
      case 'HALT': s.halted = true; break;
    }
    return { instr: i, before };
  }
  return { state: s, step };
}
