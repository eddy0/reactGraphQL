import React from 'react'
import Link from 'next/link'
import { Mutation} from 'react-apollo'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'
import {TOGGLE_CART_MUTATION} from './Cart'
import CartCount from './CartCount'



const Nav = () => {
    return (
        <User>
            {
                ({data}) => {
                    return (
                        <NavStyles>
                            <Link href="/">
                                <a>Items</a>
                            </Link>
                            {
                                data && data.me &&
                                <>
                                    <Link href="/sell">
                                        <a>Sell</a>
                                    </Link>
                                    
                                    < Link href='/orders'>
                                        <a>Orders</a>
                                    </Link>
                                    <Link href='/account'>
                                        <a>Account</a>
                                    </Link>
                                    {data.me.name}
                                    <Signout />
                                    <Mutation mutation={TOGGLE_CART_MUTATION}>
                                        {
                                            (toggleCart) =>{
                                                return (
                                                    <button onClick={toggleCart}>
                                                        my cart
                                                        <CartCount count={data.me.cart.reduce((time, item) => {
                                                            return time + item.quantity
                                                        }, 0)}
                                                        />
                                                    </button>
                                                )
                                            }
                                        }
                                    </Mutation>
                                </>
                            }
                            
                            {
                                data && !data.me &&
                                <>
                                    <Link href="/signup">
                                        <a>Signup</a>
                                    </Link>
                                    <Link href="/signin">
                                        <a>Signin</a>
                                    </Link>
                                </>
                            }
                        
                        </NavStyles>
                    )
                }}
        </User>
    
    )
}

export default Nav
