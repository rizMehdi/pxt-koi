/*
Riven
load dependency
"koi": "file:../pxt-koi"
*/

//% color="#5c7cfa" weight=10 icon="\u03f0"
namespace koi {

    type EvtAct = () => void;
    type Evtxywh = (x:number, y:number, w:number, h:number) => void;
    type Evtxyr = (x: number, y: number, r: number) => void;
    type Evtpp = (x1: number, y1: number, x2: number, y2: number) => void;
    type Evttxt = (txt: string) => void;
    type Evtsxy = (txt: string, x: number, y: number) => void;

    let classifiedIndex: number = null;
    let classiferEvt: EvtAct = null;
    
    let circleEvt: Evtxyr = null;
    let rectEvt: Evtxywh = null;
    let colorblobEvt: Evtxywh = null;
    let lineEvt: Evtpp = null;
    let imgtrackEvt: Evtxywh = null;
    let qrcodeEvt: Evttxt = null;
    let apriltagEvt: Evtsxy = null;
    let facedetEvt: Evtxywh = null;

    const PortSerial = [
        [SerialPin.P8, SerialPin.P0],
        [SerialPin.P12, SerialPin.P1],
        [SerialPin.P13, SerialPin.P2],
        [SerialPin.P15, SerialPin.P14]
    ]

    export enum SerialPorts {
        PORT1 = 0,
        PORT2 = 1,
        PORT3 = 2,
        PORT4 = 3
    }

    function trim(n: string):string {
        while (n.charCodeAt(n.length-1)<0x1f) {
            n = n.slice(0, n.length-1)
        }
        return n;
    }

    serial.onDataReceived('\n', function () {
        let a = serial.readString()
        if (a.charAt(0) == 'K'){
            a = trim(a)
            let b = a.slice(1, a.length).split(" ")
            let cmd = parseInt(b[0])

            if (cmd == 42){
                classifiedIndex = parseInt(b[1])
                if (classiferEvt){
                    classiferEvt();
                }
            }
        }
    })

    /**
     * init serial port
     * @param tx Tx pin; eg: SerialPin.P1
     * @param rx Rx pin; eg: SerialPin.P2
    */
    //% blockId=koi_init block="KOI init|Tx pin %tx|Rx pin %rx"
    //% weight=100
    export function koi_init(tx: SerialPin, rx: SerialPin): void {
        serial.redirect(
            tx,
            rx,
            BaudRate.BaudRate115200
        )
        basic.pause(100)
        serial.setTxBufferSize(64)
        serial.setRxBufferSize(64)
        serial.readString()
        serial.writeString('\n\n')
        basic.pause(1000)
    }

    //% blockId=koi_init_pw block="KOI init powerbrick|Port %port"
    //% weight=100
    export function koi_init_pw(port: SerialPorts): void {
        koi_init(PortSerial[port][1], PortSerial[port][0]);
    }

    //% blockId=koi_reset_cls block="KOI Reset Classifer"
    //% weight=90
    export function koi_reset_cls(): void {
        let str = `K40`;
        serial.writeLine(str)
    }

    //% blockId=koi_addtag block="KOI Add Tag %tag"
    //% tag.min=1 tag.max=20
    //% weight=90
    export function koi_addtag(tag: number): void {
        let str = `K41 ${tag}`;
        serial.writeLine(str)
    }

    //% blockId=koi_run block="KOI Run Clissifer"
    //% weight=90
    export function koi_run(): void {
        let str = `K42 1`;
        serial.writeLine(str)
    }

    //% blockId=koi_stop block="KOI Stop Clissifer"
    //% weight=90
    export function koi_stop(): void {
        let str = `K42 0`;
        serial.writeLine(str)
    }

    //% blockId=koi_classified block="on Identified"
    //% weight=90
    export function koi_classified(handler: () => void) {
        classiferEvt = handler;
    }

    //% blockId=koi_get_classified block="Get Class"
    //% weight=90 blockGap=48
    export function koi_get_classified():number {
        return classifiedIndex;
    }

    /**
     * @param name savepath; eg: abc.png
    */
    //% blockId=koi_screenshot block="KOI Screenshot %name"
    //% weight=89
    export function koi_screenshot(name: string): void {
        let str = `K1 ${name}`;
        serial.writeLine(str)
    }

    /**
     * @param name png to display; eg: banana.png
    */
    //% blockId=koi_display block="KOI Display %name"
    //% weight=89 blockGap=48
    export function koi_display(name: string): void {
        let str = `K2 ${name}`;
        serial.writeLine(str)
    }

    //% blockId=koi_led block="KOI LED %onoff"
    //% weight=89 blockGap=48
    export function koi_led(onoff: boolean): void {
        let str = `K3 ${onoff?1:0}`;
        serial.writeLine(str)
    }

