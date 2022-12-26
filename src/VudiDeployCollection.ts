import { Address, Cell, contractAddress, StateInit, toNano } from "ton";
import {
  VudiNewYearCollectionCodeCell,
  VudiNewYearItemCodeCell,
} from "./VudiNewYear.source";
import qrcode from "qrcode-terminal";
import { buildNftCollectionDataCell } from "./VudiUtils";
import qs from "qs";

// CONFIG CONSTANTS

const OWNER_ADDRESS = Address.parse(
  "EQAj-RQTlNNwjkuRVYWdfamU0jjvQbH31lkxTw-osulj4oqm"
);

// ------------------------

const main = async () => {
  const collectionCode = VudiNewYearCollectionCodeCell;
  const itemCode = VudiNewYearItemCodeCell;

  const defaultConfig = {
    ownerAddress: OWNER_ADDRESS,
    nextItemIndex: 0,
    collectionContent:
      "https://ipfs.io/ipfs/QmVxXnKQ7FzhP4NxNAxc1bjeycREFkzjJRguwyxnZfg8ZR?filename=kingyTON_Happy_new_Year.json",
    commonContent: "",
    nftItemCode: itemCode,
    royaltyParams: {
      royaltyFactor: 100,
      royaltyBase: 200,
      royaltyAddress: OWNER_ADDRESS,
    },
  };

  let data = buildNftCollectionDataCell(defaultConfig);

  const address = contractAddress({
    workchain: 0,
    initialCode: collectionCode,
    initialData: data,
  });

  // Prepare init message
  const initCell = new Cell();
  new StateInit({
    code: collectionCode,
    data: data,
  }).writeTo(initCell);

  // Encode link to deploy contract
  let link =
    `https://tonhub.com/transfer/` +
    address.toFriendly() +
    "?" +
    qs.stringify({
      text: "Deploy contract",
      amount: toNano(1).toString(10),
      init: initCell.toBoc({ idx: false }).toString("base64"),
    });
  console.log("Address: " + address.toFriendly());
  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
};

main();
