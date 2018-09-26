import React, {Component} from 'react'
import gql from 'graphql-tag'
import { Mutation} from 'react-apollo'
import {CURRENT_USER_QUERY} from './User'


const Add_TO_CART_MUTATION = gql`
    mutation Add_TO_CART_MUTATION($id:ID!) {
        addToCart( id: $id) {
            id
            quantity
        }
    }
`


class AddToCart extends Component {
    render() {
        const {id} = this.props
        return (
            <Mutation mutation={Add_TO_CART_MUTATION} variables={{id: id}} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                {
                    (addToCart, {loading}) => {
                        return (
                            <button disabled={loading} onClick={addToCart}>
                                add{loading? 'ing' : ''} to cart
                            </button>
                        )
                    }
                }
            </Mutation>
        )
    }
}


export default AddToCart