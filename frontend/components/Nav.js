import React from 'react'
import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'


const Nav = () => {
    return (
        <NavStyles>
            <User>
                {
                    ({data}) => {
                    return (
                        <p>
                            {data.me.name}
                        </p>
                    )
                }}
            </User>
            <Link href="/">
                <a>Items</a>
            </Link>
            <Link href="/sell">
                <a>Sell</a>
            </Link>
            <Link href="/signup">
                <a>Signup</a>
            </Link>
            <Link href="/orders">
                <a>Orders</a>
            </Link>
            <Link href="/account">
                <a>Account</a>
            </Link>
        
        </NavStyles>
    )
}

export default Nav
