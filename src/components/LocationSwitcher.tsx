
import { Component, createSignal, For, Show } from 'solid-js';

import { Items } from './Item'
import { TextInput } from './TextInput';
import icons from '../icons';
import styles from './css/LocationSwitcher.module.css';
import { onLoseFocusDirective } from '../utils';
const onLoseFocus = onLoseFocusDirective


type LocationSwitcherProps = {
    onchange: (x: string) => void,
}
const LocationSwitcher: Component<LocationSwitcherProps> = (props) => {

    const [ location, setLocation ] = createSignal('')
    const [ selected, setSelected ] = createSignal(false)
    function toggle() { setSelected(prev => !prev) }

    function addNewLocation() {
        Items.addLocation(location())
        props.onchange(location())
        setLocation('')
        toggle()
    }


    return <section
        class={styles.locationswitcher}
        use:onLoseFocus={() => setSelected(false)}
    >
        <For each={Items.locations()}>
            { (location) =>
            <button onclick={() => props.onchange(location)}>
                { location }
            </button> }
        </For>

        <Show when={!selected()}>
            <button class='iconbtn' onclick={toggle} title='Add new location'>
                { icons.plus() }
            </button>
        </Show>

        <Show when={selected()}>
            <TextInput
                editonly={true}
                includeSubmit={true}
                placeholder='Location name'
                value={location()}
                onchange={setLocation}
                onsubmit={addNewLocation}
            />
        </Show>

    </section>
}

export default LocationSwitcher;

