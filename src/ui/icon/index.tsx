import React from 'react'
import style from './index.module.sass'

interface Props {
    size: number,
    children: string
}

export const Icon = ({ size, children }: Props) => {
    return (
        <span
            className={style.icon}
            style={{
                fontSize: size
            }}
        >
            {children}
        </span>
    )
}