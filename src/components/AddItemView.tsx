
import { createSignal, batch } from 'solid-js';

import { Items } from './Item'
import type { LocationString, ExpiryDate } from './Item'
import { CountInput } from './CountInput';
import { TextInput } from './TextInput';
import { ExpiryInput } from './ExpiryInput';
import styles from './css/AddItemView.module.css';


const AddItemView = () => {

    const [ name, setName ] = createSignal('')
    const [ count, setCount ] = createSignal(1)
    const [ location, setLocation ] = createSignal<LocationString>('inventory')
    const [ expiry, setExpiry ] = createSignal<ExpiryDate>('none')

    function addItem(e: SubmitEvent) {
        e.preventDefault()
        batch(() => {
            Items.add(name(), count(), location(), expiry())
            setName('')
            setCount(1)
            setExpiry('none')
        })
    }

    return <form class={styles.additemview} onsubmit={addItem}>

        <CountInput editonly={true} value={count()} onchange={setCount} />

        <TextInput editonly={true} value={name()} onchange={setName} />

        <ExpiryInput editonly={true} value={expiry()} onchange={setExpiry} />

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

