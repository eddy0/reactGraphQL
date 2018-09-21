import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Router from 'next/router'



export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
    $title: String!,
    $description: String!,
    $price: Int!,
    $image: String,
    $largeImage: String,
    ) {
        createItem(
            title: $title,
            description: $description,
            price: $price
            image:$image
            largeImage: $largeImage
        ) {
            id
        }
    }
`


class CreateItem extends Component {
    state = {
        'title': '',
        'price': null,
        'description': '',
        'image': '',
        'largeImage': '',
    }
    
    handleChange = (e) => {
        let {name, type, value} = e.target
        if (type === 'number') {
            value = parseFloat(value)
        }
        this.setState({
            [name]: value,
        })
    }
    
    handleSubmit = async (e, createItem) => {
        e.preventDefault()
        const res = await createItem()
       
        Router.push(`/item/${res.data.createItem.id}`)
    
    }
    
    uploadFile = async (e) => {
        console.log('upload file')
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'sports' )
        const res = await fetch('https://api.cloudinary.com/v1_1/eddyinfe/image/upload', {
            method: 'POST',
            body: data,
        })
        const file = await res.json()
        console.log('file', file)
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url,
        })
    }
    
    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {
                    (createItem, {loading, error}) => {
                        return (
                            <Form onSubmit={(e) => this.handleSubmit(e, createItem)}>
                                <Error error={error} />
                                <h2>sell an item</h2>
                                <fieldset disabled={loading} aria-busy={loading}>
                                    <label htmlFor="image">
                                        Image
                                        <input type="file" id='image' name='image' placeholder='upload a image' onChange={this.uploadFile}  required />
                                    </label>
                                    {
                                        this.state.image &&
                                        <img width={200} src={this.state.image} alt="preview"/>
                                    }
                                   
                                    <label htmlFor="title">Title
                                        <input type="text" id='title' name='title' placeholder='title' onChange={this.handleChange} value={this.state.title} required />
                                    </label>
                                    
                                    <label htmlFor="price">
                                        Price
                                        <input type="number" id='price' name='price' placeholder='price' onChange={this.handleChange} value={this.state.price} required />
                                    </label>
                                    <label htmlFor="description">
                                        Description
                                        <textarea type="text" id='description' name='description' placeholder='description' onChange={this.handleChange} value={this.state.description} required />
                                    </label>
                                    <button type='submit'>Submit</button>
                                </fieldset>
                            </Form>
                        )
                    }
                }
            </Mutation>
        )
    }
}


export default CreateItem