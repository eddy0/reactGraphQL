import {shallow, mount} from 'enzyme'
import toJSON from 'enzyme-to-json'
import {MockedProvider} from 'react-apollo/test-utils'
import {fakeItem} from '../lib/testUtils'
import RequestReset, {REQUEST_REST_MUTATION} from '../components/RequestReset'

const mocks = [{
    request: {query: REQUEST_REST_MUTATION, variables: {email:'abc@xx.com'}},
    result: {
        data: {
            requestReset: {message: 'ok'}
        }
    }
}]

describe('RequestReset', function() {
    it('should render the RequestReset', async () => {
      
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <RequestReset email='abc@xx.com' />
            </MockedProvider>,
        )
        const form = wrapper.find('form')
        form.simulate('submit')
       
        await setTimeout(() => {
        }, 0)
        wrapper.update()
        console.log('wrapper.debug()', wrapper.text())
        expect(wrapper.text()).toContain('success')
        
    })
})