
import { createSignal, Switch, Match } from 'solid-js';

import icons from '../icons';
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
                    { icons.tick() }
                </button>
            </div>
        </Match>

    </Switch> </div>

}
