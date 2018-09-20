import React, {Component} from 'react'
import Header from './Header'
import Meta from './Meta'
import styled, {ThemeProvider, injectGlobal} from 'styled-components'



const theme = {
    red: '#f00',
    black: '#393939',
    grey: '#3a3a3a',
    lightGrey: '#e1e1e1',
    offWhite: '#ededed',
    maxWidth: '1000px',
    boxShadow: '0 12px 24px 0 rgba(0,0,0,0.9)',
}

const StylePage = styled.div`
  background-color: #fff;
  font-size: 12px;
  color: ${props => props.theme.black} ;
`

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`

injectGlobal`
  @font-face {
    font-family: 'radnika_next';
    src: url("/static/radnikanext-medium-webfont.woff2") format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
  }
  body {
    font-size: 1.6rem;
    line-height: 1.6;
    font-family: 'radnika_next', sans-serif;
  }
  a {
    text-decoration: none;
    color: #393939;
  }
`


class Page extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <StylePage>
                    <Meta />
                    <Header />
                    <Inner>
                        {this.props.children}
                    </Inner>
                </StylePage>
            </ThemeProvider>
        )
    }
}


export default Page