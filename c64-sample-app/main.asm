!cpu 6510
!to "./build/c64gif.prg",cbm

* = $0801                                       ; BASIC start address (#2049)
!byte $0d,$08,$dc,$07,$9e,$20,$34,$39           ; BASIC loader to start at $c000...
!byte $31,$35,$32,$00,$00,$00                   ; BASIC op-codes to execute 'SYS 49152'  (49152 = 0xc000)

* = $4400										; load gif sprite into $4400
!bin "output.spr"

* = $c000                                       ; code start address

	lda $01
	and #$7f
	sta $01				; disable BASIC ROM

	lda $dd00
	and #%11111100
	ora #%00000010		
	sta $dd00			; tell VIC-II to use bank #1

	lda $d018			
	and #%00001111
	sta $d018			; screen memory = $4000

	lda $d018			
	and #%11110001
	sta $d018			; char memory = $4000

	lda #64				
	sta 648				; screen editor = $4000

	jsr screen_clear

	jsr gif_sprite_init
	jsr irq_init
	jmp *				; infinite loop


!source "screen.asm"
!source "gif_sprite.asm"
!source "irq.asm"