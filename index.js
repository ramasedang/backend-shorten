import express from "express";
import { db, auth, adminAuth, adminDb } from "./config.js";
import bodyparser from "body-parser";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { userSchema, shortenSchema } from "./schema.js";
import randomstring from "randomstring";
import * as validurl from "valid-url";
import cors from "cors";

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyparser.json());
app.use(cors());

async function decodeIDToken(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

async function availableCustomUrl(customurl) {
  const url = await adminDb
    .collection("shorten")
    .where("customurl", "==", customurl)
    .get();
  const data = url.docs.map((doc) => doc.data());
  if (data.length > 0) {
    return false;
  }
  return true;
}

app.post("/register", async (req, res) => {
  const { body } = req;
  const { error } = userSchema.validate(body);
  try {
    if (error) {
      throw new Error(error);
    }
    const { email, password } = body;
    const user = await createUserWithEmailAndPassword(auth, email, password);
    res.status(201).send({ status: true, message: "User created" });
  } catch (error) {
    res.status(400).json({  status: false,message: "Gagal register" });
  }
});

app.post("/login", async (req, res) => {
  const { body } = req;
  const { error } = userSchema.validate(body);
  try {
    if (error) {
      throw new Error(error);
    }
    const { email, password } = body;
    const user = await signInWithEmailAndPassword(auth, email, password);
    const getIdToken = await user.user.getIdToken();
    res.status(201).json({ status: true, accestoken: getIdToken });
  } catch (error) {
    res.status(400).json({ status: false , message: "Gagal login" });
  }
});

app.get("/hello", decodeIDToken, (req, res) => {
  try {
    if (req.currentUser) {
      res.json(req.currentUser);
    } else {
      res.json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    res.json(error);
  }
});

app.post("/shorten", decodeIDToken, async (req, res) => {
  const { body } = req;
  const { error } = shortenSchema.validate(body);
  try {
    if (req.currentUser) {
      if (error) {
        throw new Error(error);
      }
      const { originalurl, customurl } = body;
      const { currentUser } = req;
      const valid = validurl.isUri(originalurl);
      const custom = randomstring.generate(6);
      if (valid) {
        if (customurl === undefined) {
          const available = await availableCustomUrl(custom);
          if (available) {
            const shorturl = await adminDb.collection("shorten").add({
              originalurl,
              customurl: custom,
              uid: currentUser.uid,
              click: 0,
            });
            res.status(201).json({ status: true, shorturl: custom });
          } else {
            res.status(400).json({ status: false, message: "Custom url sudah ada" });
          }
        } else if (customurl !== undefined) {
          const available = await availableCustomUrl(customurl);
          if (available) {
            const shorturl = await adminDb.collection("shorten").add({
              originalurl,
              customurl,
              uid: currentUser.uid,
              click: 0,
            });
            res.status(201).json({ status: true,shorturl: customurl });
          } else {
            res.status(400).json({status: false, message: "Custom url sudah ada" });
          }
        }
      } else {
        res.status(400).json({ status: false, message: "Invalid URL" });
      }
    } else {
      res.json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/go/:customurl", async (req, res) => {
  const { customurl } = req.params;
  try {
    const url = await adminDb
      .collection("shorten")
      .where("customurl", "==", customurl)
      .get();

      await adminDb.collection("shorten").doc(url.docs[0].id).update({
        click: url.docs[0].data().click + 1,
      });
    const data = url.docs[0].data();
    res.send({url: data.originalurl});
  } catch (error) {
    res.json({ status: false, message: "URL tidak ditemukan" });
  }
});

app.get("/getshorten", decodeIDToken, async (req, res) => {
  const { currentUser } = req;
  try {
    if (req.currentUser) {
      const url = await adminDb
        .collection("shorten")
        .where("uid", "==", currentUser.uid)
        .get();
      const data = url.docs.map((doc) => doc.data());
      const docid = url.docs.map((doc) => doc.id);
      const result = data.map((item, index) => {
        return { ...item, docid: docid[index] };
      });
      res.json({status: true, data: result });
    } else {
      res.json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    res.json(error);
  }
});

app.delete("/deleteshorten/:id", decodeIDToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (req.currentUser) {
      const url = await adminDb.collection("shorten").doc(id).delete();
      res.json({ status: true, message: "Berhasil hapus" });
    } else {
      res.json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    res.json(error);
  }
})

app.patch("/updateshorten/:docid", decodeIDToken, async (req, res) => {
  const { docid } = req.params;
  const { body } = req;
  try {
    if (req.currentUser) {
      const url = await adminDb.collection("shorten").doc(docid).update(body);
      res.json({ status: true, message: "Berhasil update" });
    } else {
      res.json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    res.json(error);
  }
})


app.listen(port, () => {
  console.log("Server running on port 3000");
});
