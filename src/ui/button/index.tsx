import React from 'react'
import style from './index.module.sass'

interface Props {
    children: string,
    onClick?: () => void
}

export const Button = ({ children, onClick }: Props) => {
    return (
        <button className={style.button} onClick={onClick}>
            {children}
        </button>
    )
}