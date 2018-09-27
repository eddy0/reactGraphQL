import React, {Component} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import NProgress from 'nprogress'
import {Mutation} from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import calcTotalPrice from '../lib/calcTotalPrice'
import PropTypes from 'prop-types'
import Error from './ErrorMessage'
import User from './User'


const totalItems = (carts) => {
    return carts.reduce((total, item ) => {
        return total + item.quantity
    },0)
}

class TakeMyMoney extends Component {
    
    onToken = (response) => {
        console.log('response', response.id)
    
    }
    
    render() {
        return (
            <User>
                {
                    ({data: {me}}) => {
                        return (
                            <StripeCheckout
                                amount={calcTotalPrice(me.cart)}
                                name='sports'
                                description={`order of ${totalItems(me.cart)} items`}
                                image={me.cart[0].item && me.cart[0].item.image}
                                stripeKey='pk_test_Vg4EEDemXSj71tAVGIBRLU5W'
                                currency='USD'
                                email={me.email}
                                token={response => this.onToken(response)}
                            >
                                {this.props.children}
                            </StripeCheckout>
                        )
                    }
                }
                
            </User>
        )
    }
}



export default TakeMyMoney