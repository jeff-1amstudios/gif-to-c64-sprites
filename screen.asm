; screen_clear
; 	lda #1
; 	sta $d020       ; border color
; 	sta $d021       ; background color
; 	lda #147        ; clear screen
; 	jsr CHROUT
; 	rts

screen_clear        
					ldx #$01                                     ; set X to zero (black color code)
                    stx $d021                                    ; set background color
                    stx $d020                                    ; set border color
                    ldx #0

 
_screen_clear_loop
                    lda #$0                                     ; #$20 is a blank char
                    sta $4000,x                                  ; fill four areas with 256 spacebar characters
                    sta $4100,x 
                    sta $4200,x 
                    sta $4300,x 
                    lda #$01                                    ; set foreground to black in Color Ram 
                    sta $d800,x  
                    sta $d900,x
                    sta $da00,x
                    sta $dae8,x
                    inx           
                    bne _screen_clear_loop                       ; did X overflow to zero yet?
                    rts                                    