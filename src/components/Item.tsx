import type { Store, SetStoreFunction } from "solid-js/store";

import { createSignal, createUniqueId, Show } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';


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
        const id = createUniqueId()
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

    static increaseCount(id: string) {
        this.setItems(id, 'count', (prev) => prev < 99 ? prev + 1 : 99);
        this.save()
    }

    static decreaseCount(id: string) {
        this.setItems(id, 'count', (prev) => prev > 1 ? prev - 1 : 1);
        this.save()
    }

    static changeName(id: string, name: string) {
        this.setItems(id, 'name', name)
        this.save()
    }

    static changeLocation(id: string, location: LocationString) {
        this.setItems(id, 'location', location)
        this.save()
    }
}


type ViewModes = 'view' | 'edit' | 'msg'


export const ItemView = (props: { item: Item }) => {
    const deleteItem = () => { Items.delete(props.item.id) }
    const incCount = () => { Items.increaseCount(props.item.id) }
    const decCount = () => { Items.decreaseCount(props.item.id) }

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
        }, 1000)
    }


    const [ mode, setMode ] = createSignal<ViewModes>('view')


    return <section class={styles.item}>

        <Show when={ mode() === 'msg' }>
            <p class={styles.count}>0</p>
            <p> Item archived! </p>
        </Show>

        <Show when={ mode() === 'view' }>
            <p class={styles.count}>{ props.item.count }</p>
            <p class={styles.name}>{ props.item.name }</p>

            <Show when={['inventory', 'archive'].includes(props.item.location)}>
                <button class={styles.edit} onclick={addToShoppingList}>
                    Add to { Items.locationDisplay('shopping_list') }
                </button>
            </Show>

            <Show when={['shopping_list', 'archive'].includes(props.item.location)}>
                <button class={styles.edit} onclick={moveToInventory}>
                    Move to { Items.locationDisplay('inventory') }
                </button>
            </Show>

            <button class={styles.edit} onclick={() => setMode('edit')}>
                Edit
            </button>

        </Show>

        <Show when={ mode() === 'edit' }>

            <Show when={props.item.location === 'archive'}>
                <button onclick={deleteItem}>Delete</button>
            </Show>
            <div class={styles.editcount}>
                <Show when={props.item.location !== 'archive'}>
                    <button onclick={moveToArchive}>x</button>
                    &nbsp;
                </Show>
                <button onclick={decCount}>–</button>
                <p>&nbsp; { props.item.count } &nbsp;</p>
                <button onclick={incCount}>+</button>
            </div>

            <input
                type='text'
                value={ props.item.name }
                oninput={ (e) => {
                    Items.changeName(props.item.id, e.target.value)
                }}
            />

            <button class={styles.save} onclick={() => setMode('view')}>
                Done
            </button>
        </Show>

    </section>
};

