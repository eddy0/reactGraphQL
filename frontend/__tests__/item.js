import Item from '../components/Items'
import {shallow} from 'enzyme'



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
        const PriceTag = wrapper.dive().find('PriceTag')
        console.log(PriceTag.debug())
    
    })
})