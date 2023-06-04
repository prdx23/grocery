
import { Component, createSignal, Show } from 'solid-js';

import icons from '../icons';
import styles from './css/CountInput.module.css';
import { onLoseFocusDirective } from '../utils';
const onLoseFocus = onLoseFocusDirective


type CountProps = {
    value: number,
    onchange: (value: number) => void,
    editonly?: boolean,
}
export const CountInput: Component<CountProps> = (props) => {

    function IncButton(p: {x: number, show: boolean}) {
        return <button
            type='button'
            class='iconbtn'
            style={p.show ? 'display: inherit' : 'display: none'}
            onclick={() => props.onchange(p.x < 99 ? p.x + 1 : 99)}
        >
            { icons.plus() }
        </button>
    }

    function DecButton(p: {x: number, show: boolean}) {
        return <button
            type='button'
            class='iconbtn'
            style={p.show ? 'display: inherit' : 'display: none'}
            onclick={() => props.onchange(p.x > 1 ? p.x - 1 : 1)}
        >
            { icons.minus() }
        </button>
    }

    if( props.editonly ) {
        return <div class={styles.count_container}>
            <DecButton x={props.value} show={true} />
            <div class={styles.editonly}>
                <p class={styles.number}>{ props.value }</p>
            </div>
            <IncButton x={props.value} show={true} />
        </div>
    }


    const [ selected, setSelected ] = createSignal(false)
    function toggle() { setSelected(prev => !prev) }

    const displayValue = () => {
        if( !selected() ) { return props.value }
        return props.value.toString().padStart(2, '0')
    }

    const displayClass = () => {
        return { [styles.display]: !selected(), [styles.edit]: selected() }
    }

    return <div
        class={styles.count_container}
        use:onLoseFocus={() => setSelected(false)}
    >
        <DecButton x={props.value} show={selected()} />
        <div style='display: flex;'>
            <Show when={ !selected() && props.value < 10 }>&nbsp;</Show>
            <button type='button' classList={displayClass()} onclick={toggle}>
                <p class={styles.number}>{displayValue()}</p>
            </button>
        </div>
        <IncButton x={props.value} show={selected()} />
    </div>
}
