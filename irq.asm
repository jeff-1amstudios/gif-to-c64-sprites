irq_init       
    sei             ; disable interrupts
    ldy #$7f        ; 01111111 
    sty $dc0d       ; turn off CIA timer interrupt
    lda $dc0d       ; cancel any pending IRQs
    lda #$01
    sta $d01a       ; enable VIC-II Raster Beam IRQ
    lda $d011       ; bit 7 of $d011 is the 9th bit of the raster line counter.
    and #$7f         ; make sure it is set to 0
    sta $d011
                                                         ; disable interrupts
    lda #0
    sta $d012                                                    ; this is the raster line register
    lda #<irq_handler
    sta $314
    lda #>irq_handler
    sta $315
    cli             ; enable interupts
    rts

irq_handler
    dec $d019     ; ack interrupt
    inc $4f37
    jsr gif_sprite_update
    jmp $ea31     ; system handler

