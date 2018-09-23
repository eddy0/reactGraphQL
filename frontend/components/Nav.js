import React from 'react'
import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'



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
