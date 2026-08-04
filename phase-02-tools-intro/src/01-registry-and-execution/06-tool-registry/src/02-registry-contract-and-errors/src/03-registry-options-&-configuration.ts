// Har production environment ke rules alag hote hain.Isiliye Registry
// ko instantiating ke waqt hum ek Configuration Object dete hain:

// export interface RegistryOptions {
//   allowOverwrite?: boolean; // Agar true ho, toh duplicate name aane par error throw na kare, update kar de.
//   strictValidation?: boolean; // Agar true ho, toh tool bina description ya metadata ke register hi na hone de.
// }

export interface RegistryOptions {
  allowOverWrite?: boolean;
  strictValidation?: boolean;
  strictMetadataCheck?: boolean; // Kya har tool mein metadata hona compulsory hai?
}
