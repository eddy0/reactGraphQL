import React, {Component} from 'react'
import PaginationStyles from './styles/PaginationStyles'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {perPage} from '../config'
import Link from 'next/link'



const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`


class Pagination extends Component {
    
    render() {
        const page = this.props.page
    
        return (
            <Query query={PAGINATION_QUERY}>
                {
                    ({data, loading, error}) => {
                        console.log('data', data)
                        if (!data) {
                            return <p>error</p>
                        }
                        
                        const count = data.itemsConnection.aggregate.count
                        const pages = Math.ceil(count / perPage)
                        
                        return (
                            <PaginationStyles>
                                <Link prefetch href={{pathname: '/', query: {page: page - 1}}}>
                                    <a className='prev' aria-disabled={page <= 1}>prev</a>
                                </Link>
                                <p>page {page} of {pages}</p>
                                <Link prefetch href={{pathname: '/', query: {page: page + 1}}}>
                                    <a>next</a>
                                </Link>
                            </PaginationStyles>
                        )
                    }
                }
            </Query>
        )
    }
}


export default Pagination