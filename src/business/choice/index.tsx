import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { Button } from '../../ui/button'
import { Hero, Props as HeroProps } from '../../ui/hero'
import styles from './index.module.sass'

const MYJSON_URL = 'https://api.myjson.com/bins/ueanc'

const getMinMax = (field: string, data: any[]) => {
    const min = Math.min(...data.map(item => item[field]))
    const max = Math.max(...data.map(item => item[field]))
    return { min, max }
}

interface Restaurant {
    name: string;
    icon: string;
    address: string;
    proximity: number;
    healthy: boolean;
    cost: number;
    light: boolean;
    speed: number;
}

interface BooleanOptionProps {
    className?: string,
    activated: boolean,
    low: {
        text: string,
        icon: string,
    },
    high: {
        text: string
        icon: string,
    },
    value: boolean,
    onClick: () => void,
    onLabelClick: () => void
}

interface IntegerOptionProps {
    className?: string,
    activated: boolean,
    low: {
        text: string,
    },
    high: {
        text: string,
    },
    unit: string,
    min: number,
    max: number,
    value: number,
    onChange: (value: number) => void,
    onLabelOrValueClick: () => void
}

const BooleanOption = ({ activated, low, high, value, onClick, onLabelClick, className }: BooleanOptionProps) => {
    const labelText = value ? high.text : low.text
    const icon = value ? high.icon : low.icon
    return (
        <div className={classnames(styles.booleanOption, {
            [styles.desactivated]: !activated
        }, className)} onClick={onClick}>
            <div className={styles.label} onClick={event => { event.stopPropagation(); onLabelClick() }}>
                {labelText}
            </div>
            <div className={styles.spacer} />
            <div className={styles.value}>
                {`${icon}`}
            </div>
        </div>
    )
}

const IntegerOption = ({ activated, low, high, unit, min, max, value, onChange, onLabelOrValueClick, className }: IntegerOptionProps) => {
    const labelText = value > min + (max - min) / 2 ? high.text : low.text
    return (
        <div className={classnames(styles.integerOption, {
            [styles.desactivated]: !activated
        }, className)}>
            <div className={styles.label} onClick={onLabelOrValueClick}>
                {labelText}
            </div>
            <input
                className={styles.slider}
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={event => onChange(Number(event.target.value))}
            />
            <div className={styles.value} onClick={onLabelOrValueClick}>
                {`${value} ${unit}`}
            </div>
        </div>
    )
}

