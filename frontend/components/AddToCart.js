import React, {Component} from 'react'
import gql from 'graphql-tag'
import { Mutation} from 'react-apollo'


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
            <Mutation mutation={Add_TO_CART_MUTATION} variables={{id: id}}>
                {
                    (addToCart) => {
                        return (
                            <button onClick={addToCart}>
                                add to cart
                            </button>
                        )
                    }
                }
            </Mutation>
        )
    }
}


export default AddToCart