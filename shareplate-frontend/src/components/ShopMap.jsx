import { Flex, Text, SlideFade } from "@chakra-ui/react";
import GoogleMapReact from "google-maps-react-markers";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { calcAvgRating } from "../utils";
import HomeShopCard from "./HomeShopCard";
import Loading from "../pages/Loading";
import { requestPosition } from "../utils";

function ShopMap({ shopList }) {
  const [active, setActive] = useState(-1);
  const mapRef = useRef(null);
  const [lat, setLat] = useState(37.39);
  const [lng, setLng] = useState(-122.06);
  useEffect(() => {
    requestPosition().then((pos) => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
    });
  }, []);
  const onGoogleApiLoaded = ({ map }) => {
    mapRef.current = map;
    map.addListener("click", (event) => {
      // check if click on marker
      event.stop();
      if (!event.placeId) setActive(-1);
    });
  };
  return (
    <>
      <Flex w="100vw" h="85vh" overflowX="hidden">
        <GoogleMapReact
          apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
          onGoogleApiLoaded={onGoogleApiLoaded}
          defaultCenter={{ lat, lng }}
          defaultZoom={11}
          loadingContent={<Loading />}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            clickableIcons: false,
          }}
        >
          {shopList.map((shop, idx) => {
            return (
              shop.location?.type && (
                <Flex
                  boxShadow="lg"
                  justifyContent="center"
                  alignItems="center"
                  rounded="full"
                  key={`icon-${shop._id}`}
                  lat={shop.location.coordinates[0]}
                  lng={shop.location.coordinates[1]}
                  onClick={(e) => {
                    e.stopPropagation();
                    mapRef.current.panTo({
                      lat: shop.location.coordinates[0],
                      lng: shop.location.coordinates[1],
                    });
                    setActive(idx);
                  }}
                  bg={
                    active === idx
                      ? "green.500"
                      : shop.available
                      ? "white"
                      : "gray.500"
                  }
                  color={
                    active === idx
                      ? "white"
                      : shop.available
                      ? "gray.600"
                      : "white"
                  }
                  w="48px"
                  h="48px"
                >
                  <Text fontSize="lg" fontWeight="800">
                    {calcAvgRating(shop.reviews)}
                  </Text>
                </Flex>
              )
            );
          })}
        </GoogleMapReact>
      </Flex>
      <Flex
        w="100%"
        justifyContent="center"
        position="absolute"
        bottom="16"
        zIndex={100}
      >
        <SlideFade offsetY="20px" in={active >= 0}>
          {active >= 0 && (
            <HomeShopCard
              shop={shopList[active]}
              key={`home-shop-card-${active}`}
            ></HomeShopCard>
          )}
        </SlideFade>
      </Flex>
    </>
  );
}

ShopMap.defaultProps = {};

ShopMap.propTypes = {
  shopList: PropTypes.array,
};

export default ShopMap;
