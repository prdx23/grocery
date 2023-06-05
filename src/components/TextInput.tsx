
import { Component, createSignal, Show } from 'solid-js';

import icons from '../icons';
import styles from './css/TextInput.module.css';
import { onLoseFocusDirective } from '../utils';
const onLoseFocus = onLoseFocusDirective


type TextInputProps = {
    value: string,
    placeholder: string,
    onchange: (value: string) => void,
    onsubmit?: (value: string) => void,
    editonly?: boolean,
    includeSubmit?: boolean,
    class?: string,
}
export const TextInput: Component<TextInputProps> = (props) => {

    let input: HTMLInputElement
    const [ selected, setSelected ] = createSignal(false)
    function deselect() { setSelected(false) }
    function select() {
        setSelected(true)
        input.focus()
        input.value = props.value
    }

    function submit() {
        if( props.onsubmit ) {
            props.onsubmit(!!props.editonly ? props.value : input.value)
        }
        deselect()
    }

    if( props.editonly ) {
        return <div class={styles.textinput_container + ' ' + props.class}>
            <div class={styles.edit}>
                <input
                    type='text'
                    required
                    placeholder={props.placeholder}
                    value={ props.value }
                    oninput={(e) => props.onchange(e.target.value)}
                    onkeyup={(e) => { if(e.key == 'Enter') {submit()} }}
                />
                <Show when={props.includeSubmit}>
                    <button type='button' class='iconbtn' onclick={submit}>
                        { icons.tick() }
                    </button>
                </Show>
            </div>
        </div>
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
                placeholder={props.placeholder}
                value={ props.value }
                oninput={(e) => props.onchange(e.target.value)}
                onkeyup={(e) => { if(e.key == 'Enter') {submit()} }}
                ref={input!}
            />
            <button type='button' class='iconbtn' onclick={submit}>
                { icons.tick() }
            </button>
        </div>
    </div>
}
