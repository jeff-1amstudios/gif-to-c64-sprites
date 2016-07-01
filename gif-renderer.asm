!cpu 6510
!to "./build/c64gif.prg",cbm

CHROUT = $FFD2

* = $0801                                       ; BASIC start address (#2049)
!byte $0d,$08,$dc,$07,$9e,$20,$34,$39           ; BASIC loader to start at $c000...
!byte $31,$35,$32,$00,$00,$00                   ; BASIC op-codes to execute 'SYS 49152'  (49152 = 0xc000)

* = $4400										; load address for gif sprite data
!bin "output.spr"

* = $c000                                       ; start address for 6502 code

	; disable BASIC rom
	lda $01
	and #%01111111
	sta $01

	lda $dd00
	and #%11111100
	ora #%00000010		; tell VIC-II to use bank #1
	sta $dd00

	lda $d018			; move screen memory to $4000
	and #%00001111
	sta $d018

	lda $d018			; move char memory to $4000
	and #%11110001
	sta $d018

	lda #0
	sta $4000

	lda #64
	sta 648

	jsr screen_clear

; 	ldx #255
; 	lda #'A'
; .loop
; 	jsr CHROUT
; 	dex
; 	bne .loop

	;lda #0
	;sta $43f7

	jsr gif_sprite_init
	jsr irq_init
	jmp *


!source "screen.asm"
!source "gif_sprite.asm"
!source "irq.asm"