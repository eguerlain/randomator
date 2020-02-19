import React from 'react'
import style from './index.module.sass'
import { Title } from '../title'
import { Icon } from '../icon'

export interface Props {
    icon?: string,
    name: string,
    address?: string
}

export const Hero = ({ icon, name, address }: Props) => {
    return (
        <div className={style.hero}>
            {icon && <Icon size={80}>{icon}</Icon>}
            <Title className={style.title}>{name}</Title>
            <span className={style.address}>{address}</span>
        </div>
    )
}