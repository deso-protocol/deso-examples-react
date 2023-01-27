export const getDisplayName = (user) =>
  user.ProfileEntryResponse?.Username ?? user.PublicKeyBase58Check;
