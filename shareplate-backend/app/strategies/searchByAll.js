class SearchByAll {
    search = async (model, condition) => {
        var shop = await model.getAll();
        return shop;
    };
}
export default SearchByAll;
