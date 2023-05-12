
import { createSignal, Switch, Match } from 'solid-js';

import styles from './css/TextInput.module.css';


type TextInputProps = {
    value: string,
    onchange: (value: string) => void,
    editonly?: boolean,
    class?: string,
}


export const TextInput = (props: TextInputProps) => {

    let input: HTMLInputElement

    const [ edit, setEdit ] = createSignal(!!props.editonly);
    function toggle() {
        if( !props.editonly ) {
            setEdit((prev) => !prev);
            if( edit() == true ) { input.focus() }
        }
    }

    const textbox = <input
        type='text'
        required
        placeholder='Item Name'
        value={ props.value }
        oninput={(e) => props.onchange(e.target.value)}
        onkeyup={(e) => { if(e.key == 'Enter') {toggle()} }}
        ref={input!}
    />

    return <div class={styles.textinput_container + ' ' + props.class}> <Switch>

        <Match when={props.editonly}>
            <div class={styles.edit}>
                { textbox }
            </div>
        </Match>

        <Match when={!edit()}>
            <button type='button' class={styles.display} onclick={toggle}>
                <p class={styles.text}>{ props.value }</p>
            </button>
        </Match>

        <Match when={edit()}>
            <div class={styles.edit}>
                { textbox }
                <button type='button' class='iconbtn' onclick={toggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.458 26.458">
                        <path d="M21.711 2.408 9.424 14.695l-4.677-4.677L.07 14.695l4.677 4.678 4.677 4.677 4.677-4.677L26.39 7.086Z"/>
                    </svg>
                </button>
            </div>
        </Match>

    </Switch> </div>

}
