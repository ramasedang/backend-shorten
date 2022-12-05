import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import admin from 'firebase-admin';
const firebaseConfig = {
  apiKey: "AIzaSyCNx0h9akHPtvPEzcyr0-z3wIqDbsTtr-0",
  authDomain: "fp-pweb-2bde0.firebaseapp.com",
  projectId: "fp-pweb-2bde0",
  storageBucket: "fp-pweb-2bde0.appspot.com",
  messagingSenderId: "1080393087873",
  appId: "1:1080393087873:web:4d6d074ff4d56ad8dcc680",
};

const serviceAccount = {
  type: "service_account",
  project_id: "fp-pweb-2bde0",
  private_key_id: "6b7d7d6f2f0e34fb25d2f0628691d20d6c857dd5",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9aklRZ+3hDxGL\nlGj/cWrlJpgm3CZ69ht4QRpYfjmjG34HEKGLxdJVNtAxqvDeuXOzEkEU+gpacJwn\nMJOcKPc28UexLMbQK1YBy1Tkfw6opixIyU3UDaHhyKLVpKFvdwIS2MdThJFcjMLe\nsiqcn5BTQqdJY6EQrcfJiJtkmD4gyA6ri/Zk9duFE4GdwAFsGQ5YDPCkkkElkQR0\nIc9FOTrMmLtduOVyw3NlIVAti2HNqmZ2/bJGhxUeorSnfQP873uZD8ARz6s8qT1E\nWL1QWEoPLLpMJNdJZC4p/c0KsHP2Sqd/sB8tpWFNeZmw8+nUNgQm6RUpZNq5mOQh\nTe7uCFw3AgMBAAECggEAAvjtAwsFL5yDo0GGPNrPfeelkZevrJ1w7cUrMj28RYZD\n65i/W6jdej9sqvQBVsjXFqxv8d+cU/tIHuOaHWQ6CXrTh1M8ab3dfqaSDOWaGgBE\n/n2yNRs+zTnPgOp6mOmedtqtcFyBfStPvUDloyT+cTt30gBKquXoX2lkGAMGcyIS\nyGAmxtoZOchXrki0oH6aNkTX55fCJovH3lle09aHsEXVruZLmNzuW8Vc63OjRBqo\nkJK4JIW7jb9rYeiybrKtlvWnHRkFehcgfDxWQLsKBaxvSq6E6QcU8amW5+qjtEU9\n2z4VukA0dUA86MsysoR6NVu6ONTuJDj0nibEAaAL+QKBgQDlf01AgvkzzOvXd2uf\nHoqidOrS2kKEt2gorykZY7f6ra+4GnpEglvXaSDzBXmFp3kI1De6rstjWWGw6a/U\nO/2TbUFXmp42xB8AXyPuhBMIwbXG+SHy/r9uMQHXQcIjYCAMF9usilAuefXM5PCP\ncLyLuFUKvuhrT2oz8qqoE8a/IwKBgQDTSgaFxMBukVLcqt/EitdSh3HMvvr898u6\noVn+3sjPMbK5Cv5IY7z4cdjcr+D2oof3hQJ0hxYbFnsWitLTqQ5tC1CTqZ6yLRKT\nZRcrxZVmG6xDqXhqAVHdjSybjHLxcvmb0YfAU0Rzbs/lJeIfv779Ab5a/8RGKYJd\nwwsAxbBp3QKBgQC1GjlXMEQBebOe69FU1uAmBUeNrskRPD6I5Hj1XTjBLDDfgp17\n1LcvDPoAbRCRxTABJJ75xZggxVcPKcokHFcl8PDAdfZmV2vzeiC7xyPSJDMTWmRN\nAnUEOs4uFOljyyZfBLDIvrk5g+rRjtS7DQbs50DM4ww8KoYvik7bpgePqwKBgCrW\nPEJMpJMGJZ2Viy6G06bozPqs0agN+SEKa3uP4XiYY9q+TtWQWxSnyEbd5ac7RoO5\nVMkZRjMRuLzWQm4lPUaAX8LARetr1fNKMItwUJzWCXPiXQZo5Bcd8yhKLlejbtXX\ngkVM3Hjmw4F6z8COGIOlIdnDNyDec47c51MtwVmFAoGAIO5IWkAdhClWzph3Bsjp\nMhy3mm2i9zAKj59JqwAreAf0h4AW8Y9f2RiKEXWiFhC2Mg6jOAnY3dKKwGup1VDO\nG8HTvtdzkn0HjCh72yN+tyIIw57+IV9HzWOr6FJiH8OTAH0UQ03kmrdD4vsxB5CN\nmZga0rMv6UfTXzyQlurd4kU=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-si3sl@fp-pweb-2bde0.iam.gserviceaccount.com",
  client_id: "107824443088240110707",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-si3sl%40fp-pweb-2bde0.iam.gserviceaccount.com",
};

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fp-pweb-2bde0.firebaseio.com",
})

export const adminAuth = firebaseAdmin.auth();
export const adminDb = firebaseAdmin.firestore();

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
