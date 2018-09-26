import React, {Component} from 'react'
import Downshift from 'downshift'
import Router from 'next/router'
import {ApolloConsumer} from 'react-apollo'
import debounce from 'lodash.debounce'
import gql from 'graphql-tag'
import {DropDown, DropDownItem, SearchStyles} from './styles/DropDown'



const SEARCH_ITEM_QUERY = gql`
    query SEARCH_ITEM_QUERY($searchTerm: String!) {
        items(where: {
            OR: [
                {title_contains: $searchTerm},
                { description: $searchTerm},
            ]
        }) {
            id
            image
            title
        }
    }
`


class Search extends Component {
    
    state = {
        items: [],
        loading: false,
    }
    
     onChange =debounce( async (e, client) => {
         this.setState({loading: true})
        const response = await client.query({
            query: SEARCH_ITEM_QUERY,
            variables: {searchTerm: e.target.value}
        })
         console.log('response', response)
         this.setState({
             items: response.data.items,
             loading: false
         })
     }, 350)
    
    render() {
        return (
            <SearchStyles>
                <div>
                    <ApolloConsumer>
                        {
                            (client) => {
                                return (
                                    <input type="search" onChange={(e) => {
                                        e.persist()
                                        this.onChange(e, client)}} />
                                )
                            }
                        }
                    </ApolloConsumer>
                    <DropDown>
                        {this.state.items.map((item) => (
                            <DropDownItem key={item.id}>
                                <img width={50} src={item.image} alt={item.title} />
                                {item.title}
                            </DropDownItem>
                        ))}
                    </DropDown>
                </div>
            </SearchStyles>
        )
    }
}


export default Search