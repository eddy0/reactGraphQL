import React, {Component} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import NProgress from 'nprogress'
import {Mutation} from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import calcTotalPrice from '../lib/calcTotalPrice'
import PropTypes from 'prop-types'
import Error from './ErrorMessage'
import User, {CURRENT_USER_QUERY} from './User'


const totalItems = (carts) => {
    return carts.reduce((total, item ) => {
        return total + item.quantity
    },0)
}

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`

class TakeMyMoney extends Component {
    
    onToken = async (response, createOrder) => {
        NProgress.start()
        const order = await createOrder({variables: {token: response.id}})
        Router.push({
            pathname: '/order',
            query: {
                id: order.data.createOrder.id
            }
        })
    
    }
    
    render() {
        return (
            <User>
                {
                    ({data: {me}}) => {
                        return (
                            <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]} >
                                {
                                    (createOrder, {error, loading}) => {
                                        return (
                                            <StripeCheckout
                                                amount={calcTotalPrice(me.cart)}
                                                name='sports'
                                                description={`order of ${totalItems(me.cart)} items`}
                                                image={ me.cart.length && me.cart[0].item && me.cart[0].item.image || ''}
                                                stripeKey='pk_test_Vg4EEDemXSj71tAVGIBRLU5W'
                                                currency='USD'
                                                email={me.email}
                                                token={response => this.onToken(response, createOrder)}
                                            >
                                                {this.props.children}
                                            </StripeCheckout>
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



export default TakeMyMoney