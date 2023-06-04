
import { createStore, unwrap, produce } from 'solid-js/store';
import type { Store, SetStoreFunction } from "solid-js/store";
import { createMemo } from "solid-js";

import styles from './Item.module.css';


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
            console.error(`location ${location} does not exist`)
            return
        }

        for( const [i, item] of this.items[location].entries() ) {
            if( item.name == newItem.name ) {
                this.updateCount(location, i, item.count + newItem.count)
                return
            }
        }

        this.setItems(produce(state => state[location].push(newItem)))
        this.save()
    }


    static delete(location: string, id: number) {
        if( this.items[location] === undefined ) {
            console.error(`location ${location} does not exist`)
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


//     static addLocation(location: string) {
//     check total locations limit
//         if( this.items[location] !== undefined ) {
//             console.error(`location ${location} already exists`)
//             return
//         }
//         this.setItems(location, [])
//         this.save()
//     }

//     static deleteLocation(location: string) {
//         if( this.items[location] === undefined ) {
//             console.error(`location ${location} does not exist`)
//             return
//         }
//         this.setItems(location, undefined!)
//         this.save()
//     }

}





// export type LocationString = 'inventory' | 'shopping_list' | 'archive'
// export type ExpiryDate = Date | 'none'

// export type Item = {
//     id: string,
//     name: string,
//     count: number,
//     location: LocationString,
//     expiry: ExpiryDate,
// }

// type ItemStore = Record<string, Item>


// export class Items {

//     static items: Store<ItemStore>
//     static setItems: SetStoreFunction<ItemStore>;

//     static locations = {
//         'inventory': 'Inventory',
//         'shopping_list': 'Shopping List',
//         'archive': 'Archive',
//     }

//     static {
//         const version = localStorage.getItem('data_version');
//         const datastr = localStorage.getItem('data');

//         let data
//         if( version == '1' && datastr !== null ) {
//             data = JSON.parse(datastr)
//         } else {
//             data = {}
//         }

//         const [ items, setItems ] = createStore<ItemStore>(data);
//         this.items = items;
//         this.setItems = setItems;
//     }

//     static save() {
//         localStorage.setItem('data', JSON.stringify(unwrap(this.items)));
//         localStorage.setItem('data_version', '1')
//     }


//     static list(location: LocationString) {
//         return Object.values(this.items).filter((x) => x.location === location)
//     }

//     static locationDisplay(location: LocationString) {
//         return this.locations[location]
//     }

//     static locationKeys() {
//         return Object
//             .keys(this.locations)
//             .filter((x) => x !== 'shopping_list') as LocationString[]
//     }

//     // -------------------------------------------------------------

//     static add(
//         name: string, count: number,
//         location?: LocationString, expiry?: ExpiryDate
//     ) {
//         const id = `${Date.now().toString(16)}-${Math.floor(Math.random()*9999)}`
//         this.setItems(id, {
//             id: id,
//             name: name,
//             count: Math.max(Math.min(count, 99), 1),
//             location: location ? location : 'inventory',
//             expiry: expiry ? expiry : 'none',
//         });
//         this.save()
//     }

//     static delete(id: string) {
//         this.setItems(id, undefined!);
//         this.save()
//     }

//     static updateCount(id: string, value: number) {
//         this.setItems(id, 'count', Math.min(Math.max(value, 1), 99))
//         this.save()
//     }

//     static updateName(id: string, name: string) {
//         this.setItems(id, 'name', name)
//         this.save()
//     }

//     static changeLocation(id: string, location: LocationString) {
//         this.setItems(id, 'location', location)
//         this.save()
//     }

//     static updateExpiry(id: string, expiry: ExpiryDate) {
//         this.setItems(id, 'expiry', expiry)
//         this.save()
//     }
// }
