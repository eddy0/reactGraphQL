import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import PropTypes from 'prop-types'
import {CURRENT_USER_QUERY} from './User'



export const RESET_MUTATION = gql`
    mutation RESET_MUTATION($resetToken: String!, $password:String!, $confirmPassword: String!) {
        resetPassword(
            resetToken: $resetToken,
            password:$password,
            confirmPassword: $confirmPassword
        ) {
            id
            email
            name
        }
    }
`


class Reset extends Component {
    
    static propTypes = {
        resetToken: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        confirmPassword: PropTypes.string.isRequired,
    }
    
    state = {
        password: '',
        confirmPassword: '',
    }
    
    handleChange = (e) => {
        let {name, value} = e.target
        this.setState({
            [name]: value,
        })
    }
    
    handleSubmit = async (e, reset) => {
        e.preventDefault()
        const res = await reset()
        this.setState({
            confirmPassword: '',
            password: '',
        })
    }
    
    render() {
        const resetToken = this.props.resetToken
        if (!resetToken) {
            return <p>please check your email for reseting</p>
        }
        
        return (
            <Mutation
                mutation={RESET_MUTATION}
                variables={{
                    ...this.state,
                    resetToken,
                }}
                refetchQueries={[{query: CURRENT_USER_QUERY}]}
            >
                {(resetPassword, {data, error, loading}) => {
                    return (
                        <Form method='POST' onSubmit={(e) => this.handleSubmit(e, resetPassword)}>
                            <Error error={error} />
                            <h2>Reset Your Password</h2>
                            {
                                JSON.stringify(data)
                            }
                            {
                                data && data.resetPassword &&
                                <p>you have reset the password</p>
                            }
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="password">
                                    <span>Password</span>
                                    <input
                                        type="password"
                                        id='password'
                                        name='password'
                                        placeholder='password'
                                        onChange={this.handleChange}
                                        value={this.state.password}
                                        required />
                                </label>
                                
                                <label htmlFor="confirmPassword">
                                    <span>Confirm Password</span>
                                    <input
                                        type="password"
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        placeholder='confirmPassword'
                                        onChange={this.handleChange}
                                        value={this.state.confirmPassword}
                                        required />
                                </label>
                                <button type='submit'>Submit</button>
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>
        )
    }
}


export default Reset


