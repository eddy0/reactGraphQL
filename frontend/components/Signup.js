import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'



export const SIGN_UP_MUTATION = gql`
    mutation SIGN_UP_MUTATION($name: String!, $password: String!, $email: String!) {
        signup(
            name: $name
            password:$password
            email: $email
        ) {
            id
            name
            email
        }
    }
`


class Signup extends Component {
    
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
                mutation={SIGN_UP_MUTATION}
                variables={this.state}
                refetchQueries={[{
                    query: CURRENT_USER_QUERY,
                }]}
            >
                {(signup, {data, error, loading}) => {
                    return (
                        <Form method='POST' onSubmit={(e) => this.handleSubmit(e, signup)}>
                            <Error error={error} />
                            <h2>Sign Up For An Account</h2>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <label htmlFor="name">
                                    <span>Name</span>
                                    <input
                                        type="text"
                                        id='name'
                                        name='name'
                                        placeholder='name'
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </label>
                                
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


export default Signup