import { Address, beginCell, Cell, toNano } from "ton";

import qrcode from "qrcode-terminal";

// CONFIG CONSTANTS

const COLLECTION_ADDRESS = Address.parse(
  "EQDNhyUYk3psUGi0Oe9YVv9ZJ1dC5OdJ5yxLdi8TVSBUPV23"
);

const OWNER_ADDRESS = Address.parse(
  "EQAj-RQTlNNwjkuRVYWdfamU0jjvQbH31lkxTw-osulj4oqm"
);

const RECEIVER_ADDRESS = Address.parse(
  "EQCd9phIAVzOaHA1F_lGT-NUP84MsAR1pD3ISG5addYO7cvX"
);

const INDEX = 121;

const METADATA_URL =
  "ТУТ IPFS";

// ------------------------

const main = async () => {
  let itemContent = new Cell();
  itemContent.bits.writeBuffer(Buffer.from(METADATA_URL));
  let nftItemMessage = new Cell();
  nftItemMessage.bits.writeAddress(RECEIVER_ADDRESS);
  nftItemMessage.bits.writeAddress(OWNER_ADDRESS);
  nftItemMessage.refs.push(itemContent);

  const msg = beginCell()
    .storeUint(1, 32)
    .storeUint(1, 64)
    .storeUint(INDEX-1, 64)
    .storeCoins(toNano(0.01))
    .storeRef(nftItemMessage)
    .endCell();

  // flags work only in user-friendly address form
  const collectionAddr = COLLECTION_ADDRESS.toFriendly({
    urlSafe: true,
    bounceable: true,
  });
  // we must convert TON to nanoTON
  const amountToSend = toNano("0.03").toString();
  // BOC means Bag Of Cells here
  const preparedBodyCell = msg.toBoc().toString("base64url");

  // final method to build a payment url
  const tonDeepLink = (address: string, amount: string, body: string) => {
    return `ton://transfer/${address}?amount=${amount}&bin=${body}`;
  };

  const link = tonDeepLink(collectionAddr, amountToSend, preparedBodyCell);

  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
};

main();
