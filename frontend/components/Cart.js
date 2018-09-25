import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

class Cart extends Component {
    render() {
        return (
            <CartStyles open={true}>
                <header>
                    <CloseButton title='close'>
                        &time;
                    </CloseButton>
                    <Supreme> Your Cart</Supreme>
                    <p>You Have __ items in your carts.</p>
                </header>
                <footer>
                    <p>$10.00</p>
                    <SickButton>checkout</SickButton>
                </footer>
                
            </CartStyles>
        )
    }
}

export default Cart