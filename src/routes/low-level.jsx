import {
  keygen,
  publicKeyToBase58Check,
  getUsernameForPublicKey,
  getUsersStateless,
  constructSendDeSoTransaction,
  signTx,
  identity
} from "deso-protocol";
import { useState } from "react";

export const LowLevel = () => {
  const [keyPair, setKeyPair] = useState(null);
  const [showSeed, setShowSeed] = useState(false);
  const [recipientPublicKey, setRecipientPublicKey] = useState("");
  const [amount, setAmount] = useState(0);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [txResults, setTxResults] = useState(null);

  const onPublicKeyChange = (e) => {
    setRecipientPublicKey(e.target.value);
    getUsernameForPublicKey(e.target.value).then((username) => {
      setUsername(username);
    }).catch((err) => {
      if (!isMaybeDeSoPublicKey(e.target.value)) {
        return;
      }
      setUsername(e.target.value)
    })
  }

  const sendDESO = () => {
    constructSendDeSoTransaction({
      SenderPublicKeyBase58Check: publicKeyToBase58Check(keyPair.public),
      RecipientPublicKeyOrUsername: recipientPublicKey,
      AmountNanos: amount * 1e9,
    }).then(({ SpendAmountNanos, TotalInputNanos, Transaction, TransactionHex, TransactionIDBase58Check, TxnHashHex }) => {
      signTx(TransactionHex, keyPair.seedHex).then((res) => {
        identity.submitTx(res).then((res) => {
          console.log(res);
          setTxResults(res);
        }).catch((err) => {
          console.error(err);
          alert(err);
        })
      })
    })
  }

  const isMaybeDeSoPublicKey = (query) => {
    return query.length === 55 && query.startsWith("BC");
  };

  const refreshBalance = () => {
    getUsersStateless({ PublicKeysBase58Check: [publicKeyToBase58Check(keyPair.public)], SkipForLeaderboard: true, IncludeBalance: true }).then(({ UserList }) => {
      if (UserList.length !== 1) {
        alert("Error fetching balance");
        return;
      }
      setBalance(UserList[0].BalanceNanos / 1e9);
    });
  }

  if (!keyPair) {
    return (
      <button
        onClick={() => {
          setKeyPair(keygen());
        }}
        >
        Generate Key Pair
      </button>
    )
  } else {
    return (
      <>
        <div style={{padding: "2rem", display: "flex", justifyContent: "flex-start", flexDirection: "column", alignItems: "flex-start"}}>
          <div style={{ padding: "0.5rem"}}>Public Key: {publicKeyToBase58Check(keyPair.public)}</div>
          <div style={{padding: "0.5rem"}}><button onClick={() => setShowSeed(!showSeed)}>{showSeed ? "Hide" : "Show"} Seed</button></div>
          {showSeed && <div style={{padding: "0.5rem"}}>Seed hex: <span>{keyPair.seedHex}</span></div>}
          <div style={{padding: "0.5rem"}}>Send DESO to your public key from <a href="https://node.deso.org/send-deso" target="_blank" rel="noreferrer">node.deso.org</a></div>
          <div style={{ padding: "0.5rem"}}><span style={{paddingRight: "0.25rem"}}>Balance: {balance}</span><button onClick={refreshBalance}>Click To Refresh Balance</button></div>
        </div>
        <div style={{padding: "2rem", display: "flex", justifyContent: "flex-start", flexDirection: "column", alignItems: "flex-start"}}>
          <div style={{padding: "0.5rem"}}>
            <label
              htmlFor="recipient-public-key"
              style={{paddingRight: "0.25rem"}}
            >Send DESO to Public Key:</label>
            <input
              id="recipient-public-key"
              type="text"
              value={recipientPublicKey}
              onChange={onPublicKeyChange}
              placeholder={"Enter a public key"}
            />
          </div>
          {
            recipientPublicKey && !isMaybeDeSoPublicKey(recipientPublicKey) &&
            <div style={{ color: "red", paddingLeft: "0.5rem" }}>
              Invalid Public Key
            </div>
          }
          <div style={{padding: "0.5rem"}}>Username: {username}</div>
          <div style={{padding: "0.5rem"}}>
            <label
              htmlFor="amount"
              style={{paddingRight: "0.25rem"}}
            >Amount:</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={"Enter an amount"}/>
          </div>
          <button onClick={sendDESO}>
            Send $DESO
          </button>
        </div>
        {
          txResults &&
          <div style={{padding: "2rem", display: "flex", justifyContent: "flex-start", flexDirection: "column", alignItems: "flex-start"}}>
            { JSON.stringify(txResults, null, 2) }
          </div>
        }
      </>
    )
  }
};
