
import { createStore, unwrap } from 'solid-js/store';
import type { Store, SetStoreFunction } from "solid-js/store";

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
