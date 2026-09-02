import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

const BUCKET = "event-images";

export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, `${BUCKET}/${path}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

export const getImageUrl = async (path) => {
  const storageRef = ref(storage, `${BUCKET}/${path}`);
  return await getDownloadURL(storageRef);
};

export const deleteImage = async (path) => {
  const storageRef = ref(storage, `${BUCKET}/${path}`);
  await deleteObject(storageRef);
};
