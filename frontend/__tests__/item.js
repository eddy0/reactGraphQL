import Item from '../components/Items'
import {shallow} from 'enzyme'
import toJSON from 'enzyme-to-json'


const fakeItem = {
    id: 'avc123',
    title: 'a title',
    price: 5000,
    description: ' this is description',
    image: 'dog.jpg',
    largeImage: 'largedog.jpg'
}


describe('item', function() {
    it('should render and display properly', function() {
        const wrapper = shallow(<Item item={fakeItem}/>)
        const PriceTag = wrapper.find('PriceTag')

    })
})

describe('snapshot', function() {
    it('should be a snapshot', function() {
        const wrapper = shallow(<Item item={fakeItem}/>)
        expect(toJSON(wrapper)).toMatchSnapshot()
        
    })
})