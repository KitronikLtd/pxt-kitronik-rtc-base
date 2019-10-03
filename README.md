# pxt-kitronik-rtc

# Kitronik blocks for micro:bit

Blocks that support [Kitronik kits and shields for the micro:bit](https://www.kitronik.co.uk/microbit.html)
This package is for the [Kitronik RTC Board] (hhtp://www.kitronik.co.uk/5635)

## RTC

* set Time (hours, minutes, seconds) and Date (Day, Month, Year) as groups

```blocks
input.onButtonPressed(Button.A, () => {
    kitronik_RTC.setTime(11, 49, 0)
    kitronik_RTC.setDate(11, 7, 18)
})
```

* set Time hours, minutes and seconds in individual blocks

```blocks
input.onButtonPressed(Button.B, () => {
    kitronik_RTC.writeHours(11)
    kitronik_RTC.writeMinutes(49)
    kitronik_RTC.writeSeconds(0)
})
```

* set Date day, month and year in individual blocks

```blocks
input.onButtonPressed(Button.B, () => {
    kitronik_RTC.writeDay(11)
    kitronik_RTC.writeMonth(7)
    kitronik_RTC.writeYear(18)
})
```

* show Time and Date as a String

```blocks
basic.forever(() => {
    basic.showString(kitronik_RTC.readTime())
	basic.pause(1000)
    basic.showString(kitronik_RTC.readDate())
    basic.pause(1000)
})
```

* show Time and Date as a numbers

```blocks
basic.forever(() => {
    basic.showNumber(kitronik_RTC.readHours())
    basic.showNumber(kitronik_RTC.readMinutes())
    basic.showNumber(kitronik_RTC.readSeconds())
	basic.pause(1000)
    basic.showNumber(kitronik_RTC.readDay())
    basic.showNumber(kitronik_RTC.readMonth())
    basic.showNumber(kitronik_RTC.readYear())
    basic.pause(1000)
})
```

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)


```package
pxt-kitronik-rtc=github:KitronikLtd/pxt-kitronik-rtc
```