    //% blockId=koi_print block="KOI print %txt"
    //% weight=89
    export function koi_print(txt: string): void {
        let str = `K4 ${txt}`;
        serial.writeLine(str)
    }

    //% blockId=koi_printpos block="KOI print pos x:%x y:%y"
    //% x.min=0 x.max=240
    //% y.min=0 y.max=240
    //% weight=89 blockGap=48
    export function koi_printpos(x: number, y: number): void {
        let str = `K5 ${x} ${y}`;
        serial.writeLine(str)
    }

    //% blockId=koi_track_circle block="KOI track circle"
    //% weight=88
    export function koi_track_circle(): void {
        let str = `K10`;
        serial.writeLine(str)
    }

    //% blockId=koi_oncircletrack block="on Find Circle"
    //% weight=88 draggableParameters=reporter blockGap=48
    export function koi_oncircletrack(handler: (x:number ,y:number, r:number) => void) {
        circleEvt = handler;
    }

    //% blockId=koi_track_rect block="KOI track rectangle"
    //% weight=87
    export function koi_track_rect(): void {
        let str = `K11`;
        serial.writeLine(str)
    }

    //% blockId=koi_onrecttrack block="on Find Rectangle"
    //% weight=87 draggableParameters=reporter blockGap=48
    export function koi_onrecttrack(handler: (x: number, y: number, w: number, h: number) => void) {
        rectEvt = handler;
    }

    //% blockId=koi_colorcali block="KOI color calibration"
    //% weight=86
    export function koi_colorcali() {
        let str = `K16`;
        serial.writeLine(str)
    }

    //% blockId=koi_track_line block="KOI track line"
    //% weight=86
    export function koi_track_line() {
        let str = `K12`;
        serial.writeLine(str)
    }

    //% blockId=koi_onlinetrack block="on Line Update"
    //% weight=85 draggableParameters=reporter blockGap=48
    export function koi_onlinetrack(handler: (x1: number, y1: number, x2: number, y2: number) => void) {
        lineEvt = handler;
    }

    //% blockId=koi_track_colorblob block="KOI track color blob"
    //% weight=85
    export function koi_track_colorblob() {
        let str = `K15`;
        serial.writeLine(str)
    }

    //% blockId=koi_oncolorblob block="on Color blob"
    //% weight=85 draggableParameters=reporter blockGap=48
    export function koi_oncolorblob(handler: (x: number, y: number, w: number, h: number) => void) {
        colorblobEvt = handler;
    }

    //% blockId=koi_track_img block="KOI track image"
    //% weight=84
    export function koi_track_img() {
        let str = `K17`;
        serial.writeLine(str)
    }

    //% blockId=koi_track_img_learn block="KOI track image learn"
    //% weight=84
    export function koi_track_img_learn() {
        let str = `K18`;
        serial.writeLine(str)
    }

    //% blockId=koi_onimgtrack block="on Image Track"
    //% weight=84 draggableParameters=reporter blockGap=48
    export function koi_onimgtrack(handler: (x: number, y: number, w: number, h: number) => void) {
        imgtrackEvt = handler;
    }

    //% blockId=koi_qrcode block="KOI QR code"
    //% weight=83
    export function koi_qrcode() {
        let str = `K20`;
        serial.writeLine(str)
    }

    //% blockId=koi_onqrcode block="on QR code"
    //% weight=83 draggableParameters=reporter blockGap=48
    export function koi_onqrcode(handler: (link: string) => void) {
        qrcodeEvt = handler;
    }

    //% blockId=koi_apriltag block="KOI April Tag"
    //% weight=82
    export function koi_apriltag() {
        let str = `K22`;
        serial.writeLine(str)
    }

    //% blockId=koi_onapriltag block="on AprilTag"
    //% weight=82 draggableParameters=reporter blockGap=48
    export function koi_onapriltag(handler: (id: string, x: number, y: number) => void) {
        apriltagEvt = handler;
    }

    //% blockId=koi_loadyoloface block="KOI Load Face yolo"
    //% weight=81
    export function koi_loadyoloface() {
        let str = `K30`;
        serial.writeLine(str)
    }

    //% blockId=koi_facedetect block="KOI face detect %onoff"
    //% weight=81
    export function koi_facedetect(onoff: boolean) {
        let str = `K31 ${onoff ? 1 : 0}`;
        serial.writeLine(str)
    }

    //% blockId=koi_onfindface block="on Find Face"
    //% weight=81 draggableParameters=reporter blockGap=48
    export function koi_onfindface(handler: (x: number, y: number, w: number, h: number) => void) {
        facedetEvt = handler;
    }

    

}
