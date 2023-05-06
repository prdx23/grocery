import { createSignal, batch } from 'solid-js';

import styles from './AddItemView.module.css';

import { Items } from './Item'
import type { LocationString } from './Item'


const AddItemView = () => {

    const [ name, setName ] = createSignal('')
    const [ count, setCount ] = createSignal(1)
    const [ location, setLocation ] = createSignal<LocationString>('inventory')

    const incCount = () => {
        setCount((prev) => prev < 99 ? prev + 1 : 99)
    }

    const decCount = () => {
        setCount((prev) => prev > 1 ? prev - 1 : 1)
    }

    function addItem(e: SubmitEvent) {
        e.preventDefault()
        batch(() => {
            Items.add(name(), count(), location())
            setName('')
            setCount(1)
        })
    }

    return <form class={styles.additemview} onsubmit={addItem}>

        <button class={styles.countbtn} type='button' onclick={decCount}>
            –
        </button>
        <p>{ count() }</p>
        <button class={styles.countbtn} type='button' onclick={incCount}>
            +
        </button>

        <input
            type='text'
            required
            value={ name() }
            oninput={ (e) => setName(e.target.value) }
            placeholder='Item name'
        />

        <input
            type='radio'
            name='location'
            id='inventory-radio'
            value='inventory'
            checked
            onclick={() => setLocation('inventory')}
        />
        <label for='inventory-radio'>
            { Items.locationDisplay('inventory') }
        </label>

        <input
            type='radio'
            name='location'
            id='shopping_list-radio'
            value='shopping_list'
            onclick={() => setLocation('shopping_list')}
        />
        <label for='shopping_list-radio'>
            { Items.locationDisplay('shopping_list') }
        </label>

        <button> Add </button>
    </form>
};


export default AddItemView;

