class SearchByAvailability {
    search = async (model, condition) => {
        var shop = await model.searchByAvailability(condition);
        return shop;
    };
}
export default SearchByAvailability;
