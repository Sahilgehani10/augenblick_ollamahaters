import { Document } from "../models/documentModel";

const defaultData = "";

export const getDocumentVersions = async (documentId: string) => {
    const document = await Document.findById(documentId, { versions: 1 });
    return document ? document.versions : [];
  };
  

export const getAllDocuments = async() => {
    const documents = await Document.find() ;
    return documents ;
}

export const findOrCreateDocument = async({ documentId, documentName }: { documentId: string, documentName: string }) => {
    if(!documentId){
        return ;
    }   
    const document = await Document.findById(documentId) ;
    if(document){
        return document ;
    }

    const newDocument = await Document.create({ _id: documentId, name: documentName , data: defaultData }) ;
    
    return newDocument ;
}

export const updateDocument = async (id: string, data: Object) => {
    if (!id) return;
  
    // Only update the document data
    await Document.findByIdAndUpdate(id, {
      $set: { data }, // Update the current document data
    });
  };
  export const createVersionOnDisconnect = async (documentId: string, updatedBy: string) => {
    if (!documentId) return;
  
    // Fetch the current document data
    const document = await Document.findById(documentId);
    if (document) {
      // Create a new version
      await Document.findByIdAndUpdate(documentId, {
        $push: {
          versions: {
            data: document.data, // Save the current data as a new version
            updatedBy, // Track who made the changes
          },
        },
      });
  
      console.log(`New version created for document ${documentId}`);
    }
  };