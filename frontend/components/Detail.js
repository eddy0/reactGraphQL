import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import Error from './ErrorMessage'
import styled from 'styled-components'


const DetailStyle = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 2rem auto;
  box-shadow: ${props => props.theme.boxShadow};
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  min-height: 80rem;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id:ID!) {
        item(where: {id: $id}) {
            id
            title
            image
            largeImage
            price
        }
    }
`


class Detail extends Component {
    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
                {
                    ({data, loading, error}) => {
                        if (loading) {
                            return <p>loading...</p>
                        }
                        if (!data) {
                            return <p>No Item Found</p>
                        }
                        if (error) {
                            return <Error error={error} />
                        }
                       
                        
                        return (
                            <DetailStyle>
                                <img src={data.item.largeImage} alt={data.item.title} />
                                <div className="details">
                                    <h2>viewing {data.item.title}</h2>
                                </div>
                            </DetailStyle>
                        )
                    }
                }
            </Query>
        )
    }
}


export default Detail