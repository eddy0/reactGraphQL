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

const routeToItem = (item) => {
    Router.push({
        pathname: '/item',
        query: {
            id: item.id
        }
    })
    
}


class Search extends Component {
    
    state = {
        items: [],
        loading: false,
    }
    
    onChange = debounce(async (e, client) => {
        this.setState({loading: true})
        const response = await client.query({
            query: SEARCH_ITEM_QUERY,
            variables: {searchTerm: e.target.value},
        })
        this.setState({
            items: response.data.items,
            loading: false,
        })
    }, 350)
    
    render() {
        return (
            <SearchStyles>
                <Downshift onChange={routeToItem} itemToString={item => item === null ? '': item.title}>
                    {
                        ({getInputProps, getItemProps, isOpen, inputValue, highlightedIndex}) => {
                            return (
                                
                                <div>
                                    <ApolloConsumer>
                                        {
                                            (client) => {
                                                return (
                                                    <input {...getInputProps({
                                                        type: 'search',
                                                        placeholder: 'search for an item',
                                                        id: 'search',
                                                        className: this.state.loading ? 'loading' : '',
                                                        onChange: (e) => {
                                                            e.persist()
                                                            this.onChange(e, client)
                                                        },
                                                    })} />
                                                )
                                            }
                                        }
                                    </ApolloConsumer>
                                    { isOpen &&
                                        <DropDown>
                                            {this.state.items.map((item, index) => (
                                                <DropDownItem {...getItemProps({item})} key={item.id} highlighted={index === highlightedIndex}>
                                                    <img width={50} src={item.image} alt={item.title} />
                                                    {item.title}
                                                </DropDownItem>
                                            ))}
                                            {!this.state.items.length && ! this.state.loading &&
                                                <p>nothing found</p>
        
                                            }
                                        </DropDown>
                                    }
                                    
                                
                                </div>
                            )
                        }
                    }
                </Downshift>
            </SearchStyles>
        )
    }
}


export default Search