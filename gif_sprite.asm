!zone gif_sprite

.FRAME_COUNT = 20
.ANIM_DELAY = 4
.SPRITE_0_PTR = 16
.SPRITE_1_PTR = .SPRITE_0_PTR + .FRAME_COUNT
.SPRITE_2_PTR = .SPRITE_1_PTR + .FRAME_COUNT
.SPRITE_3_PTR = .SPRITE_2_PTR + .FRAME_COUNT

.DISPLAY_X = 130
.DISPLAY_Y = 100
.WIDTH = 48
.HEIGHT = 42

.frame_counter !byte .FRAME_COUNT
.anim_delay !byte .ANIM_DELAY

gif_sprite_init
	lda #.SPRITE_0_PTR
	sta $43f8
	lda #.SPRITE_1_PTR
	sta $43f9
	lda #.SPRITE_2_PTR
	sta $43fa
	lda #.SPRITE_3_PTR
	sta $43fb

	lda $d015
	ora #%00001111		; enable sprite 0-4
	sta $d015
	lda #0
	sta $d027			; sprite colors
	sta $d028
	sta $d029
	sta $d02a

	; sprite #0 (top-left)
	lda #.DISPLAY_X
	sta $d000		; x
	lda #.DISPLAY_Y
	sta $d001		; y

	; sprite #1 (bottom-left)
	lda #.DISPLAY_X
	sta $d002		; x
	lda #.DISPLAY_Y + .HEIGHT
	sta $d003		; y

	; sprite #2 (top-right)
	lda #.DISPLAY_X + .WIDTH
	sta $d004		; x
	lda #.DISPLAY_Y
	sta $d005		; y

	; sprite #3 (bottom-right)
	lda #.DISPLAY_X + .WIDTH
	sta $d006		; x
	lda #.DISPLAY_Y + .HEIGHT
	sta $d007		; y

	lda $d01d
	ora #%00001111
	sta $d01d		; enable sprite 0-4 x-expand
	lda $d017
	ora #%00001111
	sta $d017		; enable sprite 0-4 y-expand
	rts


gif_sprite_update
	dec .anim_delay
	bne .done
	ldx #.ANIM_DELAY
	stx .anim_delay
	dec .frame_counter
	bne .update_frame
	lda #.SPRITE_0_PTR
	sta $43f8
	lda #.SPRITE_1_PTR
	sta $43f9
	lda #.SPRITE_2_PTR
	sta $43fa
	lda #.SPRITE_3_PTR
	sta $43fb
	ldx #.FRAME_COUNT
	stx .frame_counter
	rts
.update_frame
	inc $43f8
	inc $43f9
	inc $43fa
	inc $43fb
	rts		

.done
	rts


	
