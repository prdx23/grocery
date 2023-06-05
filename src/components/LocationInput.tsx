
import { Component, createSignal, For } from 'solid-js';

import { Items } from './Item';
import icons from '../icons';
import styles from './css/LocationInput.module.css';
import { onLoseFocusDirective } from '../utils';
const onLoseFocus = onLoseFocusDirective


type LocationInputProps = {
    value: string,
    onchange: (value: string) => void,
    class?: string,
}
export const LocationInput: Component<LocationInputProps> = (props) => {

    const [ selected, setSelected ] = createSignal(false)
    function toggle() { setSelected(prev => !prev) }

    return <div
        class={styles.locationinput + ' ' + props.class}
        use:onLoseFocus={() => setSelected(false)}
    >
        <button
            type='button'
            class={styles.display + ' iconbtn'}
            onclick={toggle}
            title='Change Location'
        >
            { icons.location() }
        </button>

        <section style={selected() ? 'display: flex' : 'display: none'}>
            <For each={Items.locations()}>
                {(location) => {
                    if( location == props.value ) { return <></> }
                    return <button onclick={() => props.onchange(location)}>
                        {location}
                    </button>
                }}
            </For>
        </section>

    </div>
}
