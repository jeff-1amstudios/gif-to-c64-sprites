; C64 hardware interrupts

; -------------------------------
; Sets up an interrupt to occur every screen refresh on line 0 (raster beam IRQ)
; -------------------------------
irq_init       
	sei					; disable interrupts
	ldy #$7f
	sty $dc0d			; turn off CIA timer interrupt
	lda $dc0d			; cancel pending IRQs
	lda #$01
	sta $d01a			; enable VIC-II Raster Beam IRQ
	lda $d011			; 
	and #$7f			; bit 7 of $d011 is the 9th bit of the raster line counter, set it to 0
	sta $d011
														 
	lda #0
	sta $d012       	; raster line register
	lda #<irq_handler	; set the interrupt method handler
	sta $314
	lda #>irq_handler
	sta $315
	cli             	; re-enable interupts
	rts

; -------------------------------
; This method is executed every time a hardware interrupt is generated
; -------------------------------
irq_handler
	dec $d019			; ack interrupt
	jsr gif_sprite_update
	jmp $ea31     		; jump back to the system IRQ handler

