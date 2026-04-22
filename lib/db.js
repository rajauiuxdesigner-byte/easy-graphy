import { db } from "./firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";

export const getClients = async (userId) => {
  try {
    const q = query(
      collection(db, "clients"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting clients: ", error);
    throw error;
  }
};

export const getClient = async (clientId) => {
  try {
    const docRef = doc(db, "clients", clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error getting client: ", error);
    throw error;
  }
};

export const addClient = async (userId, data) => {
  try {
    const totalAmount = Number(data.totalAmount) || 0;
    const advancePaid = Number(data.advancePaid) || 0;
    const remainingAmount = totalAmount - advancePaid;
    
    const clientData = {
      ...data,
      userId,
      totalAmount,
      advancePaid,
      remainingAmount,
      status: remainingAmount > 0 ? "Pending" : "Paid",
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "clients"), clientData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding client: ", error);
    throw error;
  }
};

export const updateClient = async (clientId, data) => {
  try {
    const docRef = doc(db, "clients", clientId);
    
    // Auto calculate if amounts are updated
    let updateData = { ...data };
    if (data.totalAmount !== undefined && data.advancePaid !== undefined) {
      const totalAmount = Number(data.totalAmount);
      const advancePaid = Number(data.advancePaid);
      const remainingAmount = totalAmount - advancePaid;
      updateData = {
        ...updateData,
        totalAmount,
        advancePaid,
        remainingAmount,
        status: remainingAmount > 0 ? "Pending" : "Paid",
      };
    } else if (data.markAsPaid) {
       // helper for 'Mark as Paid'
       const client = await getClient(clientId);
       updateData = {
         advancePaid: client.totalAmount,
         remainingAmount: 0,
         status: "Paid"
       }
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating client: ", error);
    throw error;
  }
};

export const deleteClient = async (clientId) => {
  try {
    const docRef = doc(db, "clients", clientId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting client: ", error);
    throw error;
  }
};
