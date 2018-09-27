import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import {format} from 'date-fns'
import Head from 'next/head'
import gql from 'graphql-tag'
import OrderStyles from './styles/OrderStyles'
import DisplayError from './ErrorMessage'
import formatMoney from '../lib/formatMoney'



const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                image
                quantity
                price
                
            }
        }
    }
`


class Order extends Component {
    static propTypes = {
        id: PropTypes.string.idRequired,
    }
    
    render() {
        if (!this.props.id) {
            return null
        }
        return (
            <Query query={SINGLE_ORDER_QUERY}  variables={{id: this.props.id}}>
                {
                    ({data, error, loading}) => {
                        if (error) {
                            return <DisplayError error={error}/>
                        }
                        if (loading) {
                            return <p>loading...</p>
                        }
                        const order = data.order
                        return (
                            <OrderStyles>
                                <Head>
                                    <title>
                                        Order {order.id}
                                    </title>
                                </Head>
                                <p>
                                    <span>order Id</span>
                                    <span>{this.props.id}</span>
                                </p>
                                <p>
                                    <span>order charge</span>
                                    <span>{order.charge}</span>
                                </p>
                                <p>
                                    <span>Date</span>
                                    <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
                                </p>
                                <p>
                                    <span>order total</span>
                                    <span> {formatMoney(order.total)}</span>
                                </p>
                                <p>
                                    <span>Item Count</span>
                                    <span> {order.items.length} </span>
                                </p>
                                <div className="items">
                                    {order.items.map((item) => {
                                        return (
                                                <div  key={item.id} className="order-item">
                                                    <img  src={item.image} alt={item.title} />
                                                    <div className="item-details">
                                                        <h2> {item.title} </h2>
                                                        <p> Qty: {item.quantity} </p>
                                                        <p> Each: {formatMoney(item.price)} </p>
                                                        <p>SubTotal: {formatMoney(item.price * item.quantity )}</p>
                                                        <p>{item.description}</p>
                                                    </div>
                                                </div>
                                              
                                        )
                                    })}
                                </div>
                                
                            </OrderStyles>
                        )
                        
                    }
                }
            </Query>
        
        )
    }
}


export default Order