
import { createSignal, Show } from 'solid-js';

import { Items } from './Item';
import type { Item } from './Item';
import { CountInput } from './CountInput';
import { TextInput } from './TextInput';
import styles from './css/ItemView.module.css';



export const ItemView = (props: { item: Item }) => {

    const updateCount = (x: number) => { Items.updateCount(props.item.id, x) }
    const updateName = (x: string) => { Items.updateName(props.item.id, x) }

    const deleteItem = () => { Items.delete(props.item.id) }

    const moveToInventory = () => {
        Items.changeLocation(props.item.id, 'inventory')
    }

    const addToShoppingList = () => {
        Items.add(props.item.name, 1,'shopping_list')
    }

    const moveToArchive = () => {
        setMode('msg')
        setTimeout(() => {
            Items.changeLocation(props.item.id, 'archive')
            setMode('view')
        }, 500)
    }

    type ViewModes = 'view' | 'msg'
    const [ mode, setMode ] = createSignal<ViewModes>('view')

    return <section class={styles.item}>

        <Show when={ mode() === 'msg' }>
            <p style='margin: 0; margin-left: 93px'> Item archived! </p>
        </Show>

        <Show when={ mode() === 'view' }>

            <Show when={props.item.location !== 'archive'}>
                <button type='button' class={styles.action + ' iconbtn'} onclick={moveToArchive}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.458 26.458">
                        <path d="M9.922-2.172V9.922H-2.172v6.614H9.922v12.095h6.614V16.536h12.095V9.922H16.536V-2.172z" transform="rotate(45 13.23 13.23)"/>
                    </svg>
                </button>
            </Show>

            <Show when={props.item.location == 'archive'}>
                <button onclick={deleteItem}>Delete</button>
            </Show>

            <CountInput value={props.item.count} onchange={updateCount} />
            <TextInput class={styles.name} value={props.item.name} onchange={updateName} />

            <Show when={['inventory', 'archive'].includes(props.item.location)}>
                <button class={styles.action} onclick={addToShoppingList}>
                    Add to { Items.locationDisplay('shopping_list') }
                </button>
            </Show>

            <Show when={['shopping_list', 'archive'].includes(props.item.location)}>
                <button class={styles.action} onclick={moveToInventory}>
                    Move to { Items.locationDisplay('inventory') }
                </button>
            </Show>

        </Show>

    </section>
};


