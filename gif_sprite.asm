!zone gif_sprite

.FRAME_COUNT = 19
.ANIM_DELAY = 3
.SPRITE_PTR = 16	;($2000 / 64)

.frame_counter !byte .FRAME_COUNT
.anim_delay !byte .ANIM_DELAY

gif_sprite_init
	lda #.SPRITE_PTR		
	sta $43f8

	lda $d015
	ora #1
	sta $d015
	lda #0		; color 1
	sta $d027

	
	lda #160
	sta $d000		; x
	lda #176
	sta $d001		; y

	lda $d01d
	ora #%00000001
	sta $d01d		; enable sprite #0
	lda $d017
	ora #%00000001
	sta $d017
	rts


gif_sprite_update
	dec .anim_delay
	bne .done
	ldx #.ANIM_DELAY
	stx .anim_delay
	dec .frame_counter
	bne .update_frame
	lda #.SPRITE_PTR
	sta $43f8
	inc $d020
	ldx #.FRAME_COUNT
	stx .frame_counter
	rts
.update_frame
	inc $43f8
	rts		

.done
	rts


	
