import React, {Component} from 'react'
import {Mutation, Query} from 'react-apollo'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Router from 'next/router'



const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: {id: $id}) {
            id
            title
            description
            price
            image
            largeImage
        }
    }
`

export const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!,
        $title: String,
        $description: String,
        $price: Int,
    ) {
        updateItem(
            id: $id,
            title: $title,
            description: $description,
            price: $price,
        ) {
            id
            title
            description
            price
        }
    }
`

const withQuery = (props) => (
    <Query query={SINGLE_ITEM_QUERY} variables={{id: props.id}}>
        {({data, loading}) => {
            if (loading) {
                return <p>loading...</p>
            }
            
            if (!data) {
                return <p>no item found</p>
            }
            
            return <UpdateItem id={props.id} data={data} />
        }
        }
    </Query>
)


class UpdateItem extends Component {
    
    // state = {
    //     'title': '',
    //     'price': null,
    //     'description': '',
    //     'image': '',
    //     'largeImage': '',
    // }
    
    state = {}
    
 
    
    handleChange = (e) => {
        let {name, type, value} = e.target
        if (type === 'number') {
            value = parseFloat(value)
        }
        this.setState({
            [name]: value,
        })
    }
    
    handleSubmit = async (e, updateItem) => {
        e.preventDefault()
        console.log('updateItem', this.state)
        console.log('id', this.props.id)
        let variables = {...this.state, id: this.props.id }
        console.log('variables', variables)
    
        const res = await updateItem({
            variables: variables,
        })
        
        // Router.push(`/item/${res.data.createItem.id}`)
        
    }
    
    render() {
        console.log('this.props', this.props.id)
        const data = this.props.data
        return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} >
                {
                    (updateItem, {loading, error}) => {
                        return (
                            <Form onSubmit={(e) => this.handleSubmit(e, updateItem)}>
                                <Error error={error} />
                                <fieldset disabled={loading} aria-busy={loading}>
                                    
                                    <label htmlFor="title">Title
                                        <input type="text"
                                            id='title'
                                            name='title'
                                            placeholder='title'
                                            onChange={this.handleChange}
                                            defaultValue={data.item.title}
                                            required
                                        />
                                    </label>
                                    
                                    <label htmlFor="price">
                                        Price
                                        <input
                                            type="number"
                                            id='price'
                                            name='price'
                                            placeholder='price'
                                            onChange={this.handleChange}
                                            defaultValue={data.item.price}
                                            required
                                        />
                                    </label>
                                    <label htmlFor="description">
                                        Description
                                        <textarea
                                            type="text"
                                            id='description'
                                            name='description'
                                            placeholder='description'
                                            onChange={this.handleChange}
                                            defaultValue={data.item.description}
                                            required />
                                    </label>
                                    <button type='submit'>Update</button>
                                </fieldset>
                            </Form>
                        )
                    }
                }
            </Mutation>
        )
    }
}


export default withQuery