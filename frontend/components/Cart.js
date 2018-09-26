import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import User from './User'
import CartItem from './CartItem'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'



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
            <User>
                {
                    ({data}) => {
                        if (!data.me) {
                            return null
                        }
                        const me = data.me
    
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
                                                                <p>You Have {me.cart.length} item{me.cart.length===1 ? '' : 's'} in your carts.</p>
                                                            </header>
                                                            <ul>
                                                                {me.cart.map((item) => {
                                                                    return (
                                                                        <CartItem key={item.id} item={item} />
                                                                    )
                                                                })}
                                                            </ul>
                                                            
                                                            <footer>
                                                                <p> {formatMoney(calcTotalPrice(me.cart))}</p>
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
            </User>
        )
    }
}


export default Cart