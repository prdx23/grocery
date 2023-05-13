
import { createSignal, Show, Switch, Match } from 'solid-js';

import icons from '../icons';
import styles from './css/CountInput.module.css';


type CountProps = {
    value: number,
    onchange: (value: number) => void,
    editonly?: boolean,
    class?: string,
}


export const CountInput = (props: CountProps) => {

    const [ edit, setEdit ] = createSignal(!!props.editonly);
    function toggle() { if( !props.editonly ) { setEdit((prev) => !prev); } }

    function incCount() {
        props.onchange(props.value < 99 ? props.value + 1 : 99);
    }

    function decCount() {
        props.onchange(props.value > 1 ? props.value - 1 : 1);
    }

    return <div class={styles.count_container + ' ' + props.class}> <Switch>

        <Match when={props.editonly}>
            <button type='button' onclick={decCount} class='iconbtn'>
                { icons.minus() }
            </button>
            <div class={styles.editonly}>
                <p class={styles.number}>{ props.value }</p>
            </div>
            <button type='button' onclick={incCount} class='iconbtn'>
                { icons.plus() }
            </button>
        </Match>

        <Match when={!edit()}>
            <div style='display: flex;'>
                <Show when={ props.value < 10 }>&nbsp;</Show>
                <button type='button' class={styles.display} onclick={toggle}>
                    <p class={styles.number}>{ props.value }</p>
                </button>
            </div>
        </Match>

        <Match when={edit()}>
            <button type='button' onclick={decCount} class='iconbtn'>
                { icons.minus() }
            </button>
            <button type='button' class={styles.edit} onclick={toggle}>
                <p class={styles.number}>
                    { props.value.toString().padStart(2, '0') }
                </p>
            </button>
            <button type='button' onclick={incCount} class='iconbtn'>
                { icons.plus() }
            </button>
        </Match>

    </Switch> </div>

}
