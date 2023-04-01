.global _start

.section .text
_start:
    hlt #0x0F00  // Halt the processor with an immediate value

.size _start, .-_start

