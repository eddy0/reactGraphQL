import React, {Component} from 'react'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

export const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY {
        me {
            id
            email
            name
            permissions
            cart {
                id
                quantity
                item {
                    id
                    price
                    image
                    title
                    description
                }
            }
        }
    }

`

const User = (props) => {
        return (
            <Query {...props} query={CURRENT_USER_QUERY}>
                {
                    (payload) => {
                        return props.children(payload)
                    }
                }
            
            </Query>
        )
}

User.propTypes = {
    children: PropTypes.func.isRequired,
}


export default User