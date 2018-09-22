import React, {Component} from 'react'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import propTypes from 'prop-types'

export const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY {
        me {
            id
            email
            name
            permissions

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

User.PropTypes = {
    children: propTypes.func.isRequired,
}


export default User