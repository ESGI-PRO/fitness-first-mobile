import {
  Box,
  Button,
  Center,
  CloseIcon,
  Divider,
  FlatList,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  InputGroup,
  Modal,
  Radio,
  ScrollView,
  Text,
  TextArea,
  VStack,
  View,
} from "native-base";
import { StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native";
import { Fonts, Sizes } from "../../../constants/styles";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { StatusBar } from "react-native";
import { Input, Stack, FormControl } from "native-base";
import { useEffect, useState } from "react";
import diacritic from "diacritic";
import nutrition from "../../../api/nutrition";
import { Header, ListItem } from "@rneui/base";
import InstructionsPageScreen from "./instructionsPage";
import { Alert } from "native-base";
import user from "../../../api/user";

const AddRecettesScreen = ({ navigation, route }) => {
  const data = route?.params?.data;

  useEffect(() => {
    if (data) {
      setListIngredients([...listIngredients, data]);
      setShowModal(false);
    }
    console.log("dededede", listIngredients);

    return () => {
      if (data) {
        setListIngredients([...listIngredients, data]);
        setShowModal(false);
      }
      console.log("dededede", listIngredients);
    };
  }, []);

  const [searchWord, setWord] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [ingredients, setIngredients] = useState(nutrition.ingredients);
  const [alert, setAlert] = useState({});
  const [details, setDetails] = useState([]);
  const [showModal3, setShowModal3] = useState(false);

  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [listIngredients, setListIngredients] = useState([]);
  const [list, setList] = useState([]);

  const [display, setDisplay] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <ScrollView>
        <View style={{ flex: 1 }}>
          {AlertMessage()}
          {display === false ? (
            <>
              {header()}
              {formRecette()}
              {steppers()}
            </>
          ) : (
            switchPage()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function switchPage() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <ScrollView>
          <View style={{ flex: 1 }}>
            {header()}
            <Text
              fontSize="md"
              className="mx-5"
              onPress={() => setDisplay(false)}
            >
              Retour
            </Text>
            {formRecetteIng()}
            {saisieForm()}
            {AddIngredientModal()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  function AlertMessage() {
    return Object.keys(alert)?.length > 0 ? (
      <Center>
        <Alert maxW="400" status={alert?.status} colorScheme="info">
          <VStack space={2} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                  {alert?.message}
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0,
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: "coolGray.600",
                }}
              />
            </HStack>
          </VStack>
        </Alert>
      </Center>
    ) : (
      ""
    );
  }

  function FicheProduit(id) {
    var item = ingredients.find((ingredient) => ingredient.id === id);
    setDetails(item);
    setShowModal(!showModal);
  }

  function addInList(item) {
    console.log(item);
    setListIngredients([
      ...listIngredients,
      {
        name: item.name,
        quantite: 0,
        ingredients: item.id,
      },
    ]);

    setWord("");
  }

  function sendData() {
    var array = [...listIngredients, instruction];
    setList([...list, array]);
    setDisplay(false);
    setListIngredients([]);
    setInstruction("");
  }

  function saisieForm() {
    const modifyObject = (name, key, value) => {
      console.log(name, key, value);
      const updatedData = listIngredients.map((item) => {
        if (item.name === name) {
          return { ...item, quantite: Number(value) };
        }
        return item;
      });
      setListIngredients([...updatedData]);
    };

    const deleteRow = (index) => {
      console.log(index);

      var array = listIngredients;
      array.splice(index, 1);

      setListIngredients([...array]);
    };

    return (
      <View>
        <Text fontSize="xs">{JSON.stringify(listIngredients)}</Text>
        <Text fontSize="xs">{instruction}</Text>

        {listIngredients.map((item, index) => {
          return (
            <VStack className="my-4 m-4" key={`${index}`}>
              <View>
                <View className="flex flex-row justify-between items-center">
                  <Heading>{item.name}</Heading>
                  <Text
                    colorScheme="primary"
                    className="underline italic"
                    onPress={() => deleteRow(index)}
                  >
                    supprimer
                  </Text>
                </View>

                <Text
                  colorScheme="primary"
                  onPress={() => FicheProduit(item?.ingredients)}
                >
                  Voir la fiche produit
                </Text>
              </View>

              <Text fontSize="xs" className="my-2">
                Quantite
              </Text>

              <Input
                placeholder={`Quantité de ${item.name} en gr`}
                onChangeText={(text) =>
                  modifyObject(item.name, "quantite", text)
                }
              />
            </VStack>
          );
        })}

        {listIngredients.length > 0 && (
          <View className="m-4">
            <Text fontSize="xs" className="my-2">
              instructions{" "}
            </Text>

            <TextArea
              shadow={2}
              h={20}
              placeholder="Decrivez votre recette ..."
              value={instruction}
              onChangeText={(text) => setInstruction(text)}
              selectionColor={Colors.primaryColor}
              className="w-full my-5"
              _light={{
                placeholderTextColor: "trueGray.700",
                bg: "coolGray.100",
                _hover: {
                  bg: "coolGray.200",
                },
                _focus: {
                  bg: "coolGray.200:alpha.70",
                },
              }}
              _dark={{
                bg: "coolGray.800",
                _hover: {
                  bg: "coolGray.900",
                },
                _focus: {
                  bg: "coolGray.900:alpha.70",
                },
              }}
            />
          </View>
        )}

        <Button colorScheme="green" onPress={() => sendData()}>
          Valider l'etape
        </Button>
      </View>
    );
  }

  function steppers() {
    function deleteStep(index) {
      var array = list;
      array.splice(index, 1);

      setList([...array]);
    }

    function modifyStep(item) {
      setListIngredients(item);
      setDisplay(true);
    }

    return (
      <View className="m-4">
        <Text fontSize="xs">{JSON.stringify(list)}</Text>
        {list.map((array, index) => {
          return (
            <>
              <Box border="1" borderRadius="md" className="my-3 py-3">
                <VStack space="4" divider={<Divider />}>
                  <View className="flex flex-row my-5 justify-between items-center">
                    <Heading>Etape {index + 1}</Heading>
                    {/* <Text
                      colorScheme="primary"
                      className="underline italic"
                      onPress={() => modifyStep(array)}
                    >
                      modifier
                    </Text> */}
                    <Text
                      colorScheme="primary"
                      className="underline italic"
                      onPress={() => deleteStep(index)}
                    >
                      supprimer
                    </Text>
                  </View>
                  <Box px="4">
                    {/* <Text fontSize="xs">Ingredients : </Text> */}

                    {array.map((it, index) => (
                      <Text fontSize="xs">
                        {it?.name}{" "}
                        {it?.quantite ? ` - ${it?.quantite} grammes ` : ""}{" "}
                        {typeof it === "string" ? `Ìnstructions : ${it} ` : ""}{" "}
                      </Text>
                    ))}
                  </Box>
                </VStack>
              </Box>
            </>
          );
        })}

        <Button
          colorScheme="primary"
          className={list.length > 0 ? "" : "hidden"}
          onPress={() => {
            handlesubmit();
          }}
        >
          Creer ma recette
        </Button>
      </View>
    );
  }

  function handlesubmit() {
    var instructions = [];

    list.map((array, index) => {
      instructions.push({
        order: index + 1,
        produits: array.filter((item, i) => {
          return typeof item === "object";
        }),
        description: array[array.length - 1],
      });
    });

    var p = {
      title: title,
      UserId: user.userId,
      instructions,
    };

    console.log(p);
    console.log("en cours ...");

    nutrition.create(p).then((res) => {
      if (res) {
        resetAllFormValues();
        setAlert({
          success: "success",
          message: "Votre recette " + title + " a bien ete créée",
        });

        setTimeout(() => {
          nutrition.getMyRecettes();
          setAlert({});
          navigation.push('Recettes')
        }, 5000);
      }
    });
  }

  function resetAllFormValues() {
    setList([]);
    setTitle("");
    setListIngredients([]);
  }

  function header() {
    return (
      <Flex direction="row" className="flex justify-between mx-2">
        <Text
          style={{
            margin: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor18SemiBold,
          }}
        >
          {title.length > 0 ? title : "Ajouter un titre a votre recette"}
        </Text>
      </Flex>
    );
  }

  function formRecette() {
    const filteredData = ingredients.filter((item) =>
      diacritic
        .clean(item.name.toLowerCase())
        .includes(searchWord.toLowerCase())
    );

    return (
      <View>
        <Box p="12" rounded="lg">
          <FormControl>
            <Stack space={5}>
              <Stack>
                <FormControl.Label>Title</FormControl.Label>
                <Input
                  variant="underlined"
                  p={2}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  placeholder="Pancakes au flocon d'avoine"
                />
              </Stack>

              <Button
                colorScheme="orange"
                className="w-30 p-4 m"
                onPress={() => setDisplay(true)}
              >
                + Ajouter une etape
              </Button>
            </Stack>
          </FormControl>
        </Box>
      </View>
    );
  }

  function formRecetteIng() {
    const filteredData = ingredients.filter((item) =>
      diacritic
        .clean(item.name.toLowerCase())
        .includes(searchWord.toLowerCase())
    );

    return (
      <View>
        <Box p="12" rounded="lg">
          <FormControl>
            <Stack space={5}>
              <View>
                <Text fontSize="md">
                  Ajouter des ingredients ({ingredients?.length}) {searchWord}
                </Text>

                <Text fontSize="xs">
                  {filteredData?.length > 0
                    ? `${filteredData?.length} ${
                        filteredData.length > 1 ? "ingredients" : "ingredient"
                      } trouvés`
                    : ""}
                </Text>

                <View>
                  <Input
                    style={{
                      height: 40,
                      borderColor: "gray",
                      borderWidth: 1,
                      paddingHorizontal: 10,
                    }}
                    placeholder="Recherche..."
                    value={searchWord}
                    onChangeText={(text) => setWord(text)}
                  />
                  <FlatList
                    className={searchWord.length > 0 ? "" : "hidden"}
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <>
                        <ListItem onPress={() => addInList(item)}>
                          <ListItem.Content>
                            <ListItem.Title>{item.name}</ListItem.Title>
                            <ListItem.Subtitle>
                              {`${item.calories} cal pour 100 grammes`}
                            </ListItem.Subtitle>
                            <ListItem.Subtitle>
                              <Text
                                colorScheme="primary"
                                className=" w-4 my-4 h-2 italic"
                                onPress={() => FicheProduit(item?.id)}
                              >
                                Voir la fiche produit
                              </Text>
                            </ListItem.Subtitle>
                          </ListItem.Content>
                        </ListItem>
                      </>
                    )}
                    ListEmptyComponent={<Text>Aucun résultat</Text>}
                  />
                </View>
              </View>
            </Stack>
          </FormControl>
        </Box>
      </View>
    );
  }

  function AddIngredientModal() {
    return (
      <Center>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header> Fiche produit : {details?.name}</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Sucre :</Text>
                  <Text color="blueGray.400"> {details?.sugar_g}/gr</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Calories</Text>
                  <Text color="blueGray.400"> {details?.calories}/gr</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">fat_total_g</Text>
                  <Text color="blueGray.400"> {details?.fat_total_g}/gr</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Protéine</Text>
                  <Text color="blueGray.400"> {details?.protein_g}/gr</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Sodium </Text>
                  <Text color="blueGray.400"> {details?.protein_g}/mg</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Potassium</Text>
                  <Text color="blueGray.400"> {details?.potassium_mg}/mg</Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Cholesterol </Text>
                  <Text color="blueGray.400">
                    {" "}
                    {details?.cholesterol_mg}/mg
                  </Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Carbohydrates </Text>
                  <Text color="blueGray.400">
                    {" "}
                    {details?.carbohydrates_total_g}/g
                  </Text>
                </HStack>

                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Fibre </Text>
                  <Text color="blueGray.400"> {details?.fiber_g}/g</Text>
                </HStack>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    );
  }
};

const styles = StyleSheet.create({
  snackBarStyle: {
    position: "absolute",
    bottom: -10.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: "#333333",
  },
  healthTipsInfoWrapStyle: {
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    elevation: 4.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  healthTipImageStyle: {
    height: 100.0,
    width: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
});

export default AddRecettesScreen;
