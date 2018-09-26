import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {CURRENT_USER_QUERY} from './User'

const Dot = styled.div`
  background-color:${props => props.theme.red};
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`


const CartCount = ({count}) =>  {
        return (
            <Dot>
                {count}
            </Dot>
        )
}


export default CartCount