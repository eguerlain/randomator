import React from 'react'
import style from './index.module.sass'
import classnames from 'classnames'

interface Props {
    children: string,
    className?: string
}

export const Title = ({ className, children }: Props) => {
    return <h1 className={classnames(className, style.title)}>{children}</h1>
}