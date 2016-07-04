CHROUT = $FFD2
CHKIN = $FFC6
CHRIN = $FFCF
PLOT = $FFF0

screen_clear
 
.screen_clear_loop
	lda #$20				
	sta $0400,x                                  ; fill four areas with 256 spacebar characters
    sta $0500,x 
    sta $0600,x 
    sta $06e8,x 
    lda #$00                                     ; set foreground to black in Color Ram 
    sta $d800,x  
    sta $d900,x
    sta $da00,x
    sta $dae8,x
	inx           
	bne .screen_clear_loop                       ; did X overflow to zero yet?
	rts                                    


; ----------------------------------------------------------------------
; X: row
; Y: column
; $FB/$FC: null-terminated string
; ----------------------------------------------------------------------
screen_print_str
	clc
	jsr PLOT
	ldy #0
.print_str_loop
	lda ($fb), y
	cmp #0
	beq .print_str_exit
	jsr CHROUT
	iny
	bne .print_str_loop
	; if we overflowed Y, inc $fc
	inc $fc
	ldy #0
	jmp .print_str_loop

.print_str_exit
	rts
