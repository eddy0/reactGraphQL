import React, {Component} from 'react'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Form from './styles/Form'
import Table from './styles/Table'
import UserItem from './UserItem'



export const ALL_USER_QUERY = gql`
    query ALL_USER_QUERY {
        users {
            id
            email
            name
            permissions
        }
    }
`

const permissionOption = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
]


class Permission extends Component {
    render() {
        return (
            <Query query={ALL_USER_QUERY}>
                {({data, loading, error}) => {
                    console.log('data', data)
                    
                    return (
                        <div>
                            <Error error={error} />
                            <h2>Manage the Permission</h2>
                            <Table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    {
                                        permissionOption.map((permission, index) => (
                                            <th key={index}>
                                                {permission}
                                            </th>
                                        ))
                                    }
                                    <th>update</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.users.map((user) => {
                                                return <UserItem permissionOption={permissionOption} key={user.id} user={user}/>
                                            },
                                        )
                                    }
                                </tbody>
                            
                            </Table>
                        
                        </div>
                    
                    )
                }}
            </Query>
        )
    }
}






export default Permission