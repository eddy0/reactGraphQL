import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'



export const LOCAL_STATE_QUERY = gql`
    query  {
        cartOpen @client
    }
`
export const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`

class Cart extends Component {
    render() {
        return (
            <Mutation mutation={TOGGLE_CART_MUTATION}>
                {
                    (toggleCart, {data, error, loading}) => {
                        return (
                            <Query query={LOCAL_STATE_QUERY}>
                                {({data, error, loading}) => {
                                    return (
                                        <CartStyles open={data.cartOpen}>
                                            <header>
                                                <CloseButton title='close' onClick={toggleCart}>
                                                    x
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
                                }}
    
                            </Query>
                        )
                    }
                }
            </Mutation>
          
        )
    }
}


export default Cart