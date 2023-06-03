
import { createSignal, batch } from 'solid-js';

import { Items } from './Item'
import type { ExpiryDate } from './Item'
import { CountInput } from './CountInput';
import { TextInput } from './TextInput';
import { ExpiryInput } from './ExpiryInput';
import styles from './css/AddItemView.module.css';


const AddItemView = () => {

    const [ name, setName ] = createSignal('')
    const [ count, setCount ] = createSignal(1)
    const [ location, setLocation ] = createSignal('Inventory')
    const [ expiry, setExpiry ] = createSignal<ExpiryDate>('none')

    function addItem(e: SubmitEvent) {
        e.preventDefault()
        batch(() => {
            Items.add(location(), {
                name: name(), count: count(), expiry: expiry()
            })
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
            onclick={() => setLocation('Inventory')}
        />
        <label for='inventory-radio'> Inventory </label>

        <input
            type='radio'
            name='location'
            id='shopping_list-radio'
            value='shopping_list'
            onclick={() => setLocation('Shopping List')}
        />
        <label for='shopping_list-radio'> Shopping List </label>

        <button> Add </button>
    </form>
};

export default AddItemView;

