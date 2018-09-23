import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'



export const SIGN_IN_MUTATION = gql`
    mutation SIGN_IN_MUTATION($password: String!, $email: String!) {
        signin(
            password:$password
            email: $email
        ) {
            id
            name
            email
        }
    }
`


class Signin extends Component {
    
    state = {
        name: '',
        password: '',
        email: '',
    }
    handleChange = (e) => {
        let {name, value} = e.target
        this.setState({
            [name]: value,
        })
    }
    
    handleSubmit = async (e, signup) => {
        e.preventDefault()
        const res = await signup()
        if (res.data) {
            this.setState({
                name: '',
                password: '',
                email: '',
            })
        }
        
    }
    render() {
        return (
            <Mutation
                mutation={SIGN_IN_MUTATION}
                variables={this.state}
                refetchQueries={[{
                    query: CURRENT_USER_QUERY,
                }]}>
                {(signin, {data, error, loading}) => {
                    return (
                        <Form method='POST' onSubmit={(e) => this.handleSubmit(e, signin)}>
                            <Error error={error} />
                            <h2>Sign In For An Account</h2>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="email">
                                    <span>Email</span>
                                    <input
                                        type="text"
                                        id='email'
                                        name='email'
                                        placeholder='email'
                                        onChange={this.handleChange}
                                        value={this.state.email}
                                        required />
                                </label>
                                
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
                                <button type='submit' >Submit</button>
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>
        )
    }
}


export default Signin