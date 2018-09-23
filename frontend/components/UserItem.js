import React, {Component} from 'react'
import PropTypes from 'prop-types'





class UserItem extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired
    }
    
    state={
        permissions: this.props.user.permissions
    }
    
    handleChange = (e) => {
        const checkbox = e.target
        const value = checkbox.value
    
        this.setState((prevState => {
            const {permissions} = prevState
            if (permissions.includes(value)) {
                return {
                    permissions: permissions.filter((p) => p !== value)
                }
            } else {
                return {
                    permissions: [...permissions, value]
                }
            }
        }))
        
    }
    
    
    render() {
        const user = this.props.user
        const permissionOption = this.props.permissionOption
        return (
            <tr>
                <td>
                    {user.name}
                </td>
                <td>
                    {user.email}
                </td>
                    {permissionOption.map((permission, index) => {
                        return (
                            <td key={index} style={{textAlign: 'center'}}>
                                <label htmlFor={permission}>
                                    <input type="checkbox"
                                        checked={ this.state.permissions.indexOf(permission) !== -1}
                                        value={permission}
                                        onChange={this.handleChange}
                                    />
                                </label>
                            </td>
                        )
                    })}
                <td>
                   <button>Update</button>
                </td>
           
            </tr>
        )
    }
}


export default UserItem