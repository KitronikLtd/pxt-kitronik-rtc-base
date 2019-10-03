//On Button A press, Time  and Date will be set as a group
input.onButtonPressed(Button.A, () => {
    kitronik_RTC.setTime(11, 49, 0)
    kitronik_RTC.setDate(11, 7, 18)
})
//On Button B press, individual parameters are set in single blocks
input.onButtonPressed(Button.B, () => {
    kitronik_RTC.writeHours(11)
    kitronik_RTC.writeMinutes(49)
    kitronik_RTC.writeSeconds(0)
    kitronik_RTC.writeDay(11)
    kitronik_RTC.writeMonth(7)
    kitronik_RTC.writeYear(18)
})
//forever loop will display the string of time and date
//after pause individual parameters are displayed as a number
basic.forever(() => {
    basic.showString(kitronik_RTC.readTime())
    basic.showString(kitronik_RTC.readDate())
    basic.pause(1000)
    basic.showNumber(kitronik_RTC.readHours())
    basic.showNumber(kitronik_RTC.readMinutes())
    basic.showNumber(kitronik_RTC.readSeconds())
    basic.showNumber(kitronik_RTC.readDay())
    basic.showNumber(kitronik_RTC.readMonth())
    basic.showNumber(kitronik_RTC.readYear())
    basic.pause(1000)
})