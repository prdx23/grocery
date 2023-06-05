
import { Component, createSignal, Show, Switch, Match } from 'solid-js';
// import { Portal } from "solid-js/web";
import { add, parse, differenceInCalendarDays } from 'date-fns'

import { CountInput } from './CountInput';
import { ExpiryDate } from './Item';
import icons from '../icons';
import styles from './css/ExpiryInput.module.css';
import { onLoseFocusDirective } from '../utils';
const onLoseFocus = onLoseFocusDirective



type ExpiryInputProps = {
    value: ExpiryDate,
    onchange: (value: ExpiryDate) => void,
    editonly?: boolean,
    class?: string,
}
export const ExpiryInput: Component<ExpiryInputProps> = (props) => {

    const today = new Date()

    function updateDays(days: number) {
        props.onchange(add(today, { days: days }))
    }

    function updateDate(date: string) {
        props.onchange(parse(date, 'yyyy-MM-dd', today))
    }

    function resetExpiry() {
        props.onchange('none')
    }

    function displayDays() {
        let days = 1
        if( props.value != 'none' ) {
            days = differenceInCalendarDays(new Date(props.value), today)
        }
        return days
    }

    function displayDate() {
        let date = add(today, { days: 1 })
        if( props.value != 'none' ) { date = new Date(props.value) }
        return toISOStringWithTimezone(date).slice(0, 10)
    }

    const [ selected, setSelected ] = createSignal(false)
    function toggle() { setSelected(prev => !prev) }

    function EditMenu() {
        return <section style={selected() ? 'display:inherit':'display:none'}>
            <div class={styles.days}>
                {/* <input type='number' min='1'/> <p> Days </p> */}
                <p> Days: </p>
                <CountInput
                    value={displayDays()}
                    onchange={updateDays}
                    editonly={true}
                />
            </div>
            <div class={styles.or}>
                <hr/>
                <p> or </p>
                <hr/>
            </div>
            <div class={styles.date}>
                <p> Date: </p>
                <input
                    type='date'
                    min={toISOStringWithTimezone(today).slice(0, 10)}
                    value={displayDate()}
                    onchange={(e) => updateDate(e.target.value)}
                />
            </div>
            <div class={styles.or}>
                <hr/>
                <p> or </p>
                <hr/>
            </div>
            <button type='button' onclick={resetExpiry}>
                Remove Expiry
            </button>
        </section>
    }

    if( props.editonly ) {
        return <div
            class={styles.expiry_container + ' ' + props.class}
            use:onLoseFocus={() => setSelected(false)}
        >
            <button type='button' class={styles.mainbtn} onclick={toggle}>
                <Show when={props.value == 'none'}>
                    Set Expiry
                </Show>
                <Show when={props.value != 'none'}>
                    Expires in {displayDays()} days
                </Show>
            </button>
            <EditMenu />
        </div>
    }

    return <div
        class={styles.expiry_container + ' ' + props.class}
        use:onLoseFocus={() => setSelected(false)}
    >
        <Show when={props.value == 'none'}>
            <button
                type='button'
                class={styles.display_icon}
                onclick={toggle}
                title={'Set Expiry'}
            >
                <div class={styles.clockbtn}>{ icons.clock() }</div>
            </button>
        </Show>
        <Show when={props.value != 'none' && displayDays() >= 0}>
            <button
                type='button'
                class={styles.display}
                onclick={toggle}
            >
                Expires in {displayDays()} days
            </button>
        </Show>
        <Show when={props.value != 'none' && displayDays() < 0}>
            <button
                type='button'
                class={styles.display}
                onclick={toggle}
            >
                Expired {-displayDays()} days ago
            </button>
        </Show>
        <EditMenu />
    </div>
}

const toISOStringWithTimezone = (date: Date) => {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        diff + pad(tzOffset / 60) +
        ':' + pad(tzOffset % 60);
};
