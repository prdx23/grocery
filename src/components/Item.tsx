import type { Store, SetStoreFunction } from "solid-js/store";

import { createSignal, Show } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

import { CountInput } from './CountInput';
import { TextInput } from './TextInput';

import styles from './Item.module.css';


export type LocationString = 'inventory' | 'shopping_list' | 'archive'

export type Item = {
    id: string,
    name: string,
    count: number,
    location: LocationString,
}


type ItemStore = Record<string, Item>


export class Items {

    static items: Store<ItemStore>
    static setItems: SetStoreFunction<ItemStore>;

    static locations = {
        'inventory': 'Inventory',
        'shopping_list': 'Shopping List',
        'archive': 'Archive',
    }

    static {
        const version = localStorage.getItem('data_version');
        const datastr = localStorage.getItem('data');

        let data
        if( version == '1' && datastr !== null ) {
            data = JSON.parse(datastr)
        } else {
            data = {}
        }

        const [ items, setItems ] = createStore<ItemStore>(data);
        this.items = items;
        this.setItems = setItems;
    }

    static save() {
        localStorage.setItem('data', JSON.stringify(unwrap(this.items)));
        localStorage.setItem('data_version', '1')
    }


    static list(location: LocationString) {
        return Object.values(this.items).filter((x) => x.location === location)
    }

    static locationDisplay(location: LocationString) {
        return this.locations[location]
    }

    static locationKeys() {
        return Object
            .keys(this.locations)
            .filter((x) => x !== 'shopping_list') as LocationString[]
    }

    // -------------------------------------------------------------

    static add(name: string, count: number, location?: LocationString) {
        const id = `${Date.now().toString(16)}-${Math.floor(Math.random()*9999)}`
        this.setItems(id, {
            id: id,
            name: name,
            count: Math.max(Math.min(count, 99), 1),
            location: location ? location : 'inventory',
        });
        this.save()
    }

    static delete(id: string) {
        this.setItems(id, undefined!);
        this.save()
    }

    static updateCount(id: string, value: number) {
        this.setItems(id, 'count', Math.min(Math.max(value, 1), 99))
        this.save()
    }

    static updateName(id: string, name: string) {
        this.setItems(id, 'name', name)
        this.save()
    }

    static changeLocation(id: string, location: LocationString) {
        this.setItems(id, 'location', location)
        this.save()
    }
}


type ViewModes = 'view' | 'msg'


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

