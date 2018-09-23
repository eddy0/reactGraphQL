import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import User from './User'



export const REQUEST_REST_MUTATION = gql`
    mutation REQUEST_REST_MUTATION($email: String!) {
        requestReset(
            email: $email
        ) {
            message
        }
    }
`


class RequestReset extends Component {
    
    
    handleSubmit = async (e, requestReset) => {
        e.preventDefault()
        const res = await requestReset()
        if (res.data) {
            this.setState({
                email: '',
            })
        }
        
    }
    
    render() {
        return (
            <User>
                {
                    ({data}) => {
                        if (!data.me) {
                            return <p>please sign in </p>
                        }
                        const email = data.me.email
    
                        return <Mutation
                            mutation={REQUEST_REST_MUTATION}
                            variables={{
                                email,
                            }}
                        >
                            {(requestReset, {data, error, loading}) => {
                                return (
                                    <Form method='POST' onSubmit={(e) => this.handleSubmit(e, requestReset)}>
                                        <Error error={error} />
                                        <h2>Request for Reset</h2>
                                        {
                                            data && data.requestReset &&
                                            <p>{data.requestReset.message}</p>
                                        }
                                        <fieldset disabled={loading} aria-busy={loading}>
                                            <label htmlFor="email">
                                                <span>Email</span>
                                                <input
                                                    type="text"
                                                    id='email'
                                                    name='email'
                                                    placeholder='email'
                                                    disabled={true}
                                                    defaultValue={email}
                                                    required />
                                            </label>
                                            <button type='submit'>Request Reset</button>
                                        </fieldset>
                                    </Form>
                                )
                            }}
                        </Mutation>
                    }
                }
            
            </User>
        )
    }
}


export default RequestReset


