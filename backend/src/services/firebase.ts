import { ServiceAccount, cert, initializeApp } from 'firebase-admin/app';
import { Message, MulticastMessage, getMessaging } from 'firebase-admin/messaging';
import serviceAccount from '../../firebase.json';

const init = () => initializeApp({credential: cert(serviceAccount as ServiceAccount)});

const multicast = async (message: MulticastMessage) => {
  try {
    const messaging = getMessaging();
    const res = await messaging.sendEachForMulticast(message);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export const firebase = {
  init,
  multicast
};