export const ChoicePage = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [hero, setHero] = useState<HeroProps>({ name: 'On mange où ce midi ?', icon: '❓', address: '' })
    const [buttonText, setButtonText] = useState<string>('Get a choice')
    const [showSettings, setShowSettings] = useState<boolean>(false)

    // Activations
    const [proximityActivated, setProximityActivated] = useState<boolean>(false)
    const [healthyActivated, setHealthyActivated] = useState<boolean>(false)
    const [costActivated, setCostActivated] = useState<boolean>(false)
    const [lightActivated, setLightActivated] = useState<boolean>(false)
    const [speedActivated, setSpeedActivated] = useState<boolean>(false)

    // Settings values
    const [proximity, setProximity] = useState<number>(0)
    const [healthy, setHealthy] = useState<boolean>(true)
    const [cost, setCost] = useState<number>(0)
    const [light, setLight] = useState<boolean>(false)
    const [speed, setSpeed] = useState<number>(0)

    // Min and max values
    const [proximityBounds, setProximityBounds] = useState<{ min: number, max: number }>({ min: 0, max: 0 })
    const [costBounds, setCostBounds] = useState<{ min: number, max: number }>({ min: 0, max: 0 })
    const [speedBounds, setSpeedBounds] = useState<{ min: number, max: number }>({ min: 0, max: 0 })

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(MYJSON_URL)
                const data = await response.json()
                setRestaurants(data)

                const bounds = {
                    proximity: getMinMax('proximity', data),
                    cost: getMinMax('cost', data),
                    speed: getMinMax('speed', data)
                }

                setProximityBounds(bounds.proximity)
                setCostBounds(bounds.cost)
                setSpeedBounds(bounds.speed)

                setProximity(Math.floor(bounds.proximity.min + (bounds.proximity.max - bounds.proximity.min) / 2))
                setCost(Math.floor(bounds.cost.min + (bounds.cost.max - bounds.cost.min) / 2))
                setSpeed(Math.floor(bounds.speed.min + (bounds.speed.max - bounds.speed.min) / 2))
            } catch (err) {
                // TODO Do something with the error
                console.error(err)
            }
        }

        getData()
    }, [])

    const fakeProximity = {
        low: {
            text: 'Proche',
        },
        high: {
            text: 'Loin'
        },
        unit: 'mn',
    }

    const fakeHealthy = {
        low: {
            text: 'Gras',
            icon: '🍟'
        },
        high: {
            text: 'Sain',
            icon: '🥑'
        }
    }

    const fakeCost = {
        low: {
            text: 'Cheap',
        },
        high: {
            text: 'Cher'
        },
        unit: '€',
    }

    const fakeLight = {
        low: {
            text: 'Rassasiant',
            icon: '🍗🥔🥔'
        },
        high: {
            text: 'Léger',
            icon: '🥕'
        },
    }

    const fakeSpeed = {
        low: {
            text: 'Rapide',
        },
        high: {
            text: 'Long'
        },
        unit: 'mn',
    }

    const getRandomRestaurant = () => {
        let places: Restaurant[] = restaurants
        if (proximityActivated) places = places.filter(p => p.proximity <= proximity)
        if (healthyActivated) places = places.filter(p => p.healthy === healthy)
        if (costActivated) places = places.filter(p => p.cost <= cost)
        if (lightActivated) places = places.filter(p => p.light === light)
        if (speedActivated) places = places.filter(p => p.speed <= speed)
        if (places.length) {
            return places[Math.floor(Math.random() * places.length)]
        } else {
            return {
                name: 'Not Found',
                icon: '🙁',
                address: "Essayez avec d'autres paramètres",
            }
        }
    }

    return restaurants.length
        ? (
            <div className={styles.choicePage} >
                <Hero {...hero} />
                <Button onClick={() => {
                    setHero(getRandomRestaurant())
                    setButtonText('Get another')
                }}>{buttonText}</Button>
                {
                    showSettings && (
                        <div className={styles.options}>
                            <IntegerOption className={styles.option} {...fakeProximity} {...proximityBounds} value={proximity} onChange={value => { setProximity(value); setProximityActivated(true) }} activated={proximityActivated} onLabelOrValueClick={() => setProximityActivated(!proximityActivated)} />
                            <BooleanOption className={styles.option} {...fakeHealthy} value={healthy} onClick={() => { if (healthyActivated) setHealthy(!healthy); setHealthyActivated(true) }} activated={healthyActivated} onLabelClick={() => setHealthyActivated(!healthyActivated)} />
                            <IntegerOption className={styles.option} {...fakeCost} {...costBounds} value={cost} onChange={value => { setCost(value); setCostActivated(true) }} activated={costActivated} onLabelOrValueClick={() => setCostActivated(!costActivated)} />
                            <BooleanOption className={styles.option} {...fakeLight} value={light} onClick={() => { if (lightActivated) setLight(!light); setLightActivated(true) }} activated={lightActivated} onLabelClick={() => setLightActivated(!lightActivated)} />
                            <IntegerOption className={styles.option} {...fakeSpeed} {...speedBounds} value={speed} onChange={value => { setSpeed(value); setSpeedActivated(true) }} activated={speedActivated} onLabelOrValueClick={() => setSpeedActivated(!speedActivated)} />
                        </div>
                    )
                }
                <button className={styles.moreButton} onClick={() => setShowSettings(!showSettings)}></button>
            </div >
        )
        : null
}