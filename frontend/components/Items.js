import React, {Component} from 'react'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Item from './Item'
import Pagination from './Pagination'
import {perPage} from '../config'



export const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY ($skip: Int, $first: Int = ${perPage}) {
        items (first: $first, skip: $skip, orderBy:createdAt_DESC ) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`

const Center = styled.div`
    text-align:center;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 6rem;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`


class Items extends Component {
    render() {
        const page = this.props.page
        return (
            <Center>
                <Pagination page={page} />
                    <Query query={ALL_ITEMS_QUERY} variables={{
                        skip: perPage * page - perPage,
                        first: perPage
                    }}>
                        {
                            ({data, error, loading}) => {
                                if (loading) {
                                    return <p>Loading...</p>
                                }
                                if (error) {
                                    return <p>Eorro... {error.message}</p>
                                }
                                return (<ItemsList>
                                    {
                                        data.items.map((item) => {
                                            return <Item key={item.id} item={item} />
                                        })
                                    }
                                </ItemsList>)
                            }
                        }
                    </Query>
             
            </Center>
        )
    }
}


export default Items