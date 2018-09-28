import {shallow, mount} from 'enzyme'
import toJSON from 'enzyme-to-json'
import Detail, {SINGLE_ITEM_QUERY} from '../components/Detail'
import wait from 'waait'
import {MockedProvider} from 'react-apollo/test-utils'
import {fakeItem} from '../lib/testUtils'



describe('detail page', function() {
    it('should render the detail page', async () => {
        const mocks = [{
                request: {query: SINGLE_ITEM_QUERY, variables: {id:'abc'}},
                result: {
                    data: {
                        item: fakeItem()
                    }
                }
            }]
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Detail id='abc' />
            </MockedProvider>,
        )
        await setTimeout(() => {
        }, 0)
        wrapper.update()
        console.log('wrapper.debug()', wrapper.debug())
        // expect(wrapper.text()).toContain('loading')
      
    
    })
})