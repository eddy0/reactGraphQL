import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import Link from 'next/link'
import formatMoney from '../lib/formatMoney'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {ALL_ITEMS_QUERY} from './Items'
import AddToCart from './AddToCart'





const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION (
    $id: ID!
    ) {
        deleteItem (id: $id) {
            id
        }
    }
`


class Item extends Component {
    handleDelete = (e, id, deleteItem) => {
        e.preventDefault()
        deleteItem({
            variables: {id: id},
        })
    }
    
    update = (cache, payload) => {
        const data = cache.readQuery({query: ALL_ITEMS_QUERY})
        data.items = data.items.filter((item) => item.id !== payload.data.deleteItem.id)
        cache.writeQuery({query:ALL_ITEMS_QUERY, data})
    }
    
    render() {
        const {item} = this.props
        
        return (
            <Mutation
                mutation={DELETE_ITEM_MUTATION}
                variables={{id: item.id}}
                update={this.update}
            >
                {
                    (deleteItem, {loading, error}) => {
                        if (loading) {
                            return <p>loading...</p>
                        }
                        if (error) {
                            return <p>error, {error.message}</p>
                        }
                        return (
                            <ItemStyles>
                                {
                                    item.image &&
                                    <Link href={{pathname: '/item', query: {id: item.id}}}>
                                        <a >
                                        <img src={item.image} alt={item.title} />
                                        </a>
                                    </Link>
                                    
                                }
                                <Title>
                                    <Link href={{pathname: '/item', query: {id: item.id}}}>
                                        <a>
                                            {item.title}
                                        </a>
                                    </Link>
                                </Title>
                                <PriceTag>{formatMoney(item.price)}</PriceTag>
                                <p>{item.description}</p>
                                <div className="buttonList">
                                    <Link href={{pathname: 'update', query: {id: item.id}}}>
                                        <a>
                                            edit
                                        </a>
                                    </Link>
                                    <AddToCart id={item.id}/>
                                    <button
                                        onClick={(e) => {
                                            const msg = 'are your sure you want to delete the message?'
                                        if (confirm(msg)) {
                                            this.handleDelete(e, item.id, deleteItem)
                                        }
                                    }}>
                                        delete
                                    </button>
                                
                                </div>
                            </ItemStyles>
                        )
                    }
                    
                }
            
            </Mutation>
        )
    }
}


Item.propTypes = {
    item: PropTypes.object.isRequired,
}

export default Item
