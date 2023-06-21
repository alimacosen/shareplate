import {
  Flex,
  Input,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Select,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import Footer from "../../components/Footer";
import { useShops } from "../../api/swr";
import Loading from "../Loading";
import ErrorHandler from "../ErrorHandler";
import { USER_TYPE } from "../../enum";
import { SHOP_TYPE_MAP } from "../../mapping";
import ShopMap from "../../components/ShopMap";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useState } from "react";
import HomeShopCard from "../../components/HomeShopCard";
import ListEndText from "../../components/ListEndText";

const MapView = (shopList) => {
  return (
    <Flex
      w="100%"
      h="85vh"
      flexDirection="column"
      alignItems="center"
      pt="64px"
    >
      <ShopMap shopList={shopList} />
    </Flex>
  );
};

const ListViewSearchBar = (searchMode, searchContent, setSearchContent) => {
  const ratingOptions = [0, 1, 2, 3, 4, 5];
  switch (searchMode) {
    case "name":
      return (
        <Input
          size="lg"
          placeholder="Search by name"
          bg="white"
          borderRadius="0"
          focusBorderColor="green.500"
          defaultValue={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
        />
      );
    case "category":
      return (
        <Select
          size="lg"
          placeholder="Category"
          bg="white"
          borderRadius="0"
          focusBorderColor="green.500"
          defaultValue={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
        >
          {Object.keys(SHOP_TYPE_MAP).map((key) => {
            return (
              <option key={`shop-type-${key}`} value={key}>
                {SHOP_TYPE_MAP[key]}
              </option>
            );
          })}
        </Select>
      );
    case "availability":
      return (
        <Select
          size="lg"
          placeholder="Availability"
          bg="white"
          borderRadius="0"
          focusBorderColor="green.500"
          defaultValue={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
        >
          <option key={`shop-availability-true`} value={true}>
            Open
          </option>
          <option key={`shop-availability-false`} value={false}>
            Closed
          </option>
        </Select>
      );
    case "rating":
      return (
        <Select
          size="lg"
          placeholder="Rating greater than"
          bg="white"
          borderRadius="0"
          focusBorderColor="green.500"
          defaultValue={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
        >
          {ratingOptions.map((rating) => {
            return (
              <option key={`shop-rating-${rating}`} value={rating}>
                {"Rating >= " + rating}
              </option>
            );
          })}
        </Select>
      );
  }
};

const ListView = (
  shopList,
  searchMode,
  setSearchMode,
  searchContent,
  setSearchContent,
  setSearchParams
) => {
  return (
    <Flex
      w="100%"
      flexDirection="column"
      alignItems="center"
      pt="64px"
      h="85vh"
      overflowY="scroll"
    >
      <Flex
        w="90%"
        justifyContent="space-between"
        alignItems="center"
        mt="4"
        mb="2"
      >
        <Menu>
          <MenuButton
            as={Button}
            size="lg"
            colorScheme="gray"
            color="gray.600"
            variant="solid"
            borderRightRadius="0"
            pl="4"
            pr="2"
          >
            <FaFilter />
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              color="green.600"
              title="Search by"
              defaultValue={searchMode}
              type="radio"
              onChange={(value) => {
                setSearchMode(value);
                setSearchContent("");
              }}
            >
              <MenuItemOption value="name">Name</MenuItemOption>
              <MenuItemOption value="category">Category</MenuItemOption>
              <MenuItemOption value="availability">Availability</MenuItemOption>
              <MenuItemOption value="rating">Rating</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        {ListViewSearchBar(searchMode, searchContent, setSearchContent)}
        <Button
          size="lg"
          colorScheme="green"
          borderLeftRadius="0"
          px="auto"
          isDisabled={searchContent === ""}
          onClick={() => {
            setSearchParams(`?method=${searchMode}&condition=${searchContent}`);
          }}
        >
          <Icon as={FaSearch} boxSize="5" />
        </Button>
      </Flex>
      {shopList.map((shop) => {
        return (
          <HomeShopCard shop={shop} key={`home-shop-card-${shop._id}`} my="2" />
        );
      })}
      <ListEndText />
    </Flex>
  );
};

function Shop() {
  const navigate = useNavigate();
  const [options] = useSearchParams();
  const [searchMode, setSearchMode] = useState("name");
  const [searchContent, setSearchContent] = useState("");
  const [searchParams, setSearchParams] = useState("");
  const viewMode = options.get("view") || "map";
  const { shopList, isError, isLoading } = useShops(searchParams);
  if (isError) ErrorHandler("Error fetching customer data.", "/login/customer");
  if (isLoading) return <Loading />;
  const shopData = shopList.data;
  return (
    <>
      <HeaderBar userType={USER_TYPE.CUSTOMER} />
      {viewMode === "map"
        ? MapView(shopData)
        : ListView(
            shopData,
            searchMode,
            setSearchMode,
            searchContent,
            setSearchContent,
            setSearchParams
          )}
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        bottom="16"
      >
        <Button
          onClick={() =>
            navigate(`/shops?view=${viewMode === "map" ? "list" : "map"}`, {
              replace: true,
            })
          }
          size="md"
          colorScheme="green"
          variant="outline"
          bg="white"
          border="2px solid"
          fontWeight="700"
          rounded="full"
        >
          {(viewMode === "map" ? "List" : "Map") + " View"}
        </Button>
      </Flex>
      <Footer />
    </>
  );
}

export default Shop;
