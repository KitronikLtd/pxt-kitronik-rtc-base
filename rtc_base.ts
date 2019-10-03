
/**
 * Kitronik RTC blocks
 * RTC Chip: MCP7940-N
 * As per datasheet recommendation, the RTC oscilliation is stop on updating of values
 * This results in a small loss of time (under a 1 second per setting)
 * If this is important to your application, check the actual times
 */
namespace kitronik_RTC {

    //USEFUL CONSTANT
    export const CHIP_ADDRESS = 0x6F 			//default Chip Write address
    export const RTC_SECONDS_REG = 0x00		//the RTC seconds register
    export const RTC_MINUTES_REG = 0x01		//the RTC minutes register
    export const RTC_HOURS_REG = 0x02			//the RTC hours register
    export const RTC_WEEKDAY_REG = 0x03		//the RTC week dat register
    export const RTC_DAY_REG = 0x04			//the RTC date register
    export const RTC_MONTH_REG = 0x05			//the RTC month register
    export const RTC_YEAR_REG = 0x06			//the RTC year register
    export const RTC_CONTROL_REG = 0x07		//the RTC control regisiter
    export const RTC_OSCILLATOR_REG = 0x08 	//the oscillator digital trim register
    export const RTC_PWR_UP_MINUTE_REG = 0x1C  //the RTC power up minute register

    export const START_RTC = 0x80				//enable bit of seconds register
    export const STOP_RTC = 0x00				//disable bit of seconds register

    export const ENABLE_BATTERY_BACKUP = 0x08	//set bit for battery backup voltage enable
	
	//Global variable use so only one copy of current time and date value
    export let currentSeconds = 0			
    export let currentMinutes = 0
    export let currentHours = 0
    export let currentWeekDay = 0
    export let currentDay = 0
    export let currentMonth = 0
    export let currentYear = 0
    export let initalised = false    		//a flag to allow us to initialise without explicitly calling the secret incantation


    //decToBcd function to convert a decimal number to required Binary-Coded-Deceminal (bcd) for the RTC
    export function decToBcd(Value: number) {

        let tens = 0
        let units = 0
        let bcdNumber = 0

        tens = Value / 10
        units = Value % 10

        bcdNumber = (tens << 4) | units;    // combine both tens and units for BCD number

        return bcdNumber
    }

    //bcdToDec function to convert a Binary-Coded-Deceminal to required decimal number for the micro:bit
    export function bcdToDec(Value: number, readReg: number) {
        let mask = 0
        let shiftedTens = 0
        let units = 0
        let tens = 0
        let decNumber = 0

        switch (readReg) {
            case RTC_SECONDS_REG:         //case statments fall through as both require same mask value
            case RTC_MINUTES_REG:
                mask = 0x70
                break;
			case RTC_HOURS_REG:           //case statments fall through as both require same mask value
            case RTC_DAY_REG:
                mask = 0x30
                break;
            case RTC_MONTH_REG:
                mask = 0x10
                break;
            case RTC_YEAR_REG:
                mask = 0xF0
                break;
        }

        units = Value & 0x0F        	//Mask lower nibble  for units, mask upper nibble for tens and shift
        tens = Value & mask
        shiftedTens = tens >> 4

        decNumber = (shiftedTens * 10) + units     //convert both units and tens to one number

        return decNumber
    }


	/*
		This secret incantation sets up the MCP7940-N Real Time Clock.
		It should not need to be called directly be a user - the first RTC block will call this function.
	
	*/
    export function secretIncantation(): void {
        let writeBuf = pins.createBuffer(2)
        let readBuf = pins.createBuffer(1)
        let running = 0
        let readCurrentSeconds = 0
        let readWeekDayReg = 0

        //Seconds register read for current seconds for when masking start RTC bit
        writeBuf[0] = RTC_SECONDS_REG
        pins.i2cWriteBuffer(CHIP_ADDRESS, writeBuf, false)

        readBuf = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
        readCurrentSeconds = readBuf[0]

        // First set the external oscillator
        writeBuf[0] = RTC_CONTROL_REG
        writeBuf[1] = 0x43										//only enable EXTOSC bit, external oscillator
        pins.i2cWriteBuffer(CHIP_ADDRESS, writeBuf, false)

        //Reading weekday register so can mask the Battery backup supply
        writeBuf[0] = RTC_WEEKDAY_REG
        pins.i2cWriteBuffer(CHIP_ADDRESS, writeBuf, false)
        readBuf = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
        readWeekDayReg = readBuf[0]

        writeBuf[0] = RTC_WEEKDAY_REG
        writeBuf[1] = ENABLE_BATTERY_BACKUP | readWeekDayReg             //logic OR the two bytes together for new value
        pins.i2cWriteBuffer(CHIP_ADDRESS, writeBuf, false)       //write to enable battery backup and mask with current reading of register

        //Block write to start oscillator
        writeBuf[0] = RTC_SECONDS_REG
        writeBuf[1] = START_RTC | readCurrentSeconds
        pins.i2cWriteBuffer(CHIP_ADDRESS, writeBuf, false)

        //set the initalised flag so we dont come in here again automatically
        initalised = true
    }

    //MAIN FUNCTION FOR READING ALL THE TIME AND DATE RESIGITER TO OUTPUT TO THE WORLD
    export function readValue(): void {
        if (initalised == false) {
            secretIncantation()
        }

        let writeBuf = pins.createBuffer(1)
        let readBuf = pins.createBuffer(1)
        let readCurrentSeconds = 0

        //set read from seconds register to receive all the information to global varibles
        writeBuf[0] = RTC_SECONDS_REG
        pins.i2cWriteBuffer(CHIP_ADDRESS, writeBuf, false)

        readBuf = pins.i2cReadBuffer(CHIP_ADDRESS, 7, false)
        currentSeconds = readBuf[0]
        currentMinutes = readBuf[1]
        currentHours = readBuf[2]
        currentWeekDay = readBuf[3]
        currentDay = readBuf[4]
        currentMonth = readBuf[5]
        currentYear = readBuf[6]
    }
}
