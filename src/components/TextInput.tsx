
import { Component, createSignal } from 'solid-js';

import icons from '../icons';
import styles from './css/TextInput.module.css';
import { onLoseFocusDirective } from '../utils';
const onLoseFocus = onLoseFocusDirective


type TextInputProps = {
    value: string,
    onchange: (value: string) => void,
    editonly?: boolean,
    class?: string,
}
export const TextInput: Component<TextInputProps> = (props) => {

    if( props.editonly ) {
        return <div class={styles.textinput_container + ' ' + props.class}>
            <div class={styles.edit}>
                <input
                    type='text'
                    required
                    placeholder='Item Name'
                    value={ props.value }
                    oninput={(e) => props.onchange(e.target.value)}
                />
            </div>
        </div>
    }

    let input: HTMLInputElement
    const [ selected, setSelected ] = createSignal(false)
    function deselect() { setSelected(false) }
    function select() {
        setSelected(true)
        input.focus()
    }

    return <div
        class={styles.textinput_container + ' ' + props.class}
        use:onLoseFocus={deselect}
    >
        <button
            type='button'
            class={styles.display}
            style={selected() ? 'display: none' : 'display: inherit'}
            onclick={select}
        >
            <p class={styles.text}>{ props.value }</p>
        </button>

        <div
            class={styles.edit}
            style={!selected() ? 'display: none' : 'display: flex'}
        >
            <input
                type='text'
                required
                placeholder='Item Name'
                value={ props.value }
                oninput={(e) => props.onchange(e.target.value)}
                onkeyup={(e) => { if(e.key == 'Enter') {deselect()} }}
                ref={input!}
            />
            <button type='button' class='iconbtn' onclick={deselect}>
                { icons.tick() }
            </button>
        </div>
    </div>
}
