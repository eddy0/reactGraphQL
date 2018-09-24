import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'



const UPDATE_PERMISSION_MUTATION = gql`
    mutation UPDATE_PERMISSION_MUTATION($permissions: [Permissions], $userId:ID!) {
        updatePermissions(
            permissions: $permissions
            userId: $userId
        ){
            name
            id
            permissions
            email
        }
    }
`


class UserItem extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired,
    }
    
    state = {
        permissions: this.props.user.permissions,
    }
    
    handleChange = (e) => {
        const checkbox = e.target
        const value = checkbox.value
        
        this.setState((prevState => {
            const {permissions} = prevState
            if (permissions.includes(value)) {
                return {
                    permissions: permissions.filter((p) => p !== value),
                }
            } else {
                return {
                    permissions: [...permissions, value],
                }
            }
        }))
        
    }
    
    render() {
        const user = this.props.user
        const permissionOption = this.props.permissionOption
        return (
            <Mutation mutation={UPDATE_PERMISSION_MUTATION}
                variables={{permissions: this.state.permissions, userId: user.id}}
            >
                {
                    (updatePermissions, {data, error, loading}) => {
                        return (
                            <tr>
                                <td>
                                    {user.name}
                                </td>
                                <td>
                                    {user.email}
                                </td>
                                {
                                    permissionOption.map((permission, index) => {
                                        return (
                                            <td key={index} style={{textAlign: 'center'}}>
                                                <label htmlFor={`${user.id}-${permission}`} style={{display: 'block'}}>
                                                    <input type="checkbox"
                                                        id={`${user.id}-${permission}`}
                                                        checked={this.state.permissions.indexOf(permission) !== -1}
                                                        value={permission}
                                                        onChange={this.handleChange}
                                                    />
                                                </label>
                                            </td>
                                        )
                                    })}
                                <td>
                                    <button disabled={loading} onClick={updatePermissions}>
                                        Updat{loading? 'ing': 'e'}
                                    </button>
                                </td>
                            </tr>
                        )
                    }
                }
            
            </Mutation>
        )
    }
}


export default UserItem