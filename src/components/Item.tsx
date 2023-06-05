
import { createStore, unwrap, produce } from 'solid-js/store';
import type { Store, SetStoreFunction } from "solid-js/store";
import { createMemo } from "solid-js";

import styles from './Item.module.css';
import { addPopup } from './Popup';


export type ExpiryDate = Date | 'none'

export type Item = {
    name: string,
    count: number,
    expiry: ExpiryDate,
}

type ItemStore = Record<string, Item[]>


export class Items {

    static items: Store<ItemStore>
    static setItems: SetStoreFunction<ItemStore>

    static {
        const version = localStorage.getItem('data_version');
        const datastr = localStorage.getItem('data');

        let data = {
            'Inventory': [],
            'Archive': [],
            'Shopping List': [],
        }
        if( version == '2' && datastr !== null ) {
            data = JSON.parse(datastr)
        }

        const [ items, setItems ] = createStore<ItemStore>(data);
        this.items = items;
        this.setItems = setItems;
    }


    static save() {
        localStorage.setItem('data', JSON.stringify(unwrap(this.items)));
        localStorage.setItem('data_version', '2')
    }

    static list(location: string) {
        return this.items[location]
    }

    static locations() {
        return Object.keys(this.items).filter(x => x != 'Shopping List')
    }


    static add(location: string, newItem: Item) {

        if( this.items[location] === undefined ) {
            addPopup(`location '${location}' does not exist`)
            return
        }

        for( const [i, item] of this.items[location].entries() ) {
            if( item.name == newItem.name ) {
                this.updateCount(location, i, item.count + newItem.count)
                // addPopup('Item Updated!')
                return
            }
        }

        this.setItems(produce(state => state[location].push(newItem)))
        this.save()
        // addPopup('Item Added!')
    }


    static delete(location: string, id: number) {
        if( this.items[location] === undefined ) {
            addPopup(`location '${location}' does not exist`)
            return
        }
        this.setItems(produce(state => state[location].splice(id, 1)))
        this.save()
    }


    static updateCount(location: string, id: number, value: number) {
        this.setItems(location, id, 'count', Math.min(Math.max(value, 1), 99))
        this.save()
    }

    static updateName(location: string, id: number, name: string) {
        this.setItems(location, id, 'name', name)
        this.save()
    }

    static updateExpiry(location: string, id: number, expiry: ExpiryDate) {
        this.setItems(location, id, 'expiry', expiry)
        this.save()
    }

    static moveUp(location: string, id: number) {
        if( id == 0 ) { return }
        this.setItems(produce(state => {
            const temp = state[location][id - 1]
            state[location][id - 1] = state[location][id]
            state[location][id] = temp
        }))
        this.save()
    }

    static moveDown(location: string, id: number) {
        if( id == this.items[location].length - 1 ) { return }
        this.setItems(produce(state => {
            const temp = state[location][id + 1]
            state[location][id + 1] = state[location][id]
            state[location][id] = temp
        }))
        this.save()
    }


    static changeItemLocation(location: string, id: number, newLocation: string) {
        if( location == newLocation ) { return }
        this.add(newLocation, {...this.items[location][id]})
        this.delete(location, id)
    }

    static addLocation(location: string) {
        if( this.locations().length >= 20 ) { return }
        if( this.items[location] !== undefined ) {
            addPopup(`'${location}' already exists`)
            return
        }
        if( location == '' ) {
            addPopup(`'${location}' is empty`)
            return
        }
        this.setItems(location, [])
        this.save()
    }

    static changeLocationName(location: string, newLocation: string) {
        if( this.items[newLocation] !== undefined ) {
            addPopup(`'${newLocation}' already exists`)
            return false
        }
        if( ['Inventory', 'Archive', 'Shopping List'].includes(newLocation) ) {
            addPopup(`'${newLocation}' is built-in and cannot be deleted`)
            return false
        }
        this.setItems(newLocation, this.items[location])
        this.setItems(location, [])
        this.deleteLocation(location)
        this.save()
        return true
    }

    static deleteLocation(location: string) {
        if( ['Inventory', 'Archive', 'Shopping List'].includes(location) ) {
            addPopup(`'${location}' is built-in and cannot be deleted`)
            return false
        }
        if( this.items[location].length != 0 ) {
            addPopup(`'${location}' is not empty and cannot be deleted`)
            return false
        }
        if( this.items[location] === undefined ) {
            addPopup(`location '${location}' does not exist`)
            return false
        }
        this.setItems(location, undefined!)
        this.save()
        return true
    }

}
