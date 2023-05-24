import { CSSObject } from '@emotion/react'
import { Theme } from '@emotion/react'
import { capitalize } from './util'
import type { Property } from 'csstype'

export const SIZES = {
    small: '.2rem',
    default: '.5rem',
    medium: '.8rem',
    large: '1rem',
    xlarge: '2.5rem',
    xxlarge: '4rem',
}

export type edgeKindT = "margin" | "border" | "padding"
export type Size = keyof typeof SIZES

export const SCREEN_SIZES = {
    xs: `max-width: 576px`,
    sm: `min-width: 576px`,
    md: `min-width: 768px`,
    lg: `min-width: 992px`,
    xl: `min-width: 1200px`,
    xxl: `min-width: 1400px`,
    mobile: `max-width: 767px`,
    tablet: `min-width: 768px`,
    desktop: `min-width: 992px`,
}
export type ScreenSizeNames = keyof typeof SCREEN_SIZES

export const ALIGN_CONTENT_MAP = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    around: 'space-around',
    between: 'space-between',
    evenly: 'space-evenly',
    stretch: 'stretch',
}
//export type AlignContentNames = keyof typeof ALIGN_CONTENT

export const BASIS = {
    '1/2': '50%',
    '1/4': '25%',
    '2/4': '50%',
    '3/4': '75%',
    auto: 'auto',
    full: '100%',
    '1/3': '33.33%',
    '2/3': '66.66%',
}

export const JUSTIFY_MAP = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    around: 'space-around',
    between: 'space-between',
    evenly: 'space-evenly',
}

export const FLEX = {
    grow: '1 0',
    shrink: '0 1',
}

export interface Area {
    horizontal?: Size | string | number
    vertical?: Size | string | number
    top?: Size | string | number
    bottom?: Size | string | number
    left?: Size | string | number
    right?: Size | string | number
}

export type Side = keyof Area

export const ALIGN_SELF_MAP = {
    center: 'center',
    end: 'flex-end',
    start: 'flex-start',
    stretch: 'stretch',
    left: 'left',
    right: 'right',
    baseline: 'baseline',
}


export const ALIGN_MAP = {
    baseline: 'baseline',
    center: 'center',
    end: 'flex-end',
    start: 'flex-start',
    stretch: 'stretch',
}

export type AlignNames = keyof typeof ALIGN_MAP

export interface GenericProps {
    margin?: number | string | Size | Area | Side
    padding?: number | string | Size | Area | Side
}

export const genericStyles = (props: GenericProps & { theme: Theme }): CSSObject => {
    const styles: CSSObject = {}
    if (props.margin) {
        Object.assign(styles, edgeStyle('margin', props.margin))
    }
    if (props.padding) {
        Object.assign(styles, edgeStyle('padding', props.padding))
    }
    return styles
}


interface OverflowI {
    horizontal?: Property.OverflowX
    vertical?: Property.OverflowX
}

export const overflowStyle = (overflowProp: string | OverflowI): CSSObject => {
    if (typeof overflowProp === 'string') {
        return { overflow: overflowProp }
    }
    const style: CSSObject = {}
    if (overflowProp.horizontal) style['overflowX'] = overflowProp.horizontal;
    if (overflowProp.vertical) style['overflowY'] = overflowProp.vertical;
    return style
}

const SIDES = ['top', 'right', 'left', 'bottom', 'horizontal', 'vertical']

export const edgeStyle = (
    kind: edgeKindT,
    data: string | number | Size | Area,
): CSSObject => {
    if (typeof data === 'string') {
        if (SIDES.includes(data)) {
            data = { [`${data}`]: SIZES.default }
        } else {
            return { [kind]: SIZES[data] || data }
        }
    }
    if (typeof data == 'number') {
        return { [kind]: `${data}px` }
    }

    const styles: CSSObject = {}

    if (data.horizontal) {
        styles[`${kind}Right`] = styles[`${kind}Left`] = SIZES[data.horizontal] || data.horizontal
    }
    if (data.vertical) {
        styles[`${kind}Top`] = styles[`${kind}Bottom`] = SIZES[data.vertical] || data.vertical
    }

    ['top', 'right', 'bottom', 'left'].forEach(side => {
        const value = data[side]
        if (value) {
            styles[`${kind}${capitalize(side)}`] = SIZES[value] || value
        }
    })

    return styles
}
